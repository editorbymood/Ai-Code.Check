"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Sparkles, Terminal } from 'lucide-react';

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
        <section className="py-32 relative bg-black overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Text & Controls */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono"
                        >
                            <Terminal className="w-3 h-3" />
                            <span>LIVE REMEDIATION ENGINE</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Fix Security Flaws <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Before Checking In.
                            </span>
                        </h2>

                        <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                            Devoxa is not just a linter. It&apos;s an intelligent agent that understands attack vectors and rewrites your code to be secure by default.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => setActiveTab('vulnerable')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${activeTab === 'vulnerable'
                                    ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                    : 'bg-zinc-900/50 text-gray-500 border-zinc-800 hover:border-zinc-700 hover:text-gray-300'
                                    }`}
                            >
                                <X className="w-4 h-4" /> Original Code
                            </button>
                            <button
                                onClick={() => setActiveTab('secure')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${activeTab === 'secure'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                    : 'bg-zinc-900/50 text-gray-500 border-zinc-800 hover:border-zinc-700 hover:text-gray-300'
                                    }`}
                            >
                                <Sparkles className="w-4 h-4" /> AI Remediated
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Code Window */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 rounded-2xl blur transition-all duration-500 opacity-70 ${activeTab === 'secure' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-orange-600'
                            }`} />

                        <div className="relative rounded-xl bg-[#0b0b0e] border border-white/10 overflow-hidden shadow-2xl">
                            {/* Window Actions */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                    <Code2 className="w-3 h-3" />
                                    src/api/routes.ts
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="p-6 min-h-[320px] font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <pre>
                                            <code
                                                className={activeTab === 'vulnerable' ? 'text-red-200/90' : 'text-emerald-200/90'}
                                                dangerouslySetInnerHTML={{
                                                    __html: (activeTab === 'vulnerable' ? VULNERABLE_CODE : SECURE_CODE)
                                                        .replace(/const/g, '<span class="text-purple-400">const</span>')
                                                        .replace(/async/g, '<span class="text-purple-400">async</span>')
                                                        .replace(/await/g, '<span class="text-purple-400">await</span>')
                                                        .replace(/function/g, '<span class="text-purple-400">function</span>')
                                                        .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
                                                        .replace(/('.*?')/g, '<span class="text-yellow-200/80">$1</span>')
                                                        .replace(/(".*?")/g, '<span class="text-yellow-200/80">$1</span>')
                                                }} />
                                        </pre>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
