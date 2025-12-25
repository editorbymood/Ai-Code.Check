import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gradient?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, gradient = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card rounded-xl p-6 relative overflow-hidden",
                    gradient && "bg-gradient-to-br from-glass-bg to-transparent",
                    className
                )}
                {...props}
            >
                {gradient && (
                    <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-50 pointer-events-none" />
                )}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";
