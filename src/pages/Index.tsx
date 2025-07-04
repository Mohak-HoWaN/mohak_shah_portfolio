import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Index = () => {
  const [role, setRole] = useState<"data-scientist" | "ai-engineer">("data-scientist");

  return (
    <div className="min-h-screen bg-background">
      <Header role={role} onRoleChange={setRole} />
      <Hero role={role} />
      <About role={role} />
      <Projects role={role} />
      <Contact />
    </div>
  );
};

export default Index;
