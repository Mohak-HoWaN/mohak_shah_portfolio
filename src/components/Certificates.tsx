import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, ExternalLink, Filter } from "lucide-react";

interface CertificatesProps {
  role: "data-scientist" | "ai-engineer";
}

const Certificates = ({ role }: CertificatesProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const roleData = {
    "data-scientist": {
      title: "Professional Certifications",
      certificates: [
        {
          name: "AWS Certified Machine Learning - Specialty",
          issuer: "Amazon Web Services",
          date: "2023",
          status: "Active",
          credentialId: "AWS-MLS-2023-DS",
          skills: ["AWS SageMaker", "ML Pipeline", "Model Deployment"],
          category: "education"
        },
        {
          name: "Google Cloud Professional Data Engineer",
          issuer: "Google Cloud",
          date: "2022",
          status: "Active",
          credentialId: "GCP-PDE-2022-DS",
          skills: ["BigQuery", "Dataflow", "Cloud ML Engine"],
          category: "education"
        },
        {
          name: "Microsoft Azure Data Scientist Associate",
          issuer: "Microsoft",
          date: "2023",
          status: "Active",
          credentialId: "AZ-100-2023-DS",
          skills: ["Azure ML", "Data Factory", "Cognitive Services"],
          category: "education"
        },
        {
          name: "AI/ML Conference 2023",
          issuer: "Tech Conference Series",
          date: "2023",
          status: "Active",
          credentialId: "AIC-2023-DS",
          skills: ["Machine Learning Trends", "Neural Networks", "Data Ethics"],
          category: "event"
        },
        {
          name: "Data Science Bootcamp",
          issuer: "DataCamp",
          date: "2022",
          status: "Active",
          credentialId: "DSB-2022-DS",
          skills: ["Python Programming", "Statistical Analysis", "Data Visualization"],
          category: "webinar"
        },
        {
          name: "Kaggle Competition Winner",
          issuer: "Kaggle",
          date: "2023",
          status: "Active",
          credentialId: "KCW-2023-DS",
          skills: ["Competitive ML", "Feature Engineering", "Ensemble Methods"],
          category: "hackathon"
        }
      ]
    },
    "ai-engineer": {
      title: "AI & Engineering Certifications",
      certificates: [
        {
          name: "NVIDIA Deep Learning Institute - AI Engineering",
          issuer: "NVIDIA",
          date: "2023",
          status: "Active",
          credentialId: "NVIDIA-DLI-2023-AI",
          skills: ["CUDA Programming", "TensorRT", "Multi-GPU Training"],
          category: "education"
        },
        {
          name: "TensorFlow Developer Certificate",
          issuer: "Google",
          date: "2023",
          status: "Active",
          credentialId: "TF-DEV-2023-AI",
          skills: ["TensorFlow", "Computer Vision", "NLP", "Time Series"],
          category: "education"
        },
        {
          name: "AI Innovation Summit 2023",
          issuer: "AI Summit",
          date: "2023",
          status: "Active",
          credentialId: "AIS-2023-AI",
          skills: ["AI Trends", "Innovation", "Tech Leadership"],
          category: "event"
        },
        {
          name: "MLOps Masterclass",
          issuer: "Tech Academy",
          date: "2023",
          status: "Active",
          credentialId: "MLOPS-2023-AI",
          skills: ["MLOps", "CI/CD", "Model Monitoring"],
          category: "webinar"
        },
        {
          name: "AI Hackathon Winner",
          issuer: "DevPost",
          date: "2023",
          status: "Active",
          credentialId: "AIH-2023-AI",
          skills: ["Rapid Prototyping", "Team Collaboration", "AI Applications"],
          category: "hackathon"
        },
        {
          name: "Open Source Contributor",
          issuer: "GitHub",
          date: "2022",
          status: "Active",
          credentialId: "OSC-2022-AI",
          skills: ["Open Source", "Code Review", "Community Building"],
          category: "participation"
        }
      ]
    }
  };

  const currentRole = roleData[role];
  const categories = ["all", ...Array.from(new Set(currentRole.certificates.map(cert => cert.category)))];
  
  const filteredCertificates = activeFilter === "all" 
    ? currentRole.certificates 
    : currentRole.certificates.filter(cert => cert.category === activeFilter);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
  }, [role]);

  return (
    <section id="certificates" className={`py-20 ${role === 'ai-engineer' ? 'bg-background' : 'bg-muted/10'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
            {currentRole.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto animate-fade-in"></div>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            Professional certifications demonstrating expertise and commitment to continuous learning
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className={`capitalize transition-all duration-300 ${
                activeFilter === category
                  ? role === 'ai-engineer'
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-ai-glow'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : role === 'ai-engineer'
                    ? 'border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50'
                    : 'border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              {category}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, index) => (
            <Card 
              key={index}
              className={`group transition-all duration-300 hover:scale-[1.02] ${
                role === 'ai-engineer'
                  ? 'bg-card/40 border-border/40 hover:bg-card/60 hover:shadow-ai-glow hover:border-accent/50'
                  : 'bg-card/60 border-border/60 hover:bg-card/80 hover:shadow-card hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${
                    role === 'ai-engineer'
                      ? 'bg-accent/15 group-hover:bg-accent/25 group-hover:shadow-ai-glow'
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    <Award className={`h-6 w-6 ${role === 'ai-engineer' ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      role === 'ai-engineer'
                        ? 'bg-accent/15 text-accent border-accent/30'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {cert.status}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {cert.issuer}
                </p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{cert.date}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Skills Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex}
                          variant="outline" 
                          className={`text-xs ${
                            role === 'ai-engineer'
                              ? 'border-accent/20 text-accent/80 hover:border-accent/40'
                              : 'border-primary/20 text-primary/80 hover:border-primary/40'
                          }`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Credential ID: <span className="font-mono">{cert.credentialId}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30">
                  <button className={`flex items-center text-sm transition-colors ${
                    role === 'ai-engineer'
                      ? 'text-accent hover:text-accent/80'
                      : 'text-primary hover:text-primary/80'
                  }`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>Verify Certificate</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All certifications are current and verified. Click on any certificate to view credentials.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Certificates;