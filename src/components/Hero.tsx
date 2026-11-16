import { lazy, Suspense } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Role, roleLabels, contact } from "@/lib/role";

import ShutterSlides from "@/components/ShutterSlides";

// three.js loads only when the stage is shown
const CloudScene = lazy(() => import("@/components/three/CloudScene"));

interface HeroProps {
  role: Role;
}

const roleData = {
  "cv-engineer": {
    headline: "Computer vision systems built for small, CPU‑only hardware",
    description:
      "I'm Mohak Shah, a final-year B.Tech student in AI and Data Science. I lead JonaRu, a camera-based checkout that detects the packaged products set in its scan zone and bills them, and I built real-time activity recognition for CCTV streams as a computer vision intern at Agrex.ai.",
    Stage: ShutterSlides,
  },
  "data-scientist": {
    headline: "Machine learning models, shipped as working apps and APIs",
    description:
      "I'm Mohak Shah, a final-year B.Tech student in AI and Data Science. I take a problem from raw data to a deployed service: a symptom-based health recommender running on Flask, a fitness recommendation API, and analytics work in SQL and Power BI.",
    Stage: CloudScene,
  },
};

const Hero = ({ role }: HeroProps) => {
  const { headline, description, Stage } = roleData[role];

  return (
    <section id="top" className="relative pt-14">
      <div className="backdrop-grid absolute inset-0" aria-hidden />

      {/* Re-keyed so the entrance and the stage replay when the lens changes */}
      <div key={role} className="wrap relative py-12 md:py-14">
        <p className="animate-rise font-mono text-sm text-muted-foreground">
          <span className="mr-2 inline-block size-1.5 -translate-y-0.5 rounded-full bg-primary" />
          {roleLabels[role]}
        </p>

        <h1 className="animate-rise mt-6 max-w-[20ch] font-display text-5xl leading-[0.98] tracking-[-0.02em] [animation-delay:60ms] sm:text-7xl lg:text-[5.25rem]">
          {headline}
        </h1>

        <div className="mt-10 grid items-start gap-12 md:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="animate-rise [animation-delay:120ms] lg:col-span-5">
            <p className="max-w-[34rem] text-lg leading-relaxed text-muted-foreground">{description}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-base" asChild>
                <a href="#work">
                  See the work
                  <ArrowDown strokeWidth={1.5} />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base" asChild>
                <a href="/Mohak_Resume_Latest.pdf" download="Mohak_Shah_Resume.pdf">
                  Download resume
                  <Download strokeWidth={1.5} />
                </a>
              </Button>
            </div>

            <div className="mt-8 flex gap-6 text-sm">
              <a href={`mailto:${contact.email}`} className="link">
                Email
              </a>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="link">
                GitHub
                <ArrowUpRight className="size-3.5 text-faint" strokeWidth={1.5} />
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                LinkedIn
                <ArrowUpRight className="size-3.5 text-faint" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="animate-rise [animation-delay:180ms] lg:col-span-7">
            <Suspense fallback={<div className="stage aspect-[16/10] rounded-lg border bg-card" />}>
              <Stage />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
