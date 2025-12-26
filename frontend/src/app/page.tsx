"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Shield, Zap, GitBranch, Terminal, LineChart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import InteractiveCodeDemo from '@/components/InteractiveCodeDemo';
import StatsTicker from '@/components/StatsTicker';
import HeroGeometric from '@/components/HeroGeometric';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { InfiniteMovingCards } from '@/components/ui/TestimonialMarquee';

import ScrollReveal from '@/components/ScrollReveal';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30 overflow-x-hidden font-sans bg-[#030303]">
      <Navbar />

      <main className="flex-grow flex flex-col">

        {/* New Geometric Hero */}
        <HeroGeometric />

        {/* Social Proof Marquee */}
        <ScrollReveal>
          <section className="py-20 bg-black relative z-10">
            <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
              <h2 className="text-xl text-gray-500 font-medium tracking-wide uppercase">Trusted by engineering teams at</h2>
            </div>
            <div className="h-[20rem] rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
              <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
              />
            </div>
          </section>
        </ScrollReveal>

        {/* Interactive Demo */}
        <ScrollReveal>
          <InteractiveCodeDemo />
        </ScrollReveal>

        {/* Bento Grid Features */}
        <ScrollReveal>
          <section className="py-32 bg-[#050505] relative z-10" id="features">
            <div className="max-w-4xl mx-auto px-6 text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                Architecture for Scale.
              </h2>
              <p className="mt-4 text-neutral-400 text-lg">
                Devoxa provides the building blocks for a secure, automated development lifecycle.
              </p>
            </div>

            <BentoGrid className="max-w-6xl mx-auto px-6">
              {items.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
              ))}
            </BentoGrid>
          </section>
        </ScrollReveal>

        {/* Stats Ticker */}
        <ScrollReveal>
          <StatsTicker />
        </ScrollReveal>

      </main>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">DX</span>
              </div>
              <span className="text-xl font-bold text-white">Devoxa</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The AI-native code review platform designed for high-velocity engineering teams. Secure, fast, and intelligent.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              {['Features', 'Integrations', 'Security', 'Changelog'].map(link => (
                <li key={link}><Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              {['About', 'Blog', 'Careers', 'Twitter'].map(link => (
                <li key={link}><Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link></li>
              ))}
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs text-gray-600">© 2025 DEVOXA SYSTEMS INC.</span>
          <div className="flex gap-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-gray-500">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data for Bento and Testimonials

import { ASTNodeGraph, SecurityScanner, GitGraph, VelocityChart } from '@/components/BentoGridHeaders';

const items = [
  {
    title: "Deep Semantic Analysis",
    description: "We don't just grep. Our engine builds a complete AST of your codebase to understand context.",
    header: <ASTNodeGraph />,
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Automated Verification",
    description: "Every PR is automatically checked for security vulnerabilities before it merges.",
    header: <SecurityScanner />,
    icon: <Shield className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Git Integration",
    description: "Connect with GitHub, GitLab, and Bitbucket in seconds.",
    header: <GitGraph />,
    icon: <GitBranch className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Team Velocity",
    description:
      "Track your team's performance with detailed analytics and insights. Know exactly where your bottlenecks are.",
    header: <VelocityChart />,
    icon: <LineChart className="h-4 w-4 text-neutral-500" />,
  },
];

const testimonials = [
  {
    quote:
      "Devoxa has completely transformed how we do code reviews. It's like having a principal engineer available 24/7.",
    name: "Alex Chen",
    title: "CTO at TechFlow",
  },
  {
    quote:
      "The security insights alone are worth the price of admission. We caught three critical vulns in our first week.",
    name: "Sarah Miller",
    title: "Security Lead at CyberSafe",
  },
  {
    quote: "Finally, a tool that understands context. It doesn't just flag style issues, it finds actual bugs.",
    name: "James Wilson",
    title: "Senior Engineer at DevCorp",
  },
  {
    quote:
      "The integration was seamless. We were up and running in less than 10 minutes.",
    name: "Maria Garcia",
    title: "VP Engineering at BuildIt",
  },
  {
    quote:
      "Our code quality score has improved by 40% since we started using Devoxa.",
    name: "David Kim",
    title: "Lead Architect at ScaleUp",
  },
];
