import React from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSkinImage } from '../services/geminiService';
import { SkinAnalysisResult, AnalysisStatus } from '../types';
import { cn } from '../lib/utils';

interface ScannerProps {
  onAnalysisComplete: (result: SkinAnalysisResult, image: string) => void;
  onScanStart?: () => void;
}

export default function Scanner({ onAnalysisComplete, onScanStart }: ScannerProps) {
  const [status, setStatus] = React.useState<AnalysisStatus>('idle');
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [showWebcam, setShowWebcam] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startWebcam = async () => {
    setShowWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Webcam access denied. Please use the upload option.");
      setShowWebcam(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreview(dataUrl);
      
      // Stop webcam
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowWebcam(false);
    }
  };

  const startAnalysis = async () => {
    if (!preview) return;
    setStatus('scanning');
    setError(null);
    onScanStart?.();
    
    try {
      // Simulate real scanning delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 3000));
      const result = await analyzeSkinImage(preview);
      setStatus('complete');
      onAnalysisComplete(result, preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStatus('error');
    }
  };

  const reset = () => {
    setPreview(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <section id="analyzer" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Start Your <span className="text-brand-purple tracking-tight">AI Skin Scan</span></h2>
        <p className="text-slate-400">Upload a clear selfie or use your webcam for a deep-tissue diagnostic analysis.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className={cn(
          "relative min-h-[400px] flex flex-col items-center justify-center rounded-3xl p-8 transition-all duration-500",
          status === 'idle' ? "glass bg-white/5 border-dashed border-2 border-white/20" : "glass-dark",
          status === 'scanning' && "border-brand-purple/50 shadow-2xl shadow-brand-purple/20"
        )}>
          <AnimatePresence mode="wait">
            {status === 'idle' && !preview && !showWebcam && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center w-full"
              >
                <div className="mb-8 flex justify-center gap-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-purple/40 hover:bg-white/10 transition-all text-center"
                  >
                    <Upload className="w-10 h-10 text-brand-purple mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-white mb-1">Upload Selfie</p>
                    <p className="text-xs text-slate-500">JPG, PNG up to 10MB</p>
                  </div>
                  <div 
                    onClick={startWebcam}
                    className="group cursor-pointer p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-blue/40 hover:bg-white/10 transition-all text-center"
                  >
                    <Camera className="w-10 h-10 text-brand-blue mb-4 mx-auto group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-white mb-1">Use Webcam</p>
                    <p className="text-xs text-slate-500">Real-time capture</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-slate-500">Fast, secure and purely medical-grade analysis</p>
              </motion.div>
            )}

            {showWebcam && (
              <motion.div
                key="webcam"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-dark border-brand-blue/30"
              >
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-brand-blue/40 rounded-[3rem] border-dashed" />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                  <button onClick={capturePhoto} className="btn-primary">Capture Now</button>
                  <button onClick={() => setShowWebcam(false)} className="btn-secondary">Cancel</button>
                </div>
              </motion.div>
            )}

            {preview && !showWebcam && status !== 'complete' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full text-center"
              >
                <div className="relative rounded-2xl overflow-hidden mb-8 max-h-[500px] border border-white/10 shadow-2xl shadow-black/50 mx-auto max-w-[400px]">
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                  
                  {status === 'scanning' && (
                    <>
                      <div className="absolute inset-0 bg-brand-purple/10 backdrop-blur-[2px]" />
                      <div className="scan-line" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                          <RefreshCw className="animate-spin text-brand-purple" />
                          <span className="text-xs font-bold text-white uppercase tracking-widest">Running CNN Analysis...</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  {status === 'idle' && (
                    <button onClick={startAnalysis} className="btn-primary px-10">Start AI Analysis</button>
                  )}
                  {status === 'idle' && (
                    <button onClick={reset} className="btn-secondary">Retake Photo</button>
                  )}
                  {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                      <button onClick={reset} className="btn-primary">Try Again</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {status === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Analysis Complete!</h3>
                <p className="text-slate-400 mb-8">AI has successfully processed your skin profile.</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })} 
                    className="btn-primary flex items-center gap-2"
                  >
                    View My Report <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={reset}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center gap-8 text-slate-500 text-xs uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-purple" /> CNN Processing</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-pink" /> 128 Core Analysis</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-blue" /> Cloud Secure</div>
        </div>
      </div>

      <style>{`
        @keyframes scan-y {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-y {
          animation: scan-y 2.5s infinite linear;
        }
      `}</style>
    </section>
  );
}
