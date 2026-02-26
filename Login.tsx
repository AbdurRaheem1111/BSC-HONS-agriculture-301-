import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would use Firebase Auth here:
    // signInWithEmailAndPassword(auth, email, password)
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12"
      >
        <div className="text-center mb-10">
          <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">UniAttend Pro</h1>
          <p className="text-slate-500 mt-2 font-medium">University Administrative Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@university.edu"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-slate-900/5 font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-slate-900/5 font-bold text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
            <LogIn className="w-5 h-5" />
            Authenticate
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};
