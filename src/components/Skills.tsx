import React from "react";
import { FaJava, FaCss3Alt, FaGithub, FaPython } from "react-icons/fa";
import { SiJavascript, SiHtml5, SiReact, SiTailwindcss, SiExpress, SiNodedotjs, SiNumpy, SiPandas, SiVercel, SiNetlify, SiRender } from "react-icons/si";
import { FaGitAlt } from "react-icons/fa6";

interface HexagonProps {
  icon: React.ReactNode;
  name: string;
}

const Hexagon: React.FC<HexagonProps> = ({ icon, name }) => {
  // Create a smooth hexagon path with curves
  const hexPath = "M50,5 C55,5 85,20 90,25 C95,30 95,70 90,75 C85,80 55,95 50,95 C45,95 15,80 10,75 C5,70 5,30 10,25 C15,20 45,5 50,5 Z";

  return (
    <div className="relative w-32 h-36 flex items-center justify-center group">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Hexagon outline */}
          <path 
            d={hexPath} 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-500/30 group-hover:text-indigo-500/50 transition-colors duration-300"
          />
          
          {/* Secondary border for depth */}
          <path 
            d={hexPath}
            className="fill-transparent"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'rgba(99, 102, 241, 0.4)', // Lighter indigo for depth
              filter: 'blur(0.5px)'
            }}
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="z-10 flex flex-col items-center">
        <div className="text-3xl mb-2">
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
          {name}
        </div>
      </div>
      
    </div>
  );
};

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "Java", icon: <FaJava className="text-red-500" /> },
        { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" /> },
        { name: "Python", icon: <FaPython className="text-blue-400" /> },
        { name: "HTML", icon: <SiHtml5 className="text-orange-500" /> },
        { name: "CSS", icon: <FaCss3Alt className="text-blue-300" /> },
      ]
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", icon: <SiReact className="text-blue-500" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-400" /> },
        { name: "Node.js", icon: <SiNodedotjs className="text-green-500" /> },
        { name: "Express.js", icon: <SiExpress className="text-gray-800 dark:text-gray-200" /> },
        { name: "NumPy", icon: <SiNumpy className="text-blue-600" /> },
        { name: "Pandas", icon: <SiPandas className="text-red-500" /> },
      ]
    },
    {
      title: "Developer & AI Tools",
      skills: [
        { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
        { name: "GitHub", icon: <FaGithub className="text-black dark:text-white" /> },
        { name: "Vercel", icon: <SiVercel className="text-black dark:text-white" /> },
        { name: "Netlify", icon: <SiNetlify className="text-teal-500" /> },
        { name: "Render", icon: <SiRender className="text-blue-500" /> },
        { name: "Cursor", icon: <span className="text-lg">⌨️</span> },
        { name: "Copilot", icon: <span className="text-lg">🤖</span> },
        { name: "Windsurf", icon: <span className="text-lg">🏄</span> },
      ]
    }
  ];

  return (
    <section id="skills" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My <span className="text-indigo-600 dark:text-indigo-400">Skills</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here's a visual representation of my technical expertise
          </p>
        </div>

        {skillCategories.map((category, index) => (
          <div key={index} className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
              {category.skills.map((skill, skillIndex) => (
                <Hexagon 
                  key={`${index}-${skillIndex}`}
                  icon={skill.icon}
                  name={skill.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
