'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Zap, Code as Code2, Layers, Users } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Human Readable Syntax',
    description: 'Write code using natural language that reads like plain English, making it intuitive and easy to understand.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Users,
    title: 'Beginner Friendly',
    description: 'Perfect for newcomers to programming with a gentle learning curve and comprehensive documentation.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Optimized compiler delivers high-performance execution while maintaining code readability.',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'Modern Architecture',
    description: 'Built with modern programming paradigms including functional, object-oriented, and declarative styles.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    icon: Code2,
    title: 'Clean Structure',
    description: 'Enforces clear logical structure with intuitive keywords and minimal syntax complexity.',
    color: 'from-cyan-500 to-teal-500',
  },
];

export default function WhyNDJL() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Why Choose NDJL?
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            NDJL combines the best of both worlds: the simplicity of natural language with the power of modern programming.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glassmorphism rounded-2xl p-8 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
