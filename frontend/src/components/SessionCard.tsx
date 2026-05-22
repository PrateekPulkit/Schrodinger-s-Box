import { Shield, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function SessionCard({ sessionId, combo, threat, ms }: { sessionId: string, combo: string, threat: string, ms: number }) {
  const getThreatColor = () => {
    switch (threat) {
      case 'CRITICAL': return 'text-danger';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-400';
      default: return 'text-secure';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-4 rounded-lg font-mono relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 group-hover:bg-accent transition-colors" />
      
      <div className="flex justify-between items-start mb-4 pl-2">
        <div>
          <h3 className="text-xs text-textMuted uppercase mb-1 flex items-center gap-1">
            <Shield size={12} className={getThreatColor()} /> 
            Session ID
          </h3>
          <p className="text-sm font-bold text-textMain">{sessionId}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs text-textMuted uppercase mb-1">Status</h3>
          <div className="text-xs px-2 py-0.5 rounded bg-secure/10 text-secure border border-secure/20 animate-pulse">
            SECURE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pl-2 mt-4 pt-4 border-t border-white/5">
        <div>
          <h3 className="text-[10px] text-textMuted uppercase flex items-center gap-1">
            <Activity size={10} /> Active Combo
          </h3>
          <p className="text-sm text-accent neon-text-blue">{combo}</p>
        </div>
        <div>
          <h3 className="text-[10px] text-textMuted uppercase flex items-center gap-1">
            <Clock size={10} /> Uptime
          </h3>
          <p className="text-sm text-textMain">{ms} mins</p>
        </div>
      </div>
    </motion.div>
  );
}
