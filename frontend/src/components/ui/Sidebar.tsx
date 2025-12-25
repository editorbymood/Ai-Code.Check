"use client";
import React from 'react';
import { Home, FileCode, Settings, LayoutDashboard, Shield, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const pathname = usePathname();

    const items = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Code Review', icon: FileCode, href: '/review' },
        { label: 'Security', icon: Shield, href: '/security' },
        { label: 'Integrations', icon: GitBranch, href: '/integrations' },
        { label: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 border-r border-glass-border bg-black/20 backdrop-blur-xl flex flex-col z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Devoxa
                </h1>
                <p className="text-xs text-gray-400 mt-1">Enterprise AI Reviewer</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-glass-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                        US
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">User</span>
                        <span className="text-xs text-gray-500">Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
