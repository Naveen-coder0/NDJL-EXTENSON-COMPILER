'use client';

import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import WhyNDJL from '@/components/sections/WhyNDJL';
import CodeExample from '@/components/sections/CodeExample';
import Features from '@/components/sections/Features';
import Installation from '@/components/sections/Installation';
import Documentation from '@/components/sections/Documentation';
import Team from '@/components/sections/Team';
import Community from '@/components/sections/Community';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      <Hero />
      <About />
      <WhyNDJL />
      <CodeExample />
      <Features />
      <Installation />
      <Documentation />
      <Team />
      <Community />
      <Footer />
    </main>
  );
}
