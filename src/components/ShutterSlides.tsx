import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Aperture } from "lucide-react";

// Photos and screens from the projects, changed behind a camera shutter: the blades close, the picture swaps, they open.
// The second slide is the 3D JonaRu scene, which moves on by itself only once its round of items is billed.

// three.js (about 580 KB) is fetched while the slide before the scene is up
const loadScene = () => import("@/components/three/RigScene");
const RigScene = lazy(loadScene);

const slides = [
  {
    file: "jonaru-reimagined",
    project: "JonaRu",
    caption: "JonaRu reimagined: concept render of the counter unit",
    alt: "Concept render of the JonaRu unit: a 7-inch display under a camera arm, an ultrasonic sensor in front and a Raspberry Pi on a retractable tray",
  },
  {
    file: "",
    project: "JonaRu",
    caption: "3D model: a hand sets down random products, the unit bills them",
    alt: "",
  },
  {
    file: "edgebench-compare",
    project: "EdgeBench",
    caption: "Comparing three exports of a detector by accuracy, speed and size",
    alt: "EdgeBench's compare page naming the best of three ONNX FP16 runs and listing how the others differ",
  },
  {
    file: "promptify-chatgpt",
    project: "Promptify",
    caption: "The browser extension rewriting a prompt inside ChatGPT",
    alt: "A Promptify panel over ChatGPT with the original prompt, the optimized prompt and a recommended model",
  },
  {
    file: "waste-gradcam",
    project: "Smart Waste Minimizer",
    caption: "A food photo and the Grad-CAM behind its freshness call",
    alt: "A red apple, and the same photo with a heatmap over the apple",
  },
  {
    file: "health-care-center",
    project: "Health Care Center",
    caption: "Symptom checker with typed and spoken input",
    alt: "The Health Care Center symptom checker: a text box, a voice input control and symptom chips grouped by body system",
  },
];
const SCENE = 1;
const url = (index: number) => `/project_images/slides/${slides[index].file}.webp`;

const CLOSE = 320; // milliseconds the blades take to shut
const HOLD = 4500; // a slide stays this long before the shutter fires by itself

const ShutterSlides = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sceneDone, setSceneDone] = useState(false);
  const timers = useRef<number[]>([]);
  const slide = slides[index];
  const next = (index + 1) % slides.length;

  const fire = () => {
    if (closed) return;
    if (reducedMotion) return setIndex(next);
    setClosed(true);
    timers.current = [
      window.setTimeout(() => {
        setIndex(next);
        setSceneDone(false);
      }, CLOSE),
      window.setTimeout(() => setClosed(false), CLOSE + 140),
    ];
  };

  // Fires by itself while nobody is pointing at it, the scene once its round is over; with reduced motion the picture only
  // changes on request
  useEffect(() => {
    if (paused || closed || reducedMotion || (index === SCENE && !sceneDone)) return;
    const timer = window.setTimeout(fire, index === SCENE ? 0 : HOLD);
    return () => clearTimeout(timer);
  });

  // The next picture is fetched ahead, so it is there when the blades open
  useEffect(() => {
    if (next === SCENE) loadScene();
    else new Image().src = url(next);
  }, [next]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div
      className="stage relative aspect-[16/10] overflow-hidden rounded-lg border bg-card"
      onClick={fire}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {index === SCENE ? (
        // Dragging turns the scene, so a click inside it must not fire the shutter
        <div className="absolute inset-0" onClick={(event) => event.stopPropagation()}>
          <Suspense fallback={null}>
            <RigScene onDone={() => setSceneDone(true)} />
          </Suspense>
        </div>
      ) : (
        <img src={url(index)} alt={slide.alt} width={1280} height={800} className="absolute inset-0 size-full object-cover" />
      )}

      {/* Six blades, each a half-plane turned 60 degrees from the last; sliding them to the centre shuts the aperture */}
      <svg viewBox="-80 -50 160 100" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
        <g className="transition-transform ease-in-out" style={{ transform: `rotate(${closed ? 30 : 0}deg)`, transitionDuration: `${CLOSE}ms` }}>
          {Array.from({ length: 6 }, (_, blade) => (
            <rect
              key={blade}
              x={-200}
              y={0}
              width={400}
              height={200}
              className="fill-card stroke-primary/50 transition-transform ease-in-out [stroke-width:0.3]"
              style={{ transform: `rotate(${blade * 60}deg) translateY(${closed ? 0 : 100}px)`, transitionDuration: `${CLOSE}ms` }}
            />
          ))}
        </g>
      </svg>

      <span className="frame-tag z-10">{slide.project}</span>
      <span className="absolute right-0 top-0 z-10 bg-background/80 px-3 py-1.5 font-mono text-xs tabular-nums text-muted-foreground backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 border-t bg-background/80 pl-3 font-mono text-[11px] backdrop-blur-sm sm:text-xs">
        <p className="py-2.5 text-muted-foreground">{slide.caption}</p>
        <button
          type="button"
          onClick={(event) => {
            // The frame fires on click too
            event.stopPropagation();
            fire();
          }}
          className="flex h-11 shrink-0 items-center gap-1.5 px-3 text-primary transition-colors hover:text-foreground"
        >
          <Aperture className="size-3.5" strokeWidth={1.5} />
          Next
        </button>
      </div>
    </div>
  );
};

export default ShutterSlides;
