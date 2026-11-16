import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { conditions, points, query } from "@/data/symptom-pca";
import { mountStage } from "./mount";

const SIZE = 1.3; // half the side of the plot cube

const CloudScene = () => {
  const container = useRef<HTMLDivElement>(null);
  const queryLabel = useRef<HTMLSpanElement>(null);
  const axisLabels = useRef<(HTMLSpanElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const cleanup = mountStage(
      container.current!,
      { radius: 7.4, yaw: 0.7, pitch: 0.36, target: [0, -0.05, 0], spin: 0.16 },
      ({ scene, camera, canvas, accent, foreground, place, reducedMotion, invalidate }) => {
        const line = (color: THREE.Color, opacity: number) =>
          new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const grey = foreground.clone().multiplyScalar(0.6);

        // Plot cube and a floor grid
        scene.add(
          new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE * 2, SIZE * 2, SIZE * 2)), line(foreground, 0.14))
        );
        const floor: number[] = [];
        for (let step = -SIZE; step <= SIZE + 0.01; step += SIZE / 3) {
          floor.push(step, -SIZE, -SIZE, step, -SIZE, SIZE, -SIZE, -SIZE, step, SIZE, -SIZE, step);
        }
        const floorGeometry = new THREE.BufferGeometry();
        floorGeometry.setAttribute("position", new THREE.Float32BufferAttribute(floor, 3));
        scene.add(new THREE.LineSegments(floorGeometry, line(foreground, 0.07)));

        // Round dots: a white disc used as the point sprite
        const disc = document.createElement("canvas");
        disc.width = disc.height = 64;
        const context = disc.getContext("2d")!;
        context.fillStyle = "#fff";
        context.arc(32, 32, 30, 0, Math.PI * 2);
        context.fill();

        const cloud = new THREE.Group();
        scene.add(cloud);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points.flatMap(([x, y, z]) => [x * SIZE * 0.92, y * SIZE * 0.92, z * SIZE * 0.92]), 3));
        const colors = new THREE.Float32BufferAttribute(points.length * 3, 3);
        geometry.setAttribute("color", colors);
        const dots = new THREE.Points(
          geometry,
          new THREE.PointsMaterial({ size: 0.085, map: new THREE.CanvasTexture(disc), alphaTest: 0.5, vertexColors: true })
        );
        cloud.add(dots);

        const paint = (active: number) => {
          points.forEach(([, , , condition], index) => {
            const color = condition === active ? accent : grey;
            colors.setXYZ(index, color.r, color.g, color.b);
          });
          colors.needsUpdate = true;
          invalidate();
        };
        paint(query.condition);

        // The query point, ringed
        const queryPosition = new THREE.Vector3();
        const ringMaterial = new THREE.MeshBasicMaterial({ color: accent, transparent: true, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.165, 48), ringMaterial);
        ring.position.set(...query.position).multiplyScalar(SIZE * 0.92);
        cloud.add(ring);

        // Hovering a dot names its condition
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.07;
        const pointer = new THREE.Vector2();
        let active = query.condition;
        const pick = (event: PointerEvent) => {
          const bounds = canvas.getBoundingClientRect();
          pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, 1 - ((event.clientY - bounds.top) / bounds.height) * 2);
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObject(dots)[0];
          const condition = hit ? points[hit.index!][3] : null;
          setHovered(condition);
          if ((condition ?? query.condition) !== active) paint((active = condition ?? query.condition));
        };
        const clear = () => {
          setHovered(null);
          if (active !== query.condition) paint((active = query.condition));
        };
        canvas.addEventListener("pointermove", pick);
        canvas.addEventListener("pointerleave", clear);

        const axisEnds = [new THREE.Vector3(SIZE, -SIZE, -SIZE), new THREE.Vector3(-SIZE, SIZE, -SIZE), new THREE.Vector3(-SIZE, -SIZE, SIZE)];

        return (time) => {
          // The cloud opens out from the centre on load
          const open = reducedMotion ? 1 : 1 - Math.pow(1 - Math.min(1, time / 1.4), 3);
          cloud.scale.setScalar(0.25 + open * 0.75);

          ring.quaternion.copy(camera.quaternion);
          const pulse = reducedMotion ? 0 : (time % 2.4) / 2.4;
          ring.scale.setScalar(1 + pulse * 0.9);
          ringMaterial.opacity = 1 - pulse * 0.85;

          place(queryLabel.current, ring.getWorldPosition(queryPosition));
          axisEnds.forEach((end, index) => place(axisLabels.current[index], end));
        };
      }
    );
    return cleanup ?? undefined;
  }, []);

  return (
    <div ref={container} className="stage relative aspect-[16/10] overflow-hidden rounded-lg border bg-card">
      <span className="frame-tag z-10">
        Health Care Center<span className="hidden sm:inline">, 304 symptom patterns in 3D</span>
      </span>
      <span className="absolute right-3 top-2 z-10 hidden font-mono text-xs text-faint sm:block">Drag to rotate</span>

      <span ref={queryLabel} className="pointer-events-none absolute left-0 top-0 z-10" aria-hidden>
        <span className="block -translate-y-[160%] translate-x-3 font-mono text-[11px] text-primary sm:text-xs">query</span>
      </span>
      {["PC1", "PC2", "PC3"].map((axis, index) => (
        <span
          key={axis}
          ref={(element) => (axisLabels.current[index] = element)}
          className="pointer-events-none absolute left-0 top-0 z-10"
          aria-hidden
        >
          <span className="block -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-faint">{axis}</span>
        </span>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 border-t bg-background/80 px-3 py-2.5 font-mono text-[11px] backdrop-blur-sm sm:text-xs">
        <p className="truncate text-muted-foreground">
          <span className="hidden sm:inline">itching, skin_rash, nodal_skin_eruptions</span>
          <span className="sm:hidden">3 symptoms</span>
          <span className="mx-2 text-faint">→</span>
          <span className="text-primary">{conditions[query.condition]}</span>
        </p>
        <p className="shrink-0 text-faint">{hovered === null ? "41 conditions" : conditions[hovered]}</p>
      </div>

      <p className="sr-only">
        A rotating 3D scatter plot of 304 symptom patterns on their first three principal components. Patterns for the
        same condition cluster together, and a query for itching, skin rash and nodal skin eruptions lands in the fungal
        infection cluster.
      </p>
    </div>
  );
};

export default CloudScene;
