import { type CSSProperties, Fragment, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import HeatReveal from "@/components/HeatReveal";
import LatencyChart from "@/components/LatencyChart";
import ScanZoneReplay from "@/components/ScanZoneReplay";
import PromptifyReplay from "@/components/PromptifyReplay";
import Trainity from "@/components/Trainity";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { type Role } from "@/lib/role";

interface ProjectsProps {
  role: Role;
}

interface Project {
  title: string;
  field: "Computer vision" | "Data science" | "AI engineering";
  role: Role;
  status: string;
  description: string;
  context: string;
  stack: string[];
  links: { label: string; href: string }[];
  // Stages the project moves data through; they light up as the row scrolls in
  pipeline?: string[];
  image?: { src: string; alt: string };
  // A coded visual in place of an image
  visual?: ReactNode;
}

const projects: Project[] = [
  {
    title: "JonaRu",
    field: "Computer vision",
    role: "cv-engineer",
    status: "SSIP-funded, 2025 to present",
    description:
      "Camera-based checkout for neighbourhood stores. A YOLO detector recognises packaged products, a ByteTrack-style tracker follows them, and the bill is the stable count of each product inside the scan zone, so an item is added when it settles in the zone and removed when it leaves. I lead the team and own the vision pipeline; moving it from a custom CNN to YOLO raised recognition precision from 78% to 94%.",
    context: "Student Startup and Innovation Policy (SSIP), Gujarat, with grant funding awarded twice. Built for a Raspberry Pi 5.",
    stack: ["YOLO", "ByteTrack", "ONNX Runtime", "OpenVINO", "NCNN", "FastAPI", "Next.js", "Docker"],
    links: [
      { label: "Product site", href: "https://aiot.shahonthefloor.workers.dev/" },
      { label: "GitHub", href: "https://github.com/TeamFuture635542/AIOT" },
    ],
    pipeline: ["Camera", "Detect", "Track", "Count in zone", "Bill"],
    visual: <ScanZoneReplay />,
  },
  {
    title: "EdgeBench",
    field: "Computer vision",
    role: "cv-engineer",
    status: "Open source",
    description:
      "A bench for edge deployment decisions. Upload a PyTorch detector, convert it to ONNX, OpenVINO and NCNN at different precisions, benchmark every variant on each device, and read latency against accuracy drift through one shared decode path.",
    context: "Grew out of JonaRu's deployment work: one place to compare every export before it ships to a device.",
    stack: ["FastAPI", "SQLModel", "SQLite", "React", "TypeScript", "ONNX Runtime", "OpenVINO", "NCNN"],
    links: [{ label: "GitHub", href: "https://github.com/Mohak-HoWaN/edgebench" }],
    pipeline: ["Upload .pt", "Convert", "Benchmark", "Compare"],
    visual: <LatencyChart />,
  },
  {
    title: "Promptify",
    field: "AI engineering",
    role: "cv-engineer",
    status: "AWS AI for Bharat",
    description:
      "A layer between you and the LLM. It scores a prompt, restructures it, recommends a model and estimates the cost before anything is sent. It ships as a web dashboard, a browser extension for ChatGPT, Claude and Gemini, and an MCP server for IDEs.",
    context: "Started at the AWS AI for Bharat hackathon and kept going as a product.",
    stack: ["TypeScript", "Node.js", "Express", "PostgreSQL", "Redis", "MCP", "Manifest V3"],
    links: [],
    pipeline: ["Prompt", "Score", "Rewrite", "Pick model", "Send"],
    visual: <PromptifyReplay />,
  },
  {
    title: "Health Care Center",
    field: "Data science",
    role: "data-scientist",
    status: "Live",
    description:
      "Symptom checker that predicts a likely condition with an SVM classifier, then returns medication, diet, workout and precaution guidance. Symptoms can be typed or spoken, and an offline build covers low-connectivity use.",
    context: "Trained on 132 symptoms across 41 conditions.",
    stack: ["Python", "scikit-learn", "pandas", "Flask"],
    links: [
      { label: "Live app", href: "https://health-care-center-k3gk.onrender.com/" },
      { label: "GitHub", href: "https://github.com/Mohak-HoWaN/Health-Care-Center" },
    ],
    pipeline: ["Symptoms", "SVM classifier", "Condition", "Guidance"],
    image: {
      src: "/project_images/health-care-center-result.webp",
      alt: "Health Care Center result for itching, skin rash and nodal skin eruptions: the predicted condition is fungal infection",
    },
  },
  {
    title: "Smart Waste Minimizer",
    field: "Computer vision",
    role: "cv-engineer",
    status: "HackNUthon 6.0",
    description:
      "Restaurant inventory tool that flags food before it spoils. YOLOv5 finds items in a photo, a dual-head MobileNetV2 classifies item type and freshness in one pass, and Grad-CAM heatmaps show which regions drove the call. A Next.js dashboard tracks inventory, orders and waste.",
    context: "Built for the Petpooja track at Nirma University.",
    stack: ["PyTorch", "YOLOv5", "MobileNetV2", "Grad-CAM", "Flask", "Next.js"],
    links: [{ label: "Demo video", href: "https://youtu.be/F4aPVs2v1uY" }],
    pipeline: ["Photo", "YOLOv5", "MobileNetV2", "Grad-CAM"],
    visual: <HeatReveal />,
  },
  {
    title: "Fitness Recommendation API",
    field: "Data science",
    role: "data-scientist",
    status: "Deployed API",
    description:
      "REST API that suggests a workout type and predicts daily calorie and water intake from BMI, step count and activity level. Nearest-neighbour matching for workouts, random forests for the two predictions.",
    context: "Odoo x Charusat hackathon.",
    stack: ["Python", "scikit-learn", "Flask", "Render"],
    links: [{ label: "GitHub", href: "https://github.com/Mohak-HoWaN/fitness_recommendation_api" }],
  },
];

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
    {project.links.map((link) => (
      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="link">
        {link.label}
        <ArrowUpRight className="size-3.5 text-faint" strokeWidth={1.5} />
      </a>
    ))}
  </div>
);

