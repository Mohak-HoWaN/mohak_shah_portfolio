import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { mountStage } from "./mount";
import { pack } from "./pack";

// The JonaRu unit on a shop counter: a hand sets down products in the scan zone, the camera scans them,
// and the bill builds up on the unit's display. The products are a random handful, or with `pick` the visitor's choice.
// With `onDone` the scene sits inside the slideshow, which supplies the frame and caption, and is told when each round ends.

interface Product {
  label: string; // class name the vision model emits
  name: string;
  price: number; // rupees, as in JonaRu's catalogue
  size: [number, number]; // width and length on the counter
  thick: number;
  box?: string; // a carton rather than a wrapper; the value is its side colour
}

const products: Product[] = [
  { label: "balaji_chataka_pataka", name: "Chataka Pataka", price: 5, size: [0.95, 0.86], thick: 0.14 },
  { label: "balaji_poprings_masala", name: "PopRings", price: 10, size: [0.85, 1.15], thick: 0.16 },
  { label: "cadbury_dairy_milk", name: "Dairy Milk", price: 10, size: [0.36, 1.05], thick: 0.07 },
  { label: "nestle_kitkat", name: "Kitkat", price: 25, size: [0.9, 0.5], thick: 0.08 },
  { label: "oreo_chocolate", name: "Oreo", price: 10, size: [1.0, 0.47], thick: 0.16 },
  { label: "center_fruit", name: "Center Fruit", price: 1, size: [0.5, 0.27], thick: 0.08 },
  { label: "eno_lime", name: "Eno Lime", price: 60, size: [0.52, 0.8], thick: 0.26, box: "#3d8f3c" },
  { label: "uttam_sooji", name: "Uttam Sooji", price: 40, size: [1.0, 1.38], thick: 0.2 },
];
const MAX_ITEMS = 5;

const ZONE = { width: 3.4, depth: 2.2, z: 2.5 };
const PLACE = 1.1; // seconds the hand takes per item
const SCAN = 1.4;
const HOLD = 3.6; // the finished bill stays up this long
const CLEAR = 0.7;
const SCREEN = { width: 440, height: 252 };
// Viewer distance: wide while items are set down, closer for the bill
const WIDE = 10.6;
const CLOSE = 9.3;

const ease = (value: number) => value * value * (3 - 2 * value);
const clamp = (value: number) => Math.min(1, Math.max(0, value));

