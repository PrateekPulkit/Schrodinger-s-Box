import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useSession } from '../hooks/useSession';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, Lock, Zap, AlertCircle, Copy, LogOut } from 'lucide-react';

export default function Chat() {
  const { sessionId } = useSession();
  const [combo, setCombo] = useState('COMBO-A');
  const { messages, status, sendMessage, error, clientId } = useWebSocket(sessionId, combo);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === 'SECURE') {
      sendMessage(input, combo);
      setInput('');
    }
  };

  const copySessionLink = () => {
    const link = `${window.location.origin}?session=${sessionId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const comboOptions = [
    { id: 'COMBO-A', name: 'Kyber + BIKE + SPHINCS+', level: '1' },
    { id: 'COMBO-B', name: 'Kyber + BIKE + SPHINCS+', level: '2' },
    { id: 'COMBO-C', name: 'Kyber + BIKE + SPHINCS+', level: '3' },
    { id: 'COMBO-D', name: 'NTRU + BIKE + SPHINCS+', level: '4' },
    { id: 'COMBO-E', name: 'NTRU + BIKE + SPHINCS+', level: '5' }
  ];

  return (
    <div className="h-full flex flex-col pt-8 font-mono bg-gradient-to-br from-background via-background to-accent/5">
      <header className="mb-6 px-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl text-textMain neon-text-blue mb-2">🔐 SECURE CHAT</h2>
            <div className="flex items-center gap-3 text-sm text-textMuted">
              <span>Session: <span className="text-accent font-mono">{sessionId.slice(0, 8)}...</span></span>
              <span>•</span>
              <span>User: <span className="text-accent font-mono">{clientId.slice(0, 8)}...</span></span>
            </div>
          </div>
          <button
            onClick={copySessionLink}
            className={`glass-panel px-4 py-2 rounded border transition-all ${
              copied ? 'border-secure/50 bg-secure/10' : 'border-accent/20 hover:border-accent/50'
            }`}
          >
            {copied ? (
              <span className="text-secure flex items-center gap-2"><Copy size={14} /> Copied!</span>
            ) : (
              <span className="text-accent flex items-center gap-2"><Copy size={14} /> Share Link</span>
            )}
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex gap-4 flex-wrap">
          <div className="glass-panel px-4 py-2 rounded border-accent/20 flex flex-col items-start">
            <span className="text-[10px] text-textMuted uppercase">Encryption</span>
            <span className="text-sm text-accent font-bold">AES-256-GCM</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded border-accent/20 flex flex-col items-start">
            <span className="text-[10px] text-textMuted uppercase">Algorithm Combo</span>
            <select
              value={combo}
              onChange={(e) => setCombo(e.target.value)}
              disabled={status !== 'SECURE'}
              className={`text-sm font-bold bg-transparent border-none focus:outline-none cursor-pointer ${
                status === 'SECURE' ? 'text-accent' : 'text-textMuted'
              }`}
            >
              {comboOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.id} - {opt.name} (L{opt.level})
                </option>
              ))}
            </select>
          </div>
          <div className="glass-panel px-4 py-2 rounded border-accent/20 flex flex-col items-start">
            <span className="text-[10px] text-textMuted uppercase">Status</span>
            <div className={`text-sm font-bold flex items-center gap-2 ${status === 'SECURE' ? 'text-secure' : 'text-danger'}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'SECURE' ? 'bg-secure animate-pulse' : 'bg-danger'}`} />
              {status}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass-panel border-danger/30 bg-danger/5 p-3 rounded flex gap-2 text-danger text-sm"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </header>

      <div className="flex-1 flex flex-col overflow-hidden px-6 mb-6">
        {/* Messages Container */}
        <div className="flex-1 glass-panel rounded-lg border-accent/10 flex flex-col overflow-hidden relative">
          <AnimatePresence>
            {status === 'HANDSHAKING' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <Zap className="text-accent animate-pulse mb-6" size={48} />
                <h3 className="text-xl text-accent mb-2">Establishing Secure Connection</h3>
                <p className="text-sm text-textMuted mb-8">PQC Key Exchange in Progress</p>
                <div className="flex gap-4 text-xs font-mono text-textMuted">
                  <span className="animate-bounce" style={{animationDelay: "0s"}}>[Kyber]</span>
                  <span className="animate-bounce" style={{animationDelay: "0.2s"}}>[BIKE]</span>
                  <span className="animate-bounce" style={{animationDelay: "0.4s"}}>[SPHINCS+]</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth">
            {messages.length === 0 && status === 'SECURE' && (
              <div className="h-full flex items-center justify-center text-textMuted text-sm">
                <Shield size={16} className="mr-2 text-secure" /> Secure channel established. Ready to chat!
              </div>
            )}
            {messages.map((m) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={m.id} 
                className={`flex flex-col max-w-[75%] ${m.isSelf ? 'self-end' : 'self-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-textMuted">{m.sender}</span>
                  <span className="text-[10px] text-textMuted/50 border border-white/10 px-1 rounded">{m.combo_used}</span>
                </div>
                <div className={`p-4 rounded-lg relative group break-words ${
                  m.isSelf 
                    ? 'bg-accent/15 border border-accent/30 text-textMain rounded-tr-none shadow-lg shadow-accent/20' 
                    : 'bg-white/8 border border-white/15 text-textMain rounded-tl-none shadow-lg shadow-black/20'
                }`}>
                  {m.content}
                  
                  {/* Meta tooltip on hover */}
                  <div className="absolute top-1/2 -right-40 -translate-y-1/2 hidden group-hover:flex flex-col bg-panel p-2 rounded text-[9px] border border-white/10 shadow-xl z-10 w-32">
                    <span className="text-secure flex items-center gap-1 mb-1"><Lock size={8}/> Encrypted & Authenticated</span>
                    <span className="text-textMuted">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        {status === 'SECURE' ? (
          <form onSubmit={handleSend} className="mt-6 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message... (End-to-End Encrypted)"
              className="flex-1 bg-white/5 border border-accent/20 rounded px-4 py-3 text-textMain placeholder-textMuted/50 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
              disabled={status !== 'SECURE'}
            />
            <button
              type="submit"
              disabled={!input.trim() || status !== 'SECURE'}
              className="bg-accent text-black px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
              Send
            </button>
          </form>
        ) : (
          <div className="mt-6 bg-yellow/10 border border-yellow/30 rounded px-4 py-3 text-yellow text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {status === 'HANDSHAKING' && 'Establishing secure connection...'}
            {status === 'DISCONNECTED' && 'Connecting... (Will auto-reconnect)'}
          </div>
        )}
      </div>

      <footer className="text-center text-textMuted text-xs px-6 pb-4 border-t border-white/5 pt-4">
        <p>🔒 Post-Quantum Cryptography • Messages encrypted with AES-256-GCM derived from hybrid KDF</p>
      </footer>
    </div>
  );
}
