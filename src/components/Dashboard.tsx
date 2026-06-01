import React from 'react';
import { 
  Droplets, Moon, Sun, Utensils, Info, 
  ChevronRight, TrendingUp, Heart, ShoppingBag, 
  MessageSquare, Download, FileText, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { SkinAnalysisResult } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import { cn } from '../lib/utils';

interface DashboardProps {
  result: SkinAnalysisResult;
  image: string;
}

const mockChartData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 70 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 78 },
  { name: 'Today', score: 82 },
];

export default function Dashboard({ result, image }: DashboardProps) {
  const radarData = [
    { subject: 'Acne', A: result.detections.acne, fullMark: 100 },
    { subject: 'Pigment', A: result.detections.pigmentation, fullMark: 100 },
    { subject: 'Dryness', A: result.detections.dryness, fullMark: 100 },
    { subject: 'Oiliness', A: result.detections.oiliness, fullMark: 100 },
    { subject: 'Redness', A: result.detections.redness, fullMark: 100 },
  ];

  return (
    <section id="results" className="py-24 px-6 relative bg-gradient-to-b from-[#030014] to-[#08041c]">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-4xl font-extrabold mb-4">Your <span className="gradient-text">Personalized Analysis</span></h2>
            <p className="text-slate-400 max-w-xl">Deep AI diagnostic report based on your recent facial scan. Last updated: Today, 10:05 AM</p>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button className="btn-primary flex items-center gap-2 shadow-glow-purple">
              <MessageSquare className="w-4 h-4" /> AI Assistant
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score & Scan Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <Activity className="w-12 h-12 text-brand-purple opacity-20" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="relative mb-6">
                  {/* Radial Score Background */}
                  <div className="absolute inset-0 bg-brand-purple/5 rounded-full blur-2xl" />
                  
                  <svg className="w-48 h-48 transform -rotate-90 relative">
                    <circle cx="96" cy="96" r="88" className="stroke-white/5 fill-none" strokeWidth="12" />
                    <motion.circle 
                      cx="96" cy="96" r="88" 
                      className="stroke-brand-purple fill-none" 
                      strokeWidth="12" 
                      strokeDasharray={2 * Math.PI * 88}
                      initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - result.healthScore / 100) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-display text-white glow-text">{result.healthScore}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skin Score</span>
                  </div>
                </div>
                <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-green-400 border-green-500/20 mb-4 inline-flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> +4.2% this week
                </div>
                <p className="text-sm text-slate-400 px-6 italic leading-relaxed">"{result.message}"</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-purple" /> CNN Diagnostic Results
                </h3>
                <div className="space-y-6">
                  {radarData.map((item) => (
                    <div key={item.subject}>
                      <div className="flex justify-between mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                        <span>{item.subject}</span>
                        <span className={cn(
                          "font-bold",
                          item.A > 70 ? "text-red-400" : item.A > 30 ? "text-yellow-400" : "text-green-400"
                        )}>{item.A}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.A}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            item.A > 70 ? "bg-red-500" : item.A > 30 ? "bg-yellow-500" : "bg-green-500"
                          )} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-pink" /> Improvement Trend
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {result.detections.deficiency.map(item => (
                <span key={item} className="px-3 py-1 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-bold border border-brand-purple/20 select-none">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Routines */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-3xl p-8 border-brand-purple/10 lg:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Morning Routine</h3>
            <ul className="space-y-4">
              {result.recommendations.morning.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-400 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark rounded-3xl p-8 border-brand-blue/10 lg:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Night Routine</h3>
            <ul className="space-y-4">
              {result.recommendations.night.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-400 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Diet & Lifestyle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Nutritional Guide</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Superfoods</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendations.diet.consume.map(item => (
                      <span key={item} className="px-3 py-1.5 rounded-full bg-green-500/5 text-green-500 border border-green-500/10 text-[10px] font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Limit Intake</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendations.diet.avoid.map(item => (
                      <span key={item} className="px-3 py-1.5 rounded-full bg-red-500/5 text-red-400 border border-red-500/10 text-[10px] font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Hydration</p>
                  <p className="text-sm font-bold text-white">{result.recommendations.hydration}</p>
                </div>
              </div>

              <div className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sleep Optimization</p>
                  <p className="text-sm font-bold text-white">{result.recommendations.sleep}</p>
                </div>
              </div>

              <div className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Active</p>
                  <p className="text-sm font-bold text-white">Niacinamide, Squalane</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommended Ingredients & Products */}
        <div className="mt-12 group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-brand-purple" /> Recommended Ingredients
            </h3>
            <button className="text-sm text-brand-purple flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
              View All Products <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {result.recommendations.ingredients.map((ingredient, i) => (
              <motion.div 
                key={ingredient}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-dark border-white/5 p-4 rounded-2xl text-center hover:border-brand-purple/30 transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <div className="w-2 h-2 rounded-full bg-brand-purple" />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-tight">{ingredient}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