const RigScene = ({ pick = false, onDone }: { pick?: boolean; onDone?: () => void }) => {
  const container = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  done.current = onDone;
  const framed = !pick && !onDone;
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const replay = useRef(() => {});
  const [status, setStatus] = useState({ phase: "", count: 0, total: 0 });
  // Labels of the products the visitor put on the counter; the ref is what the scene reads
  const [chosen, setChosen] = useState(["center_fruit", "nestle_kitkat", "eno_lime"]);
  const chosenRef = useRef(chosen);
  const choose = (next: string[]) => {
    // The counter always holds between one item and a full bill
    if (!next.length || next.length > MAX_ITEMS) return;
    chosenRef.current = next;
    setChosen(next);
    replay.current();
  };

  useEffect(() => {
    // mountStage reads the radius every frame, so the scene can dolly by changing it
    const view = { radius: WIDE, yaw: 0.62, pitch: 0.42, target: [-0.3, 0.85, 1.3] as [number, number, number] };
    const cleanup = mountStage(
      container.current!,
      view,
      ({ renderer, scene, accent, place, reducedMotion, invalidate }) => {
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Soft studio reflections, a warm key light with shadows, and fog that loses the counter in the dark
        const backdrop = new THREE.Color("#121211");
        scene.background = backdrop;
        scene.fog = new THREE.Fog(backdrop, 13, 24);
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environmentIntensity = 0.5;
        pmrem.dispose();

        const key = new THREE.DirectionalLight("#ffe9d2", 2.4);
        key.position.set(-5, 8, 6);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = key.shadow.camera.bottom = -7;
        key.shadow.camera.right = key.shadow.camera.top = 7;
        key.shadow.normalBias = 0.03;
        key.shadow.radius = 5;
        // Cool light from behind picks the unit's outline out of the dark
        const rim = new THREE.DirectionalLight("#9db8ff", 1.6);
        rim.position.set(6, 5, -7);
        scene.add(key, rim, new THREE.HemisphereLight("#b9c4d6", "#1c1a17", 0.6));

        const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], parent: THREE.Object3D = scene) => {
          const object = new THREE.Mesh(geometry, material);
          object.castShadow = object.receiveShadow = true;
          parent.add(object);
          return object;
        };
        const lines = (points: number[], opacity: number) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
          const object = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity }));
          scene.add(object);
          return object;
        };

        // Counter
        const counter = mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: "#211f1c", roughness: 0.55 }));
        counter.rotation.x = -Math.PI / 2;
        counter.castShadow = false;

        // --- The unit ---
        const shell = new THREE.MeshStandardMaterial({ color: "#2a2c30", roughness: 0.42, metalness: 0.25 });
        const gloss = new THREE.MeshStandardMaterial({ color: "#08090a", roughness: 0.12, metalness: 0.4 });

        // Wedge body: side profile (front to back, height), extruded across the unit's width
        const profile = new THREE.Shape();
        const outline: [number, number][] = [
          [-1, 0.03],
          [0.75, 0.03],
          [0.75, 0.42],
          [0.62, 0.5],
          [0.05, 1.62],
          [-0.15, 1.62],
          [-1, 0.55],
        ];
        outline.forEach(([z, y], index) => (index ? profile.lineTo(z, y) : profile.moveTo(z, y)));
        const body = new THREE.ExtrudeGeometry(profile, { depth: 2.2, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4 });
        body.rotateY(-Math.PI / 2).translate(1.1, 0, 0);
        mesh(body, shell);

        // Display on the slanted face, showing the bill
        const tilt = -Math.atan2(0.57, 1.12);
        const screenCanvas = document.createElement("canvas");
        screenCanvas.width = SCREEN.width;
        screenCanvas.height = SCREEN.height;
        const screenTexture = new THREE.CanvasTexture(screenCanvas);
        screenTexture.colorSpace = THREE.SRGBColorSpace;
        screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const bezel = mesh(new RoundedBoxGeometry(2.12, 1.3, 0.06, 4, 0.03), gloss);
        bezel.position.set(0, 1.07, 0.365);
        bezel.rotation.x = tilt;
        const display = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 1.1), new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }));
        display.position.set(0, 1.085, 0.397);
        display.rotation.x = tilt;
        scene.add(display);
        // The display lights whatever is in front of it
        const screenGlow = new THREE.PointLight("#dfe8ff", 1.2, 5);
        screenGlow.position.set(0, 1.4, 1.3);
        scene.add(screenGlow);

        // Ultrasonic sensor on the front lip
        const sensor = mesh(new THREE.CapsuleGeometry(0.07, 0.24, 4, 12), gloss);
        sensor.rotation.z = Math.PI / 2;
        sensor.scale.z = 0.4;
        sensor.position.set(0, 0.23, 0.8);

        // Retractable tray with the Raspberry Pi
        mesh(new RoundedBoxGeometry(0.8, 0.08, 1.15, 2, 0.03), shell).position.set(1.5, 0.22, -0.2);
        mesh(new THREE.BoxGeometry(0.52, 0.03, 0.82), new THREE.MeshStandardMaterial({ color: "#1f7a3c", roughness: 0.6 })).position.set(1.56, 0.275, -0.2);
        const port = new THREE.MeshStandardMaterial({ color: "#b9bcc0", roughness: 0.3, metalness: 0.9 });
        mesh(new THREE.BoxGeometry(0.17, 0.15, 0.2), port).position.set(1.56, 0.36, 0.1);
        mesh(new THREE.BoxGeometry(0.17, 0.15, 0.2), port).position.set(1.56, 0.36, -0.14);

        // Arm that carries the camera over the scan zone
        const lens = new THREE.Vector3(0, 2.78, 1.0);
        const zoneCentre = new THREE.Vector3(0, 0, ZONE.z);
        const arm = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.8, 0.45, -0.8),
          new THREE.Vector3(0.8, 1.7, -0.86),
          new THREE.Vector3(0.74, 2.45, -0.55),
          new THREE.Vector3(0.42, 2.83, 0.1),
          new THREE.Vector3(0.05, 2.85, 0.75),
        ]);
        mesh(new THREE.TubeGeometry(arm, 48, 0.13, 14), shell);
        const head = new THREE.Group();
        head.position.copy(lens);
        head.lookAt(zoneCentre);
        scene.add(head);
        mesh(new RoundedBoxGeometry(0.95, 0.52, 0.36, 4, 0.08), shell, head);
        const barrel = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 28), gloss, head);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = 0.2;
        const glass = new THREE.Mesh(new THREE.CircleGeometry(0.07, 28), new THREE.MeshBasicMaterial({ color: accent, toneMapped: false }));
        glass.position.z = 0.252;
        head.add(glass);

        // Light from the camera head pools on the scan zone
        const scanLight = new THREE.SpotLight("#f2ffe0", 60, 9, 0.52, 0.8);
        scanLight.position.copy(lens);
        scanLight.target.position.copy(zoneCentre);
        scene.add(scanLight, scanLight.target);

        // --- Scan zone: corner marks, the camera's field of view, and the scan line ---
        const w = ZONE.width / 2;
        const d = ZONE.depth / 2;
        const marks: number[] = [];
        const cone: number[] = [];
        for (const [sx, sz] of [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ]) {
          const x = sx * w;
          const z = ZONE.z + sz * d;
          marks.push(x, 0.006, z, x - sx * 0.35, 0.006, z, x, 0.006, z, x, 0.006, z - sz * 0.35);
          cone.push(lens.x, lens.y, lens.z, x, 0.006, z);
        }
        lines(marks, 0.9);
        lines(cone, 0.14);
        const scanLine = new THREE.Mesh(
          new THREE.PlaneGeometry(0.05, ZONE.depth),
          new THREE.MeshBasicMaterial({ color: accent, toneMapped: false, transparent: true, opacity: 0.9 })
        );
        scanLine.rotation.x = -Math.PI / 2;
        scene.add(scanLine);

        // --- Products ---
        // A wrapper is a flat sheet puffed up in the middle; a carton is a box. Both are unit-sized and scaled per product.
        const wrapper = new THREE.PlaneGeometry(1, 1, 14, 14).rotateX(-Math.PI / 2);
        const sheet = wrapper.getAttribute("position");
        for (let index = 0; index < sheet.count; index++) {
          const u = sheet.getX(index) * 2;
          const v = sheet.getZ(index) * 2;
          sheet.setY(index, (1 - Math.abs(u) ** 3) * (1 - Math.abs(v) ** 3));
        }
        wrapper.computeVertexNormals();
        const carton = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
        const frame = new THREE.EdgesGeometry(carton);
        const frameMaterial = new THREE.LineBasicMaterial({ color: accent });

        const loader = new THREE.TextureLoader();
        const materials = new Map<string, THREE.Material | THREE.Material[]>();
        const materialFor = (product: Product) => {
          if (!materials.has(product.label)) {
            const map = loader.load(`/project_images/products/${product.label}.webp`, invalidate);
            map.colorSpace = THREE.SRGBColorSpace;
            map.anisotropy = renderer.capabilities.getMaxAnisotropy();
            const face = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, roughness: 0.38, metalness: 0.1, side: THREE.DoubleSide });
            const side = product.box && new THREE.MeshStandardMaterial({ color: product.box, roughness: 0.6 });
            // Box faces: +x, -x, top, bottom, +z, -z
            materials.set(product.label, side ? [side, side, face, side, side, side] : face);
          }
          return materials.get(product.label)!;
        };

        // --- Hand: fingers point along +x, the grip point is the origin ---
        const skin = new THREE.MeshStandardMaterial({ color: "#c08a66", roughness: 0.62 });
        const hand = new THREE.Group();
        scene.add(hand);
        const palm = mesh(new THREE.SphereGeometry(1, 28, 18), skin, hand);
        palm.scale.set(0.36, 0.11, 0.31);
        palm.position.set(-0.3, 0.21, 0);
        const digit = new THREE.CapsuleGeometry(0.058, 0.3, 6, 12).rotateZ(-Math.PI / 2).translate(0.17, 0, 0);
        const fingers = [-0.21, -0.07, 0.07, 0.21].map((z, index) => {
          const finger = new THREE.Group();
          finger.position.set(-0.04, 0.2, z);
          finger.scale.setScalar([0.9, 1, 0.97, 0.8][index]);
          mesh(digit, skin, finger);
          hand.add(finger);
          return finger;
        });
        const thumb = mesh(digit, skin, hand);
        thumb.position.set(-0.38, 0.17, 0.27);
        thumb.rotation.set(0, -0.75, -0.3);
        thumb.scale.setScalar(0.85);
        const forearm = mesh(new THREE.CylinderGeometry(0.2, 0.15, 1.4, 20).rotateZ(Math.PI / 2), skin, hand);
        forearm.position.set(-1.25, 0.22, 0);
        const sleeve = mesh(
          new THREE.CylinderGeometry(0.3, 0.26, 7, 20).rotateZ(Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: "#2d3848", roughness: 0.95 }),
          hand
        );
        sleeve.position.set(-5.2, 0.22, 0);
        hand.scale.setScalar(1.25);
        // The arm reaches in from the customer's side of the counter
        const reach = new THREE.Vector3(1, -0.16, -0.2).normalize();
        hand.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), reach);
        const away = reach.clone().multiplyScalar(-7);

        // --- A round: a random handful of products, each with a spot in the zone ---
        interface Item {
          product: Product;
          x: number;
          z: number;
          object: THREE.Mesh;
          box: THREE.LineSegments;
        }
        let items: Item[] = [];
        let round = new THREE.Group();
        let start = 0;
        let restart = true;
        let shown = "";

        const deal = () => {
          scene.remove(round);
          round = new THREE.Group();
          scene.add(round);
          items = [];
          const dealt = pick
            ? products.filter((product) => chosenRef.current.includes(product.label))
            : Array.from({ length: 2 + Math.floor(Math.random() * (MAX_ITEMS - 1)) }, () => products[Math.floor(Math.random() * products.length)]);
          // A random handful can repeat large packs past what the zone holds; those get no spot and are left out
          const spots = pack(dealt.map((product) => product.size), w, d);
          dealt.forEach((product, index) => {
            const spot = spots[index];
            if (!spot) return;
            const object = mesh(product.box ? carton : wrapper, materialFor(product), round);
            object.scale.set(product.size[0], product.thick, product.size[1]);
            object.rotation.y = spot.turn;
            const box = new THREE.LineSegments(frame, frameMaterial);
            box.scale.set(product.size[0] + 0.12, product.thick + 0.1, product.size[1] + 0.12);
            box.rotation.y = spot.turn;
            box.position.set(spot.x, 0, ZONE.z + spot.z);
            round.add(box);
            items.push({ product, x: spot.x, z: ZONE.z + spot.z, object, box });
          });
          // Farthest from the arm first, so the hand never reaches over an item
          items.sort((a, b) => b.x - a.x);
          labels.current.forEach((label, index) => {
            if (label) label.firstElementChild!.textContent = items[index]?.product.label ?? "";
          });
        };

        const context = screenCanvas.getContext("2d")!;
        const drawScreen = (phase: string, billed: Item[]) => {
          const { width, height } = SCREEN;
          context.fillStyle = "#f3f4f0";
          context.fillRect(0, 0, width, height);
          context.textBaseline = "middle";
          context.textAlign = "left";
          context.fillStyle = "#141413";
          context.font = "600 22px Geist, sans-serif";
          context.fillText("JonaRu", 20, 28);
          context.textAlign = "right";
          context.fillStyle = "#6f6f69";
          context.font = "18px Geist, sans-serif";
          context.fillText(phase, width - 20, 28);
          context.fillStyle = "#d8d9d3";
          context.fillRect(20, 50, width - 40, 2);

          // One row per product, with its quantity
          const rows = new Map<Product, number>();
          for (const { product } of billed) rows.set(product, (rows.get(product) ?? 0) + 1);
          context.font = "500 20px Geist, sans-serif";
          if (!rows.size) {
            context.textAlign = "center";
            context.fillText("Place items in the scan zone", width / 2, 124);
          }
          let y = 76;
          let total = 0;
          for (const [product, quantity] of rows) {
            context.fillStyle = "#141413";
            context.textAlign = "left";
            context.fillText(product.name, 20, y);
            context.fillStyle = "#6f6f69";
            context.fillText(`× ${quantity}`, 270, y);
            context.fillStyle = "#141413";
            context.textAlign = "right";
            context.fillText(`₹${product.price * quantity}`, width - 20, y);
            total += product.price * quantity;
            y += 29;
          }

          context.fillStyle = "#141413";
          context.fillRect(0, height - 46, width, 46);
          context.fillStyle = "#f3f4f0";
          context.textAlign = "left";
          context.font = "500 17px Geist, sans-serif";
          context.fillText("TOTAL", 20, height - 22);
          context.textAlign = "right";
          context.font = "600 24px Geist, sans-serif";
          context.fillStyle = `#${accent.getHexString()}`;
          context.fillText(`₹${total}`, width - 20, height - 22);
          screenTexture.needsUpdate = true;
          return total;
        };
        // The display font may arrive after the first draw
        document.fonts.ready.then(() => {
          shown = "";
          invalidate();
        });

        replay.current = () => {
          restart = true;
          invalidate();
        };

        const anchor = new THREE.Vector3();
        return (time, delta) => {
          const placing = items.length * PLACE;
          const finished = !reducedMotion && time - start > placing + 0.35 + SCAN + HOLD + CLEAR + 0.6;
          if (restart || finished) {
            if (finished) done.current?.();
            restart = false;
            start = time;
            deal();
          }
          const scanAt = items.length * PLACE + 0.35;
          const billAt = scanAt + SCAN;
          const clearAt = billAt + HOLD;
          // With reduced motion the scene rests on the finished bill
          const t = reducedMotion ? billAt + 0.1 : time - start;

          // Hand: in with an item, set it down, out again
          const turn = Math.min(items.length - 1, Math.floor(t / PLACE));
          const local = t / PLACE - turn;
          const near = local < 0.45 ? ease(local / 0.45) : local < 0.55 ? 1 : 1 - ease(clamp((local - 0.55) / 0.45));
          const target = items[turn];
          hand.visible = t < items.length * PLACE;
          hand.position
            .set(target.x, target.product.thick, target.z)
            .addScaledVector(away, 1 - near)
            .setY(target.product.thick + (1 - near) * 1.1 + Math.sin(near * Math.PI) * 0.5);
          const open = clamp((local - 0.45) / 0.1);
          fingers.forEach((finger) => (finger.rotation.z = -0.55 + open * 0.35));

          const scanX = -w + clamp((t - scanAt) / SCAN) * ZONE.width;
          scanLine.visible = t > scanAt && t < billAt;
          scanLine.position.set(scanX, 0.012, ZONE.z);
          scanLight.intensity = scanLine.visible ? 110 : 60;
          const leaving = ease(clamp((t - clearAt) / CLEAR));

          const billed: Item[] = [];
          items.forEach((item, index) => {
            const carried = index === turn && local < 0.5;
            item.object.visible = index <= turn;
            if (carried) item.object.position.set(hand.position.x, hand.position.y - item.product.thick, hand.position.z);
            // Once the bill is done the items are collected, back the way they came
            else item.object.position.set(item.x - leaving * 9, 0, item.z);

            const detectedAt = scanAt + ((item.x + w) / ZONE.width) * SCAN;
            const detected = t >= detectedAt;
            if (detected && !leaving) billed.push(item);
            item.box.visible = detected && !leaving;
            const label = labels.current[index];
            if (label) {
              // The class name shows for a moment as each item is detected; with reduced motion it stays
              label.style.opacity = detected && (reducedMotion || t < detectedAt + 1) ? "1" : "0";
              place(label, anchor.set(item.x, item.product.thick + 0.2, item.z));
            }
          });

          const goal = t > scanAt && !leaving ? CLOSE : WIDE;
          view.radius = reducedMotion ? CLOSE : view.radius + (goal - view.radius) * (1 - Math.exp(-delta * 1.4));

          const phase = leaving ? "Thank you" : t >= billAt ? "Bill ready" : t > scanAt ? "Scanning" : "Ready";
          if (`${phase}${billed.length}` !== shown) {
            shown = `${phase}${billed.length}`;
            setStatus({ phase, count: billed.length, total: drawScreen(phase, billed) });
          }
        };
      }
    );
    return cleanup ?? undefined;
  }, []);

  return (
    <>
    {/* With `pick` the project row, and with `onDone` the slideshow, supplies the frame and its tag */}
    <div ref={container} className={cn("stage relative aspect-[16/10] overflow-hidden", framed && "rounded-lg border bg-card")}>
      {framed && <span className="frame-tag z-10">JonaRu, scan and bill</span>}
      {!onDone && (
      <button
        type="button"
        onClick={() => replay.current()}
        className="absolute right-0 top-0 z-10 flex h-11 items-center gap-1.5 px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="size-3.5" strokeWidth={1.5} />
        Replay
      </button>
      )}

      {Array.from({ length: MAX_ITEMS }, (_, index) => (
        <span
          key={index}
          ref={(element) => (labels.current[index] = element)}
          className="pointer-events-none absolute left-0 top-0 z-10 hidden opacity-0 transition-opacity sm:block"
          aria-hidden
        >
          <span className="block -translate-x-1/2 -translate-y-full whitespace-nowrap bg-primary px-1.5 py-0.5 font-mono text-[11px] text-primary-foreground" />
        </span>
      ))}

      {/* In the slideshow the caption bar takes the bottom edge */}
      <div
        className={cn(
          "absolute inset-x-0 z-10 flex items-center justify-between gap-4 border-t bg-background/80 px-3 py-2.5 font-mono text-[11px] tabular-nums backdrop-blur-sm sm:text-xs",
          onDone ? "bottom-11" : "bottom-0"
        )}
      >
        <span className="text-muted-foreground">
          {status.phase === "Ready" ? "placing items" : status.phase.toLowerCase()}
          <span className="ml-3 hidden text-faint sm:inline">drag to rotate</span>
        </span>
        <span className={status.count ? "text-primary" : "text-faint"}>
          {status.count} {status.count === 1 ? "item" : "items"} · ₹{status.total}
        </span>
      </div>

      <p className="sr-only">
        A 3D model of the JonaRu unit on a shop counter. A hand sets down{" "}
        {pick ? "the products chosen below" : "a random handful of packaged products"} in the scan zone under the unit's
        camera. Each product is detected and added to the bill shown on the unit's display.
      </p>
    </div>

    {pick && (
      <ToggleGroup
        type="multiple"
        value={chosen}
        onValueChange={choose}
        aria-label="Items on the counter"
        className="flex-wrap justify-start gap-2 border-t p-3 font-mono text-xs"
      >
        <span className="mr-1 text-faint">On the counter, up to {MAX_ITEMS}</span>
        {products.map((product) => (
          <ToggleGroupItem
            key={product.label}
            value={product.label}
            disabled={chosen.length >= MAX_ITEMS && !chosen.includes(product.label)}
            className="h-9 gap-1.5 rounded-md border px-2.5 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary/60 data-[state=on]:bg-secondary data-[state=on]:text-foreground"
          >
            {product.name}
            <span className="text-faint">₹{product.price}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )}
    </>
  );
};

export default RigScene;
