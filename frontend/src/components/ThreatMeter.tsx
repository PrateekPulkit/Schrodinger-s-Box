import { motion } from 'framer-motion';

export function ThreatMeter({ level }: { level: string }) {
  const getMetrics = () => {
    switch(level) {
      case 'LOW': return { percentage: 20, color: '#00ff88', label: 'LOW RISK' };
      case 'MEDIUM': return { percentage: 50, color: '#f59e0b', label: 'ELEVATED' };
      case 'HIGH': return { percentage: 80, color: '#f97316', label: 'HIGH THREAT' };
      case 'CRITICAL': return { percentage: 100, color: '#ff3366', label: 'CRITICAL EVENT' };
      default: return { percentage: 0, color: '#8b9bb4', label: 'ANALYZING...' };
    }
  };

  const { percentage, color, label } = getMetrics();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Ring */}
        <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" 
          />
          <motion.circle 
            cx="50" cy="50" r="45" 
            fill="none" stroke={color} strokeWidth="8"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Inner glow */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-20"
          animate={{ backgroundColor: color }}
          transition={{ duration: 1 }}
        />

        <div className="text-center z-10 font-mono">
          <motion.div 
            key={level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
            style={{ color }}
          >
            {level === 'UNKNOWN' ? '--' : level}
          </motion.div>
          <div className="text-[10px] text-textMuted tracking-widest mt-1">THREAT LEVEL</div>
        </div>
      </div>
      
      {/* Bars beneath */}
      <div className="flex gap-1 mt-4">
        {Array.from({length: 20}).map((_, i) => (
          <motion.div 
            key={i}
            className="w-1.5 h-6 rounded-sm bg-black border border-white/10"
            animate={(i * 5) < percentage ? { backgroundColor: color, opacity: 1 } : { backgroundColor: 'transparent', opacity: 0.3 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}
