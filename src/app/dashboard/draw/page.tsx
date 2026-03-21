"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Trophy, 
  Heart, 
  History, 
  Users, 
  ArrowRight, 
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

export default function DrawPage() {
  const { user } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState([0, 0, 0, 0, 0]);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDraws() {
      try {
        const res = await fetch("/api/draw/results");
        const contentType = res.headers.get("content-type");
        let data: any = {};
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        }
        setDrawHistory(data.results || data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDraws();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpinning) {
      interval = setInterval(() => {
        setDisplayNumbers(Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)));
      }, 40);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsSpinning(false);
        const winNums = [7, 2, 9, 4, 1];
        setResult(winNums);
        setDisplayNumbers(winNums);
        setShowConfetti(true);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  const startDraw = () => {
    if (!isSpinning && !result) {
      setIsSpinning(true);
      setShowConfetti(false);
    }
  };

  if (loading) return (
    <div className="p-12 space-y-8 animate-pulse">
      <div className="h-16 w-64 bg-white/5 rounded-2xl" />
      <div className="h-[400px] w-full bg-white/5 rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48 bg-white/5 rounded-[2rem]" />
        <div className="h-48 bg-white/5 rounded-[2rem]" />
      </div>
    </div>
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 pb-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#3B82F6]/5 blur-[150px] rounded-full -z-10"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3B82F6] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
          THE MOMENT<br/>
          <span className="text-gradient">OF TRUTH.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg tracking-tight">
          Verify the latest draws and witness the power of community-driven impact.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Draw Machine */}
        <div className="lg:col-span-2 space-y-8">
           <Card className={cn(
             "p-12 md:p-20 relative overflow-hidden border-white/5 flex flex-col items-center justify-center transition-all duration-1000",
             result ? "gold-glow border-[#FACC15]/20 shadow-neon" : "bg-[#0A0A0A]/40"
           )}>
              {/* Internal Glows */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="flex justify-center gap-3 md:gap-6 mb-16 relative z-10 w-full">
                {displayNumbers.map((num, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-16 h-24 md:w-28 md:h-44 bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden group shadow-2xl",
                      result ? "border-[#FACC15]/30" : ""
                    )}
                    animate={isSpinning ? { y: [0, -10, 0, 10, 0] } : { y: 0 }}
                    transition={isSpinning ? { repeat: Infinity, duration: 0.15, delay: i * 0.03 } : { type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <motion.span 
                      key={num + "-" + i}
                      initial={{ opacity: 0, y: isSpinning ? 30 : -50, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.1 }}
                      className={cn(
                        "text-6xl md:text-[7rem] font-black tracking-tighter tabular-nums",
                        result ? "text-[#FACC15] drop-shadow-neon" : "text-white"
                      )}
                    >
                      {num}
                    </motion.span>
                    {result && <div className="absolute inset-0 bg-[#FACC15]/5" />}
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 w-full max-w-sm">
                 {!result ? (
                   <Button 
                      onClick={startDraw}
                      disabled={isSpinning}
                      variant="neon" 
                      size="lg"
                      className="w-full h-20 rounded-[2rem] text-xl shadow-neon group"
                   >
                     {isSpinning ? (
                       <span className="flex items-center gap-2">
                         <Zap className="w-6 h-6 animate-pulse" /> AUTHORIZING...
                       </span>
                     ) : (
                       "START VALIDATION"
                     )}
                   </Button>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="text-center space-y-6"
                   >
                      <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full success-glow">
                        <Sparkles className="w-4 h-4 text-[#10B981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Draw Verified</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tight">ALEX NEWMAN</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Winning Sequence Authorized</p>
                      </div>
                      <div className="pt-4 flex items-center justify-center gap-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prize Fund</p>
                          <p className="text-2xl font-black text-white">$2,500</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Charity Match</p>
                          <p className="text-2xl font-black text-[#10B981]">$500</p>
                        </div>
                      </div>
                   </motion.div>
                 )}
              </div>
           </Card>

           {/* History Ledger */}
           <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Previous Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {drawHistory.length > 0 ? (
                   drawHistory.slice(0, 4).map((draw, i) => (
                     <Card key={i} className="p-6 border-white/5 bg-[#0A0A0A]/40 flex items-center justify-between group hover:border-[#3B82F6]/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Trophy className="w-5 h-5 text-slate-400 group-hover:text-[#FACC15]" />
                           </div>
                           <div>
                              <p className="text-white font-black tracking-tight">{new Date(draw.drawDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} Draw</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${draw.totalPrizeFund} Fund</p>
                           </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
                     </Card>
                   ))
                 ) : (
                   <div className="col-span-2 p-12 text-center text-slate-500 font-black uppercase tracking-widest text-xs border border-dashed border-white/5 rounded-[2rem]">
                     No historical data available.
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
           <Card className="p-8 border-[#FACC15]/20 bg-[#FACC15]/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Trophy className="w-32 h-32 text-[#FACC15]" />
              </div>
              <h4 className="text-xl font-black text-white mb-6 tracking-tight">Next Grand Prize.</h4>
              <div className="text-6xl font-black text-white tracking-tighter mb-10">$10,000</div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Entries</span>
                    <div className="flex items-center gap-2">
                       <Ticket className="w-4 h-4 text-[#3B82F6]" />
                       <span className="text-lg font-black text-white">12</span>
                    </div>
                 </div>
                 <Link href="/dashboard/scores">
                   <Button variant="glass" className="w-full rounded-xl border-white/10">Get More Tickets</Button>
                 </Link>
              </div>
           </Card>

           <Card className="p-8 border-white/5 relative overflow-hidden">
              <h4 className="text-xl font-black text-white mb-6 tracking-tight">Cumulative Impact.</h4>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-2">Total Donated</p>
                   <p className="text-4xl font-black text-white tracking-tighter">$124,500</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Projects Funded</p>
                   <p className="text-4xl font-black text-white tracking-tighter">18</p>
                </div>
              </div>
           </Card>
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: "50vw", y: "50vh", 
                opacity: 1, 
                scale: Math.random() * 2 + 0.5 
              }}
              animate={{ 
                x: `${(Math.random() * 120) - 10}vw`, 
                y: `${(Math.random() * 120) - 10}vh`, 
                opacity: 0,
                rotate: Math.random() * 720
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                ease: "easeOut" 
              }}
              className={cn(
                "absolute w-3 h-3 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                ['bg-[#FACC15]', 'bg-[#3B82F6]', 'bg-[#8B5CF6]', 'bg-[#10B981]', 'bg-white'][Math.floor(Math.random() * 5)]
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
