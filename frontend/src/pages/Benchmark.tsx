import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { apiClient } from '../api/client';
import { BenchmarkChart } from '../components/BenchmarkChart';

export default function Benchmark() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runBench = async () => {
    setRunning(true);
    try {
      const res = await apiClient.post('/api/benchmark/run');
      // Format dict to array for chart
      const arr = Object.keys(res.data.results).map(key => ({
        combo_id: key,
        ...res.data.results[key]
      }));
      setResults(arr);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // Optionally fetch history on mount
  }, []);

  return (
    <div className="h-full flex flex-col pt-8 font-mono">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl text-textMain neon-text-blue mb-2">PQC BENCHMARK SUITE</h2>
          <p className="text-sm text-textMuted uppercase tracking-widest">Measure Cryptographic Performance (Key Gen, Encap, Decap)</p>
        </div>
        
        <button 
          onClick={runBench} disabled={running}
          className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 px-6 py-2 rounded font-bold uppercase text-sm tracking-widest disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          {running ? <span className="animate-spin text-xl leading-none px-1">⟳</span> : <Play size={16} />} 
          {running ? 'Executing Suite...' : 'Run All Benchmarks'}
        </button>
      </header>

      <div className="grid grid-cols-2 gap-8 flex-1">
        <div className="glass-panel p-6 rounded-lg border-accent/20 flex flex-col justify-center relative min-h-[400px]">
          {results.length > 0 ? (
            <BenchmarkChart data={results} />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-textMuted text-sm">
                NO DATA. INITIATE SUITE.
             </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-lg border-accent/20 overflow-y-auto">
          <h3 className="uppercase text-sm text-textMuted tracking-widest mb-6 border-b border-white/5 pb-2">Tabular Results</h3>
          {results.length === 0 ? (
            <p className="text-xs text-textMuted/50">Execute benchmark to view latency arrays.</p>
          ) : (
            <table className="w-full text-left text-xs text-textMain">
              <thead>
                <tr className="border-b border-white/10 text-textMuted">
                  <th className="pb-2 font-normal">Combo</th>
                  <th className="pb-2 font-normal">Total(ms)</th>
                  <th className="pb-2 font-normal">KeyGen</th>
                  <th className="pb-2 font-normal">Encap</th>
                  <th className="pb-2 font-normal">Decap</th>
                  <th className="pb-2 font-normal">CT(bytes)</th>
                </tr>
              </thead>
              <tbody>
                {results.sort((a,b) => a.total_time_ms_mean - b.total_time_ms_mean).map(r => (
                   <tr key={r.combo_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="py-3 text-accent">{r.combo_id}</td>
                     <td className="py-3 font-bold">{r.total_time_ms_mean.toFixed(2)}</td>
                     <td className="py-3">{r.key_gen_ms_mean.toFixed(2)}</td>
                     <td className="py-3">{r.encap_ms_mean.toFixed(2)}</td>
                     <td className="py-3">{r.decap_ms_mean.toFixed(2)}</td>
                     <td className="py-3">{r.ciphertext_size}</td>
                   </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
