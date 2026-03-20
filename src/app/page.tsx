"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Heart, Users, ArrowRight, Play, Ticket, Gift, Sparkles, CheckCircle2 } from "lucide-react";

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
    <div className="flex flex-col min-h-screen pt-20 overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Global abstract premium noise */}
      <div className="fixed inset-0 pointer-events-none z-[-5] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        
        {/* Dynamic Glowing Orbs Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 blur-[100px] rounded-full -z-10 animate-pulse pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerStagger}
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div variants={itemFadeUp} className="mb-8 inline-flex items-center rounded-full bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] group cursor-pointer hover:bg-blue-500/10 transition-colors">
            <Sparkles className="w-4 h-4 mr-2 text-blue-400 group-hover:animate-pulse" />
            <span>The new standard for charitable giving</span>
          </motion.div>
          
          <motion.h1 variants={itemFadeUp} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Play. <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">Win.</span> Give Back.
          </motion.h1>
          
          <motion.p variants={itemFadeUp} className="mt-2 text-xl sm:text-2xl leading-relaxed text-slate-300 mb-12 max-w-2xl font-medium">
            Join the ultimate platform rewarding your passion. Enter scores, win monthly cash prizes, and automatically fund life-changing charities.
          </motion.p>
          
          <motion.div variants={itemFadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="neon" size="lg" className="w-full sm:w-auto shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
               <Button variant="glass" size="lg" className="w-full sm:w-auto">
                 Explore the platform
               </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemFadeUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
             <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime</div>
             <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Secure payouts</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Social Proof (Premium Startup touch) */}
      <section className="relative py-10 border-y border-white/5 bg-slate-900/30 backdrop-blur-xl overflow-hidden flex items-center">
         <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#020617] to-transparent z-10" />
         <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#020617] to-transparent z-10" />
         <motion.div 
           className="flex gap-16 whitespace-nowrap px-8"
           animate={{ x: ["0%", "-50%"] }}
           transition={{ ease: "linear", duration: 30, repeat: Infinity }}
         >
           {[...Array(2)].map((_, i) => (
             <div key={i} className="flex gap-16 items-center text-slate-500 font-bold text-xl uppercase tracking-widest">
               <span className="flex items-center gap-2"><Heart className="w-6 h-6 text-slate-600"/> GLOBAL CLEAN WATER</span>
               <span className="flex items-center gap-2"><Trophy className="w-6 h-6 text-slate-600"/> $3.2M IN PRIZES</span>
               <span className="flex items-center gap-2"><Users className="w-6 h-6 text-slate-600"/> 8,000+ MEMBERS</span>
               <span className="flex items-center gap-2"><Gift className="w-6 h-6 text-slate-600"/> EDUCATION FIRST</span>
             </div>
           ))}
         </motion.div>
      </section>

      {/* Live Stats */}
      <section className="py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.dl 
             variants={containerStagger}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true, margin: "-100px" }}
             className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3"
          >
            {[
              { id: 1, name: "Monthly Prize Pool", value: "$42,500", icon: Trophy, color: "text-yellow-400", glow: "shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)]" },
              { id: 2, name: "Total Donated", value: "$124,000", icon: Heart, color: "text-emerald-400", glow: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]" },
              { id: 3, name: "Active Members", value: "8,204", icon: Users, color: "text-blue-400", glow: "shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]" },
            ].map((stat) => (
              <motion.div key={stat.id} variants={itemFadeUp} className="mx-auto flex max-w-xs flex-col gap-y-4 items-center">
                <div className={`p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md ${stat.color} ${stat.glow}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <dt className="text-base leading-7 text-slate-400 font-medium">{stat.name}</dt>
                <dd className="order-first text-6xl font-black tracking-tighter text-white">{stat.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest uppercase text-blue-400 mb-3">Simple Process</h2>
            <p className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Turn your scores into <br className="hidden md:block"/> global impact
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3 mx-auto"
          >
            {[
              { name: "01. Log Activities", description: "Use our hyper-fast, beautiful dashboard to log your scores. Every entry earns you highly valuable draw tickets.", icon: Play },
              { name: "02. Enter the Draw", description: "Your tickets automatically enter you into our premium monthly prize draws with verifiable randomization.", icon: Ticket },
              { name: "03. Win & Give", description: "Win substantial cash prizes. A built-in percentage is matched directly to our transparent charity partners.", icon: Gift },
            ].map((feature, idx) => (
              <motion.div key={feature.name} variants={itemFadeUp}>
                <Card variant="glass" className="h-full p-8 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="mb-8 p-4 inline-flex rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-white group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {feature.name}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Extreme CTA Section */}
      <section className="relative py-32 px-6 lg:px-8 mt-12 overflow-hidden mx-4 md:mx-auto max-w-6xl mb-24 rounded-[3rem] border border-white/10 glass-panel shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-900/40 mix-blend-overlay z-0" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-blue-500/30 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
            Stop playing for nothing.
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto">
            Join the platform that treats your achievements with the rewards and impact they deserve.
          </p>
          <Link href="/dashboard">
            <Button variant="neon" size="lg" className="h-16 px-12 text-xl shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] animate-pulse hover:animate-none">
              Start Free Trial Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
