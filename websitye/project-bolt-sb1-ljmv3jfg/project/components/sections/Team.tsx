'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Lavanya B',
    role: 'Co-Founder & Lead Developer',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Visionary behind NDJL\'s human-readable syntax',
  },
  {
    name: 'Naveen Maan',
    role: 'Co-Founder & CTO',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Architect of NDJL\'s core language features',
  },
  {
    name: 'Alex Johnson',
    role: 'Co-Founder & Community Lead',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Building the NDJL developer community',
  },
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & Product Designer',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Crafting intuitive developer experiences',
  },
];

export default function Team() {
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
            Meet The Team
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The passionate developers behind NDJL
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glassmorphism rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60"></div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-white">
                  {member.name}
                </h3>
                <p className="text-cyan-400 text-sm font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <Github className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <Linkedin className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <Twitter className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
