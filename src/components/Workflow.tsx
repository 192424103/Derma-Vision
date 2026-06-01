import { motion } from 'motion/react';
import { Upload, Cpu, Search, Fingerprint, LayoutDashboard, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    desc: "Seamlessly upload your high-res selfie or capture via webcam.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    icon: Cpu,
    title: "Preprocessing",
    desc: "AI normalizes lighting, aspect ratios, and facial anchors.",
    color: "from-brand-purple to-brand-pink"
  },
  {
    icon: Search,
    title: "CNN Extraction",
    desc: "Convolutional Neural Networks extract sub-dermal features.",
    color: "from-brand-pink to-orange-400"
  },
  {
    icon: Fingerprint,
    title: "Skin Identification",
    desc: "Detecting acne, pigmentation, and nutrient markers.",
    color: "from-brand-blue to-brand-purple"
  },
  {
    icon: LayoutDashboard,
    title: "Analysis Results",
    desc: "Generation of complete skin health status reports.",
    color: "from-green-400 to-emerald-600"
  },
  {
    icon: Sparkles,
    title: "Care Routine",
    desc: "Personalized AM/PM routines and product suggestions.",
    color: "from-yellow-400 to-brand-pink"
  }
];

export default function Workflow() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Precision <span className="gradient-text">AI Workflow</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto uppercase text-xs font-bold tracking-[0.2em]">Our Scientific Methodology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden lg:block absolute top-[15%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
          <div className="hidden lg:block absolute bottom-[15%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl relative z-10 group hover:border-white/20 transition-all hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-6 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-[0.9rem] bg-[#030014] flex items-center justify-center">
                  <step.icon className={`w-7 h-7 bg-clip-text text-transparent bg-gradient-to-br ${step.color}`} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">0{i+1}</span> {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
