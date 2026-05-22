import { useState } from 'react';
import { Play, Cpu } from 'lucide-react';
import { apiClient } from '../api/client';
import { QuantumCircuit, CircuitData } from '../components/QuantumCircuit';

export default function QuantumSim() {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<CircuitData | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [probs, setProbs] = useState<Record<string, number>>({});

  const simulate = async () => {
    setRunning(true);
    setCollapsed(false);
    try {
      const res = await apiClient.get('/api/quantum/simulate');
      setData(res.data.circuit_topology);
      setProbs(res.data.state_probabilities);
      
      // Animate collapse after a short delay
      setTimeout(() => setCollapsed(true), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-8 font-mono">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl text-textMain neon-text-blue mb-2 flex items-center gap-3">
             <Cpu size={28} className="text-accent"/> QUANTUM CIRCUIT SIM
          </h2>
          <p className="text-sm text-textMuted uppercase tracking-widest max-w-[600px] mt-2 leading-relaxed">
            Metaphorical visualization of Hybrid PQC: 
            <span className="text-accent px-1">Superposition</span> (key uncertainty) &rarr;
            <span className="text-accent px-1">Entanglement</span> (client-server bond) &rarr;
            <span className="text-secure px-1">Collapse</span> (final key negotiated)
          </p>
        </div>
        
        <button 
          onClick={simulate} disabled={running}
          className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 px-6 py-2 rounded font-bold uppercase text-sm tracking-widest disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          {running ? <span className="animate-spin text-xl leading-none px-1">⟳</span> : <Play size={16} />} 
          Run Simulation
        </button>
      </header>

      <div className="flex-1 glass-panel rounded-lg border-accent/20 relative overflow-hidden flex flex-col">
        <div className="h-[60%] border-b border-white/5 relative">
          <QuantumCircuit data={data} isCollapsed={collapsed} />
        </div>
        <div className="h-[40%] bg-panel p-6 flex flex-col">
           <h3 className="uppercase text-sm text-textMuted tracking-widest mb-4">Statevector Probabilities {collapsed && <span className="text-secure ml-2 animate-pulse">[COLLAPSED]</span>}</h3>
           {Object.keys(probs).length > 0 ? (
             <div className="flex gap-4 items-end flex-1 pb-4">
               {Object.entries(probs).map(([state, prob]) => (
                  <div key={state} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                    <div className="w-full relative bg-black/40 rounded flex flex-col-reverse max-w-[80px]" style={{ height: '100%' }}>
                      <div 
                        className={`w-full rounded transition-all duration-1000 ease-out ${collapsed && prob > 0 ? 'bg-secure shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'bg-accent/40'}`}
                        style={{ height: `${prob * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-textMuted group-hover:text-accent transition-colors">|{state}⟩</span>
                  </div>
               ))}
             </div>
           ) : (
             <div className="flex-1 flex items-center justify-center text-textMuted text-xs">AWAITING EXECUTION</div>
           )}
        </div>
      </div>
    </div>
  );
}
