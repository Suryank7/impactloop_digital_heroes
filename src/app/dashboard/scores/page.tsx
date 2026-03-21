"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  MapPin, 
  Loader2, 
  History, 
  Ticket,
  Plus,
  ArrowRight,
  TrendingUp,
  Map,
  Calendar,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

export default function ScoresPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    score: "",
    playedAt: new Date().toISOString().split('T')[0]
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores");
      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }
      const s = data.scores || data.data || [];
      setScores(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleLogScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          score: parseInt(formData.score)
        }),
      });
      if (res.ok) {
        setIsLogging(false);
        setFormData({ courseName: "", score: "", playedAt: new Date().toISOString().split('T')[0] });
        fetchScores();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const chartData = [...scores].reverse().map(s => ({
    date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.score
  }));

  if (loading) return (
    <div className="p-12 space-y-12 animate-pulse">
      <div className="h-16 w-64 bg-white/5 rounded-2xl" />
      <div className="h-[300px] w-full bg-white/5 rounded-[2rem]" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Activity Hub.
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Performance Ledger • {scores.length} Records Detected
          </p>
        </div>
        <Button 
          onClick={() => setIsLogging(true)}
          variant="neon" 
          size="lg"
          className="rounded-2xl shadow-neon h-16 px-8"
        >
          <Plus className="mr-2 h-6 w-6" /> Log New Round
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Performance & Ledger */}
        <div className="lg:col-span-2 space-y-12">
          {/* Neon Chart */}
          <Card className="p-10 border-white/5 bg-[#0A0A0A]/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp className="w-32 h-32 text-[#3B82F6]" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#3B82F6]" /> Performance Vector
              </h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-neon" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Points</span>
                 </div>
              </div>
            </div>
            <div className="h-[280px] w-full relative z-10">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 800 }} 
                      dy={10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }}
                      itemStyle={{ color: "#fff", fontWeight: 900, fontSize: 12 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-[2rem] text-slate-600 font-bold uppercase tracking-widest text-xs">
                  Insufficient data for visualization
                </div>
              )}
            </div>
          </Card>

          {/* Ledger */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#3B82F6]" /> Transaction History
            </h4>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {scores.map((score, i) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-8 group hover:border-[#3B82F6]/30 transition-all bg-[#0A0A0A]/40 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Map className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <div>
                          <h5 className="text-xl font-black text-white tracking-tight">{score.courseName}</h5>
                          <div className="flex items-center gap-4 mt-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                               <Calendar className="w-3.5 h-3.5" /> {new Date(score.createdAt).toLocaleDateString()}
                             </span>
                             <span className="px-2 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-black uppercase tracking-widest border border-[#3B82F6]/20 shadow-neon">
                               +{score.ticketsAwarded} Tickets
                             </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-4xl font-black text-white tracking-tighter tabular-nums">{score.score}</div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] opacity-50">STABLEFORD</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-[#3B82F6]/10 to-transparent border-[#3B82F6]/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-24 h-24 text-[#3B82F6]" />
             </div>
             <h4 className="text-xl font-black text-white mb-4 tracking-tight">Reward Brackets.</h4>
             <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
               Your performance directly converts into draw probability. Aim for the Master bracket.
             </p>
             <div className="space-y-3">
               {[
                 { label: "Master", pts: "35-45", tickets: "+3", color: "text-[#FACC15]" },
                 { label: "Pro", pts: "25-34", tickets: "+2", color: "text-white" },
                 { label: "Beginner", pts: "1-24", tickets: "+1", color: "text-slate-500" },
               ].map(b => (
                 <div key={b.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div>
                      <span className={cn("text-xs font-black uppercase tracking-widest", b.color)}>{b.label}</span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{b.pts} PTS</p>
                    </div>
                    <span className="text-lg font-black text-[#3B82F6]">{b.tickets}</span>
                 </div>
               ))}
             </div>
          </Card>

          <Card className="p-8 border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                <Activity className="w-16 h-16 text-emerald-500" />
             </div>
             <h4 className="text-xl font-black text-white mb-6 tracking-tight">Season Stats.</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Avg Vector</p>
                   <p className="text-3xl font-black text-white tracking-tighter">
                     {scores.length > 0 ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1) : "-"}
                   </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Logs</p>
                   <p className="text-3xl font-black text-white tracking-tighter">{scores.length}</p>
                </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Logging Modal */}
      <AnimatePresence>
        {isLogging && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsLogging(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-xl relative z-10"
             >
                <Card className="p-12 border-white/10 bg-[#0A0A0A] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <Plus className="w-64 h-64 text-[#3B82F6]" />
                   </div>
                   
                   <h2 className="text-4xl font-black text-white tracking-tighter mb-10">Record Activity.</h2>
                   <form onSubmit={handleLogScore} className="space-y-10 relative z-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Facility / Course Name</Label>
                        <Input 
                          placeholder="Search or enter location..."
                          className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-xl font-bold placeholder:text-slate-700"
                          value={formData.courseName}
                          onChange={e => setFormData({...formData, courseName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stableford Points</Label>
                          <Input 
                            type="number"
                            min="1"
                            max="45"
                            placeholder="1-45"
                            className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-2xl font-black text-[#3B82F6]"
                            value={formData.score}
                            onChange={e => setFormData({...formData, score: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Execution Date</Label>
                          <Input 
                            type="date"
                            className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold"
                            value={formData.playedAt}
                            onChange={e => setFormData({...formData, playedAt: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="p-8 rounded-[2rem] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center">
                               <Ticket className="h-6 w-6 text-[#3B82F6]" />
                            </div>
                            <span className="text-lg font-black text-white tracking-tight">Reward Potential</span>
                         </div>
                         <span className="text-4xl font-black text-[#3B82F6]">
                            {parseInt(formData.score) >= 35 ? "+3" : parseInt(formData.score) >= 25 ? "+2" : parseInt(formData.score) > 0 ? "+1" : "0"}
                            <span className="text-xs ml-2 opacity-50 uppercase tracking-widest">Tickets</span>
                         </span>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button type="button" onClick={() => setIsLogging(false)} variant="ghost" className="flex-1 h-16 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:text-white">
                          Discard
                        </Button>
                        <Button type="submit" disabled={submitLoading} variant="neon" className="flex-[2] h-16 rounded-2xl shadow-neon text-lg">
                          {submitLoading ? <Loader2 className="animate-spin" /> : "Authorize Entry"}
                        </Button>
                      </div>
                   </form>
                </Card>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
