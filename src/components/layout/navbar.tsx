"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      setScrollY(currentScrollY);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 50) {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also check document scroll
    document.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard", private: true },
    { name: "Draw", href: "/draw", private: true },
    { name: "Charities", href: "/charities" },
  ];

  const visibleLinks = navLinks.filter(link => !link.private || user);

  return (
    <motion.nav 
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 mx-4 mt-6 rounded-[2rem] md:mx-auto md:max-w-6xl px-6 py-2"
    >
      {/* Debug Scroll Telemetry */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none z-[100]">
        {Math.round(scrollY)}px | {hidden ? "HIDDEN" : "VISIBLE"}
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all rotate-3 group-hover:rotate-0">
                <div className="w-4 h-4 bg-white rounded-full shadow-inner" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ImpactLoop</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "relative px-5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300",
                      isActive ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-x-2 bottom-1.5 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-24 bg-white/5 animate-pulse rounded-2xl" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/profile">
                   <Button variant="ghost" size="sm" className="rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 gap-2 border border-transparent hover:border-white/10 px-4">
                      <UserIcon className="h-4 w-4" /> Profile
                   </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="rounded-2xl border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 gap-2 px-4"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-2xl text-slate-400 hover:text-white px-6">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="neon" size="sm" className="rounded-2xl px-8 shadow-neon">
                    Join Platform
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button (visual only for now) */}
          <div className="-mr-2 flex md:hidden">
            <button className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
