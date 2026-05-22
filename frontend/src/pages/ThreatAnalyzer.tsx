import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { apiClient } from '../api/client';
import { AlgoSelector, MLRecommendation } from '../components/AlgoSelector';
import { ThreatMeter } from '../components/ThreatMeter';

export default function ThreatAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [threat, setThreat] = useState('UNKNOWN');
  const [rec, setRec] = useState<MLRecommendation | null>(null);

  const [form, setForm] = useState({
    session_duration_mins: 60,
    data_sensitivity: 5,
    network_type: 2, // 0 Internal, 1 VPN, 2 Public, 3 Tor
    geo_risk: 1, // 0 Low, 1 Med, 2 High
    payload_size_class: 1
  });

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Classify Threat
      const resT = await apiClient.post('/api/ml/threat_classify', form);
      const t = resT.data.threat_level;
      setThreat(t);

      // 2. Based on threat, ask Recommender
      const resR = await apiClient.post('/api/ml/recommend_combo', {
        threat_level_str: t,
        latency_budget_ms: 100, // Fixed for demo UI
        key_size_budget_bytes: 5000,
        security_level_req: form.data_sensitivity
      });
      setRec(resR.data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-8 font-mono">
      <header className="mb-8">
        <h2 className="text-3xl text-textMain neon-text-blue mb-2 flex items-center gap-3">
           <ShieldAlert size={28} className="text-accent"/> ML THREAT INTELLIGENCE
        </h2>
        <p className="text-sm text-textMuted uppercase tracking-widest mt-2">
          Neural Net Threat Profiler & Random Forest Algorithm Selector
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        
        {/* Left: Input Form */}
        <div className="col-span-5 glass-panel rounded-lg border-accent/20 p-6 flex flex-col">
          <h3 className="uppercase text-sm text-textMuted tracking-widest mb-6 border-b border-white/5 pb-2">Session Parameters (Input)</h3>
          
          <form id="threat-form" onSubmit={analyze} className="flex-1 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-textMuted uppercase">Data Sensitivity (1-5)</label>
              <input type="range" min="1" max="5" value={form.data_sensitivity} onChange={(e) => setForm({...form, data_sensitivity: parseInt(e.target.value)})} 
                className="accent-accent" />
              <div className="text-right text-accent text-xs font-bold">{form.data_sensitivity}/5</div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textMuted uppercase">Network Infrastructure</label>
              <select 
                value={form.network_type} onChange={(e) => setForm({...form, network_type: parseInt(e.target.value)})}
                className="bg-panel border border-white/10 p-2 text-sm text-textMain focus:outline-none focus:border-accent rounded"
              >
                <option value={0}>Internal Intranet</option>
                <option value={1}>Secured VPN</option>
                <option value={2}>Public Internet</option>
                <option value={3}>Tor Network</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textMuted uppercase">Geo-Political Risk</label>
              <select 
                value={form.geo_risk} onChange={(e) => setForm({...form, geo_risk: parseInt(e.target.value)})}
                className="bg-panel border border-white/10 p-2 text-sm text-textMain focus:outline-none focus:border-accent rounded"
              >
                <option value={0}>Low Risk Zone</option>
                <option value={1}>Medium Risk Zone</option>
                <option value={2}>High Risk / Sanctioned</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-textMuted uppercase">Payload Size Profile</label>
              <select 
                value={form.payload_size_class} onChange={(e) => setForm({...form, payload_size_class: parseInt(e.target.value)})}
                className="bg-panel border border-white/10 p-2 text-sm text-textMain focus:outline-none focus:border-accent rounded"
              >
                <option value={0}>Small Content (Chat/Text)</option>
                <option value={1}>Medium Content (Docs/Intel)</option>
                <option value={2}>Large Content (Video/Binaries)</option>
              </select>
            </div>

            <button 
              type="submit" disabled={loading}
              className="mt-auto bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 px-6 py-3 rounded font-bold uppercase text-sm tracking-widest disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-pulse">ANALYZING...</span> : 'Initiate ML Inference'}
            </button>
          </form>
        </div>

        {/* Right: Output */}
        <div className="col-span-7 flex flex-col gap-8">
           <div className="glass-panel p-6 rounded-lg flex flex-col items-center justify-center relative min-h-[250px]">
             <div className="absolute top-4 left-4 text-[10px] text-textMuted uppercase">Neural Net Output</div>
             <ThreatMeter level={threat} />
           </div>

           <div className="glass-panel rounded-lg p-6 flex-1 flex flex-col relative overflow-y-auto">
             <div className="absolute top-4 left-4 text-[10px] text-textMuted uppercase z-10">Random Forest Output</div>
             <div className="mt-8 relative z-0">
               <AlgoSelector prediction={rec} onSelect={()=>{}} currentCombo={rec?.recommended_combo || ''} />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