// Follows its own scroll position rather than the row's: it sits below the visual,
// so on the row's progress the line was full before the pipeline came into view.
const Pipeline = ({ stages }: { stages: string[] }) => {
  const ref = useScrollProgress<HTMLOListElement>();

  return (
    <ol ref={ref} className="pipeline mt-6" style={{ "--n": stages.length } as CSSProperties}>
      {stages.map((stage, index) => (
        <li key={stage} style={{ "--i": index } as CSSProperties}>
          {stage}
        </li>
      ))}
    </ol>
  );
};

const FeaturedProject = ({ project }: { project: Project }) => {
  const ref = useScrollProgress<HTMLElement>();

  return (
    <article ref={ref} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border bg-card">
            {project.visual ?? (
              <img
                src={project.image!.src}
                alt={project.image!.alt}
                width={1600}
                height={1000}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover object-top"
              />
            )}
            <span className="frame-tag">{project.field}</span>
          </div>
          {/* Viewfinder corners that close in on the frame as it scrolls into view */}
          <div className="lock" aria-hidden>
            <span className="left-0 top-0 border-l border-t" />
            <span className="right-0 top-0 border-r border-t" />
            <span className="bottom-0 left-0 border-b border-l" />
            <span className="bottom-0 right-0 border-b border-r" />
          </div>
        </div>

        {project.pipeline && <Pipeline stages={project.pipeline} />}
      </div>

      <div className="flex flex-col lg:col-span-5">
        <p className="font-mono text-sm text-faint">{project.status}</p>
        <h3 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{project.title}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{project.description}</p>

        <dl className="mt-6 space-y-3 border-t pt-6 text-sm">
          <div className="grid grid-cols-[5rem_1fr] gap-4">
            <dt className="text-faint">Context</dt>
            <dd className="text-muted-foreground">{project.context}</dd>
          </div>
          <div className="grid grid-cols-[5rem_1fr] gap-4">
            <dt className="text-faint">Stack</dt>
            <dd className="font-mono text-[13px] leading-relaxed text-muted-foreground">{project.stack.join(" · ")}</dd>
          </div>
        </dl>

        <div className="mt-6 lg:mt-auto lg:pt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
};

const Projects = ({ role }: ProjectsProps) => {
  // The chosen lens leads; sort is stable so the order within each group holds
  const ordered = [...projects].sort((a, b) => Number(b.role === role) - Number(a.role === role));
  const featured = ordered.filter((project) => project.image || project.visual);
  const compact = ordered.filter((project) => !project.image && !project.visual);

  return (
    <section id="work" className="border-t py-20 md:py-28">
      <div className="wrap">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">Selected work</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Six projects across computer vision, AI engineering and data science, and a folder of analytics case studies.
          The lens you pick sets the order.
        </p>

        <div className="mt-14 space-y-16 md:mt-16 md:space-y-24">
          {featured.map((project) => (
            <Fragment key={project.title}>
              <FeaturedProject project={project} />
              {/* The analytics case studies sit under the other data science work */}
              {project.title === "Health Care Center" && <Trainity />}
            </Fragment>
          ))}
        </div>

        <div className="mt-16 border-t md:mt-24">
          {compact.map((project) => (
            <article key={project.title} className="grid gap-4 border-b py-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <h3 className="font-display text-2xl tracking-tight">{project.title}</h3>
                <p className="mt-2 font-mono text-sm text-faint">
                  {project.field} · {project.status}
                </p>
              </div>
              <div className="lg:col-span-8">
                <p className="leading-relaxed text-muted-foreground">
                  {project.description} {project.context}
                </p>
                <p className="mt-4 font-mono text-[13px] leading-relaxed text-muted-foreground">
                  {project.stack.join(" · ")}
                </p>
                <div className="mt-4">
                  <ProjectLinks project={project} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
