import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Shield, Activity, Cpu, Hexagon, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Benchmark from './pages/Benchmark';
import QuantumSim from './pages/QuantumSim';
import ThreatAnalyzer from './pages/ThreatAnalyzer';
import Login from './pages/Login';

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Command Centre', icon: <Hexagon size={18} />, roles: ['COMMANDER', 'FIELD_OPERATIVE', 'ANALYST'] },
    { path: '/chat', label: 'E2E Secure Link', icon: <Shield size={18} />, roles: ['COMMANDER', 'FIELD_OPERATIVE'] },
    { path: '/benchmark', label: 'PQC Benchmarks', icon: <Activity size={18} />, roles: ['COMMANDER', 'ANALYST'] },
    { path: '/quantum', label: 'Quantum Sim', icon: <Cpu size={18} />, roles: ['COMMANDER', 'ANALYST'] },
    { path: '/threat', label: 'Threat Analyzer', icon: <Shield size={18} />, roles: ['COMMANDER', 'ANALYST'] },
  ];

  const allowedItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="w-64 h-full glass-panel border-r border-[#00d4ff]/20 flex flex-col pt-8 z-10 flex-shrink-0">
      <div className="px-6 mb-12">
        <h1 className="text-xl font-mono text-accent neon-text-blue flex items-center gap-3">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
          SCHRÖDINGER
        </h1>
        <p className="text-[10px] text-textMuted uppercase mt-1 tracking-widest font-mono">Operations Command</p>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {allowedItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-mono text-sm
                ${active 
                  ? 'bg-accent/10 text-accent border border-accent/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                  : 'text-textMuted hover:text-textMain hover:bg-white/5'
                }`}
            >
              <span className={active ? 'animate-pulse' : ''}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      {user && (
        <div className="mt-4 px-6 mb-2">
          <div className="flex flex-col gap-1 mb-4 p-3 bg-white/5 border border-white/10 rounded">
            <span className="text-[10px] text-textMuted uppercase">Active Operative</span>
            <span className="text-sm font-bold text-accent">{user.username}</span>
            <span className="text-xs text-textMain bg-black/40 px-2 py-1 rounded w-fit border border-accent/20">{user.role}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded text-danger hover:bg-danger/10 text-sm font-bold transition-colors border border-transparent hover:border-danger/20"
          >
            <LogOut size={16} /> DISCONNECT
          </button>
        </div>
      )}

      <div className="p-4 border-t border-accent/10">
        <div className="text-xs text-textMuted flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secure animate-pulse" />
          SYSTEM SECURE
        </div>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-accent/30 selection:text-accent font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative p-8 z-10">
        <div className="max-w-7xl mx-auto h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/chat" 
              element={<ProtectedRoute allowedRoles={['COMMANDER', 'FIELD_OPERATIVE']}><Chat /></ProtectedRoute>} 
            />
            <Route 
              path="/benchmark" 
              element={<ProtectedRoute allowedRoles={['COMMANDER', 'ANALYST']}><Benchmark /></ProtectedRoute>} 
            />
            <Route 
              path="/quantum" 
              element={<ProtectedRoute allowedRoles={['COMMANDER', 'ANALYST']}><QuantumSim /></ProtectedRoute>} 
            />
            <Route 
              path="/threat" 
              element={<ProtectedRoute allowedRoles={['COMMANDER', 'ANALYST']}><ThreatAnalyzer /></ProtectedRoute>} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
