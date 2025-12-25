"use client";
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Check, X } from 'lucide-react';
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

const plans = [
    {
        name: "Starter",
        price: "0",
        period: "mo",
        desc: "Perfect for solo developers and open source.",
        features: [
            "Unlimited public repositories",
            "5 private repositories",
            "Basic neural analysis",
            "Community support",
            "1 user"
        ],
        highlight: false,
        btn: "Start Free"
    },
    {
        name: "Pro",
        price: "29",
        period: "mo",
        desc: "For professional teams shipping fast.",
        features: [
            "Unlimited repositories",
            "Advanced security scanning",
            "Automated PR patches",
            "Priority email support",
            "Up to 10 users"
        ],
        highlight: true,
        btn: "Start Trial"
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        desc: "Control, security, and scalability.",
        features: [
            "Self-hosted option",
            "Custom LLM fine-tuning",
            "SAML / SSO Enforced",
            "Dedicated Success Manager",
            "Unlimited users"
        ],
        highlight: false,
        btn: "Contact Sales"
    }
];

export default function PricingPage() {
    const [annual, setAnnual] = useState(true);

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
                    <div className="text-center mb-16">
                        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pricing</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
                            Start for free, scale as you grow. No hidden fees or surprise overages.
                        </motion.p>

                        {/* Toggle */}
                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
                            <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-gray-500'}`}>Monthly</span>
                            <button
                                onClick={() => setAnnual(!annual)}
                                className="w-12 h-6 rounded-full bg-white/10 p-1 relative flex items-center transition-colors hover:bg-white/20"
                            >
                                <motion.div
                                    animate={{ x: annual ? 24 : 0 }}
                                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                                />
                            </button>
                            <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-gray-500'}`}>
                                Annual <span className="text-emerald-400 text-xs ml-1 font-mono">(-20%)</span>
                            </span>
                        </motion.div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                variants={fadeUp}
                                whileHover={{ y: -10 }}
                            >
                                <SpotlightCard
                                    className={`relative p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                        ? 'bg-gradient-to-b from-blue-900/20 to-blue-900/5 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.1)] scale-105 z-10'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 scale-100 z-0'
                                        }`}
                                >
                                    {plan.highlight && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-xl font-medium text-gray-300 mb-2">{plan.name}</h3>
                                        <div className="flex items-end gap-1 mb-4">
                                            <span className="text-4xl font-bold text-white">
                                                {plan.price === "Custom" ? "Custom" : `$${annual && plan.price !== "0" ? Math.floor(Number(plan.price) * 0.8) : plan.price}`}
                                            </span>
                                            {plan.price !== "Custom" && <span className="text-gray-500 mb-1">/{plan.period}</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">{plan.desc}</p>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map(feat => (
                                            <li key={feat} className="flex items-start gap-3 text-sm text-gray-300">
                                                <Check className={`w-4 h-4 mt-0.5 ${plan.highlight ? 'text-blue-400' : 'text-gray-500'}`} />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${plan.highlight
                                        ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg hover:shadow-blue-500/25'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                        }`}>
                                        {plan.btn}
                                    </button>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
