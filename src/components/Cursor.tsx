import { useEffect, useRef, useState } from "react";
import { type Role } from "@/lib/role";

interface CursorProps {
  role: Role;
  sound: boolean;
}

// Iris blades: six chords of the ring. A wider sweep brings them through the centre, closing the opening.
const RING = 10;
const OPEN = 112;
const SHUT = 172;
const blade = (index: number, sweep: number) => {
  const from = (index * 60 * Math.PI) / 180;
  const to = ((index * 60 + sweep) * Math.PI) / 180;
  return { x1: RING * Math.cos(from), y1: RING * Math.sin(from), x2: RING * Math.cos(to), y2: RING * Math.sin(to) };
};

// Both click sounds are synthesised, so no audio file is needed
let audio: AudioContext | undefined;
function wake() {
  audio ??= new AudioContext();
  if (audio.state === "suspended") audio.resume();
  return audio;
}

// Data lens: a soft plucked note. Its pitch follows the pointer across the page, the way a sonified chart
// is read from left to right. Notes are a major pentatonic scale over two octaves.
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
function playPoint(position: number) {
  const audio = wake();
  const now = audio.currentTime;
  const step = SCALE[Math.min(SCALE.length - 1, Math.floor(position * SCALE.length))];
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.3, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  gain.connect(audio.destination);
  const tone = audio.createOscillator();
  tone.type = "triangle";
  tone.frequency.value = 330 * 2 ** (step / 12);
  tone.connect(gain);
  tone.start(now);
  tone.stop(now + 0.42);
}

// Vision lens: a two-part shutter click built from short bursts of filtered noise
function playShutter() {
  const audio = wake();
  const output = audio.createGain();
  output.gain.value = 0.5;
  output.connect(audio.destination);

  const burst = (start: number, duration: number, frequency: number, level: number) => {
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    const source = audio.createBufferSource();
    source.buffer = buffer;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 0.9;
    const gain = audio.createGain();
    gain.gain.value = level;
    source.connect(filter).connect(gain).connect(output);
    source.start(audio.currentTime + start);
  };
  // First curtain: a bright tick with a little body
  burst(0, 0.03, 3400, 0.55);
  burst(0.008, 0.045, 950, 0.35);
  // Second curtain: louder and lower, with a soft thud under it
  burst(0.085, 0.065, 2300, 0.8);
  burst(0.09, 0.09, 420, 0.55);
}

// Replaces the pointer on devices with a mouse: a camera iris for the vision lens (it snaps shut with a
// shutter sound on click) and a grey data point for the data science lens (it ripples and plays a note).
// Also lights the grid near the pointer.
const Cursor = ({ role, sound }: CursorProps) => {
  const [enabled] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const cursor = useRef<HTMLDivElement>(null);
  const blades = useRef<(SVGLineElement | null)[]>([]);
  const shutter = useRef<SVGCircleElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  // Read inside listeners that are attached once
  const live = useRef({ role, sound });
  live.current = { role, sound };

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const element = cursor.current!;
    root.classList.add("custom-cursor");

    let x = 0;
    let y = 0;
    const spot = () => {
      root.style.setProperty("--mx", `${x + window.scrollX}px`);
      root.style.setProperty("--my", `${y + window.scrollY}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      spot();
      const target = event.target as Element;
      element.dataset.over = target.closest?.("input, textarea")
        ? "text"
        : target.closest?.("a, button, label, canvas")
          ? "action"
          : "";
      element.style.opacity = "1";
    };
    const onLeave = () => {
      element.style.opacity = "0";
    };

    let snap = 0;
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (live.current.role !== "cv-engineer") {
        if (live.current.sound) playPoint(event.clientX / window.innerWidth);
        ripple.current?.animate(
          [
            { transform: "scale(1)", opacity: 0.7 },
            { transform: "scale(3)", opacity: 0 },
          ],
          { duration: 450, easing: "ease-out" }
        );
        return;
      }
      if (live.current.sound) playShutter();
      // Close in 70ms, hold, reopen
      cancelAnimationFrame(snap);
      const started = performance.now();
      const tick = (now: number) => {
        const elapsed = now - started;
        const closed = elapsed < 70 ? elapsed / 70 : elapsed < 120 ? 1 : Math.max(0, 1 - (elapsed - 120) / 160);
        blades.current.forEach((line, index) => {
          const { x1, y1, x2, y2 } = blade(index, OPEN + (SHUT - OPEN) * closed);
          line?.setAttribute("x1", String(x1));
          line?.setAttribute("y1", String(y1));
          line?.setAttribute("x2", String(x2));
          line?.setAttribute("y2", String(y2));
        });
        shutter.current?.setAttribute("opacity", String(closed));
        if (elapsed < 280) snap = requestAnimationFrame(tick);
      };
      snap = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", spot, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", spot);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(snap);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="spotlight" aria-hidden />
      <div ref={cursor} className="cursor" aria-hidden>
        {role === "cv-engineer" ? (
          <svg viewBox="-16 -16 32 32" className="cursor-shape size-8">
            {/* Dark under-stroke keeps the iris visible over light screenshots */}
            <circle r={RING} fill="none" stroke="hsl(var(--background))" strokeWidth={4.5} />
            <circle ref={shutter} r={RING} fill="hsl(var(--primary))" opacity={0} />
            <g stroke="hsl(var(--primary))" strokeWidth={1.4} strokeLinecap="round" fill="none">
              <circle r={RING} />
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <line key={index} ref={(line) => (blades.current[index] = line)} {...blade(index, OPEN)} />
              ))}
            </g>
          </svg>
        ) : (
          <span className="cursor-shape relative block size-8">
            <span ref={ripple} className="absolute inset-[9px] rounded-full border border-[#b5b5ae] opacity-0" />
            <span className="absolute inset-[5px] rounded-full border border-[#b5b5ae]/50" />
            <span className="absolute inset-[11px] rounded-full bg-[#b5b5ae] ring-2 ring-background" />
          </span>
        )}
      </div>
    </>
  );
};

export default Cursor;
