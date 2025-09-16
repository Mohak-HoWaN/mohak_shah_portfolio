import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

interface HeroProps {
  role: "data-scientist" | "ai-engineer";
}

const Hero = ({ role }: HeroProps) => {
  const roleData = {
    "data-scientist": {
      title: "Data Scientist",
      subtitle: "Turning Data into Insights",
      description: "I transform complex data into actionable insights using statistical analysis, machine learning, and visualization to drive data-driven decision making.",
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization"]
    },
    "ai-engineer": {
      title: "AI Engineer",
      subtitle: "Building Intelligent Systems",
      description: "I design and deploy AI systems that solve real-world problems using deep learning, natural language processing, and computer vision technologies.",
      skills: ["PyTorch", "TensorFlow", "MLOps", "Deep Learning", "NLP", "Computer Vision"]
    }
  };

  const currentRole = roleData[role];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
  }, [role]);

  return (
    <section 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        role === 'ai-engineer' ? 'ai-theme' : 'ds-theme'
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          role === 'ai-engineer' ? 'bg-primary/15 shadow-ai-glow' : 'bg-primary/10'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          role === 'ai-engineer' ? 'bg-accent/15 shadow-ai-pulse' : 'bg-secondary/10'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 ${
          role === 'ai-engineer' ? 'bg-primary/10 shadow-ai-glow' : 'bg-accent/10'
        }`}></div>
        {role === 'ai-engineer' && (
          <>
            <div className="absolute top-10 right-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-ping"></div>
            <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Role Badge */}
          <div className={`inline-flex items-center border rounded-full px-6 py-2 mb-8 animate-fade-in ${
            role === 'ai-engineer' 
              ? 'bg-primary/15 border-primary/30 shadow-ai-glow' 
              : 'bg-primary/10 border-primary/20'
          }`}>
            <span className="text-primary font-medium">{currentRole.title}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            <span className="block">Hi, I'm</span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Mohak Shah
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8 animate-fade-in">
            {currentRole.subtitle}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
            {currentRole.description}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
            {currentRole.skills.map((skill, index) => (
              <span
                key={skill}
                className={`border rounded-full px-4 py-2 text-sm text-foreground backdrop-blur-sm transition-all duration-300 ${
                  role === 'ai-engineer'
                    ? 'bg-muted/30 border-border hover:bg-primary/15 hover:border-primary/40 hover:shadow-ai-glow hover:text-primary'
                    : 'bg-muted/50 border-border hover:bg-primary/10 hover:border-primary/30'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Button variant="hero" size="lg" className="group" asChild>
              <a href="/resume.pdf" download="Mohak_Shah_Resume.pdf">
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Resume
              </a>
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Get In Touch
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12 animate-fade-in">
            <Button variant="ghost" size="icon" className="hover:text-primary hover:scale-110 transition-all" asChild>
              <a href="https://github.com/Mohak-HoWaN" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary hover:scale-110 transition-all" asChild>
              <a href="https://www.linkedin.com/in/mohak-shah-55a892286" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary hover:scale-110 transition-all" asChild>
              <a href="https://x.com/MohakShah8972" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;