"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Target, BookOpen, Code, Terminal, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

const API_BASE = "https://rag-rag-v16-010-production-1b78.up.railway.app";

export default function SkillGapPage() {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGapSkills() {
      const projectId = localStorage.getItem("project_id");
      try {
        const res = await fetch(`${API_BASE}/api/v1/nlp/index/retun_gap_skills/${projectId}`, {
          headers: { accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setGapData(data);
      } catch (err) {
        console.error("retun_gap_skills error:", err);
        setError(err.message || "Failed to fetch gap skills.");
      } finally {
        setLoading(false);
      }
    }

    fetchGapSkills();
  }, []);

  // Helper: try to extract radar-compatible data from API response
  const extractRadarData = (data) => {
    if (!data) return [];

    // If data is already an array of { subject, A, B } objects
    if (Array.isArray(data)) {
      return data.map((item, i) => ({
        subject: item.subject || item.skill || item.name || `Skill ${i + 1}`,
        A: item.A || item.current || item.your_level || item.score || 0,
        B: item.B || item.target || item.required || item.benchmark || 100,
        fullMark: 100,
      }));
    }

    // If data has a radarData or skills key
    if (data.radarData) return extractRadarData(data.radarData);
    if (data.data) return extractRadarData(data.data);
    if (data.skills) return extractRadarData(data.skills);
    if (data.gaps) return extractRadarData(data.gaps);

    // If data is { skillName: score } map
    if (typeof data === "object" && !Array.isArray(data)) {
      return Object.entries(data).map(([key, value]) => ({
        subject: key,
        A: typeof value === "number" ? value : (value.current || value.score || 0),
        B: typeof value === "number" ? 100 : (value.target || value.required || 100),
        fullMark: 100,
      }));
    }

    return [];
  };

  return (
    <div className="h-full flex flex-col space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Skill Gap Detector</h1>
        <p className="text-muted-foreground">Identify exact missing competencies relative to your target industry baseline.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="h-64 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <span className="text-primary tracking-widest text-sm uppercase font-bold animate-pulse">
            Analyzing Skill Gaps...
          </span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/50">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Failed to Load Gap Analysis</h3>
          <p className="text-muted-foreground mb-2 max-w-md">{error}</p>
          <p className="text-xs text-muted-foreground/60 mb-6">Make sure you have uploaded a resume first.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold transition-colors hover:bg-foreground hover:text-background"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Success */}
      {gapData && !loading && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-3xl p-8 md:p-10"
  >
    <div className="flex items-center mb-8">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mr-4">
        <Target className="w-7 h-7 text-primary" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Missing Skill Analysis
        </h2>

        <p className="text-muted-foreground text-sm mt-1">
          Detected competency gaps relative to your target role.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gapData.map((skill, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          className="group border border-primary/10 bg-background/40 hover:bg-primary/10 hover:border-primary/30 transition-all rounded-2xl px-4 py-5 flex flex-col items-center text-center"
        >
          <Code className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />

          <span className="font-semibold text-sm text-foreground">
            {skill}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}
    </div>
  );
}
