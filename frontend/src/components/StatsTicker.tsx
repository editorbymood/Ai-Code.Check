"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

function Counter({ value }: { value: number }) {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const displayValue = useTransform(springValue, (latest) =>
        Math.round(latest)
    );

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return <motion.span>{displayValue}</motion.span>;
}

export default function StatsTicker() {
    const stats = [
        { label: "Security Score", value: 92, suffix: "/100", color: "text-green-400" },
        { label: "Issues Fixed", value: 143, suffix: "", color: "text-blue-400" },
        { label: "Hours Saved", value: 48, suffix: "h", color: "text-purple-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
                        {stat.label}
                    </div>
                    <div className={`text-3xl font-mono font-bold ${stat.color}`}>
                        <Counter value={stat.value} />
                        {stat.suffix}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
