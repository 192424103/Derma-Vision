import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Camera, Sun, Moon } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center bg-[#050508]">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-12 lg:col-span-5 flex flex-col gap-8"
        >
          <div className="glass p-10 relative overflow-hidden flex flex-col justify-between min-h-[500px] border-white/5 shadow-2xl">
            <div className="absolute top-6 right-6 text-[10px] text-brand-blue font-mono uppercase tracking-widest opacity-60">SCAN_ID: DV-9421</div>
            
            <div className="mt-4 flex flex-col gap-4">
              <h1 className="text-6xl font-black leading-none glow-text text-white">
                AI Smart<br />Analysis
              </h1>
              <p className="text-gray-400 text-sm max-w-[280px] leading-relaxed">
                Real-time facial scanning powered by CNN deep learning architecture. Upload your selfie and get instant diagnostic reports.
              </p>
            </div>

            <div className="relative h-72 w-full glass rounded-2xl overflow-hidden bg-black/40 border border-brand-blue/20 group">
              <div className="scan-line" />
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-125">
                  <path d="M60 20C35 20 15 45 15 80C15 115 35 140 60 140C85 140 105 115 105 80C105 45 85 20 60 20Z" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4"/>
                  <circle cx="40" cy="70" r="5" fill="#ec4899"/>
                  <circle cx="80" cy="70" r="5" fill="#ec4899"/>
                  <path d="M45 110C50 115 70 115 75 110" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-1.5 items-end">
                <div className="w-1.5 h-4 bg-brand-blue animate-pulse" />
                <div className="w-1.5 h-8 bg-brand-blue animate-pulse delay-75" />
                <div className="w-1.5 h-3 bg-brand-blue animate-pulse delay-150" />
                <span className="text-[10px] font-mono text-brand-blue ml-2 uppercase font-bold">Signal Active</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a href="#analyzer" className="flex-1 py-4 bg-white text-black text-xs font-black uppercase rounded-xl text-center hover:bg-gray-100 transition-colors tracking-widest">
                Start Analysis
              </a>
              <button className="w-14 h-14 glass flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
                <Camera className="w-6 h-6 text-brand-purple" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-12 lg:col-span-7 flex flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="glass p-6 flex flex-col justify-between border-l-4 border-l-brand-pink shadow-xl hover:bg-white/[0.05] transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Acne Detection</span>
                <span className="text-brand-pink text-xs font-mono font-bold">12.4%</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-2">Minor Active</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink w-[12%]" />
                </div>
              </div>
            </div>

            <div className="glass p-6 flex flex-col justify-between border-l-4 border-l-brand-blue shadow-xl hover:bg-white/[0.05] transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Hydration</span>
                <span className="text-brand-blue text-xs font-mono font-bold">OPTIMUM</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-2">High Retention</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-[88%]" />
                </div>
              </div>
            </div>

            <div className="glass p-6 flex flex-col justify-between border-l-4 border-l-brand-purple shadow-xl hover:bg-white/[0.05] transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Pigmentation</span>
                <span className="text-brand-purple text-xs font-mono font-bold">MINIMAL</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-2">Uniform Tone</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-[8%]" />
                </div>
              </div>
            </div>

            <div className="glass p-6 flex flex-col justify-between border-l-4 border-l-yellow-500 shadow-xl hover:bg-white/[0.05] transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Oiliness</span>
                <span className="text-yellow-500 text-xs font-mono font-bold">T-ZONE ONLY</span>
              </div>
              <div>
                <div className="text-2xl font-black text-white mb-2">Balanced</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[35%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 flex flex-col gap-6 border-white/5 relative overflow-hidden group">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">AI Personalized Routine Sample</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 glass bg-white/5 border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="text-[10px] font-bold text-brand-blue mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Sun className="w-3 h-3" /> MORNING
                </div>
                <div className="text-lg font-bold text-white mb-1">Niacinamide Serum</div>
                <div className="text-[11px] text-gray-500 font-medium">SPF 50+ Hybrid Sunscreen Protection</div>
              </div>
              <div className="flex-1 glass bg-white/5 border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="text-[10px] font-bold text-brand-purple mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Moon className="w-3 h-3" /> EVENING
                </div>
                <div className="text-lg font-bold text-white mb-1">Retinol 0.2%</div>
                <div className="text-[11px] text-gray-500 font-medium">Ceramide Repair Balm & Moisturizer</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
