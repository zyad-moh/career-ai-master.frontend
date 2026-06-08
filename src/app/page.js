"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart
} from "recharts";
import { Sparkles, TrendingUp, TrendingDown, ArrowRight, UploadCloud, Target, Briefcase, FileSearch } from "lucide-react";
import Link from "next/link";
import { careerService } from "@/services/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await careerService.getDashboardStats();
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex h-16 w-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50"></span>
            <span className="relative inline-flex rounded-full h-16 w-16 bg-primary opacity-80 blur-sm"></span>
            <span className="absolute inset-0 flex items-center justify-center text-background font-bold text-xs z-10">AI</span>
          </div>
          <p className="text-primary tracking-widest uppercase text-sm animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Executive <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">Real-time analysis of your career trajectory and skill alignment.</p>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Resume Strength", value: data.resumeStrength + "%", trend: data.resumeStrengthTrend, icon: FileSearch },
          { title: "Skill Gap Score", value: data.skillGapScore + "%", trend: data.skillGapTrend, inverted: true, icon: Target },
          { title: "Avg. Job Match Rate", value: data.matchRate + "%", trend: data.matchRateTrend, icon: Briefcase }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -inset-10 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors -z-10" />

            <div className="flex justify-between items-start mb-4">
              <span className="text-muted-foreground font-medium">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-primary/70" />
            </div>

            <div className="flex items-end space-x-4">
              <span className="text-4xl font-extrabold text-foreground">{stat.value}</span>
              <div className={`flex items-center text-sm font-medium mb-1 ${stat.trend.startsWith('+') ? (stat.inverted ? 'text-red-400' : 'text-green-400') : (stat.inverted ? 'text-green-400' : 'text-red-400')
                }`}>
                {stat.trend.startsWith('+') ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
            <Target className="w-5 h-5 mr-2 text-primary" /> Skill Gap Analysis
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.skillGapAnalysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="target" fill="var(--muted-foreground)" opacity={0.3} radius={[4, 4, 0, 0]} name="Target Requirement" />
                <Bar dataKey="current" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Your Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Resume Evolution Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Resume Evolution
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.resumeEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0b1120', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Strength Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Suggestions & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI Suggestions List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 space-y-4"
        >
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <Sparkles className="w-5 h-5 mr-2 text-primary" /> A.I. Powered Suggestions
          </h3>
          {data.aiSuggestions.map((sug) => (
            <div key={sug.id} className="glass p-4 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${sug.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {sug.priority} Priority
                </span>
              </div>
              <p className="font-medium text-sm mb-3">{sug.title}</p>
              <button className="text-xs text-primary font-medium hover:text-foreground transition-colors flex items-center">
                {sug.action} <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Quick Access Bento Grid */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 grid grid-cols-2 gap-4"
        >
          <Link href="/cv-analyzer" className="glass p-6 rounded-2xl flex flex-col justify-center items-center text-center group hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold">Upload New Resume</h4>
            <p className="text-xs text-muted-foreground mt-2">Trigger deep NLP extraction.</p>
          </Link>
          <Link href="/job-matching" className="glass p-6 rounded-2xl flex flex-col justify-center items-center text-center group hover:bg-primary/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold">Job Matching</h4>
            <p className="text-xs text-muted-foreground mt-2">Find roles fitting your profile.</p>
          </Link>
          <Link href="/resume-optimizer" className="col-span-2 glass p-6 rounded-2xl flex items-center justify-between group hover:bg-primary/5 transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold">Resume Optimizer</h4>
                <p className="text-xs text-muted-foreground mt-1">Apply AI suggestions directly to your CV.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
