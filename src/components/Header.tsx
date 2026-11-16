import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Role, roleLabels } from "@/lib/role";

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  sound: boolean;
  onSoundChange: (sound: boolean) => void;
}

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];

const LensSwitch = ({
  role,
  onRoleChange,
  className,
}: Pick<HeaderProps, "role" | "onRoleChange"> & { className?: string }) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // The pill slides to the pressed button; measured, so it fits the row and the stacked mobile layout alike
  useLayoutEffect(() => {
    const group = groupRef.current!;
    const place = () => {
      const active = group.querySelector<HTMLElement>("[aria-pressed=true]")!;
      Object.assign(pillRef.current!.style, {
        width: `${active.offsetWidth}px`,
        height: `${active.offsetHeight}px`,
        transform: `translate(${active.offsetLeft}px, ${active.offsetTop}px)`,
      });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(group);
    return () => observer.disconnect();
  }, [role]);

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Portfolio lens"
      className={cn("relative flex rounded-md border p-0.5", className)}
    >
      <span
        ref={pillRef}
        aria-hidden
        className="absolute left-0 top-0 rounded-[5px] bg-secondary transition-[transform,width,height] duration-300 ease-out"
      />
      {(Object.keys(roleLabels) as Role[]).map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={role === key}
          onClick={() => onRoleChange(key)}
          className={cn(
            "relative flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-3 text-sm transition-colors lg:h-8",
            role === key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-[background-color,transform] duration-300",
              role === key ? "scale-125 bg-primary" : "bg-border"
            )}
          />
          {roleLabels[key]}
        </button>
      ))}
    </div>
  );
};

// Section in view, for the nav highlight: the one crossing the upper third of the screen
const useActiveSection = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
};

const Header = ({ role, onRoleChange, sound, onSoundChange }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const active = useActiveSection();

  // Page progress goes straight to a CSS variable so scrolling never re-renders React
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current!.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300",
        menuOpen
          ? "bg-background"
          : scrolled
            ? "bg-background/80 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md"
            : "border-transparent bg-background/40 backdrop-blur-sm"
      )}
    >
      {/* Reading progress along the bottom edge */}
      <span ref={progressRef} aria-hidden className="scroll-progress" />
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-sm font-medium">
          <img src="/favicon.svg" alt="" width={24} height={24} className="size-6" />
          Mohak Shah
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              className="nav-link rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LensSwitch role={role} onRoleChange={onRoleChange} className="hidden lg:flex" />

          {/* Click sounds only exist with a mouse */}
          <button
            type="button"
            className="hidden size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground lg:size-9 [@media(hover:hover)_and_(pointer:fine)]:flex"
            aria-pressed={sound}
            aria-label="Click sound"
            onClick={() => onSoundChange(!sound)}
          >
            {sound ? <Volume2 className="size-4" strokeWidth={1.5} /> : <VolumeX className="size-4" strokeWidth={1.5} />}
          </button>

          <button
            type="button"
            className="-mr-2 flex size-11 items-center justify-center rounded-md text-muted-foreground lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t lg:hidden">
          <div className="wrap flex flex-col py-4">
            <nav className="flex flex-col" aria-label="Sections">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === link.href ? "location" : undefined}
                  className="flex h-11 items-center gap-3 rounded-sm text-muted-foreground transition-colors hover:text-foreground aria-[current]:text-foreground"
                >
                  <span
                    aria-hidden
                    className={cn("h-px bg-primary transition-[width] duration-300", active === link.href ? "w-4" : "w-0")}
                  />
                  {link.label}
                </a>
              ))}
            </nav>
            <LensSwitch role={role} onRoleChange={onRoleChange} className="mt-4 flex-col sm:flex-row sm:[&>button]:flex-1" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
