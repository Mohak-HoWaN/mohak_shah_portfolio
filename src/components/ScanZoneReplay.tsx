import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import Picker from "@/components/Picker";
import { runs, WINDOW, ZONE } from "@/data/scan-zone";
import { cn } from "@/lib/utils";

// One packet slid into the scan zone and back out, as the JonaRu pipeline reported it. The visitor picks the product.

// The part of the frame the stage shows
const VIEW = { x: 0, y: 122, w: 384, h: 240 };
const pctX = (x: number) => `${((x - VIEW.x) / VIEW.w) * 100}%`;
const pctY = (y: number) => `${((y - VIEW.y) / VIEW.h) * 100}%`;
const pctW = (w: number) => `${(w / VIEW.w) * 100}%`;
const pctH = (h: number) => `${(h / VIEW.h) * 100}%`;
// Left edge of the frame crop the model runs on: the zone's left edge less the pipeline's 0.1 margin (zone_margin) of 640 px
const CROP_X = ZONE[0] - 64;

const ScanZoneReplay = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [label, setLabel] = useState(runs[0].label);
  const run = runs.find((candidate) => candidate.label === label)!;
  const last = run.steps.length - 1;
  // With reduced motion the replay rests on the held step, with the product billed
  const rest = Math.floor(last / 2);
  const [step, setStep] = useState(reducedMotion ? rest : 0);
  const root = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Start once most of the stage has scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setStarted(true), { threshold: 0.6 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reducedMotion || step >= last) return;
    const timer = setTimeout(() => setStep(step + 1), step === 0 ? 900 : 700);
    return () => clearTimeout(timer);
  }, [step, started, last, reducedMotion]);

  const { at, box, zone, cart } = run.steps[step];
  const billed = cart > 0;

  return (
    <>
      <div ref={root} className="stage relative aspect-[16/10] overflow-hidden">
        {/* The scan zone runs off the right and bottom of the view */}
        <div
          className="absolute border border-dashed border-primary/70"
          style={{ left: pctX(ZONE[0]), top: pctY(ZONE[1]), width: pctW(ZONE[2] - ZONE[0]), height: pctH(ZONE[3] - ZONE[1]) }}
        />
        <span className="absolute top-12 hidden whitespace-nowrap font-mono text-xs text-muted-foreground sm:block" style={{ left: pctX(CROP_X), transform: "translateX(0.5rem)" }}>
          dead zone
        </span>
        <span className="absolute top-12 hidden whitespace-nowrap font-mono text-xs text-primary sm:block" style={{ left: `calc(${pctX(ZONE[0])} + 0.5rem)` }}>
          scan zone
        </span>

        <button
          type="button"
          onClick={() => setStep(0)}
          className="absolute right-0 top-0 z-10 flex h-11 items-center gap-1.5 px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.5} />
          Replay
        </button>

        {/* The packet where it was pasted, framed whole while the pipeline tracks it (with the pipeline's confidence), so box
            and packet move as one. Keyed so a new product does not slide in. */}
        <div
          key={label}
          className="absolute transition-[left] duration-500 ease-out"
          style={{ left: pctX(at[0]), top: pctY(at[1]), width: pctW(at[2] - at[0]), height: pctH(at[3] - at[1]) }}
        >
          <img src={`/project_images/products/${label}.webp`} alt="" className="size-full object-contain" />
          {box && (
            // Above the crop shade, which only dims the picture
            <div className={cn("absolute -inset-1 z-[1] border transition-colors", billed ? "border-primary" : "border-foreground/70")}>
              <span
                className={cn(
                  "absolute bottom-full left-[-1px] whitespace-nowrap px-1.5 py-0.5 font-mono text-[11px] tabular-nums transition-colors sm:text-xs",
                  billed ? "bg-primary text-primary-foreground" : "bg-foreground/85 text-background"
                )}
              >
                #1 {label} {box[0].toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Only the zone plus a margin goes to the model, so the part of the packet left of that is never seen */}
        <div className="absolute inset-y-0 left-0 border-r border-dotted border-foreground/30 bg-background/70" style={{ width: pctX(CROP_X) }}>
          <span className="absolute top-12 left-3 hidden font-mono text-xs text-faint sm:block">not sent to model</span>
        </div>

        {/* Readout */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t bg-background/80 px-3 py-2.5 font-mono text-[11px] tabular-nums backdrop-blur-sm sm:text-xs">
          <p className="text-muted-foreground">
            step {step + 1}/{run.steps.length}
            <span className="hidden sm:inline">
              <span className="mx-2 text-faint">·</span>
              {zone ? `track in ${zone} zone` : "no box drawn"}
            </span>
          </p>
          <p aria-live="polite" className={billed ? "text-primary" : "text-faint"}>
            {billed ? `${label} · cart: ${cart}` : "cart: empty"}
          </p>
        </div>

        <p className="sr-only">
          A {run.name} packet slides from the dead zone into the JonaRu scan zone and is billed once {WINDOW} frames agree it is
          there, then slides back out and comes off the bill.
        </p>
      </div>

      <Picker
        label="Product"
        options={runs.map((candidate) => ({ value: candidate.label, label: candidate.name }))}
        value={label}
        onChange={(next) => {
          setLabel(next);
          // Every run has the same number of steps
          setStep(reducedMotion ? rest : 0);
        }}
      />
    </>
  );
};

export default ScanZoneReplay;
