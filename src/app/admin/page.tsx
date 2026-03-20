"use client";

import { useState } from "react";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, DollarSign, Activity, PlayCircle, Anchor, TrendingUp, AlertCircle, Heart } from "lucide-react";

const revenueData = [
  { name: 'Jan', value: 4000 }, { name: 'Feb', value: 5500 },
  { name: 'Mar', value: 4800 }, { name: 'Apr', value: 7200 },
  { name: 'May', value: 8500 }, { name: 'Jun', value: 10200 },
];

const charityData = [
  { name: 'Water', amount: 4500 }, { name: 'Edu', amount: 3200 },
  { name: 'Wildlife', amount: 2100 }, { name: 'Social', amount: 5800 },
  { name: 'Health', amount: 6200 },
];

const recentUsers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", status: "Active", plan: "Pro", date: "2023-10-24" },
  { id: 2, name: "Sarah Williams", email: "sarah@example.com", status: "Inactive", plan: "Basic", date: "2023-10-23" },
  { id: 3, name: "Mike Chen", email: "mike@example.com", status: "Active", plan: "Pro", date: "2023-10-23" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", status: "Active", plan: "Premium", date: "2023-10-22" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              {['overview', 'users', 'draws', 'charities', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  {tab === 'overview' && <Activity className="h-5 w-5" />}
                  {tab === 'users' && <Users className="h-5 w-5" />}
                  {tab === 'draws' && <PlayCircle className="h-5 w-5" />}
                  {tab === 'charities' && <Anchor className="h-5 w-5" />}
                  {tab === 'settings' && <Settings className="h-5 w-5" />}
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Admin Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white capitalize">{activeTab} Dashboard</h1>
            <Button variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800">
               Export Report
            </Button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: "$42,500", icon: DollarSign, trend: "+12.5%", color: "text-blue-400" },
                  { label: "Active Subs", value: "8,204", icon: Users, trend: "+4.2%", color: "text-purple-400" },
                  { label: "Draw Pool", value: "$15,200", icon: PlayCircle, trend: "+8.1%", color: "text-yellow-400" },
                  { label: "Charity Raised", value: "$124k", icon: Heart, trend: "+15.3%", color: "text-green-400" },
                ].map(stat => (
                  <Card key={stat.label} variant="solid" className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg bg-slate-800 ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                        <TrendingUp className="h-3 w-3 mr-1" /> {stat.trend}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card variant="solid" className="p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-6">Revenue Growth</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card variant="solid" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Charity Distribution</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charityData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#64748b" axisLine={false} tickLine={false} width={60} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                           cursor={{fill: '#1e293b'}}
                        />
                        <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Data Table */}
              <Card variant="solid" className="overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Recent Subscribers</h3>
                  <Button variant="outline" size="sm" className="text-xs">View All</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Plan</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Joined</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-slate-500 text-xs">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">{user.plan}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{user.date}</td>
                          <td className="px-6 py-4">
                            <button className="text-blue-400 hover:text-blue-300 font-medium text-xs">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'draws' && (
            <div className="space-y-6">
              <Card className="p-8 border-yellow-500/20 bg-yellow-500/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                      <AlertCircle className="text-yellow-500 h-6 w-6" /> Main Draw Control
                    </h2>
                    <p className="text-slate-400 max-w-xl">
                      Triggering the draw will select random winners from the current pool and automatically distribute funds and notify winners. This action cannot be undone.
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">$15,200 Pool</div>
                    <Button variant="neon" size="lg" className="w-full sm:w-auto">
                       Execute Monthly Draw
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Draw Settings inside Draw Tab */}
               <Card variant="solid" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Draw Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm text-slate-400 block">Number of Winners</label>
                       <input type="number" defaultValue={5} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-slate-400 block">Charity Split (%)</label>
                       <input type="number" defaultValue={20} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
               </Card>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['users', 'charities', 'settings'].includes(activeTab) && (
            <Card variant="solid" className="p-12 text-center text-slate-400 border-dashed border-2 border-slate-800">
               {activeTab} management interface coming soon.
            </Card>
          )}

        </main>
      </div>
    </div>
  );
}
