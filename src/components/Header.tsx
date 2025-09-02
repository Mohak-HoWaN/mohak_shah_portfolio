import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Bot, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  role: "data-scientist" | "ai-engineer";
  onRoleChange: (role: "data-scientist" | "ai-engineer") => void;
}

const Header = ({ role, onRoleChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {role === "data-scientist" ? (
              <Database className="h-8 w-8 text-primary" />
            ) : (
              <Bot className="h-8 w-8 text-primary" />
            )}
            <span className="text-xl font-bold text-foreground">Portfolio</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#certificates" className="text-muted-foreground hover:text-primary transition-colors">
              Certificates
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth & Role Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Role Toggle */}
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${role === "data-scientist" ? "text-primary" : "text-muted-foreground"}`}>
                Data Scientist
              </span>
              <Switch
                checked={role === "ai-engineer"}
                onCheckedChange={(checked) => 
                  onRoleChange(checked ? "ai-engineer" : "data-scientist")
                }
              />
              <span className={`text-sm ${role === "ai-engineer" ? "text-primary" : "text-muted-foreground"}`}>
                AI Engineer
              </span>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                Projects
              </a>
              <a href="#certificates" className="text-muted-foreground hover:text-primary transition-colors">
                Certificates
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
              
              {/* Mobile Role Toggle */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border">
                <span className={`text-sm ${role === "data-scientist" ? "text-primary" : "text-muted-foreground"}`}>
                  Data Scientist
                </span>
                <Switch
                  checked={role === "ai-engineer"}
                  onCheckedChange={(checked) => 
                    onRoleChange(checked ? "ai-engineer" : "data-scientist")
                  }
                />
                <span className={`text-sm ${role === "ai-engineer" ? "text-primary" : "text-muted-foreground"}`}>
                  AI Engineer
                </span>
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;