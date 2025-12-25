import React from 'react';

export default function GridBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
            {/* Main Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
            />

            {/* Secondary Dot Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

            {/* Top Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-20 pointer-events-none" />

            {/* Bottom Ambient Glow */}
            <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-accent/10 blur-[100px] rounded-full opacity-20 pointer-events-none" />
        </div>
    );
}
