"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, Zap, GitBranch, Cpu, Lock, RefreshCw, Layers } from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import Navbar from '@/components/Navbar';
import SpotlightCard from '@/components/SpotlightCard';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function FeaturesPage() {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
            <GridBackground />
            <Navbar />

            <main className="pt-32 px-6 pb-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-24">
                        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Capabilities</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl mx-auto">
                            A comprehensive suite of tools designed to elevate code quality, security, and velocity for modern engineering teams.
                        </motion.p>
                    </div>

                    {/* Feature 1: Neural Analysis */}
                    <motion.div variants={fadeUp} className="mb-32">
                        <SpotlightCard className="rounded-3xl p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                                        <Cpu className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Neural AST Analysis</h2>
                                    <p className="text-gray-400 leading-relaxed mb-6">
                                        Unlike traditional linters that rely on regex, Devoxa constructs a complete Abstract Syntax Tree (AST) of your codebase. Our neural networks analyze semantic relationships, data flow, and control structures to identify complex bugs that static analysis misses.
                                    </p>
                                    <ul className="space-y-3">
                                        {['Context-aware bug detection', 'Semantic code understanding', 'False positive reduction'].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    {/* Abstract Code Viz */}
                                    <div className="font-mono text-xs text-gray-500 space-y-1 p-4 opacity-50 select-none">
                                        <div className="pl-0">function <span className="text-purple-400">optimize</span>(graph) {'{'}</div>
                                        <div className="pl-4">const nodes = <span className="text-blue-400">await</span> graph.parse();</div>
                                        <div className="pl-4">return nodes.filter(n ={'>'} n.isValid());</div>
                                        <div className="pl-0">{'}'}</div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="glass-panel px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-mono shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                            AI Confidence: 99.8%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Grid of Secondary Features */}
                    <div className="grid md:grid-cols-3 gap-6 mb-32">
                        {[
                            { title: "Zero-Day Security", icon: Lock, desc: "Real-time vulnerability scanning against the latest CVE databases." },
                            { title: "Automated Repair", icon: RefreshCw, desc: "Don't just find bugs—fix them. Accept AI-generated patches with one click." },
                            { title: "Architecture Review", icon: Layers, desc: "Visualize dependency graphs and identify architectural bottlenecks." }
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                whileHover={{ y: -5 }}
                            >
                                <SpotlightCard className="p-8 rounded-2xl h-full">
                                    <div className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center mb-4 text-white">
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Feature 2: Workflow */}
                    <motion.div variants={fadeUp}>
                        <SpotlightCard className="rounded-3xl p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="order-2 md:order-1 relative aspect-square md:aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                                    {/* Simple Flow Diagram */}
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <GitBranch className="w-8 h-8" />
                                        <div className="h-[1px] w-12 bg-gray-700" />
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse">
                                            DX
                                        </div>
                                        <div className="h-[1px] w-12 bg-gray-700" />
                                        <Zap className="w-8 h-8 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                                        <GitBranch className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
                                    <p className="text-gray-400 leading-relaxed mb-6">
                                        Devoxa lives where you code. Whether it's a GitHub Action, a VS Code extension, or a pre-commit hook, we fit perfectly into your existing CI/CD pipeline without slowing you down.
                                    </p>
                                    <ul className="space-y-3">
                                        {['GitHub / GitLab / Bitbucket', 'VS Code & JetBrains Plugins', 'CLI Tool for Local Dev'].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
}
