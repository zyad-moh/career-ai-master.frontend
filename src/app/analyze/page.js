"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileType, FileText, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e) => {
    // Mock file selection
    setFile(e.target.files?.[0] || { name: "my_resume.pdf" });
    setTimeout(() => setStep(2), 500); 
  };

  const handleSimulateDragDrop = () => {
    setFile({ name: "my_resume.pdf" });
    setTimeout(() => setStep(2), 500);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Mock 3-second analytical process
    setTimeout(() => {
      router.push("/results");
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      
      {/* Progress Indicators */}
      <div className="w-full flex items-center justify-center mb-12 space-x-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 rounded-full mx-2 transition-colors duration-300 ${
                 step > s ? "bg-primary" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full glass rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Upload Resume */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Upload Your Resume</h2>
                <p className="text-muted-foreground">Supported formats: PDF, DOCX (Max 5MB)</p>
              </div>

              <div 
                onClick={handleSimulateDragDrop}
                className="w-full border-2 border-dashed border-primary/30 rounded-2xl p-12 hover:bg-primary/5 hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">Click to Upload or Drag and Drop</p>
                  <p className="text-sm text-muted-foreground mt-1">We'll automatically extract your skills and experience</p>
                </div>
                <input 
                  type="file" 
                  accept=".pdf,.docx" 
                  className="hidden" 
                  id="resume-upload" 
                  onChange={handleFileUpload} 
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && !isAnalyzing && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Target Job Description</h2>
                  <p className="text-muted-foreground text-sm">Paste the exact job ad you're applying for.</p>
                </div>
                <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <FileType className="w-4 h-4" />
                  <span>{file?.name} uploaded</span>
                </div>
              </div>

              <textarea 
                className="w-full h-64 p-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="e.g. We are looking for a Software Engineer with 3+ years of experience in React, Node.js and AWS..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground font-medium text-sm">
                  Back to Upload
                </button>
                <button 
                  onClick={startAnalysis}
                  disabled={jobDescription.length < 50}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Match Analysis <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Analyzing Profile...</h2>
              <div className="space-y-2 text-muted-foreground max-w-sm">
                <p className="animate-pulse">Extracting text & formatting...</p>
                <p className="animate-pulse animation-delay-200">Matching skills via NLP...</p>
                <p className="animate-pulse animation-delay-500">Generating Learning Paths...</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
