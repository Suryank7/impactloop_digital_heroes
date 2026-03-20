"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Globe, BookOpen, Heart, Droplets, X } from "lucide-react";

const CHARITIES = [
  { id: 1, name: "Global Clean Water Fund", category: "Environment", icon: Droplets, impact: "$42k raised", desc: "Providing clean drinking water to remote villages.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: 2, name: "Kids Education First", category: "Education", icon: BookOpen, impact: "$89k raised", desc: "Building schools and supplying educational materials.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: 3, name: "Wildlife Rescue & Rehab", category: "Environment", icon: Globe, impact: "$21k raised", desc: "Protecting endangered species and their habitats.", color: "text-green-400", bg: "bg-green-500/10" },
  { id: 4, name: "Heart for the Homeless", category: "Social", icon: Heart, impact: "$115k raised", desc: "Providing shelter, food, and job training.", color: "text-red-400", bg: "bg-red-500/10" },
  { id: 5, name: "Ocean Cleanup Initiative", category: "Environment", icon: Droplets, impact: "$65k raised", desc: "Removing plastic waste from the world's oceans.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: 6, name: "Medical Aid Without Borders", category: "Health", icon: Heart, impact: "$210k raised", desc: "Emergency medical relief in crisis zones.", color: "text-red-400", bg: "bg-red-500/10" },
];

export default function CharitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharity, setSelectedCharity] = useState<number | null>(null);

  const categories = ["All", "Environment", "Education", "Social", "Health"];

  const filteredCharities = CHARITIES.filter(c => 
    (selectedCategory === "All" || c.category === selectedCategory) &&
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
             Your <span className="text-gradient">Impact</span> Partners
           </h1>
           <p className="text-slate-400 text-lg max-w-2xl">
             Explore the incredible organizations we support. Every time you play, a portion goes directly to these verified charities.
           </p>
        </div>
        
        {/* Global Impact Stats */}
        <div className="flex gap-4">
           <Card className="px-6 py-4 border-green-500/20 bg-green-500/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Impact</p>
              <p className="text-2xl font-bold text-green-400">$3.2M+</p>
           </Card>
           <Card className="px-6 py-4 border-blue-500/20 bg-blue-500/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Charities</p>
              <p className="text-2xl font-bold text-blue-400">24 Active</p>
           </Card>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search charities..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter className="h-5 w-5 text-slate-400 mr-2" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charity Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCharities.map((charity) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={charity.id}
            >
              <Card 
                className="p-6 h-full flex flex-col cursor-pointer border-transparent hover:border-slate-700 transition-all group"
                onClick={() => setSelectedCharity(charity.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${charity.bg} ${charity.color}`}>
                    <charity.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                    {charity.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{charity.name}</h3>
                <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-2">{charity.desc}</p>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-300">Total Raised</span>
                  <span className={`font-bold ${charity.color}`}>{charity.impact}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Simple Modal overlay for selected charity */}
      <AnimatePresence>
        {selectedCharity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCharity(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedCharity(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-slate-300 hover:text-white hover:bg-black/40 transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              
              {(() => {
                const c = CHARITIES.find(x => x.id === selectedCharity);
                if (!c) return null;
                return (
                  <>
                    <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative">
                       <div className={`absolute -bottom-8 left-6 p-4 rounded-2xl ${c.bg} ${c.color} border-4 border-slate-900`}>
                          <c.icon className="h-8 w-8" />
                       </div>
                    </div>
                    <div className="pt-12 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-white">{c.name}</h2>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                          {c.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">{c.desc}</p>
                      
                      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-medium text-slate-300">Community Impact</span>
                           <span className={`font-bold ${c.color}`}>{c.impact}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className={`h-2 rounded-full ${c.color.replace('text-', 'bg-')}`} style={{ width: '75%' }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">75% of funding goal reached</p>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1" variant="neon">Donate Directly</Button>
                        <Button className="flex-1 border-slate-700" variant="outline">Learn More</Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
