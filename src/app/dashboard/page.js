"use client";

import { motion } from "framer-motion";
import { PlusCircle, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const recentScans = [
    { id: 1, role: "Frontend Developer", company: "TechCorp", score: 82, date: "2 days ago", status: "Strong Match" },
    { id: 2, role: "React Engineer", company: "StartUp Inc.", score: 65, date: "1 week ago", status: "Needs Work" },
    { id: 3, role: "UI/UX Designer", company: "Creative Agency", score: 45, date: "2 weeks ago", status: "Low Match" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Track your resume performance and skill growth.</p>
        </div>
        <Link href="/analyze" className="mt-4 md:mt-0 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105">
          <PlusCircle className="mr-2 w-5 h-5" /> New Analysis
        </Link>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { title: "Total Resumes Analyzed", value: "12", desc: "+3 this month", color: "text-blue-500" },
          { title: "Average Match Score", value: "74%", desc: "+5% improvement", color: "text-green-500" },
          { title: "Identified Gaps", value: "6", desc: "2 skills mastered recently", color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 flex flex-col hover:shadow-lg transition-all duration-300">
            <h3 className="text-muted-foreground font-medium mb-2">{stat.title}</h3>
            <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" /> Recent Analyses
        </h2>
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-4 px-6 font-medium text-muted-foreground">Target Role / Company</th>
                  <th className="py-4 px-6 font-medium text-muted-foreground">Match Score</th>
                  <th className="py-4 px-6 font-medium text-muted-foreground">Status</th>
                  <th className="py-4 px-6 font-medium text-muted-foreground">Date</th>
                  <th className="py-4 px-6 font-medium text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary" /> {scan.role}
                      </div>
                      <div className="text-sm text-muted-foreground ml-6">{scan.company}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-full max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${scan.score >= 80 ? 'bg-green-500' : scan.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${scan.score}%` }}
                          />
                        </div>
                        <span className="font-medium text-sm">{scan.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scan.score >= 80 ? 'bg-green-500/10 text-green-500' : 
                        scan.score >= 60 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {scan.score >= 80 && <CheckCircle className="w-3 h-3 mr-1"/>}
                        {scan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{scan.date}</td>
                    <td className="py-4 px-6 text-right">
                      <Link href="/results" className="text-primary hover:underline text-sm font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
