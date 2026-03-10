'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, GitBranch, List, Code, Package, ArrowRight } from 'lucide-react';

const docSections = [
  {
    icon: FileText,
    title: 'Variables',
    description: 'Learn how to declare and use variables in NDJL with intuitive syntax.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: GitBranch,
    title: 'Conditions',
    description: 'Master conditional logic with readable if-else statements.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: List,
    title: 'Lists',
    description: 'Work with collections of data using simple list operations.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Code,
    title: 'Functions',
    description: 'Create reusable code blocks with clear function definitions.',
    color: 'from-orange-400 to-red-500',
  },
  {
    icon: Package,
    title: 'Modules',
    description: 'Organize your code with powerful module system.',
    color: 'from-blue-400 to-indigo-500',
  },
];

export default function Documentation() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Comprehensive Documentation
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to master NDJL, from basics to advanced concepts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {docSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group block"
              >
                <div className="glassmorphism rounded-xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center justify-between">
                    {section.title}
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300 glow-cyan"
          >
            <FileText className="w-5 h-5" />
            View Full Documentation
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
