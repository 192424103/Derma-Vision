import { Brain, Heart, Globe, Shield } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            Advancing Healthcare through <br />
            <span className="text-brand-pink tracking-tight">Machine Intelligence</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg leading-relaxed">
            DermaVision AI was born from the vision of making professional skin diagnostics accessible to everyone. By leveraging Convolutional Neural Networks (CNN), our system identifies patterns that are often invisible to the naked eye.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-dark border-white/5">
              <Brain className="w-8 h-8 text-brand-purple mb-4" />
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Deep Learning</h4>
              <p className="text-slate-500 text-xs">Proprietary CNN models trained on 100k+ dermatological samples.</p>
            </div>
            <div className="p-6 rounded-2xl glass-dark border-white/5">
              <Shield className="w-8 h-8 text-brand-blue mb-4" />
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Data Privacy</h4>
              <p className="text-slate-500 text-xs">Full end-to-end encryption for your personal biometric data.</p>
            </div>
            <div className="p-6 rounded-2xl glass-dark border-white/5">
              <Globe className="w-8 h-8 text-brand-pink mb-4" />
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Accessibility</h4>
              <p className="text-slate-500 text-xs">Available 24/7 on any device with a camera and internet.</p>
            </div>
            <div className="p-6 rounded-2xl glass-dark border-white/5">
              <Heart className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Holistic Care</h4>
              <p className="text-slate-500 text-xs">Beyond scan results: detailed diet and lifestyle guidance.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden glass p-3 rotate-3 relative z-10">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Laboratory" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-full h-full bg-brand-purple/10 rounded-[3rem] -rotate-3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-blue/30 blur-[80px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
