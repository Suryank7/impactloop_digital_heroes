"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  Heart, 
  Trophy, 
  CreditCard, 
  ArrowUpRight, 
  PlusCircle, 
  Ticket,
  TrendingUp,
  Activity,
  Calendar
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 25 },
  { name: "Fri", value: 22 },
  { name: "Sat", value: 30 },
  { name: "Sun", value: 28 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tickets: 0,
    winnings: 0,
    impact: 0,
    renewDays: 0,
  });
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scoresRes, statsRes] = await Promise.all([
          fetch("/api/scores"),
          fetch("/api/auth/me"),
        ]);
        
        const safeJson = async (r: Response) => {
          const contentType = r.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return await r.json();
          }
          return {};
        };

        const scoresData = await safeJson(scoresRes);
        const userData = await safeJson(statsRes);

        const s = scoresData.scores || scoresData.data || [];
        setScores(s);
        setStats({
          tickets: s.reduce((acc: number, s: any) => acc + (s.ticketsAwarded || 0), 0) || 0,
          winnings: 0,
          impact: (s.length || 0) * 5,
          renewDays: 12,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const containerStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (loading) {
     return (
       <div className="p-12 flex flex-col gap-8 animate-pulse">
         <div className="h-12 w-64 bg-white/5 rounded-2xl" />
         <div className="grid grid-cols-3 gap-6">
           {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[2rem]" />)}
         </div>
         <div className="h-[400px] bg-white/5 rounded-[2rem]" />
       </div>
     )
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            System Overview.
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Welcome back, <span className="text-[#3B82F6]">{user?.name}</span> • Live Feed Active
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/scores">
            <Button variant="neon" size="lg" className="rounded-2xl shadow-neon">
              <PlusCircle className="mr-2 h-5 w-5" /> Log Score
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* 3 Metric Cards */}
      <motion.div 
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Subscription Card */}
        <motion.div variants={itemFadeUp}>
          <Card className="p-8 group h-full flex flex-col justify-between border-white/5 hover:border-[#3B82F6]/30">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-black uppercase tracking-widest border border-[#10B981]/20 success-glow">
                Member Pro
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Membership Status</p>
              <h3 className="text-2xl font-black text-white mb-6">Impact Hero Pass</h3>
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" 
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Renewal Cycle</span>
                  <span className="text-[#3B82F6]">{stats.renewDays} Days Left</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Winnings Card (Gold) */}
        <motion.div variants={itemFadeUp}>
          <Card className="p-8 group h-full flex flex-col justify-between border-white/5 hover:border-[#FACC15]/30">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#FACC15] opacity-50" />
            </div>
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Total Winnings</p>
              <h3 className="text-5xl font-black text-white tracking-tighter flex items-baseline gap-2">
                <AnimatedCounter value={stats.winnings} prefix="$" />
                <span className="text-xs font-black text-[#FACC15] uppercase tracking-widest bg-[#FACC15]/10 px-2 py-0.5 rounded border border-[#FACC15]/20">+2.4%</span>
              </h3>
            </div>
          </Card>
        </motion.div>

        {/* Charity Card (Emerald) */}
        <motion.div variants={itemFadeUp}>
          <Card className="p-8 group h-full flex flex-col justify-between border-white/5 hover:border-[#10B981]/30">
            <div className="flex items-center justify-between mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 text-[#10B981] opacity-50 animate-pulse" />
            </div>
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Charity Impact</p>
              <h3 className="text-5xl font-black text-white tracking-tighter flex items-baseline gap-2">
                <AnimatedCounter value={stats.impact} prefix="$" />
                <span className="text-[10px] uppercase font-black text-[#10B981] tracking-widest">Raised</span>
              </h3>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Analytics Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="p-10 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-64 h-64 text-[#3B82F6]" />
          </div>
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h4 className="text-2xl font-black text-white tracking-tighter">Performance Matrix.</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Net tickets generated over last 7 days</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> This Week
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0A0A0A", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 900, fontSize: 12 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Feed & Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Ledger */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <h5 className="text-sm font-black uppercase tracking-[0.2em] text-white">Activity Ledger</h5>
            <Link href="/dashboard/scores" className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] hover:underline underline-offset-4">Explore History</Link>
          </div>
          <Card className="divide-y divide-white/5 border-white/10 overflow-hidden">
            {scores.length > 0 ? (
              scores.slice(0, 4).map((score, i) => (
                <div key={i} className="p-6 flex items-center justify-between bg-[#0A0A0A]/40 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all">
                      <Ticket className="w-5 h-5 text-slate-400 group-hover:text-[#3B82F6]" />
                    </div>
                    <div>
                      <h6 className="text-white font-black tracking-tight">{score.courseName || "Charity Round"}</h6>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">
                        {new Date(score.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white tracking-tighter">{score.score} pts</div>
                    <p className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest">+{score.ticketsAwarded} Tickets</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No Recent Data Found</div>
            )}
          </Card>
        </motion.div>

        {/* Next Draw Target */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
           <div className="flex items-center justify-between mb-6 px-1">
            <h5 className="text-sm font-black uppercase tracking-[0.2em] text-white">Draw Liquidity</h5>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Pool</span>
            </div>
          </div>
          <Card className="p-10 bg-gradient-to-br from-[#3B82F6]/10 to-transparent border-[#3B82F6]/20 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#3B82F6]/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3B82F6] mb-6">Upcoming Prize</p>
              <h6 className="text-8xl font-black text-white tracking-tighter mb-8 group-hover:scale-105 transition-transform duration-500">
                <AnimatedCounter value={10000} prefix="$" />
              </h6>
              
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-10 w-fit">
                <div className="flex items-center -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-slate-800" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-300 tracking-tight">820 members entered</span>
              </div>

              <Link href="/dashboard/draw" className="w-full">
                <Button variant="neon" size="lg" className="w-full rounded-2xl h-16 text-lg shadow-neon">
                  Enter Draw <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
