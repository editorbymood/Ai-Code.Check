"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, Loader2 } from 'lucide-react';

interface ReviewInputProps {
    onAnalyze: (code: string) => void;
    isAnalyzing: boolean;
}

export default function ReviewInput({ onAnalyze, isAnalyzing }: ReviewInputProps) {
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            onAnalyze(code);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Code className="w-4 h-4" />
                            <span className="text-xs font-mono">Input Source</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                        </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Paste your code here to begin analysis..."
                        className="w-full h-[400px] bg-[#0A0A0A] p-6 text-sm font-mono text-gray-300 focus:outline-none resize-none placeholder-gray-700"
                        spellCheck={false}
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/5">
                        <div className="text-xs text-gray-500 font-mono">
                            {code.length} characters
                        </div>
                        <button
                            type="submit"
                            disabled={!code.trim() || isAnalyzing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-black
                                ${!code.trim() || isAnalyzing
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-current" />
                                    Start Review
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Supported languages: JavaScript, TypeScript, Python, Java, Go, Rust
                </p>
            </div>
        </div>
    );
}
