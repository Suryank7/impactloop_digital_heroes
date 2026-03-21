"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Trophy, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Received non-JSON response from server");
      }
      
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // On success, redirect to Stripe checkout or Dashboard
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10"
      >
        <Card className="p-8 border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Join ImpactLoop</h1>
            <p className="text-slate-400 font-medium">Subscription-based golf with a soul.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { icon: ShieldCheck, text: "Entry into Draws", color: "text-blue-400" },
                    { icon: Heart, text: "Charity Impact", color: "text-emerald-400" },
                    { icon: Trophy, text: "Cash Prizes", color: "text-yellow-500" },
                  ].map((feat, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <feat.icon className={`h-6 w-6 mx-auto mb-2 ${feat.color}`} />
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">{feat.text}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-10 rounded-xl bg-slate-950/50 border-white/10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 h-10 rounded-xl bg-slate-950/50 border-white/10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-10 rounded-xl bg-slate-950/50 border-white/10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.name || !formData.email || !formData.password}
                  className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all group"
                >
                  Choose Membership <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8 bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Trophy className="h-24 w-24 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">Impact Pass</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-white">$10</span>
                    <span className="text-sm font-bold text-slate-500">/ month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {["Log up to 5 scores/month", "Auto-entry into $10,000 Draws", "25% prize pool goes to Charity", "Instant Pro Dashboard access"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-white text-[#020617] hover:bg-slate-200 font-black transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Subscribe & Sign Up"}
                  </Button>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Back to Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs font-medium text-slate-500">
            Already have an account?{" "}
            <button onClick={() => router.push("/login")} className="text-blue-400 font-bold hover:underline">Log In</button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
