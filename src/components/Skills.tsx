import React from 'react';

const Skills: React.FC = () => {
  const skills = [
    { name: "React", level: 90 },
    { name: "Python", level: 85 },
    { name: "UI/UX Design", level: 88 },
    { name: "Java", level: 80 },
    { name: "JavaScript", level: 92 },
    { name: "Tailwind CSS", level: 95 },
    { name: "CSS", level: 90 },
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            SKILLS
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="space-y-8">
          {skills.map((skill, index) => (
            <div key={skill.name} className="group">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                <span className="text-white/60 font-medium">{skill.level}%</span>
              </div>
              
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${skill.level}%`,
                    animationDelay: `${index * 200}ms`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;