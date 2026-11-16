import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import Picker from "@/components/Picker";
import { runs, TARGET_MODEL } from "@/data/promptify-runs";
import { cn } from "@/lib/utils";

// A prompt going through Promptify: typed in, scored, rewritten and costed, as the backend returned it.
// The visitor picks which of the recorded runs to replay.

const PARTS = ["Task", "Objective", "Output", "Nuance"];
const TICK = 30; // milliseconds
const CHARS_PER_TICK = 5;
// The backend's cost estimates are fractions of a cent, so they are shown per thousand prompts
const perThousand = (cost: number) => `$${(cost * 1000).toFixed(4)}`;

const PromptifyReplay = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [title, setTitle] = useState(runs[0].title);
  const run = runs.find((candidate) => candidate.title === title)!;
  const root = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // The replay's clock, in ticks: the prompt is typed, then each stage appears after a pause
  const scoreAt = Math.ceil(run.prompt.length / CHARS_PER_TICK) + 15;
  const rewriteAt = scoreAt + 40;
  const costAt = rewriteAt + 40;
  const [tick, setTick] = useState(reducedMotion ? Infinity : 0);

  // Start once most of the stage has scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setStarted(true), { threshold: 0.6 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || tick >= costAt) return;
    const timer = setTimeout(() => setTick(tick + 1), TICK);
    return () => clearTimeout(timer);
  }, [tick, started, costAt]);

  const typed = tick * CHARS_PER_TICK;
  const scored = tick >= scoreAt;
  const rewritten = tick >= rewriteAt;
  const costed = tick >= costAt;
  const restart = () => setTick(reducedMotion ? Infinity : 0);
  const stage = "transition-opacity duration-500";

  return (
    <>
      <div ref={root} className="stage relative flex aspect-[16/10] flex-col gap-4 px-4 pb-14 pt-12 sm:px-5">
        <button
          type="button"
          onClick={restart}
          className="absolute right-0 top-0 z-10 flex h-11 items-center gap-1.5 px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.5} />
          Replay
        </button>

        <div>
          <p className="font-mono text-[11px] text-faint">Prompt</p>
          {/* The untyped remainder is laid out but hidden, so the stage keeps its height while the prompt types */}
          <p className="mt-1 font-mono text-xs leading-relaxed text-muted-foreground" aria-hidden>
            {run.prompt.slice(0, typed)}
            <span className="invisible">{run.prompt.slice(typed)}</span>
          </p>
        </div>

        <div className={cn(stage, !scored && "opacity-0")} aria-hidden>
          <p className="font-mono text-[11px] text-faint">Score</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs">
            <span className="text-muted-foreground">
              {run.taskType} · {run.complexity} · {run.tokens} tokens
            </span>
            <span className="flex gap-2">
              {/* The four parts of a TOON prompt: lit if the original states it, and all lit once it is rewritten */}
              {PARTS.map((part, index) => (
                <span
                  key={part}
                  className={cn(
                    "transition-colors duration-500",
                    run.has[index] ? "text-foreground" : rewritten ? "text-primary" : "text-faint line-through"
                  )}
                >
                  {part}
                </span>
              ))}
            </span>
            <span className="tabular-nums text-primary">TOON readiness {run.toonReadiness}%</span>
          </div>
        </div>

        <div className={cn(stage, !rewritten && "opacity-0")} aria-hidden>
          <p className="font-mono text-[11px] text-faint">Rewrite</p>
          <p className="mt-1 border-l border-primary pl-3 text-sm leading-relaxed">{run.optimized}</p>
        </div>

        {/* Readout */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t bg-background/80 px-3 py-2.5 font-mono text-[11px] tabular-nums backdrop-blur-sm sm:text-xs">
          <p className="text-muted-foreground">
            {costed ? `done in ${run.seconds} s` : rewritten ? "picking model" : scored ? "rewriting" : typed < run.prompt.length ? "prompt" : "scoring"}
          </p>
          <p className={cn(stage, costed ? "text-primary" : "opacity-0")}>
            {TARGET_MODEL}
            <span className="hidden sm:inline">
              {" · "}
              {perThousand(run.costBefore)} → {perThousand(run.costAfter)} per 1,000 prompts
            </span>
            {run.saved > 0 && ` · ${run.saved}% less`}
          </p>
        </div>

        <p className="sr-only">
          Promptify takes the prompt "{run.prompt}", classes it as a {run.complexity} {run.taskType} task of {run.tokens}{" "}
          tokens, and rewrites it as "{run.optimized}" for {TARGET_MODEL}.
        </p>
      </div>

      <Picker
        label="Prompt"
        options={runs.map((candidate) => ({ value: candidate.title, label: candidate.title }))}
        value={title}
        onChange={(next) => {
          setTitle(next);
          restart();
        }}
      />
    </>
  );
};

export default PromptifyReplay;
