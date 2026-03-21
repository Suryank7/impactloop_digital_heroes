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
      neon: "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] border border-white/10 hover:border-white/25",
      outline: "border border-white/10 bg-transparent text-slate-100 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm",
      ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
      glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    };

    // Size classes
    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-10 rounded-lg px-4",
      lg: "h-16 rounded-2xl px-10 text-lg tracking-tight font-black",
      icon: "h-12 w-12 rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {variant === 'neon' && (
          <motion.div 
            className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ scale: [1, 1.2], opacity: [0, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">{children as React.ReactNode}</span>
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/10 pointer-events-none transition-colors" />
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
