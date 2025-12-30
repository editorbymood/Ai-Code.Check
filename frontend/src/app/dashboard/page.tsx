

"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Activity, GitBranch, Zap, Play, Loader2, FileCode, MonitorPlay, Terminal as TerminalIcon } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { IdeLayout } from '@/components/IdeLayout';
import { useAuth } from '@/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { RealTimeTerminal } from '@/components/RealTimeTerminal';
import { ConfidenceChart } from '@/components/ConfidenceChart';

export default function Dashboard() {
    const [code, setCode] = useState(`// Welcome to Devoxa
// Paste your code here to analyze...

function example() {
  console.log("Hello World");
}`);
    const [isGodMode, setIsGodMode] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { isAuthenticated, isLoading, token } = useAuth(); // Assume user from context
    const router = useRouter();

    // Real-time State
    const [socket, setSocket] = useState<Socket | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState('IDLE');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Socket Connection
    useEffect(() => {
        const newSocket = io('http://localhost:3001'); // Adjust URL for prod
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket');
            addLog('SYSTEM', 'Secure connection established.', 'system');
        });

        // Review Events
        newSocket.on('analysis:start', (data) => {
            setStatus('ANALYZING');
            addLog('SYSTEM', `Analysis job started: ${data.reviewId}`, 'info');
        });

        newSocket.on('analysis:progress', (data) => {
            // data = { agentName, status, message, progress }
            const type = data.status === 'error' ? 'error' : 'info';
            addLog(data.agentName?.toUpperCase() || 'AGENT', data.message, type);

            // Mock score update for visual effect during progress
            if (data.progress) {
                setScore(prev => Math.min(99, prev + 2));
            }
        });

        newSocket.on('analysis:complete', (data) => {
            setStatus('COMPLETED');
            setScore(data.score);
            addLog('SYSTEM', `Analysis Complete. Score: ${data.score}`, 'success');
            setIsAnalyzing(false);
        });

        newSocket.on('analysis:error', (data) => {
            setStatus('ERROR');
            addLog('SYSTEM', `Error: ${data.message}`, 'error');
            setIsAnalyzing(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const addLog = (source: string, message: string, type: 'info' | 'success' | 'warning' | 'error' | 'system') => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36),
            timestamp: new Date().toLocaleTimeString().split(' ')[0],
            source,
            message,
            type
        }]);
    };

    const handleAnalyze = async () => {
        if (!code || isAnalyzing) return;
        setIsAnalyzing(true);
        setLogs([]); // Clear previous logs
        setScore(0);

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
            if (data.reviewId && socket) {
                // Subscribe to potential room if needed, or backend emits to user room
                // For now, backend emits to review room, we might need to join it? 
                // In generic implementation, we just listen to 'user:id' events.
                addLog('SYSTEM', 'Request sent. Waiting for agent allocation...', 'system');
            }
        } catch (e) {
            console.error(e);
            setIsAnalyzing(false);
            addLog('SYSTEM', 'Failed to send request.', 'error');
        }
    };

    // Components for Slots
    const ActivityBar = (
        <>
            <div className="group relative flex justify-center">
                <FileCode className="w-6 h-6 text-indigo-400 cursor-pointer" />
            </div>
            <div className="group relative flex justify-center mt-4">
                <MonitorPlay className="w-6 h-6 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="mt-auto mb-4 group relative flex justify-center">
                <div onClick={() => setIsGodMode(!isGodMode)} className={`cursor-pointer ${isGodMode ? 'text-purple-500 animate-pulse' : 'text-gray-600 hover:text-white'}`}>
                    <Zap className="w-6 h-6" />
                </div>
            </div>
        </>
    );

    const Sidebar = (
        <div className="p-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Explorer</h2>
            <div className="space-y-1">
                <div className="flex items-center gap-2 bg-[#2a2a2e] text-white p-1 rounded cursor-pointer text-sm">
                    <span className="text-blue-400">TS</span>
                    <span>snippet.ts</span>
                </div>
            </div>

            <div className="mt-8">
                <ConfidenceChart score={score} />
            </div>
        </div>
    );

    const Main = (
        <motion.div className="h-full flex flex-col bg-[#050505]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Minimal Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505]">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-gray-200">Analysis Workbench</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded border ${status === 'ANALYZING' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' : status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-gray-800 text-gray-500'}`}>
                        {status}
                    </span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 p-0 flex flex-col min-w-0 bg-[#0a0a0a]">
                    <textarea
                        className="w-full h-full p-6 bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-300 resize-none placeholder:text-gray-700 leading-relaxed custom-scrollbar outline-none"
                        spellCheck={false}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <div className="absolute bottom-10 right-10">
                        <NeonButton
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !code}
                            className={`h-12 px-8 ${isAnalyzing ? 'bg-zinc-800 text-gray-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} shadow-2xl`}
                        >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2 fill-current" />}
                            {isAnalyzing ? 'Analyzing...' : 'Run Diagnostics'}
                        </NeonButton>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const Panel = (
        <RealTimeTerminal
            logs={logs}
            isConnected={!!socket}
            status={status}
        />
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

