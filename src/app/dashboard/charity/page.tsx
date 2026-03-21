"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Globe, 
  BookOpen, 
  Heart, 
  Droplets, 
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHARITIES = [
  { id: 1, name: "Global Clean Water Fund", category: "Environment", icon: Droplets, impact: "$42,500", desc: "Providing clean drinking water to remote villages via sustainable solar-powered filtration systems.", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", websiteUrl: "https://www.charitywater.org", donateUrl: "https://www.charitywater.org/donate" },
  { id: 2, name: "Kids Education First", category: "Education", icon: BookOpen, impact: "$89,200", desc: "Building modular schools and supplying high-tech educational materials to underfunded regions.", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", websiteUrl: "https://www.unicef.org", donateUrl: "https://www.unicef.org/donate" },
  { id: 3, name: "Wildlife Rescue & Rehab", category: "Environment", icon: Leaf, impact: "$21,400", desc: "Protecting endangered species and restoring critical habitats through community-led conservation.", color: "text-[#FACC15]", bg: "bg-[#FACC15]/10", websiteUrl: "https://www.worldwildlife.org", donateUrl: "https://secure.worldwildlife.org/donations" },
  { id: 4, name: "Heart for the Homeless", category: "Social", icon: Heart, impact: "$115,000", desc: "Providing immediate shelter, nutritious food, and long-term vocational training programs.", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", websiteUrl: "https://www.feedingamerica.org", donateUrl: "https://give.feedingamerica.org/" },
  { id: 5, name: "Ocean Cleanup Initiative", category: "Environment", icon: Droplets, impact: "$65,000", desc: "Deploying advanced interceptor technology to extract plastic waste from the world's most polluted rivers.", color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10", websiteUrl: "https://theoceancleanup.com", donateUrl: "https://theoceancleanup.com/donate" },
  { id: 6, name: "Medical Aid Global", category: "Health", icon: Stethoscope, impact: "$210,000", desc: "Delivering emergency medical relief and essential healthcare services in active global crisis zones.", color: "text-[#10B981]", bg: "bg-[#10B981]/10", websiteUrl: "https://www.msf.org", donateUrl: "https://donate.doctorswithoutborders.org" },
];

export default function CharityHubPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharity, setSelectedCharity] = useState<number | null>(null);

  const categories = ["All", "Environment", "Education", "Social", "Health"];

  const filteredCharities = CHARITIES.filter(c => 
    (selectedCategory === "All" || c.category === selectedCategory) &&
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Charity Hub.
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Verified Impact Partners Only
          </p>
        </div>
        
        <div className="flex gap-4">
           <Card className="px-8 py-4 border-[#10B981]/20 bg-[#10B981]/5 flex flex-col items-end">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Network Impact</p>
              <p className="text-3xl font-black text-[#10B981] tracking-tighter tracking-tighter">$3.2M+</p>
           </Card>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-y border-white/5 py-8">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-[#3B82F6] transition-colors" />
          <input 
            type="text" 
            placeholder="Search verified partners..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 placeholder:text-slate-700 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                selectedCategory === cat 
                  ? "bg-[#3B82F6] text-white shadow-neon" 
                  : "bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCharities.map((charity) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={charity.id}
            >
              <Card 
                className="p-8 h-full flex flex-col cursor-pointer border-white/5 hover:border-[#3B82F6]/30 transition-all group bg-[#0A0A0A]/40"
                onClick={() => setSelectedCharity(charity.id)}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110", charity.bg, charity.color)}>
                    <charity.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    {charity.category}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-[#3B82F6] transition-colors">{charity.name}</h3>
                <p className="text-slate-500 font-medium leading-relaxed flex-1 line-clamp-3 mb-8 tracking-tight">{charity.desc}</p>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Contribution</span>
                  <span className={cn("text-lg font-black tracking-tighter", charity.color)}>{charity.impact}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCharity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedCharity(null)}
               className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
             />
             <motion.div 
               initial={{ scale: 0.95, y: 20, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.95, y: 20, opacity: 0 }}
               onClick={e => e.stopPropagation()}
               className="w-full max-w-[40rem] bg-[#0A0A0A] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
             >
                <button 
                  onClick={() => setSelectedCharity(null)}
                  className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all z-20"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {(() => {
                  const c = CHARITIES.find(x => x.id === selectedCharity);
                  if (!c) return null;
                  return (
                    <div className="flex flex-col">
                      <div className="h-48 bg-gradient-to-br from-[#3B82F6]/20 via-[#8B5CF6]/10 to-transparent relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
                          <c.icon className="w-64 h-64 text-white" />
                        </div>
                        <div className={cn("absolute bottom-0 left-12 translate-y-1/2 p-6 rounded-[2rem] border-8 border-[#0A0A0A] shadow-2xl", c.bg, c.color)}>
                          <c.icon className="w-10 h-10" />
                        </div>
                      </div>
                      
                      <div className="pt-20 p-12 space-y-10">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] px-3 py-1 bg-[#3B82F6]/10 rounded-full border border-[#3B82F6]/20">
                              Verified Partner
                            </span>
                          </div>
                          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{c.name}</h2>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed tracking-tight">{c.desc}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 pb-10 border-b border-white/5">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Impact Funding</p>
                             <p className={cn("text-3xl font-black tracking-tighter", c.color)}>{c.impact}</p>
                          </div>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Transparency Score</p>
                             <div className="flex gap-1">
                               {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />)}
                             </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            className="flex-[2] h-16 rounded-2xl shadow-neon text-lg" 
                            variant="neon"
                            onClick={() => window.open(c.donateUrl, '_blank')}
                          >
                            Authorize Donation <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                          <Button 
                            className="flex-1 h-16 rounded-2xl border-white/10 group" 
                            variant="outline"
                            onClick={() => window.open(c.websiteUrl, '_blank')}
                          >
                            Explore Site <ExternalLink className="ml-2 w-4 h-4 group-hover:text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
