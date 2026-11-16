import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import FieldBackground from "@/components/FieldBackground";
import { type Role, roleLabels } from "@/lib/role";

const Index = () => {
  // ?lens=data-science opens the data science lens, so each application can link to the right one
  const [role, setRole] = useState<Role>(() =>
    new URLSearchParams(window.location.search).get("lens") === "data-science" ? "data-scientist" : "cv-engineer"
  );

  const [sound, setSound] = useState(true);

  useEffect(() => {
    // The lens accent is keyed off this attribute in index.css
    document.documentElement.setAttribute("data-role", role);
    document.title = `Mohak Shah, ${roleLabels[role]}`;
    const search = role === "data-scientist" ? "?lens=data-science" : "";
    window.history.replaceState(null, "", window.location.pathname + search + window.location.hash);
  }, [role]);

  return (
    // No background here: the field canvas and the cursor spotlight sit behind the content, on the body's
    <div className="relative min-h-screen">
      <FieldBackground role={role} />
      <Cursor role={role} sound={sound} />
      <Header role={role} onRoleChange={setRole} sound={sound} onSoundChange={setSound} />
      <main>
        <Hero role={role} />
        <Projects role={role} />
        <About role={role} />
        <Certificates />
        <Contact />
      </main>
      <footer className="border-t">
        <div className="wrap flex flex-col gap-2 py-8 text-sm text-faint sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Mohak Shah</p>
          <a href="#top" className="-my-3 rounded-sm py-3 transition-colors hover:text-foreground">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
