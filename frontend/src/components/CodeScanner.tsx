"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, Terminal } from 'lucide-react';

const codeSnippet = `
// Server-side authentication logic
async function validateUser(token: string) {
  if (!token) return null;

  try {
    // Verify token signature 
    const decoded = await verify(
      token, 
      process.env.JWT_SECRET
    );

    // Potential vulnerability check
    const user = await db.query(
      "SELECT * FROM users WHERE id = " + decoded.id
    );

    return user;
  } catch (error) {
    console.error("Auth failed:", error);
    return null;
  }
}
`.trim();

export default function CodeScanner() {
    const [scannedLines, setScannedLines] = useState<number[]>([]);
    const [issues, setIssues] = useState<{ line: number; type: 'error' | 'warning' | 'success'; message: string }[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setScannedLines(prev => {
                if (prev.length >= codeSnippet.split('\n').length) return prev;
                return [...prev, prev.length];
            });
        }, 100);

        // Simulate finding issues
        setTimeout(() => {
            setIssues(prev => [...prev, { line: 12, type: 'error', message: 'SQL Injection Vulnerability detected' }]);
        }, 1500);

        setTimeout(() => {
            setIssues(prev => [...prev, { line: 4, type: 'warning', message: 'Missing type safety check' }]);
        }, 800);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto font-mono text-sm bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Terminal className="w-3 h-3" />
                    <span>auth_service.ts</span>
                </div>
            </div>

            {/* Code Area */}
            <div className="relative p-6 overflow-hidden">
                {/* Scan Line */}
                <motion.div
                    className="absolute left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-0">
                    {codeSnippet.split('\n').map((line, i) => {
                        const issue = issues.find(issue => issue.line === i);
                        const isScanned = scannedLines.includes(i);

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: isScanned ? 1 : 0.3 }}
                                className={`relative flex items-center gap-4 py-0.5 px-2 rounded transition-colors duration-300 ${issue?.type === 'error' ? 'bg-red-500/10' :
                                    issue?.type === 'warning' ? 'bg-yellow-500/10' :
                                        'hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-gray-600 select-none w-6 text-right">{i + 1}</span>
                                <span className={`${issue ? 'text-white' : 'text-gray-300'}`}>
                                    {line}
                                </span>

                                {issue && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`absolute right-4 flex items-center gap-2 text-xs px-2 py-1 rounded bg-black/50 border backdrop-blur-md ${issue.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-yellow-400 border-yellow-500/30'
                                            }`}
                                    >
                                        {issue.type === 'error' ? <AlertTriangle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                        {issue.message}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
