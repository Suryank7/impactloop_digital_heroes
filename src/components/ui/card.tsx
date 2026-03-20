"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "solid" | "neonOutline";
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", interactive = true, children, ...props }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current || isFocused) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
      setIsFocused(true);
      setOpacity(1);
    };

    const handleBlur = () => {
      setIsFocused(false);
      setOpacity(0);
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    const variants = {
      glass: "bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl relative",
      solid: "bg-slate-900 border-white/5 relative shadow-xl",
      neonOutline: "bg-slate-900/60 backdrop-blur-2xl border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] relative group",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl border overflow-hidden transition-all duration-300",
          variants[variant],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        {...(interactive ? {
           onMouseMove: handleMouseMove,
           onFocus: handleFocus,
           onBlur: handleBlur,
           onMouseEnter: handleMouseEnter,
           onMouseLeave: handleMouseLeave
        } : {})}
        {...props}
      >
        <div ref={divRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          {interactive && (
            <div
              className="absolute inset-0 z-0 transition-opacity duration-500"
              style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
              }}
            />
          )}
          {variant === "neonOutline" && (
            <div
               className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
               style={{
                 background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(59,130,246,.15), transparent 40%)`,
               }}
            />
          )}
        </div>
        <div className="relative z-10 w-full h-full">{children as React.ReactNode}</div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
