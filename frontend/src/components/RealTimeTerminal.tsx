"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface LogEntry {
    id: string;
    source: string;
    message: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
}

interface RealTimeTerminalProps {
    logs: LogEntry[];
    isConnected: boolean;
    status: string;
}

export const RealTimeTerminal: React.FC<RealTimeTerminalProps> = ({ logs, isConnected, status }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] border border-white/5 rounded-lg overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#141419] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-300 font-medium">DEVOXA KERNEL DIAGNOSTICS</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] text-gray-500">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                    </div>
                    <span className="text-[10px] text-gray-600 border-l border-white/5 pl-3">{status.toUpperCase()}</span>
                </div>
            </div>

            {/* Log Window */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative">
                <div className="absolute inset-0 bg-[url('/grid-dark.svg')] opacity-5 pointer-events-none"></div>

                <AnimatePresence initial={false}>
                    {logs.length === 0 && (
                        <div className="text-gray-600 italic text-center mt-10">Waiting for data stream...</div>
                    )}

                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3"
                        >
                            <span className="text-gray-600 min-w-[60px]">{log.timestamp}</span>
                            <span className={`font-bold min-w-[120px] ${log.source === 'ORCHESTRATOR' ? 'text-purple-400' :
                                log.source === 'SECURITY' ? 'text-red-400' :
                                    log.source === 'LINTER' ? 'text-yellow-400' :
                                        'text-blue-400'
                                }`}>
                                [{log.source}]
                            </span>
                            <span className={`${log.type === 'error' ? 'text-red-400 bg-red-500/10 px-1 rounded' :
                                log.type === 'success' ? 'text-emerald-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                        'text-gray-300'
                                }`}>
                                {log.message}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {status === 'ANALYZING' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-gray-500 mt-2 pl-[200px]"
                    >
                        <span className="w-2 h-4 bg-indigo-500/50 animate-pulse block"></span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
