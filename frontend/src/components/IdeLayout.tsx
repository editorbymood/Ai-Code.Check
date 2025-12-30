import React from 'react';

interface IdeLayoutProps {
    sidebar?: React.ReactNode;
    main: React.ReactNode;
    panel?: React.ReactNode;
    activityBar?: React.ReactNode; // Far left icon strip
}

export const IdeLayout: React.FC<IdeLayoutProps> = ({ sidebar, main, panel, activityBar }) => {
    return (
        <div className="flex h-full min-h-[600px] w-full bg-[#0d0d0d] overflow-hidden font-sans text-sm rounded-xl border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.07)]">
            {/* Activity Bar (Far Left) */}
            {activityBar && (
                <div className="w-12 bg-[#18181b] border-r border-[#27272a] flex flex-col items-center py-4 gap-4 z-20">
                    {activityBar}
                </div>
            )}

            {/* Primary Side Bar (File Explorer) */}
            {sidebar && (
                <div className="w-64 bg-[#111] border-r border-[#27272a] flex flex-col z-10 hidden md:flex">
                    {sidebar}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d]">
                {/* Editor / Main View */}
                <div className="flex-1 overflow-hidden relative">
                    {main}
                </div>

                {/* Bottom Panel (Terminal/Output) */}
                {panel && (
                    <div className="h-48 border-t border-[#27272a] bg-[#111] flex flex-col">
                        {panel}
                    </div>
                )}
            </div>

            {/* Status Bar (Very Bottom) - Optional, could be added later */}
        </div>
    );
};
