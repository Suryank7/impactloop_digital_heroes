"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
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
      
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Set cookie or local state (handled by route.ts setting cookie)
      router.push("/dashboard");
      router.refresh(); // Force refresh to update navigation
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <div className="text-center mb-10">
             <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <ShieldCheck className="h-8 w-8 text-blue-400" />
             </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-400 font-medium text-sm">Sign in to manage your scores and draws.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
                  <button type="button" className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-10 rounded-xl bg-slate-950/50 border-white/10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all group"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <span className="flex items-center">
                  Secure Sign In <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-slate-500">
            New to ImpactLoop?{" "}
            <button onClick={() => router.push("/signup")} className="text-blue-400 font-bold hover:underline">Create Account</button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
