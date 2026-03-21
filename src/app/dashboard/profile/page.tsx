"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  Heart, 
  ChevronRight, 
  History, 
  LogOut, 
  Loader2,
  ExternalLink,
  Zap,
  Bell,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe/portal");
      const contentType = res.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="p-12 space-y-12 animate-pulse">
      <div className="h-16 w-64 bg-white/5 rounded-2xl" />
      <div className="grid grid-cols-3 gap-8">
        <div className="h-[400px] bg-white/5 rounded-[3rem]" />
        <div className="col-span-2 h-[400px] bg-white/5 rounded-[3rem]" />
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
            Account Intel.
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" /> Security Clearance: Verified Member
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="rounded-2xl h-14 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 px-8 font-black uppercase tracking-widest text-xs"
        >
          <LogOut className="mr-2 h-4 w-4" /> Terminate Session
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Identity */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-10 border-white/5 bg-[#0A0A0A]/40 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                <Settings className="w-48 h-48 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-1 mb-8 shadow-neon group-hover:scale-105 transition-transform">
                   <div className="w-full h-full rounded-[2.3rem] bg-[#0A0A0A] flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{user?.name}</h3>
                <p className="text-slate-500 font-bold tracking-tight mb-6">{user?.email}</p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#10B981]/10 rounded-full border border-[#10B981]/20 text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] success-glow">
                   <Zap className="w-3 h-3" /> Impact Elite
                </div>
             </div>
          </Card>

          <Card className="p-8 border-white/5 bg-[#0A0A0A]/40 space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Integrations</h4>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                         <Heart className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <span className="text-sm font-black text-white tracking-tight">Charity Ledger</span>
                   </div>
                   <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center group hover:bg-white/5 transition-colors cursor-pointer">
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">+ Connect External Provider</span>
                </div>
             </div>
          </Card>
        </div>

        {/* Subscription & Advanced Intel */}
        <div className="lg:col-span-2 space-y-12">
           {/* Pro Tier (Stripe Style) */}
           <Card className="p-10 border-[#3B82F6]/20 bg-gradient-to-br from-[#3B82F6]/10 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#3B82F6]/10 blur-[120px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="space-y-6 max-w-md">
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 bg-[#3B82F6]/20 rounded-lg text-[#3B82F6] text-[10px] font-black uppercase tracking-widest border border-[#3B82F6]/30">
                          Active License
                       </div>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-none">IMPACT PASS<br/><span className="text-[#3B82F6]">VERSION 4.2</span></h2>
                    <ul className="space-y-4">
                       <li className="flex items-center gap-3 text-slate-400 font-bold tracking-tight">
                          <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-neon" />
                          Priority ticket allocation for all major draws
                       </li>
                       <li className="flex items-center gap-3 text-slate-400 font-bold tracking-tight">
                          <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-neon" />
                          Unlimited score verification logs
                       </li>
                    </ul>
                    <div className="flex items-center gap-10 pt-4">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Rate</p>
                          <p className="text-2xl font-black text-white">$10.00 <span className="text-xs opacity-50">/MO</span></p>
                       </div>
                       <div className="w-px h-10 bg-white/10" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Next Epoch</p>
                          <p className="text-2xl font-black text-white">Nov 12, 2026</p>
                       </div>
                    </div>
                 </div>
                 
                 <Button 
                    onClick={handlePortal}
                    disabled={loading}
                    variant="neon" 
                    className="w-full md:w-auto h-20 px-12 rounded-[2rem] shadow-neon text-lg group"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : (
                       <span className="flex items-center gap-2">AUTHORIZE PORTAL <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                    )}
                 </Button>
              </div>
           </Card>

           {/* Preference Blocks */}
           <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 px-1">
                 <Lock className="w-4 h-4 text-slate-500" /> SYSTEM CONFIGURATION
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { title: "Notification Protocol", desc: "Manage high-priority draw alerts", icon: Bell },
                   { title: "Privacy Encryption", desc: "Digital identity & ranking visibility", icon: ShieldCheck },
                   { title: "Historical Records", desc: "Full cryptographic activity ledger", icon: History },
                   { title: "System Preferences", desc: "Application interface & experience", icon: Settings },
                 ].map((row, i) => (
                   <div 
                     key={i} 
                     className="p-8 flex items-center justify-between bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center group-hover:bg-[#3B82F6]/10 transition-colors">
                            <row.icon className="w-6 h-6 text-slate-500 group-hover:text-[#3B82F6]" />
                         </div>
                         <div>
                            <p className="text-white font-black tracking-tight">{row.title}</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{row.desc}</p>
                         </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
