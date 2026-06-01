import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center">
              <span className="text-white font-bold">DV</span>
            </div>
            <span className="text-2xl font-bold font-display text-white">DermaVision <span className="text-brand-purple">AI</span></span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
            Revolutionizing skincare through deep learning. Get professional-grade facial analysis and personalized care routines in seconds.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 rounded-full glass border-white/10 hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="p-3 rounded-full glass border-white/10 hover:bg-white/10 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-3 rounded-full glass border-white/10 hover:bg-white/10 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><a href="#analyzer" className="hover:text-brand-purple transition-colors">Skin Scanner</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Recommendation Engine</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Progress Tracking</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Case Studies</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@dermavision.ai</li>
            <li>BTech Final Year Project</li>
            <li>Innovation Lab</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between pt-10 border-t border-white/5 text-slate-500 text-xs">
        <p>© 2026 DermaVision AI. All rights reserved.</p>
        <div className="flex items-center gap-1 mt-4 md:mt-0">
          Built with <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" /> for Innovation
        </div>
      </div>
    </footer>
  );
}
