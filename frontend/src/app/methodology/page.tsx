"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Database, Brain, FileCode, CheckCircle, Search, ArrowRight } from 'lucide-react';
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
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const steps = [
    {
        title: "Ingestion & Tokenization",
        icon: FileCode,
        description: "Source code is ingested and tokenized. We support over 40 languages including TypeScript, Rust, Python, and Go.",
        detail: "Secure Encryption • Dependency Resolution"
    },
    {
        title: "Static & Semantic Analysis",
        icon: Search,
        description: "Hybrid engines scan for known patterns and construct a semantic graph of the codebase logic.",
        detail: "AST Generation • Control Flow Graph"
    },
    {
        title: "Neural Inference",
        icon: Brain,
        description: "Our proprietary LLM models analyze the semantic graph to find subtle logical errors and security vulnerabilities.",
        detail: "Context Window: 128k • Custom Fine-Tuning"
    },
    {
        title: "Knowledge Graph Integration",
        icon: Database,
        description: "Findings are cross-referenced with your team's historical data and industry best practices.",
        detail: "RAG Pipeline • Team Patterns"
    },
    {
        title: "Actionable Report",
        icon: CheckCircle,
        description: "A valid, linted patch is generated for every issue found. One click to merge.",
        detail: "Diff Generation • Automated PR"
    }
];

export default function MethodologyPage() {
    return (
        <div className="relative min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
            <GridBackground />
            <Navbar />

            <main className="pt-32 px-6 pb-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-24">
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <span className="text-xs font-mono text-gray-400">DX-V3 ENGINE</span>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Methodology</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl mx-auto">
                            How Devoxa transforms raw code into optimized, secure software using a hybrid analysis pipeline.
                        </motion.p>
                    </div>

                    {/* Timeline Steps */}
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 md:left-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />

                        <div className="space-y-12 md:space-y-24">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    variants={fadeUp}
                                    className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content Side */}
                                    <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12">
                                        <SpotlightCard className={`p-6 rounded-2xl relative group ${index % 2 === 0 ? 'text-left' : 'md:text-right'}`}>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">{step.title}</h3>
                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                                            <div className={`text-xs font-mono text-gray-600 uppercase tracking-wider flex items-center gap-2 ${index % 2 === 0 ? 'justify-start' : 'md:justify-end'}`}>
                                                <ArrowRight className="w-3 h-3 md:hidden" />
                                                {step.detail}
                                            </div>
                                        </SpotlightCard>
                                    </div>

                                    {/* Center Icon */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full border-4 border-[#020202] bg-black z-10 flex items-center justify-center relative">
                                            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl"></div>
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-lg">
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty Side for layout balance */}
                                    <div className="w-full md:w-1/2 md:px-12 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
