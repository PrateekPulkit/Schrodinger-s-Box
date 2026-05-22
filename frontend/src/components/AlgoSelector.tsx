import { motion } from 'framer-motion';

export interface MLRecommendation {
  recommended_combo: string;
  confidences: Record<string, number>;
}

export function AlgoSelector({
  prediction,
  onSelect,
  currentCombo
}: {
  prediction: MLRecommendation | null;
  onSelect: (combo: string) => void;
  currentCombo: string;
}) {
  if (!prediction) {
    return (
      <div className="h-full flex items-center justify-center text-textMuted font-mono">
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
          Awaiting ML Inference...
        </div>
      </div>
    );
  }

  const combos = Object.keys(prediction.confidences).sort((a,b) => prediction.confidences[b] - prediction.confidences[a]);

  return (
    <div className="flex flex-col gap-4 font-mono">
      <div className="text-sm text-textMuted flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
        ML OPTIMAL RECOMMENDATION DETECTED
      </div>
      
      {combos.map((combo) => {
        const conf = prediction.confidences[combo] * 100;
        const isRec = combo === prediction.recommended_combo;
        const isActive = combo === currentCombo;

        return (
          <div 
            key={combo}
            onClick={() => onSelect(combo)}
            className={`p-3 rounded border hover:cursor-pointer transition-all duration-300 relative overflow-hidden group
              ${isActive ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'border-white/10 bg-panel hover:bg-white/5'}`}
          >
            {isRec && <div className="absolute top-0 right-0 px-2 py-1 bg-secure text-black text-[10px] uppercase font-bold tracking-widest rounded-bl">Optimal</div>}
            
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${isActive ? 'text-accent' : 'text-textMain'}`}>{combo}</span>
              <span className="text-xs text-textMuted">{conf.toFixed(1)}% CONFIDENCE</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${conf}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${isRec ? 'bg-secure' : 'bg-accent'}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
