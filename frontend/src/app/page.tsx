"use client";
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Code, Shield, Radio, CheckCircle2, Zap, GitBranch, Terminal } from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import Navbar from '@/components/Navbar';
import SpotlightCard from '@/components/SpotlightCard';
import Magnetic from '@/components/MagneticButton';
import CodeScanner from '@/components/CodeScanner';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30 overflow-x-hidden font-sans bg-[#020202]">
      <GridBackground />
      <Navbar />

      <main className="flex-grow flex flex-col justify-center pt-32 px-6">

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center relative z-10 mb-40 pt-20"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-8 shadow-inner shadow-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.25em]">System Online</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95] text-white">
            Code Review <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400/90 leading-relaxed max-w-xl mx-auto mb-12 font-light">
            Precision engineering for your codebase. Devoxa brings spatial analysis and deep learning to your review process.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <Link href="/auth/register" className="group relative h-12 px-8 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Start Analysis <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Magnetic>

          </motion.div>
        </motion.section>

        {/* Abstract Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mb-40"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-30"></div>
          <div className="glass-card rounded-3xl p-1 overflow-hidden relative shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10">
            <div className="bg-[#050505]/80 backdrop-blur-3xl rounded-2xl border border-white/5 p-8 md:p-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Code Side */}
                <div className="space-y-6 font-mono text-xs md:text-sm opacity-90">
                  <div className="flex gap-4 border-b border-white/5 pb-4 mb-4 items-center">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="ml-auto text-gray-600">server.ts • 2.4kb</div>
                  </div>

                  <div className="space-y-4 text-gray-400">
                    <div className="pl-4 border-l-2 border-indigo-500/50 relative">
                      <span className="absolute -left-[3px] top-0 w-1.5 h-full bg-indigo-500 opacity-50 blur-[2px]"></span>
                      <span className="text-pink-400">const</span> <span className="text-white">analyze</span> = <span className="text-pink-400">async</span> (code) <span className="text-pink-400">={">"}</span> {'{'}
                    </div>
                    <div className="pl-8 text-gray-500 italic">
                          // Utilizing Neural AST Parsing
                    </div>
                    <div className="pl-8">
                      <span className="text-pink-400">const</span> <span className="text-purple-300">vectors</span> = <span className="text-pink-400">await</span> <span className="text-yellow-200">Model</span>.<span className="text-blue-300">embed</span>(code);
                    </div>
                    <div className="pl-8">
                      <span className="text-pink-400">return</span> <span className="text-yellow-200">vectors</span>.<span className="text-blue-300">optimize</span>();
                    </div>
                    <div className="pl-4 text-gray-400">{'}'}</div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative h-64 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="relative z-10 grid grid-cols-2 gap-4"
                  >
                    {[
                      { icon: Shield, col: "text-indigo-400", label: "Secure" },
                      { icon: Code, col: "text-purple-400", label: "Clean" },
                      { icon: Radio, col: "text-sky-400", label: "Live" },
                      { icon: CheckCircle2, col: "text-emerald-400", label: "Valid" }
                    ].map(({ icon: Icon, col, label }, i) => (
                      <motion.div
                        key={label}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <SpotlightCard className="p-5 rounded-2xl flex flex-col items-center gap-3 transition-colors">
                          <Icon className={`w-6 h-6 ${col}`} />
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</span>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Minimal Features */}
        <section className="max-w-7xl mx-auto mb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Deep Analysis", desc: "Beyond regex. We understand the semantic structure of your code.", icon: Zap },
              { title: "Security First", desc: "Automated vulnerability detection and dependency auditing.", icon: Shield },
              { title: "Instant Fixes", desc: "One-click refactoring suggestions powered by state-of-the-art LLMs.", icon: CheckCircle2 },
              { title: "Git Integration", desc: "Seamlessly connects with GitHub, GitLab, and Bitbucket.", icon: GitBranch },
              { title: "CI/CD Pipeline", desc: "Automate reviews in your deployment workflow.", icon: Terminal },
              { title: "Team Insights", desc: "Analytics on code quality trends over time.", icon: Code },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <SpotlightCard className="p-8 rounded-3xl h-full group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-gray-500 font-mono tracking-wider">DEVOXA SYSTEMS © 2025</span>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Twitter', 'GitHub'].map(link => (
              <Link key={link} href="#" className="text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest">{link}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
