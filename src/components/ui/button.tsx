"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "glass" | "neon";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    
    // Base classes with improved transitions
    const baseClasses = "relative inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group";
    
    // Variant classes upgraded for premium feel
    const variants = {
      default: "bg-white text-slate-950 shadow-[0_2px_10px_rgba(255,255,255,0.1)] hover:bg-slate-100 hover:shadow-[0_5px_20px_rgba(255,255,255,0.2)]",
      neon: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] border border-white/10 hover:border-white/20",
      outline: "border border-slate-700/50 bg-slate-900/50 backdrop-blur-md text-slate-100 hover:border-slate-600 hover:bg-slate-800",
      ghost: "hover:bg-slate-800/80 text-slate-300 hover:text-white",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
    };

    // Size classes
    const sizes = {
      default: "h-11 px-5 py-2",
      sm: "h-9 rounded-lg px-4",
      lg: "h-14 rounded-2xl px-8 text-base tracking-wide",
      icon: "h-11 w-11 rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {variant === 'neon' && (
           <>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
           </>
        )}
        {(variant === 'default' || variant === 'glass') && (
           <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
