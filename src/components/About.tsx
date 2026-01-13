import React from 'react';
import { Code2, Palette, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
            ABOUT ME
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            I'm passionate about learning, experimenting, and building solutions that bring ideas to life. 
            I enjoy challenges that push me to think differently and work with people who inspire me to grow. 
            My goal is to keep evolving as a creator while contributing to projects that make a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <Code2 size={48} className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Development</h3>
            <p className="text-white/70 leading-relaxed">
            Full-stack development skilled in building scalable applications 
            using MongoDB, Express.js, React, and Node.js.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <Palette size={48} className="text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Design</h3>
            <p className="text-white/70 leading-relaxed">
              Creating intuitive user experiences with clean, modern designs 
              that prioritize usability and aesthetic appeal.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300">
            <div className="mb-6">
              <Rocket size={48} className="text-pink-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
            <p className="text-white/70 leading-relaxed">
              Always exploring new technologies and pushing boundaries 
              to deliver cutting-edge solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;