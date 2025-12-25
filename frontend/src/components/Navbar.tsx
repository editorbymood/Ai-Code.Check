"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Magnetic from '@/components/MagneticButton';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll behavior
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Show/hide based on scroll direction
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }

        // Add background when scrolled
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: -100 },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 transition-all duration-300 pointer-events-none`}
            >
                <nav
                    className={`
            pointer-events-auto
            flex items-center gap-2 md:gap-8 px-4 md:px-6 py-3 rounded-full 
            transition-all duration-500 ease-out
            ${scrolled
                            ? "bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                            : "bg-transparent border border-transparent shadow-none"
                        }
          `}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 pr-2 md:pr-4 md:border-r border-white/10 group cursor-pointer">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300">
                            <span className="relative z-10 text-white font-bold text-xs tracking-tighter">DX</span>
                            <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                        </div>
                        <span className="hidden md:block font-semibold text-sm text-white tracking-tight group-hover:text-primary transition-colors">Devoxa</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {[
                            { name: 'Features', path: '/features' },
                            { name: 'Methodology', path: '/methodology' },
                            { name: 'Pricing', path: '/pricing' },
                            { name: 'Blog', path: '/blog' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="relative text-xs font-medium text-gray-400 hover:text-white transition-colors py-1 group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center opacity-50"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-white/10">
                        <Link
                            href="/auth/login"
                            className="hidden md:block text-xs font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Magnetic>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-8 px-4 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors flex items-center shadow-lg hover:shadow-cyan-500/20"
                            >
                                Get Started
                            </motion.button>
                        </Magnetic>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col items-center gap-6"
                    >
                        {[
                            { name: 'Features', path: '/features' },
                            { name: 'Methodology', path: '/methodology' },
                            { name: 'Pricing', path: '/pricing' },
                            { name: 'Blog', path: '/blog' },
                            { name: 'Sign In', path: '/auth/login' }
                        ].map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={item.path}
                                    className="text-2xl font-semibold text-gray-300 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
