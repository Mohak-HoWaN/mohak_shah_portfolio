import * as THREE from "three";

export interface StageContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  accent: THREE.Color;
  foreground: THREE.Color;
  reducedMotion: boolean;
  // Places an absolutely positioned DOM label at a world position
  place: (label: HTMLElement | null, position: THREE.Vector3) => void;
  // Asks for a frame when the loop is idle (reduced motion, or something loaded late)
  invalidate: () => void;
}

interface StageOptions {
  // Orbit of the viewer around `target`: yaw and pitch in radians
  radius: number;
  yaw: number;
  pitch: number;
  target: [number, number, number];
  // Radians per second of constant rotation, or 0 for a gentle sway
  spin?: number;
}

const cssColor = (name: string) => {
  const [h, s, l] = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(" ");
  return new THREE.Color(`hsl(${h}, ${s}, ${l})`);
};

// Sets up renderer, camera, drag-to-orbit and the frame loop inside `container`.
// `build` adds objects and returns the per-frame update. Returns a cleanup function, or null without WebGL.
export function mountStage(
  container: HTMLElement,
  options: StageOptions,
  build: (context: StageContext) => (time: number, delta: number) => void
) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }

  const canvas = renderer.domElement;
  canvas.className = "absolute inset-0 size-full touch-pan-y";
  container.prepend(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 16 / 10, 0.1, 100);
  const target = new THREE.Vector3(...options.target);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 1;
  let height = 1;
  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the scene framed on narrow stages
    camera.fov = width < 420 ? 38 : 32;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const projected = new THREE.Vector3();
  const place: StageContext["place"] = (label, position) => {
    if (!label) return;
    projected.copy(position).project(camera);
    label.style.transform = `translate(${((projected.x + 1) / 2) * width}px, ${((1 - projected.y) / 2) * height}px)`;
  };

  // Drag horizontally and vertically to orbit; vertical touch drags still scroll the page
  let yaw = options.yaw;
  let pitch = options.pitch;
  let dragging = false;
  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    yaw -= event.movementX * 0.006;
    pitch = Math.min(1.25, Math.max(0.12, pitch + event.movementY * 0.004));
    // With reduced motion nothing else is asking for frames
    invalidate();
  };
  const onPointerUp = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  let frame = 0;
  let visible = true;
  let last = performance.now();
  let time = 0;
  const invalidate = () => {
    frame ||= requestAnimationFrame(render);
  };

  const update = build({
    renderer,
    scene,
    camera,
    canvas,
    accent: cssColor("--primary"),
    foreground: cssColor("--foreground"),
    reducedMotion,
    place,
    invalidate,
  });

  function render(now: number) {
    frame = visible && !reducedMotion ? requestAnimationFrame(render) : 0;
    // A frame's timestamp can be earlier than `last`, so clamp at zero
    const delta = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    time += delta;

    if (options.spin && !dragging && !reducedMotion) yaw += options.spin * delta;
    const sway = options.spin || reducedMotion ? 0 : Math.sin(time * 0.4) * 0.22;
    camera.position.set(
      target.x + options.radius * Math.cos(pitch) * Math.sin(yaw + sway),
      target.y + options.radius * Math.sin(pitch),
      target.z + options.radius * Math.cos(pitch) * Math.cos(yaw + sway)
    );
    camera.lookAt(target);
    camera.updateMatrixWorld();

    update(time, delta);
    renderer.render(scene, camera);
  }

  // Only run while the stage is on screen
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      last = performance.now();
      invalidate();
    }
  });
  intersectionObserver.observe(container);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      for (const material of [mesh.material].flat()) {
        (material as THREE.MeshBasicMaterial | undefined)?.map?.dispose();
        material?.dispose();
      }
    });
    scene.environment?.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
