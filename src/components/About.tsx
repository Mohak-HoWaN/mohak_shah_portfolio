import { type Role } from "@/lib/role";

interface AboutProps {
  role: Role;
}

const roleData = {
  "cv-engineer": {
    paragraphs: [
      "Most of my work sits between a trained detector and the device it has to run on. For JonaRu that means collecting and labelling product images, training YOLO models, exporting them to ONNX, OpenVINO and NCNN, and checking each export against the original weights.",
      "At Agrex.ai I trained YOLO and RF-DETR models for safety monitoring, built a throwing-detection pipeline with RF-DETR and ByteTrack that reached up to 85% recall, and benchmarked it on TensorRT and Triton across GStreamer CCTV pipelines.",
    ],
    offer: [
      "Take a detector from labelled data to the device: train YOLO or RF-DETR, export to ONNX, OpenVINO and NCNN, and check each export against the original weights",
      "Benchmark exports and precisions for latency against accuracy on CPU and edge hardware",
      "Build detection, tracking and counting pipelines on camera and CCTV streams",
      "Ship models as APIs and apps with FastAPI, Flask and Docker",
    ],
  },
  "data-scientist": {
    paragraphs: [
      "I like data work that ends in something a person can use. Health Care Center started as a notebook comparing classifiers on symptom data and became a Flask app with voice input and an offline build.",
      "Alongside modelling I have done analytics training and internships in SQL, Python and Power BI, including a live project on social media user data.",
    ],
    offer: [
      "Take a problem from raw data to a deployed service, such as a Flask app or a REST API",
      "Compare and tune classical models with scikit-learn and pandas",
      "Answer business questions with SQL, Python and Power BI",
    ],
  },
};

const facts = [
  {
    label: "Open to",
    lines: ["Internships, full-time roles and collaborations"],
    detail: "Available now, remote or on-site",
  },
  {
    label: "Education",
    lines: ["B.Tech, Artificial Intelligence and Data Science"],
    detail: "Sankalchand Patel University, Visnagar. 2023 to 2027",
  },
  {
    label: "Now",
    lines: ["Team lead, JonaRu"],
    detail: "Retail automation funded under Gujarat's Student Startup and Innovation Policy (SSIP)",
  },
  {
    label: "Experience",
    lines: [
      "Computer Vision Intern, Agrex.ai, Delhi, 2026",
      "AI/ML Intern, Micro Information Technology Services, 2025",
      "Artificial Intelligence Intern, MindSparc, 2024",
      "Data Analytics virtual internship, Trainity, 2025",
    ],
  },
  { label: "Based in", lines: ["Mehsana, Gujarat, India"] },
];

const toolkit = [
  { label: "Vision", items: ["YOLO", "RF-DETR", "ByteTrack", "OpenCV", "ONNX Runtime", "OpenVINO", "NCNN", "INT8 and FP16 quantization"] },
  { label: "ML and data", items: ["PyTorch", "scikit-learn", "pandas", "NumPy", "SQL", "Power BI"] },
  { label: "Serving", items: ["TensorRT", "Triton Inference Server", "GStreamer", "FastAPI", "Flask", "Docker", "Raspberry Pi"] },
  { label: "Web", items: ["TypeScript", "React", "Next.js"] },
];

const About = ({ role }: AboutProps) => (
  <section id="about" className="border-t py-20 md:py-28">
    <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">About</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
          {roleData[role].paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h3 className="mt-12 text-sm text-faint">What I can do for teams</h3>
        <ul className="mt-4 space-y-3 border-l pl-5">
          {roleData[role].offer.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7">
        <dl className="border-t">
          {facts.map((fact) => (
            <div key={fact.label} className="grid gap-2 border-b py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="text-sm text-faint">{fact.label}</dt>
              <dd className="space-y-1">
                {fact.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {fact.detail && <p className="text-muted-foreground">{fact.detail}</p>}
              </dd>
            </div>
          ))}
          {toolkit.map((group) => (
            <div key={group.label} className="grid gap-2 border-b py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="text-sm text-faint">{group.label}</dt>
              <dd className="font-mono text-[13px] leading-relaxed text-muted-foreground">
                {group.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

export default About;
