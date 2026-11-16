import { type PointerEvent, useState } from "react";
import { cn } from "@/lib/utils";

// A photo run through Smart Waste Minimizer's MobileNetV2 classifier, with its Grad-CAM revealed around the pointer.
// The heatmap comes from gradcam.py in the project, for the predicted class (Apple-Fresh, 0.94).
// The button shows the whole heatmap, for touch and keyboard.
const HeatReveal = () => {
  const [all, setAll] = useState(false);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div className="stage flex aspect-[16/10] flex-col items-center justify-center gap-4 px-5 pb-5 pt-12">
      <div
        className="relative w-full max-w-[19rem] overflow-hidden rounded-sm"
        onPointerMove={move}
        onPointerLeave={(event) => event.currentTarget.style.removeProperty("--x")}
      >
        <img
          src="/project_images/waste-input.jpg"
          alt="A red apple on a white surface"
          width={500}
          height={500}
          loading="lazy"
          className="block w-full"
        />
        <img
          src="/project_images/waste-heatmap.jpg"
          alt={all ? "The same photo with the Grad-CAM heatmap: the warmest region covers the left side and top of the apple" : ""}
          loading="lazy"
          className={cn(
            "absolute inset-0 size-full",
            !all && "[mask-image:radial-gradient(circle_5.5rem_at_var(--x,-99rem)_var(--y,-99rem),black_55%,transparent)]"
          )}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px] sm:text-xs">
        <span className="tabular-nums text-muted-foreground">Apple-Fresh 0.94</span>
        <span className="hidden text-faint [@media(hover:hover)]:inline">Move over the photo to see where the model looks</span>
        <button
          type="button"
          aria-pressed={all}
          onClick={() => setAll(!all)}
          className="-my-2 rounded-sm py-2 text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
        >
          {all ? "Hide heatmap" : "Show heatmap"}
        </button>
      </div>
    </div>
  );
};

export default HeatReveal;
