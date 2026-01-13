import React from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const Education: React.FC = () => {
  const education = [
    {
      degree: "Integrated B.Sc. in Computer Science",
      institution: "Scaler School of Technology (with BITS Pilani - Digital Campus)",
      period: "2024 - 2028",
      location: "Bangalore, India",
      type: "undergraduate"
    },
    {
      degree: "Higher Secondary Education (Class 11th + 12th)",
      institution: "Columbia Foundation Sr. Sec. School",
      period: "2022 - 2024",
      location: "Delhi, India",
      type: "higher-secondary"
    },
    {
      degree: "Secondary Education",
      institution: "St. Peter's Convent",
      period: "2010 - 2022",
      location: "Delhi, India",
      type: "secondary"
    }
  ];

  return (
    <section id="education" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            EDUCATION
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            My academic journey and educational background
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
          
          {education.map((edu, index) => (
            <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Content card */}
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                <div className="group bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap size={24} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                  </div>
                  
                  <p className="text-lg text-white/90 mb-3 font-medium">
                    {edu.institution}
                  </p>
                  
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-indigo-500 rounded-full border-4 border-gray-900 z-10"></div>
              
              {/* Empty space for alternating layout */}
              <div className="hidden md:block w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
