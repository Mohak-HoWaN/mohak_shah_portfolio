import { useEffect, useRef } from "react";
import { type Role } from "@/lib/role";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  phase: number;
}

// Standard normal sample (Box-Muller)
const gaussian = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

// A quiet field behind the whole page.
// Computer vision lens: drifting keypoints, with detection boxes that lock onto clusters and track them.
// Data science lens: points that keep settling into clusters, a regression, a bell curve and a wave.
const FieldBackground = ({ role }: { role: Role }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const context = canvas.getContext("2d")!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(document.documentElement);
    const color = (name: string, alpha: number) => `hsl(${style.getPropertyValue(name).trim()} / ${alpha})`;
    const vision = role === "cv-engineer";

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    const pointer = { x: -999, y: -999 };

    // Data science formations: each returns a target for a point and may draw a guide
    const formations = [
      {
        target: () => {
          const [cx, cy] = [
            [0.24, 0.3],
            [0.72, 0.24],
            [0.36, 0.74],
            [0.8, 0.68],
          ][Math.floor(Math.random() * 4)];
          const spread = Math.min(width, height) * 0.07;
          return [cx * width + gaussian() * spread, cy * height + gaussian() * spread];
        },
        guide: () => {},
      },
      {
        target: () => {
          const x = (0.1 + Math.random() * 0.8) * width;
          return [x, height * (0.76 - 0.5 * (x / width)) + gaussian() * height * 0.045];
        },
        guide: () => {
          context.moveTo(width * 0.08, height * 0.72);
          context.lineTo(width * 0.92, height * 0.3);
        },
      },
      {
        target: () => {
          const z = gaussian();
          return [width * (0.5 + z * 0.13), height * (0.8 - Math.random() * 0.5 * Math.exp(-(z * z) / 2))];
        },
        guide: () => {
          for (let z = -3; z <= 3.01; z += 0.1) context.lineTo(width * (0.5 + z * 0.13), height * (0.8 - 0.5 * Math.exp(-(z * z) / 2)));
        },
      },
      {
        target: () => {
          const x = (0.06 + Math.random() * 0.88) * width;
          return [x, height * (0.5 + 0.17 * Math.sin((x / width) * Math.PI * 3)) + gaussian() * height * 0.02];
        },
        guide: () => {
          for (let x = 0.06; x <= 0.941; x += 0.01) context.lineTo(x * width, height * (0.5 + 0.17 * Math.sin(x * Math.PI * 3)));
        },
      },
    ];
    const HOLD = 7; // seconds per formation
    let formation = -1;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(36, Math.min(120, Math.round((width * height) / 15000)));
      points = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 9;
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, tx: x, ty: y, phase: Math.random() * 6.28 };
      });
      formation = -1;
      boxes = [];
    };

    // Detection boxes: each follows the points it was born around
    let boxes: { members: Point[]; born: number }[] = [];
    let lastBox = 0;
    const BOX_LIFE = 3;
    const spawnBox = (time: number) => {
      for (let attempt = 0; attempt < 6; attempt++) {
        const seed = points[Math.floor(Math.random() * points.length)];
        const members = points.filter((point) => Math.hypot(point.x - seed.x, point.y - seed.y) < 120);
        if (members.length >= 3 && members.length <= 9) {
          boxes.push({ members, born: time });
          return;
        }
      }
    };

    const draw = (time: number, delta: number) => {
      context.clearRect(0, 0, width, height);

      if (vision) {
        for (const point of points) {
          point.x = (point.x + point.vx * delta + width) % width;
          point.y = (point.y + point.vy * delta + height) % height;
        }

        // Scan line with a short trail
        const scanY = ((time * 80) % (height + 400)) - 200;
        const trail = context.createLinearGradient(0, scanY - 120, 0, scanY);
        trail.addColorStop(0, color("--primary", 0));
        trail.addColorStop(1, color("--primary", 0.07));
        context.fillStyle = trail;
        context.fillRect(0, scanY - 120, width, 120);
        context.fillStyle = color("--primary", 0.22);
        context.fillRect(0, scanY, width, 1);

        // Keypoints
        context.strokeStyle = color("--foreground", 0.3);
        context.lineWidth = 1;
        context.beginPath();
        for (const { x, y } of points) {
          context.moveTo(x - 3, y);
          context.lineTo(x + 3, y);
          context.moveTo(x, y - 3);
          context.lineTo(x, y + 3);
        }
        context.stroke();

        // Lines from the cursor to nearby keypoints
        for (const { x, y } of points) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          if (distance > 170) continue;
          context.strokeStyle = color("--primary", 0.35 * (1 - distance / 170));
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(x, y);
          context.stroke();
        }

        if (time - lastBox > 1.3 && boxes.length < 4) {
          lastBox = time;
          spawnBox(time);
        }
        boxes = boxes.filter((box) => time - box.born < BOX_LIFE);
        for (const box of boxes) {
          const age = (time - box.born) / BOX_LIFE;
          const alpha = Math.min(1, age / 0.08, (1 - age) / 0.25);
          // Starts loose and tightens onto the cluster
          const pad = 14 + 26 * Math.pow(1 - Math.min(1, age / 0.12), 2);
          const xs = box.members.map((point) => point.x);
          const ys = box.members.map((point) => point.y);
          // A member that wrapped around the screen would stretch the box; drop the box instead
          if (Math.max(...xs) - Math.min(...xs) > 300 || Math.max(...ys) - Math.min(...ys) > 300) {
            box.born = -BOX_LIFE;
            continue;
          }
          const left = Math.min(...xs) - pad;
          const top = Math.min(...ys) - pad;
          const right = Math.max(...xs) + pad;
          const bottom = Math.max(...ys) + pad;
          context.strokeStyle = color("--primary", 0.14 * alpha);
          context.strokeRect(left, top, right - left, bottom - top);
          context.strokeStyle = color("--primary", 0.7 * alpha);
          context.lineWidth = 1.5;
          context.beginPath();
          for (const [x, y, dx, dy] of [
            [left, top, 1, 1],
            [right, top, -1, 1],
            [right, bottom, -1, -1],
            [left, bottom, 1, -1],
          ]) {
            context.moveTo(x + dx * 12, y);
            context.lineTo(x, y);
            context.lineTo(x, y + dy * 12);
          }
          context.stroke();
          context.lineWidth = 1;
        }
        return;
      }

      // Data science: move to the next formation when its time is up
      const index = Math.floor(time / HOLD) % formations.length;
      if (index !== formation) {
        formation = index;
        for (const point of points) [point.tx, point.ty] = formations[index].target();
      }
      const ease = 1 - Math.exp(-delta * 2);
      context.fillStyle = color("--foreground", 0.34);
      context.beginPath();
      for (const point of points) {
        // Settle towards the target, with a slow wobble so the shape stays alive
        point.x += (point.tx + Math.sin(time * 0.7 + point.phase) * 5 - point.x) * ease;
        point.y += (point.ty + Math.cos(time * 0.6 + point.phase) * 5 - point.y) * ease;
        // The cursor pushes nearby points aside
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 110 && distance > 0.1) {
          point.x += (dx / distance) * (110 - distance) * 0.12;
          point.y += (dy / distance) * (110 - distance) * 0.12;
        }
        context.moveTo(point.x + 1.8, point.y);
        context.arc(point.x, point.y, 1.8, 0, Math.PI * 2);
      }
      context.fill();

      // The fitted line or curve fades in once the points have gathered, and out before they leave
      const local = time % HOLD;
      const guideAlpha = Math.max(0, Math.min(1, (local - 1.2) / 1.2, (HOLD - 0.6 - local) / 0.8));
      context.strokeStyle = color("--primary", 0.4 * guideAlpha);
      context.lineWidth = 1.5;
      context.beginPath();
      formations[index].guide();
      context.stroke();
      context.lineWidth = 1;
    };

    let frame = 0;
    let last = performance.now();
    let time = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      // A frame's timestamp can be earlier than `last`, so clamp at zero
      const delta = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      time += delta;
      draw(time, delta);
    };
    const start = () => {
      if (reducedMotion) {
        // One still frame, with the points already in their first shape
        draw(0, 10);
        return;
      }
      last = performance.now();
      frame ||= requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onResize = () => {
      resize();
      if (reducedMotion) start();
    };
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [role]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden />;
};

export default FieldBackground;
