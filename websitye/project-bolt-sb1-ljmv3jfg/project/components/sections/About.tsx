'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            About NDJL
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mb-8"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glassmorphism rounded-2xl p-8 md:p-12"
        >
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
            NDJL is a revolutionary <span className="text-cyan-400 font-semibold">human-readable programming language</span> designed
            to bridge the gap between human logic and machine execution.
          </p>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6">
            Built from the ground up with <span className="text-purple-400 font-semibold">beginners in mind</span>, NDJL allows developers
            to write code using natural language constructs, making programming accessible to everyone regardless of their
            technical background.
          </p>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Whether you're starting your coding journey or you're a seasoned developer looking for a more intuitive syntax,
            NDJL empowers you to <span className="text-blue-400 font-semibold">write code the way humans think</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {[
            { number: '10K+', label: 'Active Developers' },
            { number: '50K+', label: 'Lines of Code' },
            { number: '100%', label: 'Open Source' },
          ].map((stat, index) => (
            <div
              key={index}
              className="glassmorphism rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
