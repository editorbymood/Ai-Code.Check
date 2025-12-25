"use client";
import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import GridBackground from '@/components/GridBackground';
import SpotlightCard from '@/components/SpotlightCard';
import { GitBranch, Wifi } from 'lucide-react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Check for success param
        if (searchParams.get('success') === 'true') {
            // Toast success (mock)
            console.log("Integration connected successfully!");
            router.replace('/integrations');
        }
        fetchIntegrations();
    }, [searchParams]);

    const fetchIntegrations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3001/api/integrations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIntegrations(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch integrations", error);
            setLoading(false);
        }
    };

    const handleConnect = (providerId: string) => {
        const token = localStorage.getItem('token');
        // Redirect to backend connect endpoint which handles the OAuth flow
        // We pass the auth token so backend knows who is connecting
        window.location.href = `http://localhost:3001/api/auth/${providerId}/connect?token=${token}`;
    };

    const PROVIDERS = [
        { id: "github", name: "GitHub", desc: "Sync repositories and automate PR reviews." },
        { id: "gitlab", name: "GitLab", desc: "Connect self-hosted GitLab instances." },
        { id: "bitbucket", name: "Bitbucket", desc: "Import repos from Bitbucket Cloud." },
        { id: "slack", name: "Slack", desc: "Get notifications for review updates." },
    ];

    const isConnected = (providerId: string) => {
        return integrations.some(i => i.provider === providerId);
    };

    return (
        <div className="flex bg-[#020202] min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 relative">
                <GridBackground />
                <div className="relative z-10 p-8 pt-10">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
                        <p className="text-gray-400">Connect Devoxa with your favorite tools.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROVIDERS.map((provider, i) => {
                            const connected = isConnected(provider.id);
                            return (
                                <SpotlightCard key={i} className="p-6 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${connected ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                                            <GitBranch className={`w-6 h-6 ${connected ? 'text-emerald-400' : 'text-gray-300'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{provider.name}</h3>
                                            <p className="text-xs text-gray-500">{provider.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => !connected && handleConnect(provider.id)}
                                        disabled={connected}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${connected
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                                : "bg-white/5 text-gray-300 hover:bg-white/10"
                                            }`}>
                                        {connected ? "Connected" : "Connect"}
                                    </button>
                                </SpotlightCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
