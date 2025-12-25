"use client";
import React from 'react';
import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar is fixed, so we need a spacer or margin */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 md:pl-64 min-h-screen relative z-0">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
