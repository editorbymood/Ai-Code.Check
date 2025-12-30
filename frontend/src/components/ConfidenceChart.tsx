"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceChartProps {
    score: number;
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ score }) => {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s >= 90) return '#10b981'; // Emerald
        if (s >= 70) return '#6366f1'; // Indigo
        if (s >= 50) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(score);
    const circumference = 2 * Math.PI * 40; // radius 40
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-full h-48 flex items-center justify-center">
            {/* SVG Gauge */}
            <svg className="w-40 h-40 transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    key={score}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-bold text-white tracking-tighter"
                >
                    {Math.round(score)}
                </motion.span>
                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Quality Score</span>
            </div>
        </div>
    );
};
