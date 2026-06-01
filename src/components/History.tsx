import React, { useEffect, useState } from 'react';
import { Clock, Activity, Target, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDateSafe } from '../lib/utils';
import Dashboard from './Dashboard';
import MilestoneBadges from './MilestoneBadges';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    const path = 'analyses';
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Login to view history</h2>
        <p className="text-slate-500">Your analysis history is securely stored in your profile.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2 glow-text">Analysis <span className="text-brand-purple">History</span></h1>
        <p className="text-slate-400">Track your skin's progress over time.</p>
      </div>

      {selectedScan ? (
        <div>
          <button 
            onClick={() => setSelectedScan(null)}
            className="mb-8 text-brand-purple flex items-center gap-2 font-bold hover:translate-x-1 transition-transform"
          >
            ← Back to History
          </button>
          <Dashboard result={selectedScan} image={selectedScan.imageUrl} />
        </div>
      ) : (
        <>
          <MilestoneBadges history={history} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.length === 0 ? (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No scans found. Start your first analysis today!</p>
              </div>
            ) : (
              history.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedScan(scan)}
                  className="glass p-6 rounded-3xl hover:border-brand-purple/30 group cursor-pointer transition-all"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-black/20 relative">
                    <img src={scan.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase">
                      Score: {scan.healthScore}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{scan.condition}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {formatDateSafe(scan.timestamp)}
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-purple group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
