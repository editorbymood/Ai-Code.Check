"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Calendar, User, Tag } from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
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

const posts = [
    {
        title: "The Death of RegEx: Why Neural ASTs are the Future",
        excerpt: "Regular expressions are powerful, but they lack context. Discover how deep learning models understand code semantics.",
        date: "Dec 12, 2024",
        author: "Sarah Chen",
        tag: "Research",
        color: "text-purple-400"
    },
    {
        title: "Scaling Static Analysis to 10 Million Lines of Code",
        excerpt: "Lessons learned from analyzing massive monorepos at Fortune 500 companies without breaking the build.",
        date: "Nov 28, 2024",
        author: "David Miller",
        tag: "Engineering",
        color: "text-blue-400"
    },
    {
        title: "CVE-2024-912: A Case Study in Dependency Chain Attacks",
        excerpt: "How a single npm package compromised thousands of automated build pipelines, and how to prevent it.",
        date: "Nov 15, 2024",
        author: "Alex V.",
        tag: "Security",
        color: "text-red-400"
    },
    {
        title: "Maximizing Developer Velocity with Automated Patches",
        excerpt: "Moving beyond detection to remediation. How automated PRs reduce technical debt.",
        date: "Oct 30, 2024",
        author: "Team AG",
        tag: "Productivity",
        color: "text-emerald-400"
    }
];

export default function BlogPage() {
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
                    <div className="mb-20">
                        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Insights</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl">
                            Deep dives into static analysis, compiler theory, and the future of AI-assisted programming.
                        </motion.p>
                    </div>

                    {/* Featured Post */}
                    <motion.div variants={fadeUp} className="mb-20">
                        <SpotlightCard className="rounded-3xl p-8 md:p-12 cursor-pointer group">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-2/3">
                                    <div className="flex items-center gap-3 mb-4 text-xs font-mono uppercase tracking-wider text-indigo-400">
                                        <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">Featured</span>
                                        <span className="text-gray-500">Dec 20, 2024</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-indigo-400 transition-colors">
                                        Introducing Devoxa Enterprise: Self-Hosted AI Code Review
                                    </h2>
                                    <p className="text-gray-400 leading-relaxed mb-6 max-w-2xl">
                                        Today we're announcing our biggest release yet. Run our full neural analysis engine on your own infrastructure, completely air-gapped.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-4 transition-all">
                                        Read Article <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Post Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.title}
                                variants={fadeUp}
                            >
                                <SpotlightCard className="p-8 rounded-2xl h-full flex flex-col justify-between cursor-pointer group">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono uppercase tracking-wider ${post.color}`}>
                                                {post.tag}
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-white/90 transition-colors">{post.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8">{post.excerpt}</p>
                                    </div>

                                    <div className="flex items-center gap-6 text-xs text-gray-500 font-mono pt-6 border-t border-white/5">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> {post.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <User className="w-3 h-3" /> {post.author}
                                        </span>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
