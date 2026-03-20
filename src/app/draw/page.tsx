"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Trophy, Heart } from "lucide-react";

export default function DrawPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpinning) {
      // Faster, more dramatic tick
      interval = setInterval(() => {
        setDisplayNumbers(Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)));
      }, 40);
      
      // Stop spinning after 3.5 seconds of intense tension
      setTimeout(() => {
        clearInterval(interval);
        setIsSpinning(false);
        setResult([7, 2, 9, 4, 1]);
        setDisplayNumbers([7, 2, 9, 4, 1]);
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

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background tension/glow effects */}
      <AnimatePresence>
        {!result && (
          <motion.div 
            initial={{ opacity: 0.5 }}
            animate={isSpinning ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" 
          />
        )}
      </AnimatePresence>

      {showConfetti && (
         <motion.div 
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-yellow-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" 
         />
      )}
      
      {isSpinning && (
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Visual scanlines/grid moving down to create tension */}
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:100%_4px] animate-[slide_10s_linear_infinite]" />
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center z-10"
      >
        <motion.span 
           animate={isSpinning ? { opacity: [1, 0.5, 1] } : {}}
           transition={{ duration: 0.5, repeat: Infinity }}
           className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs mb-6 block"
        >
          {isSpinning ? 'System Processing...' : 'November Grand Draw'}
        </motion.span>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-10 drop-shadow-2xl">
          The Moment of <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Truth</span>
        </h1>
        
        <Card variant={result ? "neonOutline" : "glass"} interactive={!isSpinning} className="p-8 md:p-16 mb-10 relative overflow-hidden backdrop-blur-3xl border-white/10 shadow-2xl">
          
          {/* Tension pulsing borders inside card while spinning */}
          {isSpinning && (
            <motion.div 
              className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl pointer-events-none"
              animate={{ opacity: [0, 1, 0], scale: [0.98, 1.02, 1.05] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          <div className="flex justify-center gap-3 md:gap-5 mb-10">
            {displayNumbers.map((num, i) => (
              <motion.div
                key={i}
                className={`w-16 h-24 md:w-28 md:h-40 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden ${result ? 'shadow-[0_0_30px_rgba(250,204,21,0.2)] border-yellow-500/30' : ''}`}
                animate={isSpinning ? { y: [0, -15, 0, 15, 0] } : { y: 0 }}
                transition={isSpinning ? { repeat: Infinity, duration: 0.15, delay: i * 0.03 } : { type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                <motion.span 
                  key={num + "-" + i}
                  initial={{ opacity: 0, y: isSpinning ? 30 : -50, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${result ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'text-white'} z-0 relative`}
                >
                  {num}
                </motion.span>
                
                {result && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.15 + 0.5 }}
                    className="absolute inset-0 bg-yellow-400/10 pointer-events-none" 
                  />
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="start-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              >
                <Button 
                   variant="neon" 
                   size="lg" 
                   className={`h-16 px-12 text-xl font-bold w-full max-w-md ${isSpinning ? 'opacity-80' : 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]'}`}
                   onClick={startDraw}
                   disabled={isSpinning}
                >
                  {isSpinning ? (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8 }} className="tracking-widest">
                      SYSTEM LOCKED...
                    </motion.div>
                  ) : (
                    <>
                      <Play className="mr-3 h-6 w-6" /> Initiate Draw Sequence
                    </>
                  )}
                </Button>
                <p className="mt-5 text-sm font-semibold text-slate-500 uppercase tracking-wider">Authorizes 1 ticket</p>
              </motion.div>
            ) : (
              <motion.div
                key="result-msg"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="pt-4"
              >
                <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}
                   className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-yellow-400 font-bold text-lg tracking-widest uppercase">Match Verified</h3>
                </motion.div>
                <p className="text-white text-xl font-medium mb-3">You secured <strong className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-4xl font-black drop-shadow-md mx-2">$2,500</strong> this cycle!</p>
                <p className="text-emerald-400 flex items-center justify-center gap-2 font-medium">
                   <Heart className="w-5 h-5 fill-emerald-400" /> 
                   $250 impact transferred to Global Clean Water Fund.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
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
                className={`absolute w-4 h-4 rounded-sm ${['bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-emerald-400', 'bg-white'][Math.floor(Math.random() * 5)]} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
