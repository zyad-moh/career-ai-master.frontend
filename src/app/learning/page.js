"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, TerminalSquare, Clock, Loader2, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";

const API_BASE = "https://rag-rag-v16-010-production-1b78.up.railway.app";

export default function LearningPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    async function fetchRecommendations() {
      const projectId = localStorage.getItem("project_id");
      try {
        const res = await fetch(`${API_BASE}/api/v1/nlp/index/retun_learning_recommendtion/${projectId}`, {
          headers: { accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const rawData = await res.json();

        const parsedData =
          typeof rawData === "string"
            ? JSON.parse(rawData)
            : rawData;

        setRecommendations(parsedData);
      } catch (err) {
        console.error("retun_learning_recommendtion error:", err);
        setError(err.message || "Failed to fetch learning recommendations.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  // Helper: extract courses list from API response


  return (
    <div className="h-full flex flex-col space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Learning & Projects</h1>
        <p className="text-muted-foreground">Master the missing competencies identified by the AI matching engine.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="h-64 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <span className="text-primary tracking-widest text-sm uppercase font-bold animate-pulse">
            Loading Learning Paths...
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
          <h3 className="text-xl font-bold mb-2">Failed to Load Recommendations</h3>
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
      {recommendations && !loading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-8"
  >
    {Object.entries(recommendations).map(([skill, resources], idx) => (
      <motion.div
        key={skill}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.08 }}
        className="glass-panel rounded-3xl p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              {skill}
            </h2>

            <p className="text-muted-foreground mt-2 text-sm">
              AI generated learning resources for mastering {skill}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
            Skill Path
          </div>
        </div>

        {/* Resource Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coursera */}
          <div className="glass rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center mb-5">
              <PlayCircle className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-bold text-lg">Coursera</h3>
            </div>

            <div className="space-y-3">
              {resources.coursera?.map((course, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-background/40 border border-border hover:border-primary/30 transition-all"
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {course}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Udemy */}
          <div className="glass rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center mb-5">
              <BookOpen className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-bold text-lg">Udemy</h3>
            </div>

            <div className="space-y-3">
              {resources.udemy?.map((course, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-background/40 border border-border hover:border-primary/30 transition-all"
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {course}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <div className="glass rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center mb-5">
              <TerminalSquare className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-bold text-lg">GitHub Projects</h3>
            </div>

            <div className="space-y-3">
              {resources.github_projects?.map((repo, i) => (
                <a
                  key={i}
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-background/40 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary group-hover:underline">
                      {repo}
                    </p>

                    <ArrowRight className="w-4 h-4 text-primary opacity-70 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    ))}
  </motion.div>
)}
    </div>
  );
}
