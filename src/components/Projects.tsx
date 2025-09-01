import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Filter, Clock, CheckCircle } from "lucide-react";

interface ProjectsProps {
  role: "data-scientist" | "ai-engineer";
}

const Projects = ({ role }: ProjectsProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
  }, [role]);

  const dataScientistProjects = [
    {
      id: 1,
      title: "Customer Churn Prediction",
      description: "Built a machine learning model to predict customer churn with 94% accuracy using ensemble methods and feature engineering.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      technologies: ["Python", "Scikit-learn", "Pandas", "XGBoost"],
      category: "Machine Learning",
      status: "completed",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "Sales Forecasting Dashboard",
      description: "Interactive Tableau dashboard for time series forecasting that increased forecast accuracy by 25%.",
      image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=200&fit=crop",
      technologies: ["R", "Tableau", "SQL", "ARIMA"],
      category: "Analytics",
      status: "completed",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "A/B Testing Framework",
      description: "Statistical framework for A/B testing that standardized experimentation across the organization.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      technologies: ["Python", "Scipy", "Statsmodels", "Plotly"],
      category: "Statistics",
      status: "ongoing",
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "Deep Learning Model Optimization",
      description: "Developing advanced neural network architectures for improved performance in computer vision tasks.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      technologies: ["PyTorch", "CUDA", "TensorBoard", "Optuna"],
      category: "Deep Learning",
      status: "ongoing",
      github: "#",
      demo: "#"
    }
  ];

  const aiEngineerProjects = [
    {
      id: 1,
      title: "Intelligent Document Processing",
      description: "AI system using OCR and NLP to extract and classify information from documents with 99% accuracy.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
      technologies: ["PyTorch", "Transformers", "FastAPI", "Docker"],
      category: "NLP",
      status: "completed",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "Real-time Object Detection",
      description: "Computer vision system for real-time object detection and tracking in video streams using YOLO.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      technologies: ["TensorFlow", "OpenCV", "YOLO", "Kubernetes"],
      category: "Computer Vision",
      status: "completed",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "Conversational AI Chatbot",
      description: "Advanced chatbot using large language models for customer support automation.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=200&fit=crop",
      technologies: ["LangChain", "OpenAI", "Vector DB", "Streamlit"],
      category: "LLM",
      status: "ongoing",
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "Multi-Modal AI Assistant",
      description: "Building an advanced AI assistant capable of processing text, images, and audio for comprehensive user interactions.",
      image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=200&fit=crop",
      technologies: ["GPT-4", "Whisper", "CLIP", "React"],
      category: "Multi-Modal AI",
      status: "ongoing",
      github: "#",
      demo: "#"
    }
  ];

  const projects = role === "data-scientist" ? dataScientistProjects : aiEngineerProjects;
  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Showcasing my expertise through real-world projects and implementations
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto animate-fade-in"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className="capitalize"
            >
              <Filter className="mr-2 h-4 w-4" />
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id}
              className={`backdrop-blur-sm transition-all duration-300 group overflow-hidden animate-fade-in ${
                role === 'ai-engineer'
                  ? `bg-card/30 hover:bg-card/60 hover:shadow-ai-glow ${
                      project.status === 'ongoing' 
                        ? 'border-accent/60 shadow-ai-pulse shadow-lg' 
                        : 'border-border/30 hover:border-primary/30'
                    }`
                  : `bg-card/50 hover:bg-card/80 hover:shadow-card ${
                      project.status === 'ongoing' 
                        ? 'border-accent/50 shadow-accent/20 shadow-lg' 
                        : 'border-border/50'
                    }`
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                  role === 'ai-engineer' ? 'bg-primary/30' : 'bg-primary/20'
                }`}>
                  <div className="flex space-x-4">
                    <Button size="sm" variant="secondary" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {project.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={project.status === 'ongoing' ? 'default' : 'outline'}
                    className={`text-xs ${
                      project.status === 'ongoing' 
                        ? 'bg-accent text-accent-foreground border-accent animate-pulse' 
                        : 'bg-success/10 text-success border-success/30'
                    }`}
                  >
                    {project.status === 'ongoing' ? (
                      <>
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="outline" 
                      className="text-xs bg-muted/50 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group">
            <Github className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;