"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Activity, GitBranch, Zap, Users, Play, Loader2, FileCode, MonitorPlay, Terminal, Layout } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { IdeLayout } from '@/components/IdeLayout';

export default function Dashboard() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [isGodMode, setIsGodMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/auth/login');
        }
    }, []);

    const handleAnalyze = async () => {
        if (!code) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    code,
                    mode: isGodMode ? 'GOD_MODE' : 'STANDARD'
                })
            });
            const data = await res.json();
            if (data.reviewId) {
                router.push(`/review/${data.reviewId}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // Components for Slots
    const ActivityBar = (
        <>
            <div className="group relative flex justify-center">
                <FileCode className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <span className="absolute left-full ml-2 bg-neutral-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Explorer</span>
            </div>
            <div className="group relative flex justify-center">
                <MonitorPlay className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <span className="absolute left-full ml-2 bg-neutral-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Debug</span>
            </div>
            <div className="group relative flex justify-center">
                <GitBranch className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <span className="absolute left-full ml-2 bg-neutral-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Source Control</span>
            </div>
            <div className="mt-auto mb-4 group relative flex justify-center">
                <div onClick={() => setIsGodMode(!isGodMode)} className={`cursor-pointer ${isGodMode ? 'text-purple-500 animate-pulse' : 'text-gray-400'}`}>
                    <Zap className="w-6 h-6" />
                </div>
                <span className="absolute left-full ml-2 bg-purple-900/50 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">God Mode</span>
            </div>
        </>
    );

    const Sidebar = (
        <div className="p-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Files</h2>
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-300 hover:bg-[#2a2a2e] p-1 rounded cursor-pointer text-sm">
                    <span className="text-blue-400">TS</span>
                    <span>src/index.ts</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:bg-[#2a2a2e] p-1 rounded cursor-pointer text-sm">
                    <span className="text-yellow-400">JS</span>
                    <span>package.json</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 hover:bg-[#2a2a2e] p-1 rounded cursor-pointer text-sm">
                    <span className="text-cyan-400">RX</span>
                    <span>components/Auth.tsx</span>
                </div>
            </div>

            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-8 mb-4">Open Editors</h2>
            <div className="bg-[#1e1e1e] p-2 rounded text-xs text-gray-400">
                <p>No open files</p>
            </div>
        </div>
    );

    const Main = (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Workspace Overview</h1>
                    <p className="text-gray-400 text-sm">Welcome back, Senior Architect.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Security Score</div>
                        <div className="text-xl font-mono text-green-400">92/100</div>
                    </div>
                    <div className="h-8 w-px bg-gray-700"></div>
                    <NeonButton onClick={handleAnalyze} disabled={isLoading || !code} className="h-10">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        Run Analysis
                    </NeonButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <GlassCard className="p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-500" /> Quick Input
                    </h3>
                    <textarea
                        className="w-full h-40 bg-black/40 border border-white/10 rounded p-3 font-mono text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 resize-none"
                        placeholder="// Paste code snippet here..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-500" /> Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="text-sm text-gray-400 border-l-2 border-green-500 pl-3">
                            <span className="text-white font-medium">Review #1024</span> passed with score 98.
                            <div className="text-xs text-gray-600 mt-1">2 mins ago</div>
                        </div>
                        <div className="text-sm text-gray-400 border-l-2 border-red-500 pl-3">
                            <span className="text-white font-medium">Review #1023</span> failed security check.
                            <div className="text-xs text-gray-600 mt-1">1 hour ago</div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Tech Debt Heatmap Placeholder (since we don't have real data yet) */}
            <div className="flex-1 bg-black/20 rounded-lg border border-white/5 p-4 flex items-center justify-center text-gray-600 italic">
                Select a file to view deep metrics and graph.
            </div>
        </div>
    );

    const Panel = (
        <div className="h-full p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-gray-800 pb-2">
                <span className="text-white font-bold border-b-2 border-cyan-500 pb-2 -mb-2.5">TERMINAL</span>
                <span className="hover:text-white cursor-pointer px-2">OUTPUT</span>
                <span className="hover:text-white cursor-pointer px-2">DEBUG CONSOLE</span>
                <span className="hover:text-white cursor-pointer px-2">PROBLEMS</span>
            </div>
            <div className="text-green-500">➜  ~  System Initialized.</div>
            <div className="text-gray-400">   Loaded 14 agents.</div>
            {isGodMode && <div className="text-purple-400">   GOD MODE ACTIVE: Personas ready.</div>}
            <div className="text-gray-500">   Waiting for input...</div>
        </div>
    );

    return (
        <IdeLayout
            activityBar={ActivityBar}
            sidebar={Sidebar}
            main={Main}
            panel={Panel}
        />
    );
}

