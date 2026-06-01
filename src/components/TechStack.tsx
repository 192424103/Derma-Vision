import { motion } from 'motion/react';

const techs = [
  { name: 'React.js', icon: '⚛️', color: 'bg-blue-500/10 text-blue-500' },
  { name: 'Tailwind CSS', icon: '🎨', color: 'bg-cyan-500/10 text-cyan-500' },
  { name: 'TensorFlow', icon: '🧠', color: 'bg-orange-500/10 text-orange-500' },
  { name: 'Node.js', icon: '🟢', color: 'bg-green-500/10 text-green-500' },
  { name: 'Python', icon: '🐍', color: 'bg-yellow-500/10 text-yellow-500' },
  { name: 'CNN', icon: '📦', color: 'bg-brand-purple/10 text-brand-purple' },
  { name: 'OpenCV', icon: '👁️', color: 'bg-red-500/10 text-red-500' },
  { name: 'Framer Motion', icon: '✨', color: 'bg-brand-pink/10 text-brand-pink' },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-6">
      <div className="max-w-7xl mx-auto glass p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <div className="text-[120px] font-black uppercase pointer-events-none select-none tracking-tighter">STACK</div>
        </div>
        
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-2 glow-text">Infrastructure</h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">System Protocols & Technology Stack</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {techs.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 glass text-[10px] font-mono border-white/5 hover:border-brand-purple/30 transition-all cursor-default text-white flex items-center gap-2"
              >
                <span className="opacity-50">{tech.icon}</span>
                {tech.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
