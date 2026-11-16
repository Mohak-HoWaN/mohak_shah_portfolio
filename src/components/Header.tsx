import { useState } from "react";
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
}: Pick<HeaderProps, "role" | "onRoleChange"> & { className?: string }) => (
  <div role="group" aria-label="Portfolio lens" className={cn("flex rounded-md border p-0.5", className)}>
    {(Object.keys(roleLabels) as Role[]).map((key) => (
      <button
        key={key}
        type="button"
        aria-pressed={role === key}
        onClick={() => onRoleChange(key)}
        className={cn(
          "flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-3 text-sm transition-colors lg:h-8",
          role === key ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className={cn("size-1.5 rounded-full", role === key ? "bg-primary" : "bg-border")} />
        {roleLabels[key]}
      </button>
    ))}
  </div>
);

const Header = ({ role, onRoleChange, sound, onSoundChange }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b",
        menuOpen ? "bg-background" : "bg-background/85 backdrop-blur-md"
      )}
    >
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <a href="#top" className="rounded-sm font-medium">
          Mohak Shah
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                  className="flex h-11 items-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                >
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
