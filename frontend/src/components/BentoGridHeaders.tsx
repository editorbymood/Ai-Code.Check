"use client";
import React from "react";
import { motion } from "framer-motion";

// Card 1: Deep Semantic Analysis (AST Node Graph)
export const ASTNodeGraph = () => {
    const nodes = [
        { x: "20%", y: "20%", delay: 0 },
        { x: "50%", y: "20%", delay: 0.2 },
        { x: "80%", y: "20%", delay: 0.4 },
        { x: "20%", y: "50%", delay: 0.6 },
        { x: "50%", y: "50%", delay: 0.8 },
        { x: "80%", y: "50%", delay: 1.0 },
        { x: "35%", y: "80%", delay: 1.2 },
        { x: "65%", y: "80%", delay: 1.4 },
    ];

    return (
        <div className="flex flex-1 w-full h-full min-h-[8rem] bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-lg relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
            {/* Connecting Lines (Static for simplicity, could be SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="20%" y1="20%" x2="50%" y2="20%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="20%" x2="80%" y2="20%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="white" strokeWidth="1" />
                <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="35%" y2="80%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="65%" y2="80%" stroke="white" strokeWidth="1" />
            </svg>

            {/* Pulsing Nodes */}
            {nodes.map((node, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10"
                    style={{ left: node.x, top: node.y }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 1], opacity: 1 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: node.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Code Blocks Hints */}
            <div className="absolute bottom-2 right-2 flex gap-1">
                <div className="w-12 h-1 rounded-full bg-white/10" />
                <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>
        </div>
    );
};

// Card 2: Automated Verification (Security Scanner)
export const SecurityScanner = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[8rem] bg-black rounded-lg relative overflow-hidden border border-white/5 items-center justify-center">

            {/* Radar Sweep */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent z-0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Shield Icon */}
            <div className="relative z-10 w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center bg-emerald-900/10 backdrop-blur-sm">
                <div className="w-12 h-12 border border-emerald-500/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
            </div>

            {/* Random bugs detected/fixed popup animation */}
            <motion.div
                className="absolute top-4 right-8 bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.8, 1], delay: 1 }}
            >
                CVE-2024-X FOUND
            </motion.div>
            <motion.div
                className="absolute bottom-4 left-8 bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.8, 1], delay: 2.5 }}
            >
                PATCH APPLIED
            </motion.div>
        </div>
    )
}

// Card 3: Git Integration (Git Graph)
export const GitGraph = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[8rem] bg-[#0A0A0A] rounded-lg relative overflow-hidden border border-white/5 flex items-center px-8">
            <div className="relative w-full h-24 flex items-center">
                {/* Horizontal Lines */}
                <div className="absolute w-full h-[2px] bg-white/10 top-1/2 -translate-y-1/2"></div>
                <div className="absolute w-2/3 h-[2px] bg-white/10 top-1/3 -translate-y-1/2 left-16 rotate-6 origin-left"></div>
                <div className="absolute w-1/2 h-[2px] bg-white/10 bottom-1/3 translate-y-1/2 left-24 -rotate-6 origin-left"></div>

                {/* Commits */}
                <motion.div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-[#0A0A0A] absolute left-[10%] top-1/2 -translate-y-1/2 z-10" />
                <motion.div className="w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0A0A0A] absolute left-[30%] top-1/3 -translate-y-1/2 z-10"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                />
                <motion.div className="w-4 h-4 rounded-full bg-pink-500 border-4 border-[#0A0A0A] absolute left-[50%] bottom-1/3 translate-y-1/2 z-10"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
                />
                <motion.div className="w-4 h-4 rounded-full bg-green-500 border-4 border-[#0A0A0A] absolute left-[70%] top-1/2 -translate-y-1/2 z-10"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
                />
                <motion.div className="w-4 h-4 rounded-full bg-white border-4 border-[#0A0A0A] absolute left-[90%] top-1/2 -translate-y-1/2 z-10"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}
                />
            </div>

            <motion.div
                className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
            >
                main*
            </motion.div>
        </div>
    )
}

// Card 4: Team Velocity (Area Chart)
export const VelocityChart = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[8rem] bg-gradient-to-t from-black to-neutral-900 rounded-lg relative overflow-hidden border border-white/5 flex items-end">
            <svg viewBox="0 0 100 40" className="w-full h-full opacity-80" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="velocity-gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4"></stop>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"></stop>
                    </linearGradient>
                </defs>
                <motion.path
                    d="M0 40 L0 30 C 10 25, 20 35, 30 20 C 40 10, 50 25, 60 15 C 70 5, 80 15, 90 10 L 100 5 L 100 40 Z"
                    fill="url(#velocity-gradient)"
                    initial={{ d: "M0 40 L0 40 C 10 40, 20 40, 30 40 C 40 40, 50 40, 60 40 C 70 40, 80 40, 90 40 L 100 40 L 100 40 Z" }}
                    animate={{ d: "M0 40 L0 30 C 10 25, 20 35, 30 20 C 40 10, 50 25, 60 15 C 70 5, 80 15, 90 10 L 100 5 L 100 40 Z" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.path
                    d="M0 30 C 10 25, 20 35, 30 20 C 40 10, 50 25, 60 15 C 70 5, 80 15, 90 10 L 100 5"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            <div className="absolute top-4 left-4">
                <div className="text-xs text-gray-500 mb-1">Weekly Velocity</div>
                <div className="text-xl font-bold text-white flex items-center gap-1">
                    +42%
                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </div>
            </div>
        </div>
    )
}
