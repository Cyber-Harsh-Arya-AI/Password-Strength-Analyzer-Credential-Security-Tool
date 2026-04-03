import { useState } from 'react';
import { Shield, Lock, Cpu, Server, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-mono text-sm relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyber-neon/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyber-purple/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Header Pipeline */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyber-neon/10 rounded-lg border border-cyber-neon/30">
                <Shield className="w-6 h-6 text-cyber-neon animate-pulse-fast" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-white">
                  SOC<span className="text-cyber-neon">.NEXUS</span>
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest hidden sm:block">
                  Credential Security & Vulnerability Analysis
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === 'analyzer' 
                    ? 'bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Analyzer Engine
              </button>
              <button
                onClick={() => setActiveTab('toolkit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === 'toolkit' 
                    ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Lock className="w-4 h-4" />
                Security Toolkit
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-cyber-neon bg-cyber-neon/10 px-3 py-1.5 rounded-full border border-cyber-neon/20">
                <div className="w-2 h-2 rounded-full bg-cyber-neon animate-ping"></div>
                SYSTEM ONLINE
              </div>
              <button 
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        <Dashboard activeTab={activeTab} />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 glass-panel py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>NODE: SEC-ALPHA-01</span>
          </div>
          <div>
            ENCRYPTED CONNECTION // AES-256
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
