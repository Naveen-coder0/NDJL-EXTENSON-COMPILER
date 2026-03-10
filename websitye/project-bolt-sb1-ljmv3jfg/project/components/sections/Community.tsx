'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Github, Users, ArrowRight } from 'lucide-react';

const communities = [
  {
    icon: MessageCircle,
    name: 'Discord',
    description: 'Join our active Discord server for real-time discussions and support',
    members: '5,000+ members',
    color: 'from-indigo-400 to-purple-500',
    link: '#',
  },
  {
    icon: Github,
    name: 'GitHub',
    description: 'Contribute to NDJL development and explore our open-source codebase',
    members: '2,000+ stars',
    color: 'from-gray-400 to-gray-600',
    link: '#',
  },
  {
    icon: Users,
    name: 'Developer Community',
    description: 'Connect with fellow NDJL developers worldwide',
    members: '10,000+ developers',
    color: 'from-cyan-400 to-blue-500',
    link: '#',
  },
];

export default function Community() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Join Our Community
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Be part of a growing community of developers building the future of programming
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {communities.map((community, index) => {
            const Icon = community.icon;
            return (
              <motion.a
                key={index}
                href={community.link}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group block"
              >
                <div className="glassmorphism rounded-2xl p-8 h-full hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {community.name}
                  </h3>

                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {community.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-cyan-400">
                      {community.members}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glassmorphism rounded-2xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-4 text-white">
            Ready to Get Involved?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you want to contribute code, help with documentation, or simply learn with others,
            there's a place for you in the NDJL community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300 glow-cyan"
            >
              Join Discord
            </a>
            <a
              href="#"
              className="px-8 py-4 border-2 border-cyan-400 rounded-xl text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-all duration-300"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
