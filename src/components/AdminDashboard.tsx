import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Target, Settings, Search, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot, getDocs, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { cn } from '../lib/utils';

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    modelAccuracy: 0,
    activeToday: 156
  });
  const [isEditingAccuracy, setIsEditingAccuracy] = useState(false);
  const [tempAccuracy, setTempAccuracy] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAdmin) return;

    // Real-time stats listeners
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    const scansUnsubscribe = onSnapshot(collection(db, 'analyses'), (snapshot) => {
      setStats(prev => ({ ...prev, totalScans: snapshot.size }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'analyses'));

    const adminsUnsubscribe = onSnapshot(collection(db, 'admins'), (snapshot) => {
      setAdminIds(new Set(snapshot.docs.map(doc => doc.id)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'admins'));

    const systemStatsUnsubscribe = onSnapshot(doc(db, 'system', 'stats'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats(prev => ({ ...prev, modelAccuracy: data.modelAccuracy || 0 }));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'system/stats'));

    // Listen to recent analyses
    const path = 'analyses';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(10));
    const recentUnsubscribe = onSnapshot(q, (snapshot) => {
      setRecentAnalyses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });

    return () => {
      usersUnsubscribe();
      scansUnsubscribe();
      adminsUnsubscribe();
      systemStatsUnsubscribe();
      recentUnsubscribe();
    };
  }, [isAdmin]);

  const toggleAdmin = async (targetUid: string) => {
    if (targetUid === user?.uid) return alert("You cannot revoke your own admin status.");
    const isAdminUser = adminIds.has(targetUid);
    const adminRef = doc(db, 'admins', targetUid);

    try {
      if (isAdminUser) {
        await deleteDoc(adminRef);
      } else {
        await setDoc(adminRef, { assignedAt: serverTimestamp(), assignedBy: user?.uid });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'admins');
    }
  };

  const deleteUserRecord = async (targetUid: string) => {
    if (targetUid === user?.uid) return alert("You cannot delete yourself.");
    if (!window.confirm("Delete user record? This will NOT delete their Firebase Auth account, only their database profile.")) return;

    try {
      await deleteDoc(doc(db, 'users', targetUid));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'users');
    }
  };

  const updateAccuracy = async () => {
    const val = parseFloat(tempAccuracy);
    if (isNaN(val) || val < 0 || val > 100) return alert("Please enter a valid percentage (0-100)");

    try {
      await setDoc(doc(db, 'system', 'stats'), { modelAccuracy: val }, { merge: true });
      setIsEditingAccuracy(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'system/stats');
    }
  };

  if (loading) return <div className="pt-40 text-center text-slate-500">Authenticating...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  const chartData = [
    { name: 'Acne', count: 45 },
    { name: 'Pigment', count: 32 },
    { name: 'Dry', count: 18 },
    { name: 'Oily', count: 25 },
    { name: 'Healthy', count: 80 }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold glow-text uppercase tracking-tight">System <span className="text-brand-purple">Admin</span></h1>
            <p className="text-slate-400">Model performance & platform management.</p>
          </div>
        </div>

        <div className="flex glass p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'overview' ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-slate-500 hover:text-white"
            )}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'users' ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-slate-500 hover:text-white"
            )}
          >
            User Management
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers.toString()} trend="+12% this week" color="text-brand-purple" />
              <StatCard icon={Activity} label="Facial Scans" value={stats.totalScans.toString()} trend="+45% spike" color="text-brand-blue" />
              <StatCard icon={Target} label="AI Accuracy" value={stats.modelAccuracy > 0 ? stats.modelAccuracy + "%" : "..."} trend="CNN v4.0 Active" color="text-brand-pink" />
              <StatCard icon={BarChart3} label="Active Today" value={stats.activeToday.toString()} trend="Global Traffic" color="text-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-purple" /> Condition Distribution
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ borderRadius: '12px', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Search className="w-5 h-5 text-brand-blue" /> Recent Activity Logs
                  </h3>
                  <div className="space-y-4">
                    {recentAnalyses.map((item, i) => (
                      <div key={item.id} className="flex items-center justify-between p-4 glass bg-white/5 border-white/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/20">
                            <img src={item.imageUrl} className="w-full h-full object-cover opacity-50" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">Analysis #{item.id.slice(0,6)}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{item.timestamp?.toDate().toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{item.condition}</p>
                            <p className="text-[10px] text-slate-500">Score: {item.healthScore}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8">Model Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">CNN Sensitivity</span>
                      <span className="text-xs font-mono text-brand-purple">HIGH [0.85]</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full">
                      <div className="h-full bg-brand-purple w-[85%] rounded-full shadow-[0_0_10px_#8B5CF6]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Model Accuracy</span>
                      {isEditingAccuracy ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            step="0.1"
                            value={tempAccuracy}
                            onChange={(e) => setTempAccuracy(e.target.value)}
                            className="w-20 glass px-2 py-1 rounded text-xs text-white"
                          />
                          <button onClick={updateAccuracy} className="text-[10px] text-green-500 font-bold">SAVE</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setTempAccuracy(stats.modelAccuracy.toString());
                            setIsEditingAccuracy(true);
                          }}
                          className="text-xs font-mono text-brand-purple hover:underline"
                        >
                          {stats.modelAccuracy}% [EDIT]
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Preprocessing Cache</span>
                      <span className="text-xs font-mono text-brand-blue">ACTIVE</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl border-orange-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">System Alerts</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] text-slate-500 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-orange-500 font-bold">[WARN]</span> Image processing latency spike detected in Region US-West-1.
                    </div>
                    <div className="text-[10px] text-slate-500 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-blue-500 font-bold">[INFO]</span> New CNN Weights (v4.0.1) deployed successfully.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-3xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-brand-purple" /> Member Directory
              </h3>
              <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-400">
                {users.length} Registered Profiles
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    <th className="pb-6 pl-4">User Profile</th>
                    <th className="pb-6">Email Address</th>
                    <th className="pb-6">Joined Date</th>
                    <th className="pb-6">Privileges</th>
                    <th className="pb-6 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.uid} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 pl-4">
                        <div className="flex items-center gap-4">
                          <img src={u.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                          <span className="font-bold text-white">{u.displayName || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="py-6 text-sm text-slate-400">{u.email}</td>
                      <td className="py-6 text-xs font-mono text-slate-500">
                        {u.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            adminIds.has(u.uid) 
                              ? "bg-brand-purple/20 border-brand-purple/30 text-brand-purple" 
                              : "bg-white/5 border-white/10 text-slate-500"
                          )}>
                            {adminIds.has(u.uid) ? 'Administrator' : 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 pr-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleAdmin(u.uid)}
                            title={adminIds.has(u.uid) ? "Revoke Admin" : "Grant Admin"}
                            className="p-2 glass hover:border-brand-purple/40 text-brand-purple rounded-lg transition-all"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteUserRecord(u.uid)}
                            title="Remove User Record"
                            className="p-2 glass hover:border-red-500/40 text-red-500 rounded-lg transition-all"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-[10px] font-bold text-green-500">{trend}</div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </motion.div>
  );
}
