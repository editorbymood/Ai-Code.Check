"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import CodeScanner from '@/components/CodeScanner';
import GridBackground from '@/components/GridBackground';

export default function ReviewPage() {
    return (
        <div className="flex bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <div className="flex-1 ml-64 relative">
                <GridBackground />
                <div className="relative z-10 p-8 pt-10">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Code Review</h1>
                        <p className="text-gray-400">Analyze your code for bugs, security vulnerabilities, and style issues.</p>
                    </header>
                    <CodeScanner />
                </div>
            </div>
        </div>
    );
}
