import React, { useState, useEffect } from 'react';
import { Shield, Activity, Clock, Menu, X, Cpu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentActive: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentActive, onNavigate }) => {
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-white font-display flex overflow-hidden selection:bg-lime/30">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-bg2 border-r border-white/10 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lime w-8 h-8 flex items-center justify-center border border-lime/20 bg-lime/5 rounded-sm">
              <Cpu size={20} />
            </div>
            {isSidebarOpen && <span className="text-xl font-black tracking-widest grad-text">VEXO</span>}
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-muted hover:text-lime transition-colors">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem 
            icon={<Activity size={18} />} 
            label="DASHBOARD" 
            active={currentActive === 'DASHBOARD'} 
            isOpen={isSidebarOpen} 
            onClick={() => onNavigate('DASHBOARD')}
          />
          <NavItem 
            icon={<Shield size={18} />} 
            label="SIMULATION" 
            active={currentActive === 'SIMULATION'} 
            isOpen={isSidebarOpen} 
            onClick={() => onNavigate('SIMULATION')}
          />
          <NavItem 
            icon={<Clock size={18} />} 
            label="DEBRIEF" 
            active={currentActive === 'SUMMARY'} 
            isOpen={isSidebarOpen} 
            onClick={() => onNavigate('SUMMARY')}
          />
        </nav>

        <div className="p-4 border-t border-white/10 bg-bg/50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-amber opacity-70 uppercase tracking-widest font-mono">Rank Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              {isSidebarOpen && <span className="text-xs font-bold text-lime tracking-wider uppercase">NEON NINJA</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main HUD Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-bg">
        {/* Top HUD */}
        <header className="h-[68px] border-b border-white/10 bg-bg/92 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-lime opacity-70 uppercase tracking-widest font-mono">System Status</span>
              <span className="text-xs font-mono text-muted">CORE_OPERATIONAL_V1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-8 font-mono">
            <div className="text-right">
              <span className="block text-[10px] text-amber opacity-70 uppercase">Local Pulse</span>
              <span className="text-sm text-amber tracking-widest font-bold">{time.toLocaleTimeString([], { hour12: false })}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-lime)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Corner Decals */}
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-20 hidden md:block">
          <div className="text-[10px] font-mono text-right text-muted uppercase tracking-tighter">
            [ACCESS_GRANTED]<br />
            [SCAN_ACTIVE_CORE_01]
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, isOpen = true, onClick }: { icon: React.ReactNode, label: string, active?: boolean, isOpen?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center gap-4 px-4 py-3 rounded-[2px] border transition-all duration-200 cursor-pointer group
      ${active 
        ? 'bg-lime/10 border-lime/30 text-lime shadow-[0_0_15px_rgba(163,230,53,0.1)]' 
        : 'border-transparent text-muted hover:bg-surface hover:text-white hover:border-white/10'}
    `}
  >
    <div className={`${active ? 'text-lime' : 'text-muted group-hover:text-lime'} transition-colors`}>
      {icon}
    </div>
    {isOpen && <span className="text-[.7rem] font-bold tracking-[.15em] uppercase">{label}</span>}
  </div>
);

export default Layout;
