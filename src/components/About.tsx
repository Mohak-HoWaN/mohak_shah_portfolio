import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Award, TrendingUp } from "lucide-react";

interface AboutProps {
  role: "data-scientist" | "ai-engineer";
}

const About = ({ role }: AboutProps) => {
  const roleData = {
    "data-scientist": {
      title: "About Me - Data Scientist",
      description: "With over 5 years of experience in data science, I specialize in extracting meaningful insights from complex datasets. My expertise spans across statistical modeling, machine learning, and data visualization, helping organizations make data-driven decisions that drive growth and innovation.",
      achievements: [
        { icon: TrendingUp, title: "20+ ML Models", description: "Deployed in production" },
        { icon: Award, title: "95% Accuracy", description: "Average model performance" },
        { icon: Briefcase, title: "50+ Projects", description: "Successfully completed" },
        { icon: GraduationCap, title: "PhD Statistics", description: "Advanced degree" }
      ],
      experience: [
        "Advanced Statistical Analysis & Hypothesis Testing",
        "Predictive Modeling & Time Series Forecasting",
        "A/B Testing & Experimentation Design",
        "Data Pipeline Architecture & ETL Processes",
        "Business Intelligence & Dashboard Development"
      ]
    },
    "ai-engineer": {
      title: "About Me - AI Engineer",
      description: "As an AI Engineer with 4+ years of experience, I bridge the gap between research and production by building scalable AI systems. I specialize in deep learning, natural language processing, and computer vision, creating intelligent solutions that enhance user experiences and automate complex tasks.",
      achievements: [
        { icon: TrendingUp, title: "15+ AI Systems", description: "Deployed at scale" },
        { icon: Award, title: "99.5% Uptime", description: "Production reliability" },
        { icon: Briefcase, title: "30+ Models", description: "In production" },
        { icon: GraduationCap, title: "MS AI/ML", description: "Specialized degree" }
      ],
      experience: [
        "Deep Learning Architecture Design & Implementation",
        "Natural Language Processing & Large Language Models",
        "Computer Vision & Image Recognition Systems",
        "MLOps & Model Deployment Automation",
        "AI System Optimization & Performance Tuning"
      ]
    }
  };

  const currentRole = roleData[role];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
  }, [role]);

  return (
    <section id="about" className={`py-20 ${role === 'ai-engineer' ? 'bg-muted/15' : 'bg-muted/20'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
            {currentRole.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto animate-fade-in"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Description */}
          <div className="animate-slide-in">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {currentRole.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">Key Expertise:</h3>
              {currentRole.experience.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            {currentRole.achievements.map((achievement, index) => (
              <Card 
                key={index} 
                className={`backdrop-blur-sm transition-all duration-300 group ${
                  role === 'ai-engineer'
                    ? 'bg-card/30 border-border/30 hover:bg-card/60 hover:shadow-ai-glow hover:border-primary/30'
                    : 'bg-card/50 border-border/50 hover:bg-card/80 hover:shadow-card'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${
                    role === 'ai-engineer'
                      ? 'bg-primary/15 group-hover:bg-primary/25 group-hover:shadow-ai-glow'
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    <achievement.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-8">Core Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {role === "data-scientist" && (
              <>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Python</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">R</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">SQL</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Pandas</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Scikit-learn</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Tableau</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Apache Spark</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Docker</Badge>
              </>
            )}
            {role === "ai-engineer" && (
              <>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">PyTorch</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">TensorFlow</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">Transformers</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">LangChain</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">Kubernetes</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">MLflow</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">FastAPI</Badge>
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 hover:shadow-ai-glow transition-shadow">AWS</Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;