import { motion } from 'framer-motion';

export interface CircuitData {
  num_qubits: number;
  operations: Array<{
    type: string;
    name?: string;
    qubits?: number[];
    qubit?: number;
    clbit?: number;
    label?: string;
  }>;
}

export function QuantumCircuit({ data, isCollapsed }: { data: CircuitData | null, isCollapsed: boolean }) {
  if (!data) return <div className="text-textMuted font-mono animate-pulse">Awaiting Quantum State...</div>;

  return (
    <div className="relative w-full h-full min-h-[200px] flex flex-col justify-center gap-[40px] py-8 pl-12 pr-4 overflow-x-auto">
      {/* Qubit Lines */}
      {Array.from({ length: data.num_qubits }).map((_, i) => (
        <div key={`qubit-${i}`} className="relative h-[2px] w-full bg-[#00d4ff]/20">
          <span className="absolute -left-10 -top-3 text-accent font-mono text-sm">q_{i}</span>
          
          {/* Operations mapped onto the line */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center gap-6 px-12">
            {data.operations.map((op, opIdx) => {
              const isOnThisLine = op.qubits?.includes(i) || op.qubit === i;
              if (!isOnThisLine) return <div key={opIdx} className="w-10 h-10 shrink-0" />; // Spacer
              
              if (op.type === 'barrier') {
                return (
                  <motion.div 
                    initial={{ scaleY: 0 }} 
                    animate={{ scaleY: 1 }} 
                    key={opIdx} 
                    className="w-1 h-16 bg-white/30 border-l border-r border-dashed border-[#00d4ff]/50 shrink-0 -translate-y-8"
                  />
                );
              }

              if (op.type === 'measure') {
                return (
                  <motion.div 
                    key={opIdx}
                    animate={isCollapsed ? { scale: [1, 1.2, 1], borderColor: '#00ff88' } : {}}
                    className="w-10 h-10 shrink-0 bg-panel border-2 border-accent flex items-center justify-center -translate-y-5 rounded flex-col relative"
                  >
                    <div className="w-6 h-4 border-t-2 border-accent rounded-t-full absolute top-1" />
                    <div className="w-[2px] h-3 bg-accent absolute top-2 origin-bottom rotate-45" />
                  </motion.div>
                );
              }

              // Normal Gate
              const isMultiQubit = op.qubits && op.qubits.length > 1;
              const isControlTarget = isMultiQubit && op.name === 'CX';

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: opIdx * 0.1 }}
                  key={opIdx}
                  className={`shrink-0 flex items-center justify-center -translate-y-5
                    ${isControlTarget ? 'w-4 h-4 rounded-full bg-accent' : 'w-10 h-10 bg-panel border border-accent rounded text-accent font-mono font-bold'}`}
                >
                  {!isControlTarget ? op.name : ''}
                  {isControlTarget && op.qubits?.[0] === i && (
                    <div className="w-[2px] h-[40px] bg-accent absolute top-4 z-[-1]" />
                  )}
                  {isControlTarget && op.qubits?.[1] === i && (
                    <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center bg-panel absolute">
                      <div className="w-4 h-[2px] bg-accent absolute" />
                      <div className="w-[2px] h-4 bg-accent absolute" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
