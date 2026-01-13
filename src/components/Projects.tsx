import React from "react";
import { ExternalLink, Github, FileText } from "lucide-react";

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "AASRAH",
      description:
        "Developed a platform connecting users with NGOs to provide real-time assistance for people and animals in distress, integrating Google Maps/GSI for accurate location tracking to ensure timely support and impactful interventions.",
      image:
        "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["React", "Google Maps API", "Node.js", "MongoDB"],
      github: "https://github.com/NoiceHax/Aasrah",
      live: "#",
    },
    {
      id: 2,
      title: "PactPal",
      description:
        "Built an AI-powered agent to simplify legal documents for non-legal users, reducing comprehension time by ~30% and empowering faster, more informed decision-making.",
      image:
        "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["Python", "AI/ML", "NLP", "React", "FastAPI"],
      githubFrontend: "https://github.com/Tanush1206/PactPal-Frontend",
      githubBackend: "https://github.com/Tanush1206/PactPal-Backend",
      live: "https://pactpal-frontend.onrender.com/",
    },
    {
      id: 3,
      title: "Case Study (Urban Company)",
      description:
        "Analyzed business strategy and market positioning, uncovering gaps in scalability, retention, and revenue; conducted competitive benchmarking and field research to propose a 5-year fixed-deposit service model offering builders a 10% benefit.",
      image:
        "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: [
        "Business Analysis",
        "Market Research",
        "Strategy",
        "Financial Modeling",
      ],
      github: "#",
      live: "https://docs.google.com/document/d/1f3hW2TAc8VsnFCNyycK5vNI6NNOHrO4gd_f7H0T2gF4/edit?usp=sharing",
      isStudy: true,
    },
    {
      id: 4,
      title: "Clique",
      description:
        "Developed a web app for Scaler students to securely access and track upcoming events in one place, eliminating the need to search through multiple channels.",
      image:
        "https://bsmedia.business-standard.com/_media/bs/img/article/2025-04/22/full/1745322158-1979.jpg",
      tech: [
        "Problem Solving",
        "User-Centric Design",
        "Operational Efficiency",
        "Event Coordination",
        "Process Optimization",
      ],
      github: "https://github.com/Tanush1206/CLIQUE",
      live: "https://frontend-clique-1.onrender.com/",
      isStudy: false,
    },
    {
      id: 5,
      title: "All The Way Transportation System (ATW)",
      description:
        "Developing a mobile app for drivers and medics to manage trip assignments, live status updates, navigation, and EMS report submission.",
      image:
        "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: [
        "Mobile Development",
        "Real-time GPS Tracking",
        "Trip Management",
        "EMS Reporting",
        "Navigation Systems",
      ],
      githubBackend: "https://github.com/NeuralSynth/atw_backend",
      githubFrontend: "https://github.com/NeuralSynth/cyparta-atw-frontend-android",
      live: "#",
      isStudy: false,
    },
  ];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            PROJECTS
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent work and creative solutions
          </p>
        </div>

        <div
          className={`grid gap-8 ${
            projects.length % 2 === 0
              ? "md:grid-cols-2 lg:grid-cols-2" // Even: 2 columns
              : "md:grid-cols-2 lg:grid-cols-3" // Odd: 3 columns
          }`}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    >
                      <Github size={20} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.githubFrontend && (
                    <a
                      href={project.githubFrontend}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    >
                      <Github size={20} />
                      <span>Frontend</span>
                    </a>
                  )}
                  {project.githubBackend && (
                    <a
                      href={project.githubBackend}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    >
                      <Github size={20} />
                      <span>Backend</span>
                    </a>
                  )}
                  {project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {project.isStudy ? (
                        <FileText size={20} />
                      ) : (
                        <ExternalLink size={20} />
                      )}
                      <span>{project.isStudy ? "Study" : "Live"}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
