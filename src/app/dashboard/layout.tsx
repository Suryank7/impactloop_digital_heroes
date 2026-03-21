"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  User, 
  LogOut, 
  ChevronRight,
  Settings,
  HelpCircle,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const Sparkles = ({ className }: { className?: string }) => (
    <div className={cn("w-5 h-5 relative", className)}>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-[#3B82F6]/20 blur-sm rounded-full" 
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
      </div>
    </div>
  );

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Scores", href: "/dashboard/scores", icon: Trophy },
    { name: "Draw Results", href: "/dashboard/draw", icon: Sparkles },
    { name: "Charity Hub", href: "/dashboard/charity", icon: Heart },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] noise-bg">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 bottom-0 z-50 border-r border-white/5 bg-[#0A0A0A]/80 backdrop-blur-2xl flex flex-col pt-8 pb-4 transition-all"
      >
        <div className="px-6 mb-12 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-neon">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">ImpactLoop</span>
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isActive ? "bg-white/10 text-white shadow-neon" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-[#3B82F6]" : "group-hover:text-white")} />
                  {!isCollapsed && <span className="font-bold tracking-tight text-sm">{item.name}</span>}
                  {isActive && !isCollapsed && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-[#3B82F6] rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 space-y-2">
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <User className="w-5 h-5" />
              {!isCollapsed && <span className="font-bold tracking-tight text-sm">Account</span>}
            </div>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-bold tracking-tight text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-[280px]"
      )}>
        {children}
      </main>
    </div>
  );
}
