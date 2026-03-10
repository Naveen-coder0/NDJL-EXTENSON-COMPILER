'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeExample() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [copied, setCopied] = useState(false);

  const code = `# NDJL Example - Simple and Readable
create number visitors = 100

if visitors greater than 50
  say "Popular Website"
else
  say "Growing Website"
end

# Functions are easy too!
function greet with name
  say "Hello, " + name
end

greet with "World"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the intuitive syntax that makes programming feel natural
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glassmorphism rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm text-gray-400 font-mono">example.ndjl</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-6 md:p-8">
              <pre className="font-mono text-sm md:text-base overflow-x-auto">
                <code>
                  <span className="text-gray-500"># NDJL Example - Simple and Readable</span>
                  {'\n'}
                  <span className="text-purple-400">create</span>{' '}
                  <span className="text-blue-400">number</span>{' '}
                  <span className="text-cyan-400">visitors</span>{' '}
                  <span className="text-gray-400">=</span>{' '}
                  <span className="text-yellow-400">100</span>
                  {'\n\n'}
                  <span className="text-purple-400">if</span>{' '}
                  <span className="text-cyan-400">visitors</span>{' '}
                  <span className="text-purple-400">greater than</span>{' '}
                  <span className="text-yellow-400">50</span>
                  {'\n  '}
                  <span className="text-pink-400">say</span>{' '}
                  <span className="text-green-400">"Popular Website"</span>
                  {'\n'}
                  <span className="text-purple-400">else</span>
                  {'\n  '}
                  <span className="text-pink-400">say</span>{' '}
                  <span className="text-green-400">"Growing Website"</span>
                  {'\n'}
                  <span className="text-purple-400">end</span>
                  {'\n\n'}
                  <span className="text-gray-500"># Functions are easy too!</span>
                  {'\n'}
                  <span className="text-purple-400">function</span>{' '}
                  <span className="text-blue-400">greet</span>{' '}
                  <span className="text-purple-400">with</span>{' '}
                  <span className="text-cyan-400">name</span>
                  {'\n  '}
                  <span className="text-pink-400">say</span>{' '}
                  <span className="text-green-400">"Hello, "</span>{' '}
                  <span className="text-gray-400">+</span>{' '}
                  <span className="text-cyan-400">name</span>
                  {'\n'}
                  <span className="text-purple-400">end</span>
                  {'\n\n'}
                  <span className="text-blue-400">greet</span>{' '}
                  <span className="text-purple-400">with</span>{' '}
                  <span className="text-green-400">"World"</span>
                </code>
              </pre>
            </div>
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-2xl opacity-20 -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
}
