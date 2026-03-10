'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Bot, TrendingUp, Box, Rocket } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Simple Syntax',
    description: 'No complex symbols or cryptic abbreviations. Write code that reads like sentences.',
  },
  {
    icon: Bot,
    title: 'AI Friendly',
    description: 'Perfectly structured for AI understanding and code generation, making it ideal for modern development.',
  },
  {
    icon: TrendingUp,
    title: 'Fast Learning Curve',
    description: 'Go from zero to productive in days, not months. Start building real projects immediately.',
  },
  {
    icon: Box,
    title: 'Clean Structure',
    description: 'Clear block definitions and logical flow make code maintainable and easy to debug.',
  },
  {
    icon: Rocket,
    title: 'Developer Productivity',
    description: 'Focus on solving problems, not fighting syntax. Boost your productivity significantly.',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Powerful Features
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full">
                  <div className="glassmorphism rounded-xl p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
