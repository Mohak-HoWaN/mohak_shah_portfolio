import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import Picker from "@/components/Picker";

// One polygon drawn in ByteBOXer, with the box it implies growing alongside it, then saved. The visitor picks the output
// mode, which changes only what is written: the same shape feeds every mode.

// The image being labelled, in the drawing's 640x400 units
const FRAME = { x: 24, y: 52, w: 360, h: 270 };
// Traced from the product cutout's alpha with OpenCV (approxPolyDP, epsilon 6 px), then placed in the frame
const POLYGON: [number, number][] = [
  [127.9, 82], [139, 128.7], [140.1, 201.6], [139, 254.7], [127.9, 290.8], [279.5, 290.8],
  [267.9, 247.1], [268.5, 128.1], [279.5, 88.4], [157, 89], [153.5, 83.8],
];
const CLASS = "sooji";
const NAME = "uttam_sooji";

// What each mode writes for this shape. The numbers are POLYGON normalised to FRAME, as the tool writes them.
const BOX_LINE = "0 0.4992 0.4978 0.4211 0.7733";
type File = { path: string; text?: string; thumb?: "mask" | "redact" };
const modes: { value: string; label: string; files: File[] }[] = [
  {
    value: "seg",
    label: "seg",
    files: [
      { path: `${CLASS}/${NAME}.png`, thumb: "mask" },
      { path: `_combined/${NAME}.png`, text: `pixel 1 = ${CLASS}` },
      { path: `yolo_seg/${NAME}.txt`, text: "0 0.2886 0.1111 0.3194 0.2841 …" },
    ],
  },
  {
    value: "bbox",
    label: "bbox",
    files: [
      { path: `labels/${NAME}.txt`, text: BOX_LINE },
      { path: "classes.txt", text: CLASS },
    ],
  },
  { value: "redact", label: "redact", files: [{ path: `redacted/${NAME}.jpg`, thumb: "redact" }] },
  {
    value: "detect",
    label: "detect+classify",
    files: [
      { path: `detect/labels/${NAME}.txt`, text: BOX_LINE },
      { path: "detect/data.yaml", text: `nc: 1  names: [${CLASS}]` },
      { path: `classifier/${CLASS}/${NAME}.jpg`, thumb: "redact" },
    ],
  },
];

const CLOSE = POLYGON.length + 1;
const SAVE = POLYGON.length + 2;
const THUMB = 0.2; // thumbnails are the frame at a fifth of its size
const PANEL_X = 404;

const bounds = (points: [number, number][]) => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};
const BOX = bounds(POLYGON);
const toPoints = (points: [number, number][]) => points.map((point) => point.join(",")).join(" ");

// The frame as a small output image: the binary mask, or the photo with everything outside the box filled
const Thumb = ({ kind, x, y }: { kind: "mask" | "redact"; x: number; y: number }) => (
  <g transform={`translate(${x} ${y}) scale(${THUMB}) translate(${-FRAME.x} ${-FRAME.y})`}>
    {kind === "mask" ? (
      <>
        <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} fill="#000" />
        <polygon points={toPoints(POLYGON)} fill="#fff" />
      </>
    ) : (
      <>
        <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} className="fill-card" />
        <image href={`/project_images/products/${NAME}.webp`} x={127.88} y={82} width={152.25} height={210} />
        <path
          fillRule="evenodd"
          fill="#000"
          d={`M${FRAME.x} ${FRAME.y}h${FRAME.w}v${FRAME.h}h${-FRAME.w}z M${BOX.x} ${BOX.y}v${BOX.h}h${BOX.w}v${-BOX.h}z`}
        />
      </>
    )}
    <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} fill="none" className="stroke-border" strokeWidth={5} />
  </g>
);

