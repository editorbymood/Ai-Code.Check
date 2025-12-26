"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import CodeScanner from '@/components/CodeScanner';
import GridBackground from '@/components/GridBackground';
import ReviewInput from '@/components/ReviewInput';
import { ReviewDisplay, ReviewData } from '@/components/ReviewDisplay';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
    const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'RESULTS'>('INPUT');
    const [reviewResult, setReviewResult] = useState<ReviewData | null>(null);

    const handleAnalyze = async (code: string) => {
        setStep('ANALYZING');
        try {
            // Include user token if auth is implemented, otherwise it might be public/mock for now
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3001/api/review', {
                code,
                language: 'javascript', // Default for now
                mode: 'STANDARD'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Simulate a minimum "scanning" time for the effect
            setTimeout(() => {
                setReviewResult(response.data);
                setStep('RESULTS');
            }, 3000);

        } catch (error) {
            console.error("Analysis Failed", error);
            setStep('INPUT');
            // Suggestion: Add toast notification here
        }
    };

    return (
        <div className="flex bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <div className="flex-1 ml-64 relative min-h-screen flex flex-col">
                <GridBackground />
                <div className="relative z-10 flex-grow p-8 pt-10 flex flex-col">
                    <header className="mb-12 max-w-4xl mx-auto w-full text-center">
                        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                            AI Code Review
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Analyze your code for bugs, security vulnerabilities, and style issues with our deep-learning engine.
                        </p>
                    </header>

                    <div className="flex-grow flex flex-col items-center justify-center w-full">
                        <AnimatePresence mode="wait">
                            {step === 'INPUT' && (
                                <motion.div
                                    key="inputs"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full"
                                >
                                    <ReviewInput onAnalyze={handleAnalyze} isAnalyzing={false} />
                                </motion.div>
                            )}

                            {step === 'ANALYZING' && (
                                <motion.div
                                    key="scanner"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full"
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl font-mono text-indigo-400 animate-pulse">
                                            {">"} Initializing Neural Scan...
                                        </h2>
                                    </div>
                                    <CodeScanner />
                                </motion.div>
                            )}

                            {step === 'RESULTS' && reviewResult && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full max-w-6xl mx-auto"
                                >
                                    <div className="mb-6 flex justify-between items-center">
                                        <button
                                            onClick={() => setStep('INPUT')}
                                            className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            ← Analyze Another Snippet
                                        </button>
                                    </div>
                                    <ReviewDisplay review={reviewResult} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
