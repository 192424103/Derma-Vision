import React from 'react';
import { Sparkles, Menu, X, LogIn, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../lib/firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log("User closed the login popup.");
      } else {
        console.error("Login failed", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center shadow-lg shadow-brand-purple/20">
            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">DermaVision <span className="text-brand-purple">AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-white transition-colors">Analyzer</Link>
          <Link to="/history" className="hover:text-white transition-colors">History</Link>
          <Link to="/forum" className="hover:text-white transition-colors">Forum</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1 text-brand-purple">
              <Shield className="w-3 h-3" /> Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-xs font-bold text-white hidden lg:inline">{user.displayName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full glass border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-6 py-2 rounded-full glass border border-brand-purple/30 text-sm font-semibold hover:bg-brand-purple/10 transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 right-6 glass p-6 rounded-2xl md:hidden flex flex-col gap-4 text-center"
          >
            <Link to="/" onClick={() => setIsOpen(false)}>Analyzer</Link>
            <Link to="/forum" onClick={() => setIsOpen(false)}>Forum</Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>}
            
            {user ? (
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn-secondary mt-2">Logout</button>
            ) : (
              <button onClick={() => { handleLogin(); setIsOpen(false); }} className="btn-primary mt-2">Login</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
