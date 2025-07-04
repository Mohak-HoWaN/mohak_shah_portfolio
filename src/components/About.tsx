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

  return (
    <section id="about" className="py-20 bg-muted/20">
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
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:shadow-card transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
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
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">PyTorch</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">TensorFlow</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Transformers</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">LangChain</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Kubernetes</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">MLflow</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">FastAPI</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">AWS</Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;