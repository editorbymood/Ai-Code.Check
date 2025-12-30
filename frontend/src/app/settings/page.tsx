"use client";
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import GridBackground from '@/components/GridBackground';
import SpotlightCard from '@/components/SpotlightCard';
import { User, CreditCard, Bell, Shield, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState<any>(null);
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [profileRes, keysRes] = await Promise.all([
                axios.get('http://localhost:3001/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:3001/api/user/keys', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setUser(profileRes.data);
            setKeys(keysRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/api/user/profile', {
                name: user.name,
                marketingEmails: user.marketingEmails,
                securityAlerts: user.securityAlerts
            }, { headers: { Authorization: `Bearer ${token}` } });
            setSaving(false);
            // Show toast/success
        } catch (error) {
            setSaving(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:3001/api/user/keys', { name: newKeyName }, { headers: { Authorization: `Bearer ${token}` } });
            setKeys([res.data, ...keys]);
            setNewKeyName('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteKey = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/user/keys/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setKeys(keys.filter(k => k.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-[#020202] min-h-screen items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="flex bg-[#020202] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <div className="flex-1 ml-64 relative">
                <GridBackground />
                <div className="relative z-10 p-8 pt-10">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-gray-400">Manage your workspace and preferences.</p>
                    </header>

                    <div className="flex gap-8 max-w-6xl">
                        {/* Tabs */}
                        <div className="w-64 flex flex-col gap-2">
                            {[
                                { id: 'profile', label: 'Profile', icon: User },
                                { id: 'notifications', label: 'Notifications', icon: Bell },
                                { id: 'billing', label: 'Billing', icon: CreditCard },
                                { id: 'api-keys', label: 'API Keys', icon: Shield },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-white/10 text-white font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <SpotlightCard className="p-8 rounded-2xl mb-6">
                                            <h2 className="text-xl font-bold mb-6">Profile Details</h2>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                                    <input
                                                        disabled
                                                        value={user?.email || ''}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                                                    <input
                                                        value={user?.name || ''}
                                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                        placeholder="Enter your name"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleUpdateProfile}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                >
                                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    Save Changes
                                                </button>
                                            </div>
                                        </SpotlightCard>
                                    </motion.div>
                                )}

                                {activeTab === 'notifications' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <SpotlightCard className="p-8 rounded-2xl">
                                            <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                    <div>
                                                        <h3 className="font-medium">Marketing Emails</h3>
                                                        <p className="text-xs text-gray-400">Receive updates about new features and promotions.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={user?.marketingEmails}
                                                            onChange={(e) => setUser({ ...user, marketingEmails: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                    <div>
                                                        <h3 className="font-medium">Security Alerts</h3>
                                                        <p className="text-xs text-gray-400">Get notified about critical security vulnerabilities.</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={user?.securityAlerts}
                                                            onChange={(e) => setUser({ ...user, securityAlerts: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <button
                                                    onClick={handleUpdateProfile}
                                                    className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    Save Preferences
                                                </button>
                                            </div>
                                        </SpotlightCard>
                                    </motion.div>
                                )}

                                {activeTab === 'api-keys' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <SpotlightCard className="p-8 rounded-2xl mb-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <h2 className="text-xl font-bold">API Keys</h2>
                                                    <p className="text-sm text-gray-400">Manage your personal access tokens.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mb-6">
                                                <input
                                                    value={newKeyName}
                                                    onChange={(e) => setNewKeyName(e.target.value)}
                                                    placeholder="Token Name (e.g. CI/CD Runner)"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                                                />
                                                <button
                                                    onClick={handleCreateKey}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" /> Generate
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {keys.length === 0 ? (
                                                    <div className="text-center py-10 text-gray-500">No API keys generated yet.</div>
                                                ) : (
                                                    keys.map((key) => (
                                                        <div key={key.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                                    <Shield className="w-5 h-5 text-indigo-400" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-white">{key.name}</h3>
                                                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{key.key.substring(0, 10)}...****************</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                                                                <button
                                                                    onClick={() => handleDeleteKey(key.id)}
                                                                    className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </SpotlightCard>
                                    </motion.div>
                                )}

                                {activeTab === 'billing' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <SpotlightCard className="p-8 rounded-2xl text-center py-20">
                                            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                                            <h2 className="text-2xl font-bold mb-2">Billing Portal</h2>
                                            <p className="text-gray-400 max-w-md mx-auto mb-8">
                                                Manage your subscription, payment methods, and invoices via our secure backend.
                                                <br />
                                                <span className="text-xs uppercase tracking-widest text-indigo-400 mt-2 block">Enterprise Plan Active</span>
                                            </p>
                                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                                                Manage Subscription
                                            </button>
                                        </SpotlightCard>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
