'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function Installation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const commands = [
    { title: 'Install NDJL', command: 'npm install ndjl' },
    { title: 'Run Your First Program', command: 'ndjl run app.ndjl' },
    { title: 'Create New Project', command: 'ndjl create my-project' },
  ];

  const handleCopy = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Get Started in Seconds
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Installing NDJL is quick and easy. Get up and running in no time.
          </p>
        </motion.div>

        <div className="space-y-6">
          {commands.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glassmorphism rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border-b border-white/10">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400 font-medium">{item.title}</span>
                </div>
                <div className="flex items-center justify-between p-6 font-mono">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-green-400">$</span>
                    <span className="text-white text-lg">{item.command}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.command, index)}
                    className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="glassmorphism rounded-xl p-8 inline-block">
            <p className="text-gray-400 mb-4">Need help getting started?</p>
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
            >
              Check out our installation guide →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