const ByteBoxerReplay = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [mode, setMode] = useState(modes[0].value);
  const { files } = modes.find((candidate) => candidate.value === mode)!;
  // With reduced motion the replay rests on the saved shape
  const [step, setStep] = useState(reducedMotion ? SAVE : 0);
  const root = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Start once most of the stage has scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setStarted(true), { threshold: 0.6 });
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reducedMotion || step >= SAVE) return;
    const timer = setTimeout(() => setStep(step + 1), step === 0 ? 900 : step >= POLYGON.length ? 700 : 260);
    return () => clearTimeout(timer);
  }, [step, started, reducedMotion]);

  const drawn = POLYGON.slice(0, Math.min(step, POLYGON.length));
  const closed = step >= CLOSE;
  const saved = step >= SAVE;
  const box = drawn.length > 1 ? bounds(drawn) : null;
  const cursor = drawn[drawn.length - 1];

  let rowY = FRAME.y + 34;

  return (
    <>
      <div ref={root} className="stage relative aspect-[16/10] overflow-hidden">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="absolute right-0 top-0 z-10 flex h-11 items-center gap-1.5 px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.5} />
          Replay
        </button>

        <svg viewBox="0 0 640 400" className="absolute inset-0 size-full font-mono" aria-hidden>
          <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} className="fill-card stroke-border" />
          <image href={`/project_images/products/${NAME}.webp`} x={127.88} y={82} width={152.25} height={210} />

          {/* The box follows the points as they go down, so detection labels come from the same stroke */}
          {box && (
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="none"
              className="stroke-foreground/70"
              strokeDasharray={closed ? undefined : "5 4"}
            />
          )}
          {closed ? (
            <polygon points={toPoints(POLYGON)} className="fill-primary/30 stroke-primary" strokeWidth={2} />
          ) : (
            <polyline points={toPoints(drawn)} fill="none" className="stroke-primary" strokeWidth={2} />
          )}
          {!closed &&
            drawn.map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={3.5} className="fill-background stroke-primary" strokeWidth={1.5} />)}
          {cursor && !closed && (
            <path d={`M${cursor[0] - 9} ${cursor[1]}h18M${cursor[0]} ${cursor[1] - 9}v18`} className="stroke-foreground" strokeWidth={1} />
          )}
          {closed && (
            <g>
              <rect x={BOX.x} y={BOX.y - 17} width={CLASS.length * 7.4 + 12} height={17} className="fill-primary" />
              <text x={BOX.x + 6} y={BOX.y - 5} fontSize={12} className="fill-primary-foreground">
                {CLASS}
              </text>
            </g>
          )}

          <text x={PANEL_X} y={FRAME.y + 10} fontSize={12} className="fill-faint">
            output/
          </text>
          {!saved && (
            <text x={PANEL_X} y={FRAME.y + 34} fontSize={12} className="fill-faint">
              saved when you move on (d)
            </text>
          )}
          {saved &&
            files.map((file) => {
              const y = rowY;
              rowY += file.thumb ? 92 : 50;
              return (
                <g key={file.path} className="animate-rise">
                  <text x={PANEL_X} y={y} fontSize={12} className="fill-foreground">
                    {file.path}
                  </text>
                  {file.thumb ? (
                    <Thumb kind={file.thumb} x={PANEL_X} y={y + 10} />
                  ) : (
                    <text x={PANEL_X} y={y + 20} fontSize={12} className="fill-primary">
                      {file.text}
                    </text>
                  )}
                </g>
              );
            })}
        </svg>

        {/* Readout */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t bg-background/80 px-3 py-2.5 font-mono text-[11px] tabular-nums backdrop-blur-sm sm:text-xs">
          <p className="text-muted-foreground">
            {closed ? `polygon · ${CLASS}` : `polygon · ${drawn.length}/${POLYGON.length} points`}
          </p>
          <p aria-live="polite" className={saved ? "text-primary" : "text-faint"}>
            {saved ? `saved · ${files.length} file${files.length > 1 ? "s" : ""}` : `mode: ${mode}`}
          </p>
        </div>

        <p className="sr-only">
          A polygon is drawn point by point around a packet of Uttam Sooji while its bounding box grows with it. Once closed,
          the shape is saved in {modes.find((candidate) => candidate.value === mode)!.label} mode as {files.map((file) => file.path).join(", ")}.
        </p>
      </div>

      <Picker
        label="Output mode"
        options={modes.map(({ value, label }) => ({ value, label }))}
        value={mode}
        onChange={(next) => {
          setMode(next);
          setStep(reducedMotion ? SAVE : 0);
        }}
      />
    </>
  );
};

export default ByteBoxerReplay;
