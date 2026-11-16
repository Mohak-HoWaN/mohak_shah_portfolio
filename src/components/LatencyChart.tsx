import { type CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";

// Median inference time per image, measured with EdgeBench
const latency = [
  { label: "OpenVINO INT8", ms: 17.0 },
  { label: "ONNX INT8", ms: 25.0 },
  { label: "OpenVINO FP16", ms: 27.5 },
  { label: "ONNX FP32", ms: 30.0 },
  { label: "PyTorch baseline", ms: 55.9 },
];

// The visitor's own device runs the same YOLO11n exports in the browser.
// OpenVINO and NCNN have no browser runtime, so only the ONNX exports can run here.
const variants = [
  { label: "ONNX INT8", file: "yolo11n_int8.onnx", provider: "wasm" },
  { label: "ONNX FP32", file: "yolo11n_fp32.onnx", provider: "wasm" },
  { label: "ONNX FP32, GPU", file: "yolo11n_fp32.onnx", provider: "webgpu" },
];
const WARMUP = 2;
const RUNS = 10;

// ONNX Runtime Web is fetched on first use, so nothing loads until someone runs the benchmark.
// shortcut: depends on jsDelivr being reachable, copy the dist files into public/ if that becomes a problem
const ORT_URL = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.webgpu.bundle.min.mjs";

interface Row {
  label: string;
  ms: number;
}

async function benchmark(onProgress: (text: string) => void, onResult: (row: Row) => void) {
  const ort = await import(/* @vite-ignore */ ORT_URL);
  // Threads need cross-origin isolation headers, which static hosts do not send
  ort.env.wasm.numThreads = 1;
  const pixels = Float32Array.from({ length: 3 * 640 * 640 }, Math.random);

  for (const { label, file, provider } of variants) {
    if (provider === "webgpu" && !("gpu" in navigator)) continue;
    try {
      onProgress(`${label}: loading the model`);
      const session = await ort.InferenceSession.create(`/models/${file}`, { executionProviders: [provider] });
      const feeds = { [session.inputNames[0]]: new ort.Tensor("float32", pixels, [1, 3, 640, 640]) };
      const times: number[] = [];
      for (let run = -WARMUP; run < RUNS; run++) {
        onProgress(run < 0 ? `${label}: warming up` : `${label}: run ${run + 1} of ${RUNS}`);
        // Let the page paint between runs
        await new Promise((resolve) => setTimeout(resolve));
        const started = performance.now();
        await session.run(feeds);
        if (run >= 0) times.push(performance.now() - started);
      }
      await session.release();
      times.sort((a, b) => a - b);
      onResult({ label, ms: (times[RUNS / 2 - 1] + times[RUNS / 2]) / 2 });
    } catch (error) {
      // A backend this browser cannot run is left out of the chart
      console.warn(`Benchmark skipped ${label}`, error);
    }
  }
}

const LatencyChart = () => {
  const [mine, setMine] = useState<Row[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const scale = Math.max(60, ...mine.map((row) => row.ms)) * 1.02;

  const run = async () => {
    setMine([]);
    setFailed(false);
    setProgress("Loading ONNX Runtime");
    let results = 0;
    await benchmark(setProgress, (row) => {
      results++;
      setMine((rows) => [...rows, row]);
    }).catch(() => {});
    setFailed(!results);
    setProgress(null);
  };

  const bar = (row: Row, className: string, style?: CSSProperties) => (
    <div
      key={className + row.label}
      className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 font-mono text-[11px] sm:grid-cols-[9rem_1fr_3.5rem] sm:text-xs"
    >
      <span className="text-muted-foreground">{row.label}</span>
      <span className="h-4 sm:h-5">
        <span
          className={cn("block h-full origin-left rounded-sm transition-[width] duration-500", className)}
          style={{ width: `${(row.ms / scale) * 100}%`, ...style }}
        />
      </span>
      <span className="text-right tabular-nums text-foreground">{row.ms.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="stage flex aspect-[16/10] flex-col justify-center gap-3 px-5 pb-5 pt-12 sm:gap-4 sm:px-8">
      <div
        className="flex flex-col gap-3 sm:gap-4"
        role="img"
        aria-label={latency.map((row) => `${row.label} ${row.ms} milliseconds`).join(", ")}
      >
        {latency.map((row, index) =>
          bar(row, cn("bar", index === 0 ? "bg-primary" : "bg-foreground/25"), { "--i": index } as CSSProperties)
        )}
      </div>
      <p className="font-mono text-[11px] text-faint sm:text-xs">Median inference time per image, ms. YOLO11n on COCO128</p>

      {mine.length > 0 && (
        <div className="flex flex-col gap-3 border-t pt-3 sm:gap-4 sm:pt-4">
          {mine.map((row) => bar(row, "bg-foreground"))}
          <p className="font-mono text-[11px] text-faint sm:text-xs">
            This device: the same model in your browser, on one CPU thread unless marked GPU
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] sm:text-xs">
        <button
          type="button"
          onClick={run}
          disabled={progress !== null}
          className="-my-2 rounded-sm py-2 text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary disabled:text-muted-foreground disabled:no-underline"
        >
          {mine.length && !progress ? "Run it again" : "Benchmark this device"}
        </button>
        <span className="text-faint" aria-live="polite">
          {progress ?? (failed ? "This browser could not run the model" : mine.length ? "" : "Downloads about 20 MB, takes under a minute")}
        </span>
      </div>
    </div>
  );
};

export default LatencyChart;
