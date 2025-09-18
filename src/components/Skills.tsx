import React from "react";

const Skills: React.FC = () => {
  const skills = [
    { name: "React", level: 78 },
    { name: "Python", level: 80 },
    { name: "UI/UX Design", level: 90 },
    { name: "Java", level: 75 },
    { name: "Tailwind CSS", level: 92 },
    { name: "JavaScript", level: 75 },
    { name: "CSS", level: 88 },
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            SKILLS
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {skills.map((skill, index) => {
            const radius = 50;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (skill.level / 100) * circumference;

            return (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="white"
                      strokeOpacity="0.2"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="url(#grad)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Centered percentage label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {skill.level}%
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
