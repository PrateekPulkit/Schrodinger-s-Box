import { useEffect, useState } from 'react';
import { Shield, Server, Activity, AlertTriangle } from 'lucide-react';
import { SessionCard } from '../components/SessionCard';
import { ThreatMeter } from '../components/ThreatMeter';
import { apiClient } from '../api/client';
import { useSession } from '../hooks/useSession';

export default function Dashboard() {
  const { sessionId } = useSession();
  const [stats, setStats] = useState({ activeSessions: 12, threatLevel: 'CRITICAL', avgLatency: 145 });

  return (
    <div className="h-full flex flex-col pt-8">
      <header className="mb-8 font-mono">
        <h2 className="text-3xl text-textMain neon-text-blue mb-2">OPERATIONS OVERVIEW</h2>
        <p className="text-textMuted text-sm tracking-widest uppercase">System status: active defense perimeter</p>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1 pb-8">
        {/* Left Column - Main Stats & Network Map */}
        <div className="col-span-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-lg flex flex-col bg-accent/5 border-accent/20">
              <div className="flex items-center gap-3 text-accent mb-4">
                <Server size={20} />
                <h3 className="font-mono text-sm uppercase tracking-widest">Active Sessions</h3>
              </div>
              <div className="text-4xl font-mono font-bold text-textMain">{stats.activeSessions}</div>
              <div className="text-xs text-textMuted mt-2">+3 in last hour</div>
            </div>

            <div className="glass-panel p-6 rounded-lg flex flex-col bg-danger/5 border-danger/20">
              <div className="flex items-center gap-3 text-danger mb-4">
                <AlertTriangle size={20} />
                <h3 className="font-mono text-sm uppercase tracking-widest">Sys Threat Obj</h3>
              </div>
              <div className="text-2xl font-mono font-bold text-danger mt-2">{stats.threatLevel}</div>
            </div>

            <div className="glass-panel p-6 rounded-lg flex flex-col bg-secure/5 border-secure/20">
              <div className="flex items-center gap-3 text-secure mb-4">
                <Activity size={20} />
                <h3 className="font-mono text-sm uppercase tracking-widest">Avg Crypto Latency</h3>
              </div>
              <div className="text-4xl font-mono font-bold text-textMain">{stats.avgLatency}<span className="text-lg">ms</span></div>
              <div className="text-xs text-secure mt-2 animate-pulse">Within SLA bounds</div>
            </div>
          </div>

          <div className="flex-1 glass-panel rounded-lg p-6 relative overflow-hidden group">
            <h3 className="font-mono text-sm uppercase tracking-widest text-textMuted mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Global Telemetry (Simulated Geo-Map)
            </h3>
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Equirectangular_projection_SW.jpg')] bg-cover bg-center grayscale mix-blend-screen" />
            <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-danger animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-secure animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-secure animate-pulse" />
          </div>

        </div>

        {/* Right Column - Threat Meter & Sessions */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 rounded-full bg-danger animate-ping" />
             </div>
             <ThreatMeter level={stats.threatLevel} />
          </div>

          <div className="flex-1 glass-panel rounded-lg p-6 flex flex-col gap-4 overflow-y-auto">
            <h3 className="font-mono text-sm uppercase tracking-widest text-textMuted sticky top-0 bg-panel/90 pb-2 z-10 border-b border-white/5">
              Live Secure Links
            </h3>
            
            <SessionCard sessionId={sessionId} combo="COMBO-A" threat={stats.threatLevel} ms={12} />
            <SessionCard sessionId="Sess_9XyZ12" combo="COMBO-C" threat="MEDIUM" ms={45} />
            <SessionCard sessionId="Sess_7AaBc4" combo="COMBO-E" threat="LOW" ms={120} />
          </div>
        </div>

      </div>
    </div>
  );
}
