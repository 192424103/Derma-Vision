import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="glass p-12 lg:p-20 rounded-[3.5rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 blur-[100px] rounded-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get in <span className="text-brand-purple tracking-tight">Touch</span></h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                Have questions about our AI models? Interested in collaboration? Drop us a message and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-purple">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm uppercase tracking-widest">Email</h5>
                    <p className="text-slate-400">info@dermavision.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-blue">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm uppercase tracking-widest">Location</h5>
                    <p className="text-slate-400">Innovation Hub, Tech City</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-purple/40 outline-none text-white focus:bg-white/10 transition-all font-medium"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-purple/40 outline-none text-white focus:bg-white/10 transition-all font-medium"
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-purple/40 outline-none text-white focus:bg-white/10 transition-all font-medium"
              />
              <textarea 
                placeholder="Your Message..." 
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-purple/40 outline-none text-white focus:bg-white/10 transition-all font-medium"
              />
              <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
