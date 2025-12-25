"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle } from 'lucide-react';
import axios from 'axios';
import GridBackground from '@/components/GridBackground';
import Link from 'next/link';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3001/api/auth/register', { email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <GridBackground />

            <div className="relative z-10 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Shield className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Join the enterprise AI code review platform.</p>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 mt-2">
                        Sign Up
                    </button>
                </form>
                <div className="text-center mt-6">
                    <span className="text-sm text-gray-500">Already have an account? </span>
                    <Link href="/auth/login" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
