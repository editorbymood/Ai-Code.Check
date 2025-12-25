"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import GridBackground from '@/components/GridBackground';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-[#050505] items-center justify-center overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl" />
                <GridBackground />

                <div className="relative z-10 max-w-md p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Security at <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hyperspeed.</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Access your Devoxa workspace to monitor, analyze, and secure your codebase in real-time.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <GridBackground /> {/* Subtle background for mobile/right side */}

                <div className="w-full max-w-sm relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-500">Please enter your details.</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="group w-full bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
                                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                        <div className="text-center mt-8">
                            <span className="text-sm text-gray-500">Don't have an account? </span>
                            <Link href="/auth/register" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create account</Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
