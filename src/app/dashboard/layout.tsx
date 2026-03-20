"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Award, History, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Scores", href: "/dashboard/scores", icon: Award },
    { name: "Draw History", href: "/dashboard/draws", icon: History },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden pt-20">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 md:flex flex-col border-r border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto py-8 px-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors relative group",
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("h-5 w-5 relative z-10", isActive && "text-blue-400")} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 w-full transition-colors">
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-0 hide-scrollbar">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/5 flex justify-around p-3 z-50">
         {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg relative",
                  isActive ? "text-blue-400" : "text-slate-500"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-t-full"
                  />
                )}
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
