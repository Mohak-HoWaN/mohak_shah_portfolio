import { useState } from "react";
import { cn } from "@/lib/utils";

type Category = "certification" | "internship" | "training" | "hackathon";

interface Credential {
  date: string;
  name: string;
  issuer: string;
  category: Category;
  credentialId?: string;
}

// Newest first. Every entry has a certificate on file.
const credentials: Credential[] = [
  {
    date: "Jul 2026",
    name: "Machine Learning for Automotive Safety, project certificate",
    issuer: "ProoV",
    category: "certification",
    credentialId: "PRV-2026-A192F2F5",
  },
  {
    date: "Oct 2025",
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    category: "certification",
    credentialId: "323307691OCI25AICFA",
  },
  {
    date: "Jun 2025",
    name: "AI/ML Intern, one-month programme",
    issuer: "Micro Information Technology Services",
    category: "internship",
    credentialId: "MITS136428",
  },
  { date: "Jun 2025", name: "GenAI Job Simulation", issuer: "BCG X on Forage", category: "training" },
  {
    date: "Jun 2025",
    name: "One-week Artificial Intelligence challenge",
    issuer: "NoviTech R&D",
    category: "training",
    credentialId: "NT_5AIV834",
  },
  { date: "Mar 2025", name: "HackNUthon 6.0, Petpooja track", issuer: "Nirma University", category: "hackathon" },
  {
    date: "Feb 2025",
    name: "Data Analytics virtual internship",
    issuer: "Trainity",
    category: "internship",
    credentialId: "110777",
  },
  {
    date: "Jan 2025",
    name: "Eight-week Data Analytics specialization",
    issuer: "Trainity",
    category: "training",
    credentialId: "110777",
  },
  {
    date: "Jan 2025",
    name: "Real-time Twitter analytics dashboard in Power BI",
    issuer: "NullClass",
    category: "training",
  },
  {
    date: "Dec 2024",
    name: "Artificial Intelligence internship, September to December",
    issuer: "MindSparc",
    category: "internship",
    credentialId: "TMIN20243714",
  },
  {
    date: "Nov 2024",
    name: "Odoo x Amalthea Hackathon, 24 hours",
    issuer: "IIT Gandhinagar",
    category: "hackathon",
  },
  {
    date: "Sep 2024",
    name: "Smart India Hackathon 2024, internal round",
    issuer: "Sankalchand Patel College of Engineering",
    category: "hackathon",
  },
  {
    date: "Aug 2024",
    name: "DataQuest Hackathon 2024",
    issuer: "Adani Institute of Digital Technology Management",
    category: "hackathon",
  },
  {
    date: "Aug 2024",
    name: "Robo-AI, 30-day industrial training in robotics automation and simulation",
    issuer: "My Equation",
    category: "training",
  },
  {
    date: "Jul 2024",
    name: "Google Data Analytics, five courses",
    issuer: "Google on Coursera",
    category: "certification",
  },
  {
    date: "Nov 2023",
    name: "New India Vibrant Hackathon 2023, grand finale",
    issuer: "SSIP Gujarat, at PDEU Gandhinagar",
    category: "hackathon",
  },
];

const filters: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "certification", label: "Certifications" },
  { value: "internship", label: "Internships" },
  { value: "training", label: "Training" },
  { value: "hackathon", label: "Hackathons" },
];

const Certificates = () => {
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const filtered =
    activeFilter === "all" ? credentials : credentials.filter((credential) => credential.category === activeFilter);

  return (
    <section id="credentials" className="border-t py-20 md:py-28">
      <div className="wrap">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">Credentials</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Certifications, internships, training and hackathons, newest first.
        </p>

        <div role="group" aria-label="Filter credentials" className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "h-11 rounded-md border px-4 text-sm transition-colors md:h-9",
                activeFilter === filter.value
                  ? "border-foreground/30 bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
              <span className="ml-2 font-mono text-xs tabular-nums text-faint">
                {filter.value === "all"
                  ? credentials.length
                  : credentials.filter((credential) => credential.category === filter.value).length}
              </span>
            </button>
          ))}
        </div>

        <ul className="mt-8 border-t">
          {filtered.map((credential) => (
            <li
              key={credential.name}
              className="grid gap-x-10 gap-y-1 border-b py-4 md:grid-cols-[6rem_1fr_auto] md:items-baseline"
            >
              <span className="font-mono text-sm tabular-nums text-faint">{credential.date}</span>
              <div>
                <p>{credential.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{credential.issuer}</p>
              </div>
              {credential.credentialId && (
                <span className="font-mono text-xs text-faint">ID {credential.credentialId}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certificates;
