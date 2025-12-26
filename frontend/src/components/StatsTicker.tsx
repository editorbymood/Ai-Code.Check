"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Code, Zap, Users } from 'lucide-react';

export default function StatsTicker() {
    const stats = [
        { label: "Lines Analyzed", value: "10M+", icon: Code },
        { label: "Vulnerabilities Fixes", value: "99.9%", icon: ShieldCheck },
        { label: "Developer Hours Saved", value: "5,000+", icon: Zap },
        { label: "Teams Secured", value: "250+", icon: Users },
    ];

    return (
        <section className="py-20 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center justify-center text-center group"
                        >
                            <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-mono">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
