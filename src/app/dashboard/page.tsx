"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trophy, CreditCard, ChevronRight, PlusCircle, ArrowRight, Ticket } from "lucide-react";

// Number Ticker component for highly polished tracking
function NumberTicker({ value, prefix = "$" }: { value: number, prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    // Slight delay for dramatic effect on load
    const timer = setTimeout(() => motionValue.set(value), 300);
    return () => clearTimeout(timer);
  }, [motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.floor(latest))}`;
      }
    });
  }, [springValue, prefix]);

  return <span ref={ref}>{prefix}0</span>;
}

export default function DashboardPage() {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-screen">
      <motion.div 
        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
            Welcome back, Alex 👋
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-xs sm:text-sm font-bold bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              🔥 5 Week Streak
            </motion.span>
          </h1>
          <p className="text-slate-400 font-medium">You have <strong className="text-blue-400">3 tickets</strong> ready for the upcoming draw.</p>
        </div>
        <Button variant="neon" className="rounded-2xl h-12 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
          <PlusCircle className="mr-2 h-5 w-5" /> Log New Score
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div variants={item}>
          <Card className="p-6 h-full flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 ring-1 ring-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Active Pro</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Subscription</p>
              <h3 className="text-2xl font-bold text-white mb-5">Impact Tier</h3>
              <div className="space-y-3">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px] animate-pulse" />
                  </motion.div>
                </div>
                <p className="text-xs text-slate-400 font-medium flex justify-between items-center">
                  <span>Renews in 12 days</span>
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center group-hover:translate-x-1 transition-transform">Manage <ArrowRight className="h-3 w-3 ml-1" /></span>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 h-full flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500 ring-1 ring-yellow-500/20 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-500">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 flex items-center group-hover:text-yellow-400 transition-colors cursor-pointer">
                View History <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Winnings</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-end gap-2 drop-shadow-md">
                <NumberTicker value={4250} />
                <span className="text-sm font-bold text-yellow-500 mb-2 px-2 py-0.5 bg-yellow-500/10 rounded-md border border-yellow-500/20">+12%</span>
              </h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 h-full flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                <Heart className="h-5 w-5" />
              </div>
               <span className="text-xs font-bold text-slate-500 flex items-center group-hover:text-emerald-400 transition-colors cursor-pointer">
                Your Impact <ChevronRight className="h-3 w-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Charity Contrib</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-end gap-2 drop-shadow-md">
                <NumberTicker value={1850} />
                <span className="text-sm font-bold text-emerald-400 mb-2">raised</span>
              </h3>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Secondary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Scores */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Logged Activities</h2>
             <span className="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">View All</span>
          </div>
          <Card className="divide-y divide-white/5 overflow-hidden border-white/5">
            {[
              { id: 1, date: "Today", score: 72, course: "Pebble Beach GL", tickets: 2 },
              { id: 2, date: "Yesterday", score: 84, course: "Augusta National", tickets: 1 },
              { id: 3, date: "Oct 12", score: 78, course: "St Andrews", tickets: 1 },
              { id: 4, date: "Oct 05", score: 91, course: "Torrey Pines", tickets: 0 },
            ].map((score, i) => (
              <motion.div 
                key={score.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-bold text-slate-300 group-hover:text-white transition-colors">{score.course}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{score.date}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  {score.tickets > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      +{score.tickets} Ticket{score.tickets > 1 ? 's' : ''}
                    </span>
                  )}
                  <div className="text-2xl font-black text-white tabular-nums tracking-tighter">{score.score}</div>
                </div>
              </motion.div>
            ))}
          </Card>
        </motion.div>

        {/* Next Draw */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Draw Focus</h2>
             <span className="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">Details</span>
          </div>
          <Card variant="neonOutline" className="p-8 text-center relative overflow-hidden group h-[calc(100%-2rem)] flex flex-col justify-center items-center">
            {/* Pulsing focal point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-600/10 to-purple-600/10 animate-pulse pointer-events-none z-0" />
            
            <div className="relative z-10 w-full">
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-400">November Grand Prize</p>
              <h3 className="text-6xl font-black mb-8 drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">
                <NumberTicker value={10000} />
              </h3>
              
              <div className="grid grid-cols-4 gap-3 mb-8 max-w-sm mx-auto">
                {['05', '12', '45', '13'].map((time, idx) => (
                    <div key={idx} className="bg-[#020617]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <div className="text-2xl md:text-3xl font-black text-white font-mono tracking-tighter">{time}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase mt-2 tracking-widest">{['Days', 'Hrs', 'Mins', 'Secs'][idx]}</div>
                    </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 bg-blue-500/10 border border-blue-500/20 py-2.5 px-6 rounded-full w-fit mx-auto mb-6">
                <Ticket className="w-5 h-5 text-blue-400" />
                <p className="text-sm font-medium text-blue-100">You have <strong className="text-white font-bold">3 tickets</strong> entered</p>
              </div>
              
              <Button variant="neon" className="w-full sm:w-auto h-12 px-8 text-base">
                Acquire More Tickets
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
