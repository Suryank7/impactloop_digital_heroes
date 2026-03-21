"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Trophy, Heart, Users, ArrowRight, Play, Ticket, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const containerStagger: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemFadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] selection:bg-[#3B82F6]/30 selection:text-white noise-bg">
      
      {/* 1. HERO SECTION (BEHANCE STORYTELLING) */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[90vh] z-10">
        {/* Deep Depth Layers */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-[#3B82F6]/10 via-transparent to-[#8B5CF6]/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6]/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerStagger}
          className="flex flex-col items-center text-center space-y-8"
        >
          <motion.div variants={itemFadeUp} className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-neon flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#3B82F6]">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Global Impact</span>
          </motion.div>

          <motion.h1 variants={itemFadeUp} className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-white">
            PLAY. WIN.<br/>
            <span className="text-gradient">GIVE BACK.</span>
          </motion.h1>

          <motion.p variants={itemFadeUp} className="max-w-2xl text-xl md:text-2xl text-slate-400 font-medium leading-relaxed tracking-tight">
            Stop playing for points. Start playing for <span className="text-white font-bold">real impact</span>. Join 8,000+ members winning cash while funding world-changing charities.
          </motion.p>

          <motion.div variants={itemFadeUp} className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link href="/signup">
              <Button variant="neon" size="lg" className="h-20 px-12 text-xl shadow-neon">
                Get Started <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="glass" size="lg" className="h-20 px-12 text-xl group">
                How It Works <Play className="ml-2 w-5 h-5 group-hover:fill-white transition-all" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Global Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* 2. LIVE STATS SECTION (REVOLUT STYLE) */}
      <section className="py-32 relative border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { label: "Global Prize Pool", value: 42500, prefix: "$", color: "text-[#FACC15]", icon: Trophy },
              { label: "Impact Donations", value: 124000, prefix: "$", color: "text-[#10B981]", icon: Heart },
              { label: "Active Members", value: 8204, prefix: "", color: "text-[#3B82F6]", icon: Users },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemFadeUp} className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                </div>
                <dt className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</dt>
                <dd className={cn("text-7xl font-black tracking-tighter", stat.color)}>
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} />
                </dd>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. NARRATIVE "HOW IT WORKS" (LINEAR STYLE) */}
      <section id="how-it-works" className="py-40 relative px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#3B82F6] mb-4">The Architecture of Impact</h2>
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-3xl">
              Turn every activity <br/>
              into a <span className="text-gradient">force for good</span>.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01",
                title: "Log Your Activities", 
                desc: "Every score logged, every metric tracked earns you high-value draw tickets. Your performance is now your impact currency.",
                icon: Ticket,
                gradient: "from-blue-500/10 to-transparent"
              },
              { 
                step: "02",
                title: "The Premium Draw", 
                desc: "Automatic entry into premium monthly prize pools. Our high-transparency lottery system ensures fairness and excitement.",
                icon: Sparkles,
                gradient: "from-purple-500/10 to-transparent"
              },
              { 
                step: "03",
                title: "Win & Empower", 
                desc: "Win substantial cash prizes. A built-in percentage is matched directly to our world-class charity partners.",
                icon: Gift,
                gradient: "from-emerald-500/10 to-transparent"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Card className={cn("group h-full p-10 bg-gradient-to-br", item.gradient)}>
                  <span className="text-6xl font-black text-white/5 absolute top-4 right-8 group-hover:text-[#3B82F6]/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-3xl font-black text-white mb-4 tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHARITY SHOWCASE (BEHANCE STYLE) */}
      <section className="py-40 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#10B981]">Direct Partners</h2>
            <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
              Real world impact.<br/>
              Verified by data.
            </h3>
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {['Clean Water', 'Global Education', 'Ocean Cleanup', 'Reforestation'].map((tag) => (
                <span key={tag} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. FINAL CASE STUDY CTA */}
      <section className="py-40 relative px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[4rem] p-24 relative overflow-hidden text-center glass-panel border border-[#3B82F6]/20 shadow-neon"
        >
          {/* Neon Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/10 blur-[120px] rounded-full -z-10" />
          
          <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-10 leading-[0.85]">
            BECOME THE<br/>
            <span className="text-gradient">DIGITAL HERO.</span>
          </h2>
          <p className="text-2xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto tracking-tight">
            The platform is ready. The prize pool is waiting. The impact is exponential.
          </p>
          <Link href="/signup">
            <Button variant="neon" size="lg" className="h-24 px-16 text-2xl shadow-neon group">
              Join the Movement <ArrowRight className="ml-2 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FOOTER (MINIMAL CASE STUDY STYLE) */}
      <footer className="py-20 border-t border-white/5 mx-auto max-w-7xl px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">ImpactLoop</span>
        </div>
        <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">
          © 2026 Crafted with Passion for High Impact
        </p>
        <div className="flex gap-8">
          {['T&C', 'Privacy', 'Contact'].map(link => (
            <Link key={link} href="#" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              {link}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
