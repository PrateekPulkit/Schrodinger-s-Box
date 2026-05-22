import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Key } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const host = window.location.hostname;
      const apiUrl = (import.meta as any).env.VITE_API_URL || `http://${host}:8000`;
      const response = await fetch(`${apiUrl}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error('Authentication Failed. Clearance Denied.');
      }

      const data = await response.json();
      login(data.access_token, username, data.role);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-textMain font-mono bg-gradient-to-tr from-[#020617] to-[#0f172a]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 glass-panel border border-accent/20 rounded-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        
        <div className="flex flex-col items-center mb-8">
          <Shield size={48} className="text-accent mb-4" />
          <h1 className="text-2xl font-bold tracking-widest neon-text-blue">SCHRÖDINGER OPERATIONS</h1>
          <p className="text-textMuted text-xs mt-2 uppercase tracking-widest">Restricted Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2 text-textMuted text-sm">
              <User size={16} /> <label>OPERATIVE ID</label>
            </div>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 rounded text-accent focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g. commander"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-textMuted text-sm">
              <Key size={16} /> <label>CLEARANCE CODE</label>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-3 rounded text-accent focus:outline-none focus:border-accent transition-colors tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 p-4 rounded font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : <><Lock size={18} /> INITIATE SECURE UPLINK</>}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/5 text-center text-xs text-textMuted flex flex-col gap-1">
          <p>Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-white/5 rounded">commander / defend123</div>
            <div className="p-2 bg-white/5 rounded">operative / field123</div>
            <div className="col-span-2 p-2 bg-white/5 rounded">analyst / intel123</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
