import React from 'react';
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';

const Experience: React.FC = () => {
  // Dynamic period calculation - will change to "Dec 2025 - Jan 2026" after January 2026
  const currentDate = new Date();
  const isAfterJanuary2026 = currentDate > new Date('2026-01-31');
  const period = isAfterJanuary2026 ? "Dec 2025 - Jan 2026" : "Dec 2025 - Present";

  const experiences = [
    {
      title: "App Developer Intern",
      company: "CYPARTA",
      period: period,
      location: "On-Site",
      type: "internship",
      responsibilities: [
        "Working on the Driver & Medic mobile application, implementing trip workflows such as trip acceptance, live status updates, navigation, and post-trip EMS reporting based on detailed SRS requirements.",
        "Collaborating with backend and product teams to integrate real-time features like GPS tracking, notifications, and in-app communication while ensuring reliability and usability for field staff."
      ],
      skills: ["Mobile Development", "Real-time GPS Tracking", "Trip Management", "EMS Reporting", "Navigation Systems"]
    }
  ];

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            EXPERIENCE
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            My professional journey and work experience
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase size={24} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                  </div>
                  <p className="text-xl text-white/90 font-medium">{exp.company}</p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 text-white/70 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Key Responsibilities:</h4>
                <ul className="space-y-2">
                  {exp.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/80 leading-relaxed">{responsibility}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Technologies & Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Open to opportunities */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full">
            <span className="text-white/80">Open to new opportunities</span>
            <ExternalLink size={18} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
