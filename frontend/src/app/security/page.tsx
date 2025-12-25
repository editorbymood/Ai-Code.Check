"use client";
import React from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import GridBackground from '@/components/GridBackground';
import SpotlightCard from '@/components/SpotlightCard';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
    return (
        <div className="flex bg-[#020202] min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 relative">
                <GridBackground />
                <div className="relative z-10 p-8 pt-10">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
                        <p className="text-gray-400">Real-time vulnerability monitoring and dependency audits.</p>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: "Vulnerabilities Found", value: "0", sub: "Last 7 days", icon: AlertTriangle, color: "text-red-400" },
                            { label: "Secure Dependencies", value: "100%", sub: "Up to date", icon: Shield, color: "text-emerald-400" },
                            { label: "Pending Scans", value: "0", sub: "Everything checked", icon: CheckCircle, color: "text-blue-400" }
                        ].map((stat, i) => (
                            <SpotlightCard key={i} className="p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{stat.sub}</span>
                                </div>
                                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </SpotlightCard>
                        ))}
                    </div>

                    <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm text-center">
                        <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Security Incidents</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Your repositories are currently clean. Start a new scan to check for the latest CVEs.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
