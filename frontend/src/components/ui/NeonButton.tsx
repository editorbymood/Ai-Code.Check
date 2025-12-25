import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
    isLoading?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, children, variant = 'primary', isLoading, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]",
            secondary: "bg-secondary/20 text-secondary border-secondary/50 hover:bg-secondary/30 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]",
            accent: "bg-accent/20 text-accent border-accent/50 hover:bg-accent/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]",
            ghost: "hover:bg-white/5 text-gray-400 hover:text-white border-transparent"
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-300 border backdrop-blur-sm",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
NeonButton.displayName = "NeonButton";
