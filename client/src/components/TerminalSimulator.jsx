import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

const TerminalSimulator = ({ password, isActive }) => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  const generateLogs = (pwd) => {
    if (!pwd) return [];
    
    const baseLogs = [
      `[INFO] Initializing Crack Engine v4.2.0...`,
      `[SCAN] Target sequence: ${'*'.repeat(pwd.length)}`,
      `[INFO] Calculating entropy...`,
      `[DATA] Entropy: ${Math.round(pwd.length * 4.7)} bits detected`,
      `[SCAN] Loading dictionary: common_passwords.txt...`,
      `[DICT] Iterating top 100,000 common patterns...`,
    ];

    if (pwd.length < 8) {
      baseLogs.push(`[WARN] Sequence length below threshold. Brute-force likely in < 1s.`);
    }

    if (/[0-9]/.test(pwd)) baseLogs.push(`[INFO] Numeric sub-sequence detected.`);
    if (/[A-Z]/.test(pwd)) baseLogs.push(`[INFO] Case variance detected.`);
    
    // Simulate iterative attack logs
    const attackLogs = [
      `[ATTACK] Starting parallel brute-force (Core 0-7)...`,
      `[ATTACK] Index 0: 0x00... FAIL`,
      `[ATTACK] Index 0: 0x01... FAIL`,
      `[ATTACK] Hashing with SHA-256 rounds...`,
      `[INFO] Analysis complete. Result: ${pwd.length > 12 ? 'RESISTANT' : 'VULNERABLE'}`,
    ];

    return [...baseLogs, ...attackLogs];
  };

  useEffect(() => {
    if (isActive && password) {
      const allLogs = generateLogs(password);
      setLogs([]); // Reset logs
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < allLogs.length) {
          setLogs(prev => [...prev.slice(-15), allLogs[i]]); // Keep only last 15 logs
          i++;
        } else {
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [password, isActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 glass-panel rounded-xl overflow-hidden border border-cyber-neon/30 bg-black/90"
    >
      <div className="bg-cyber-neon/10 border-b border-cyber-neon/30 p-2 flex justify-between items-center px-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyber-neon">
          <Terminal className="w-4 h-4" />
          DEV_MODE: CRACK_SIMULATION_LOGS
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="p-4 font-mono text-[10px] sm:text-xs leading-relaxed h-48 overflow-y-auto relative scroll-smooth"
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 opacity-30 bg-[length:100%_2px,3px_100%]"></div>
        
        {logs.filter(l => typeof l === 'string').map((log, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <span className="text-gray-600">[{new Date().toLocaleTimeString('en-GB')}]</span>
            <span className={log.includes('WARN') || log.includes('VULNERABLE') ? 'text-cyber-red' : log.includes('ATTACK') ? 'text-cyber-purple' : 'text-cyber-neon'}>
              {log}
            </span>
          </div>
        ))}
        {logs.length > 0 && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-cyber-neon inline-block align-middle ml-1"
          />
        )}
      </div>
    </motion.div>
  );
};

export default TerminalSimulator;
