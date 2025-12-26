"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Code2, ArrowRight } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const VULNERABLE_CODE = `// ❌ Vulnerable: SQL Injection Risk
app.get('/users', async (req, res) => {
  const query = "SELECT * FROM users WHERE id = " + req.query.id;
  const users = await db.execute(query);
  res.json(users);
});`;

const SECURE_CODE = `// ✅ Secure: Parameterized Query
app.get('/users', async (req, res) => {
  // Input validation and parameterized query
  const query = "SELECT * FROM users WHERE id = ?";
  const users = await db.execute(query, [req.query.id]);
  res.json(users);
});`;

export default function InteractiveCodeDemo() {
    const [activeTab, setActiveTab] = useState<'vulnerable' | 'secure'>('vulnerable');

    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-400 mb-4"
                    >
                        <Code2 className="w-3 h-3" />
                        <span>LIVE REMEDIATION ENGINE</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        See the difference. <br />
                        <span className="text-gray-500">Instantly.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Controls Side */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white">
                            Automated Refactoring
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Devoxa doesn't just find bugs; it understands the context and rewrites code to industry standards.
                            Toggle below to see how our engine transforms a critical SQL injection vulnerability into secure, production-ready code.
                        </p>

                        <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('vulnerable')}
                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'vulnerable'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <X className="w-4 h-4" /> Before
                            </button>
                            <button
                                onClick={() => setActiveTab('secure')}
                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'secure'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Check className="w-4 h-4" /> After Refactor
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-8 pt-8 border-t border-white/5">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                Analyzing AST
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
                                Matching Patterns
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                                Generating Patch
                            </div>
                        </div>
                    </div>

                    {/* Code Window */}
                    <SpotlightCard className="p-1 rounded-2xl bg-black/40 border-white/10 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                        <div className="relative bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 min-h-[300px]">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500">api/routes/user.js</div>
                                <div className="w-4"></div>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 font-mono text-xs md:text-sm leading-loose">
                                <AnimatePresence mode="wait">
                                    <motion.pre
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`${activeTab === 'vulnerable' ? 'text-red-100' : 'text-emerald-100'}`}
                                    >
                                        <code dangerouslySetInnerHTML={{
                                            __html: (activeTab === 'vulnerable' ? VULNERABLE_CODE : SECURE_CODE)
                                                .replace(/const/g, '<span class="text-purple-400">const</span>')
                                                .replace(/async/g, '<span class="text-purple-400">async</span>')
                                                .replace(/await/g, '<span class="text-purple-400">await</span>')
                                                .replace(/function/g, '<span class="text-purple-400">function</span>')
                                                .replace(/\/\/.*/g, '<span class="text-gray-500">$&</span>')
                                        }} />
                                    </motion.pre>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                    </SpotlightCard>
                </div>
            </div>
        </section>
    );
}
