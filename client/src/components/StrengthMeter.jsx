import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Zap, Activity, Eye, EyeOff, Hash, Terminal as TerminalIcon } from 'lucide-react';
import { analyzePassword } from '../services/api';
import TerminalSimulator from './TerminalSimulator';

const StrengthMeter = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (password) {
        try {
          const data = await analyzePassword(password);
          setResult(data);
        } catch (error) {
          console.error("Failed to analyze password");
        }
      } else {
        setResult(null);
      }
      setIsTyping(false);
    }, 500);

    setIsTyping(true);
    return () => clearTimeout(delayDebounceFn);
  }, [password]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-cyber-neon';
    if (score >= 60) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-cyber-red';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-cyber-neon';
    if (score >= 60) return 'bg-green-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-cyber-red';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
      {/* Input Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-50"></div>
          
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyber-neon" />
            <span className="text-white">THREAT ANALYSIS</span>
          </h2>
          <p className="text-gray-400 mb-6 text-xs uppercase tracking-wider">
            Enter sequence to begin vulnerability scan
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-4 pl-4 pr-12 text-lg text-white font-mono focus:outline-none focus:border-cyber-neon/50 focus:ring-1 focus:ring-cyber-neon/50 transition-all placeholder-gray-600"
              placeholder="Inject payload here..."
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-neon transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {/* Typing Indicator */}
            {isTyping && password && (
              <div className="absolute -bottom-6 left-2 flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyber-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-cyber-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-cyber-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </form>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsDevMode(!isDevMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] uppercase font-bold ${
                isDevMode 
                  ? 'bg-cyber-purple/20 border-cyber-purple/50 text-cyber-purple shadow-[0_0_10px_rgba(176,38,255,0.2)]' 
                  : 'bg-black/50 border-white/10 text-gray-500 hover:text-gray-300'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              {isDevMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
            </button>
          </div>

          <AnimatePresence>
            {isDevMode && <TerminalSimulator password={password} isActive={isDevMode} />}
          </AnimatePresence>
        </div>

        {/* Quick Stats Panel */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
            <div className={`p-3 rounded-lg ${result ? getScoreBg(result.score).replace('bg-', 'bg-').replace('-400', '-900/40') : 'bg-gray-800'} bg-opacity-20`}>
              <Activity className={`w-6 h-6 ${result ? getScoreColor(result.score) : 'text-gray-500'}`} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">Entropy</div>
              <div className="text-xl font-bold text-white font-mono">
                {result ? result.entropy : '0.0'} <span className="text-xs text-gray-500">bits</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
            <div className={`p-3 rounded-lg ${result && result.hasPattern ? 'bg-cyber-red/20' : 'bg-green-900/40'}`}>
              <Hash className={`w-6 h-6 ${result && result.hasPattern ? 'text-cyber-red' : 'text-green-400'}`} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">Pattern Match</div>
              <div className="text-md font-bold text-white uppercase">
                {result ? (result.hasPattern ? 'Detected' : 'Clear') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full lg:w-1/2">
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden">
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neon/5 to-transparent h-20 opacity-30 animate-scan pointer-events-none"></div>

          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-white/5 pb-2">
            Intelligence Report
          </h3>

          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
              <ShieldAlert className="w-16 h-16 text-gray-600" />
              <p className="font-mono uppercase tracking-widest text-xs">Awaiting input signal...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full gap-6"
            >
              <div className="text-center">
                <div className={`text-6xl font-black font-mono tracking-tighter ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mt-2">
                  System Security Score
                </div>
              </div>

              {/* Strength Bar */}
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${getScoreBg(result.score)} shadow-[0_0_10px_currentColor]`}
                />
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Est. Crack Time:</span>
                  <span className={`font-bold ${getScoreColor(result.score)}`}>
                    {result.crackTimeDisplay}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Length Constraint:</span>
                  <span className="font-bold text-white">{result.passwordLength} chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Breach Status:</span>
                  <span className={`font-bold ${result.isPwned ? 'text-cyber-red' : 'text-green-400'}`}>
                    {result.isPwned ? `BREACH DETECTED (${result.breachCount.toLocaleString()})` : 'SECURE / NO BREACHES'}
                  </span>
                </div>
              </div>

              {/* Feedback Terminal */}
              <div className="flex-1 bg-black p-4 rounded-lg font-mono text-xs overflow-y-auto border border-white/10 shadow-inner relative">
                <div className="text-cyber-neon mb-2">root@soc:~# ./analyze_vulnerabilities</div>
                {result.feedback.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-400 mt-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>[OK] No major vulnerabilities detected in structure.</span>
                  </div>
                ) : (
                  <ul className="space-y-2 mt-2">
                    {result.feedback.map((f, i) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="text-cyber-red flex gap-2"
                      >
                        <span className="text-gray-500">{'>'}</span> {f}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrengthMeter;
