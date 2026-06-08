"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, FileText, Zap } from "lucide-react";

export default function ResumeOptimizerPage() {
  
  // =========================
  // Resume State (still mock preview)
  // =========================
  const [resume, setResume] = useState({
    summary: "Dedicated software engineer looking for a job to write code. Have experience in React and Node.js.",
    experience: [
      { id: 1, role: "Frontend Developer", company: "TechCorp", desc: "Worked on UI components and fixed bugs in the main app." },
      { id: 2, role: "Intern", company: "StartupInc", desc: "Helped the team with various web tasks." }
    ]
  });

  // =========================
  // ❌ REMOVE MOCK SUGGESTIONS
  // =========================
  const [suggestions, setSuggestions] = useState([]);

  // =========================
  // ATS STATE
  // =========================
  const [atsData, setAtsData] = useState(null);
  const [atsLoading, setAtsLoading] = useState(true);
  const [atsError, setAtsError] = useState(null);

  // =========================
  // FETCH ATS API
  // =========================
  useEffect(() => {
    async function fetchATS() {
      const projectId = localStorage.getItem("project_id");
      try {
        const res = await fetch(
          `https://rag-rag-v16-010-production-1b78.up.railway.app/api/v1/nlp/index/retun_ats_score_recommendtion/${projectId}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        setAtsData(data);

        // =========================
        // MAP API → UI FORMAT
        // =========================
        const mappedSuggestions = (data?.[1] || []).map((item, i) => ({
          id: `ats-${i}`,
          targetType: "ats",
          issue: item.title,
          suggestion: item.actions?.join(" "),
          status: "pending",
        }));

        setSuggestions(mappedSuggestions);

      } catch (err) {
        console.error("ATS error:", err);
        setAtsError(err.message || "Failed to load ATS data");
      } finally {
        setAtsLoading(false);
      }
    }

    fetchATS();
  }, []);

  // =========================
  // SCORE + RECOMMENDATIONS
  // =========================
  const score = atsData?.[0] || 0;

  // =========================
  // ACTION HANDLER
  // =========================
  const handleAction = (sug, action) => {
    setSuggestions(prev =>
      prev.map(s => s.id === sug.id ? { ...s, status: action } : s)
    );
  };

  const activeSuggestions = suggestions.filter(s => s.status === "pending");

  return (
    <div className="h-full flex flex-col space-y-6 pb-6">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Smart Resume Optimizer
          </h1>
          <p className="text-muted-foreground">
            ATS-powered resume intelligence system
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1">

        {/* LEFT - RESUME */}
        <div className="w-full lg:w-1/2 glass p-8 rounded-2xl">

          <h2 className="text-2xl font-bold mb-4">Live Preview</h2>

          <h3 className="font-bold mb-2">Summary</h3>
          <p className="text-sm mb-6">{resume.summary}</p>

          <h3 className="font-bold mb-2">Experience</h3>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="font-semibold text-sm">
                {exp.role} - {exp.company}
              </div>
              <p className="text-sm text-muted-foreground">
                {exp.desc}
              </p>
            </div>
          ))}

        </div>

        {/* RIGHT - ATS PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col">

          {/* SCORE */}
          <div className="glass-panel p-5 rounded-2xl mb-4 flex justify-between items-center">
            <h2 className="text-primary font-bold uppercase text-sm">
              ATS Score
            </h2>
            <span className="text-xl font-bold text-primary">
              {score} / 100
            </span>
          </div>

          {/* LOADING */}
          {atsLoading && (
            <div className="text-primary animate-pulse">
              Loading ATS analysis...
            </div>
          )}

          {/* ERROR */}
          {atsError && (
            <div className="text-red-400 text-sm">{atsError}</div>
          )}

          {/* SUGGESTIONS */}
          <div className="flex-1 space-y-4">

            <AnimatePresence>
              {activeSuggestions.map((sug) => (
                <motion.div
                  key={sug.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-4 rounded-xl border border-primary/30"
                >

                  <h3 className="font-semibold mb-1">
                    {sug.issue}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    {sug.suggestion}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(sug, "applied")}
                      className="flex-1 bg-primary text-black py-2 rounded"
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      Apply
                    </button>

                    <button
                      onClick={() => handleAction(sug, "dismissed")}
                      className="flex-1 border py-2 rounded"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Dismiss
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}