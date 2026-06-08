"use client";
// ityjbi
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";


export default function CvAnalyzerPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isRunningNLP, setIsRunningNLP] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setResult(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      setError("Please upload a valid PDF or DOCX file under 5MB.");
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });

  const startAnalysis = async () => {
  if (!file) return;
  const projectId = localStorage.getItem("project_id");
  setIsUploading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);

  try {
    // 1) Upload
    const uploadResponse = await fetch(
      `https://rag-rag-v16-010-production-1b78.up.railway.app/api/v1/data/upload/${projectId}`,
      {
        method: "POST",
        headers: { accept: "application/json" },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData["file id"];

    // 2) Process (IMPORTANT: send fileId)
    const processResponse = await fetch(
      `https://rag-rag-v16-010-production-1b78.up.railway.app/api/v1/data/process/${projectId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileId,
        }),
      }
    );

    if (!processResponse.ok) {
      throw new Error(`Process failed with status: ${processResponse.status}`);
    }

    const processData = await processResponse.json();

    setResult({
      status: "success",
      message: uploadData.signal || "file_upload_success",
      fileId,
      fileName: file.name,
      processStatus: processData?.signal || "processing_done",
    });

  } catch (err) {
    console.error("Upload error:", err);
    setError("Failed to analyze resume. Please try again.");
  } finally {
    setIsUploading(false);
  }
};
  const runAllAnalysis = async () => {
  const projectId = localStorage.getItem("project_id");  
  try {
    setIsRunningNLP(true);
    setError(null);

    const response = await fetch(
      `https://rag-rag-v16-010-production-1b78.up.railway.app/api/v1/nlp/index/run_all/${projectId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill_request: {
            user_skill: ["python", "fastapi"],
          },
          gap_request: {
            user_gap_skill: ["docker", "kubernetes"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();

      console.error("Run All Error:", errText);

      throw new Error(`Run all failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Run All Success:", data);

    setResult((prev) => ({
      ...prev,
      nlpResult: data,
    }));

  } catch (err) {
    console.error(err);
    setError("Failed to run NLP analysis.");
  } finally {
    setIsRunningNLP(false);
  }
};
  const resetState = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-10">
      <motion.div 
        className="w-full text-center mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-primary mb-3">
          CV Neural Analyzer
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Upload your resume. Our parsing engine will extract your structural data, identify hard skills, and map your trajectory.
        </p>
      </motion.div>

      <div className="w-full relative">
        <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-[2rem] -z-10" />
        
        <AnimatePresence mode="wait">
          
          {/* Upload State */}
          {!isUploading && !result && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-10 md:p-16 rounded-[2rem] w-full border border-primary/20 flex flex-col items-center justify-center text-center"
            >
              <div 
                {...getRootProps()} 
                className={`w-full max-w-xl mx-auto p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  isDragActive ? 'border-primary bg-primary/10 scale-105' : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-sm">
                  <UploadCloud className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Initialize Parsing Sequence</h3>
                <p className="text-muted-foreground mb-2">Drag & Drop your resume here, or click to select</p>
                <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">SUPPORTED: PDF, DOCX (Max 5MB)</p>
                
                {file && (
                  <div className="mt-8 flex items-center justify-center space-x-2 text-primary font-medium bg-background border border-primary/20 px-4 py-2 rounded-lg">
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={startAnalysis}
                disabled={!file}
                className="mt-8 w-full max-w-md px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 transition-all hover:bg-foreground hover:text-background disabled:hover:bg-primary disabled:hover:text-primary-foreground"
              >
                Analyze Target Document
              </button>

              {error && (
                <div className="mt-6 flex items-center text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* Skeleton Processing State */}
          {isUploading && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass p-10 md:p-16 rounded-[2rem] w-full border border-primary/30 flex flex-col space-y-8"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold tracking-widest uppercase text-primary animate-pulse">Running ML Pipeline...</h3>
                <p className="text-muted-foreground font-mono text-xs mt-2">Extracting structural entities and parsing raw text</p>
              </div>

              {/* Skeleton Bars simulating loading progress */}
              <div className="space-y-6 w-full max-w-xl mx-auto">
                <div className="space-y-3">
                  <div className="h-4 w-1/4 bg-primary/20 rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
                </div>
                
                <div className="space-y-3 pt-6">
                  <div className="h-4 w-1/3 bg-primary/20 rounded animate-pulse" />
                  <div className="h-24 w-full bg-muted/50 rounded animate-pulse" />
                </div>

                <div className="flex gap-4 pt-4">
                  <div className="h-10 w-24 bg-primary/20 rounded animate-pulse" />
                  <div className="h-10 w-24 bg-primary/20 rounded animate-pulse" />
                </div>
              </div>

              <div className="w-full max-w-xl mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-[2rem] w-full border border-green-500/30 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/50">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
              <p className="text-muted-foreground mb-2">File Processed: {file?.name}</p>
              <p className="text-xs text-primary font-mono mb-8 bg-primary/10 px-3 py-1 rounded">ID: {result.fileId}</p>
              
              <div className="flex space-x-4">
                <button onClick={resetState} className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  Upload Another
                </button>
                <button 
                  onClick={() => router.push('/results')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold transition-colors hover:bg-foreground hover:text-background"
                >
                  View Data Profile
                </button>
                <button
                  onClick={runAllAnalysis}
                  disabled={isRunningNLP}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors hover:bg-blue-600 disabled:opacity-50"
                >
                  {isRunningNLP ? "Running NLP..." : "Run Full NLP"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
