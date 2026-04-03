import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Shield, FileDigit, Copy, CheckCircle2, Languages, Binary, AlertCircle, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { generatePassword, generatePassphrase, hashText, convertData } from '../services/api';

const SecurityToolkit = () => {
  const [activeTool, setActiveTool] = useState('generator');
  const [generatedPass, setGeneratedPass] = useState('');
  const [copied, setCopied] = useState('');
  const [genOptions, setGenOptions] = useState({
    length: 16, numbers: true, symbols: true, uppercase: true, lowercase: true
  });
  const [passphraseOptions, setPassphraseOptions] = useState({
    wordCount: 4, separator: '-', includeNumber: true, capitalize: true
  });
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');
  
  const [hashInput, setHashInput] = useState('');
  const [hashAlgo, setHashAlgo] = useState('sha256');
  const [hashOutput, setHashOutput] = useState('');

  // Cipher Station State
  const [cipherInput, setCipherInput] = useState('');
  const [cipherResult, setCipherResult] = useState('');
  const [cipherType, setCipherType] = useState('base64');
  const [cipherMode, setCipherMode] = useState('encode');
  const [isConverting, setIsConverting] = useState(false);

  const handleGenerate = async () => {
    try {
      const data = await generatePassword(genOptions);
      setGeneratedPass(data.password);
      setCopied('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGeneratePassphrase = async () => {
    try {
      const data = await generatePassphrase(passphraseOptions);
      setGeneratedPassphrase(data.passphrase);
      setCopied('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleHash = async () => {
    if (!hashInput) return;
    try {
      const data = await hashText({ text: hashInput, algorithm: hashAlgo });
      setHashOutput(data.hash);
      setCopied('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = async () => {
    if (!cipherInput) return;
    setIsConverting(true);
    try {
      const data = await convertData(cipherInput, cipherType, cipherMode);
      if (data.success) {
        setCipherResult(data.result);
        setCopied('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  const handleSwap = () => {
    const newMode = cipherMode === 'encode' ? 'decode' : 'encode';
    setCipherMode(newMode);
    if (cipherResult) {
      setCipherInput(cipherResult);
      setCipherResult('');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex md:flex-col gap-2">
        <button 
          onClick={() => setActiveTool('generator')}
          className={`glass-panel p-4 rounded-xl flex items-center gap-3 transition-all ${
            activeTool === 'generator' ? 'bg-cyber-purple/20 border-cyber-purple/50' : 'hover:bg-white/5'
          }`}
        >
          <KeyRound className={`w-5 h-5 ${activeTool === 'generator' ? 'text-cyber-purple drop-shadow-[0_0_8px_currentColor]' : 'text-gray-400'}`} />
          <span className={`font-bold uppercase tracking-wider text-xs ${activeTool === 'generator' ? 'text-white' : 'text-gray-400'}`}>
            Token Forge
          </span>
        </button>

        <button 
          onClick={() => setActiveTool('passphrase')}
          className={`glass-panel p-4 rounded-xl flex items-center gap-3 transition-all ${
            activeTool === 'passphrase' ? 'bg-cyber-neon/20 border-cyber-neon/50' : 'hover:bg-white/5'
          }`}
        >
          <Languages className={`w-5 h-5 ${activeTool === 'passphrase' ? 'text-cyber-neon drop-shadow-[0_0_8px_currentColor]' : 'text-gray-400'}`} />
          <span className={`font-bold uppercase tracking-wider text-xs ${activeTool === 'passphrase' ? 'text-white' : 'text-gray-400'}`}>
            Passphrase Forge
          </span>
        </button>

        <button 
          onClick={() => setActiveTool('cipher')}
          className={`glass-panel p-4 rounded-xl flex items-center gap-3 transition-all ${
            activeTool === 'cipher' ? 'bg-amber-500/20 border-amber-500/50' : 'hover:bg-white/5'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${activeTool === 'cipher' ? 'text-amber-500 drop-shadow-[0_0_8px_currentColor]' : 'text-gray-400'}`} />
          <span className={`font-bold uppercase tracking-wider text-xs ${activeTool === 'cipher' ? 'text-white' : 'text-gray-400'}`}>
            Cipher Station
          </span>
        </button>

        <button 
          onClick={() => setActiveTool('hasher')}
          className={`glass-panel p-4 rounded-xl flex items-center gap-3 transition-all ${
            activeTool === 'hasher' ? 'bg-blue-500/20 border-blue-500/50' : 'hover:bg-white/5'
          }`}
        >
          <FileDigit className={`w-5 h-5 ${activeTool === 'hasher' ? 'text-blue-500 drop-shadow-[0_0_8px_currentColor]' : 'text-gray-400'}`} />
          <span className={`font-bold uppercase tracking-wider text-xs ${activeTool === 'hasher' ? 'text-white' : 'text-gray-400'}`}>
            Cryptographic Hash
          </span>
        </button>
      </div>

      {/* Main Tool Area */}
      <div className="flex-1 glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {activeTool === 'generator' && (
             <motion.div
              key="gen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
             >
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Shield className="w-5 h-5 text-cyber-purple" />
                 SECURE TOKEN GENERATOR
               </h3>

               <div className="bg-black/50 p-6 rounded-xl border border-white/5 relative group">
                 <div className="text-2xl font-mono text-center break-all text-cyber-purple tracking-widest min-h-[40px]">
                   {generatedPass || "----------------"}
                 </div>
                 {generatedPass && (
                   <button 
                     onClick={() => copyToClipboard(generatedPass, 'pass')}
                     className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded"
                   >
                     {copied === 'pass' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                   </button>
                 )}
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="flex justify-between text-xs text-gray-400 uppercase mb-2">
                     <span>Length Parameter</span>
                     <span className="text-cyber-purple">{genOptions.length}</span>
                   </label>
                   <input 
                     type="range" 
                     min="8" max="64" 
                     value={genOptions.length}
                     onChange={(e) => setGenOptions({...genOptions, length: parseInt(e.target.value)})}
                     className="w-full accent-cyber-purple"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'uppercase', label: 'Uppercase [A-Z]' },
                     { id: 'lowercase', label: 'Lowercase [a-z]' },
                     { id: 'numbers', label: 'Numerics [0-9]' },
                     { id: 'symbols', label: 'Symbols [!@#$]' }
                   ].map(opt => (
                     <label key={opt.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 border border-transparent hover:border-white/5 transition-colors">
                       <input 
                         type="checkbox" 
                         checked={genOptions[opt.id]}
                         onChange={(e) => setGenOptions({...genOptions, [opt.id]: e.target.checked})}
                         className="accent-cyber-purple w-4 h-4"
                       />
                       <span className="text-sm font-mono text-gray-300">{opt.label}</span>
                     </label>
                   ))}
                 </div>
               </div>

               <button 
                 onClick={handleGenerate}
                 className="w-full py-4 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple border border-cyber-purple/50 rounded-xl font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(176,38,255,0.3)]"
               >
                 Execute Generation
               </button>
             </motion.div>
          )}

          {activeTool === 'cipher' && (
             <motion.div
              key="cipher"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
             >
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <RefreshCw className="w-5 h-5 text-amber-500" />
                 UNIVERSAL CIPHER STATION
               </h3>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-xs text-gray-400 uppercase">Algorithm Select</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['base64', 'hex', 'binary', 'rot13'].map(type => (
                        <button
                          key={type}
                          onClick={() => setCipherType(type)}
                          className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            cipherType === type ? 'bg-amber-500 text-black' : 'bg-black/40 text-gray-400 border border-white/5'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs text-gray-400 uppercase">Operation Mode</label>
                    <button 
                      onClick={handleSwap}
                      className="w-full flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg group hover:border-amber-500/30 transition-all"
                    >
                      <span className={`text-xs font-bold uppercase ${cipherMode === 'encode' ? 'text-amber-500' : 'text-gray-400'}`}>Encode</span>
                      <ArrowRightLeft className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-all" />
                      <span className={`text-xs font-bold uppercase ${cipherMode === 'decode' ? 'text-amber-500' : 'text-gray-400'}`}>Decode</span>
                    </button>
                  </div>
               </div>

               <div className="space-y-4">
                 <div className="relative">
                   <textarea 
                     value={cipherInput}
                     onChange={(e) => setCipherInput(e.target.value)}
                     rows="3"
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-amber-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none resize-none"
                     placeholder={`Enter text to ${cipherMode}...`}
                   />
                 </div>

                 <button 
                   onClick={handleConvert}
                   disabled={isConverting}
                   className="w-full py-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/50 rounded-xl font-bold uppercase tracking-widest transition-all"
                 >
                   {isConverting ? 'Processing Conversion...' : `Execute ${cipherType.toUpperCase()} ${cipherMode.toUpperCase()}`}
                 </button>

                 {cipherResult && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/50 p-6 rounded-xl border border-amber-500/20 relative group"
                   >
                     <div className="text-sm font-mono text-white break-all pr-8">
                       {cipherResult}
                     </div>
                     <button 
                       onClick={() => copyToClipboard(cipherResult, 'cipher')}
                       className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded"
                     >
                       {copied === 'cipher' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                     </button>
                   </motion.div>
                 )}
               </div>
             </motion.div>
          )}

          {activeTool === 'passphrase' && (
             <motion.div
              key="passphrase"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
             >
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Languages className="w-5 h-5 text-cyber-neon" />
                 MEMORABLE PASSPHRASE FORGE
               </h3>

               <div className="bg-black/50 p-6 rounded-xl border border-white/5 relative group">
                 <div className="text-2xl font-mono text-center break-words text-cyber-neon tracking-wider min-h-[40px]">
                   {generatedPassphrase || "----------------"}
                 </div>
                 {generatedPassphrase && (
                   <>
                    <button 
                      onClick={() => copyToClipboard(generatedPassphrase, 'phrase')}
                      className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded"
                    >
                      {copied === 'phrase' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                    <div className="absolute bottom-2 left-6 text-[10px] text-cyber-neon/60 font-mono uppercase">
                      Est. Entropy: ~{(passphraseOptions.wordCount * 12.9).toFixed(1)} bits
                    </div>
                   </>
                 )}
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="flex justify-between text-xs text-gray-400 uppercase mb-2">
                     <span>Word Count</span>
                     <span className="text-cyber-neon">{passphraseOptions.wordCount}</span>
                   </label>
                   <input 
                     type="range" 
                     min="3" max="8" 
                     value={passphraseOptions.wordCount}
                     onChange={(e) => setPassphraseOptions({...passphraseOptions, wordCount: parseInt(e.target.value)})}
                     className="w-full accent-cyber-neon"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'capitalize', label: 'Capitalize Titles' },
                     { id: 'includeNumber', label: 'Suffix Numeric' },
                   ].map(opt => (
                     <label key={opt.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 border border-transparent hover:border-white/5 transition-colors">
                       <input 
                         type="checkbox" 
                         checked={passphraseOptions[opt.id]}
                         onChange={(e) => setPassphraseOptions({...passphraseOptions, [opt.id]: e.target.checked})}
                         className="accent-cyber-neon w-4 h-4"
                       />
                       <span className="text-sm font-mono text-gray-300">{opt.label}</span>
                     </label>
                   ))}
                   
                   <div className="col-span-2">
                     <label className="block text-[10px] text-gray-500 uppercase mb-2">Separator Character</label>
                     <div className="flex gap-2">
                       {['-', '_', '.', '/'].map(char => (
                         <button 
                           key={char}
                           onClick={() => setPassphraseOptions({...passphraseOptions, separator: char})}
                           className={`flex-1 py-2 rounded font-mono text-sm border transition-all ${
                             passphraseOptions.separator === char 
                               ? 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon' 
                               : 'border-white/5 text-gray-400'
                           }`}
                         >
                           {char}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleGeneratePassphrase}
                 className="w-full py-4 bg-cyber-neon/20 hover:bg-cyber-neon/30 text-cyber-neon border border-cyber-neon/50 rounded-xl font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(13,240,227,0.3)]"
               >
                 Assemble Passphrase
               </button>
             </motion.div>
          )}

          {activeTool === 'hasher' && (
             <motion.div
              key="hash"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
             >
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <FileDigit className="w-5 h-5 text-cyber-neon" />
                 CRYPTOGRAPHIC HASHER
               </h3>

               <div className="space-y-4">
                 <div>
                   <label className="block text-xs text-gray-400 uppercase mb-2">Cleartext Input Payload</label>
                   <textarea 
                     value={hashInput}
                     onChange={(e) => setHashInput(e.target.value)}
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-white focus:border-cyber-neon/50 focus:ring-1 focus:ring-cyber-neon/50 outline-none resize-none h-24"
                     placeholder="Enter string to ingest..."
                   />
                 </div>

                 <div className="flex gap-2 bg-black/30 p-1 rounded-lg border border-white/10 overflow-x-auto">
                   {['md5', 'sha1', 'sha256', 'sha512', 'bcrypt', 'base64'].map(algo => (
                     <button
                       key={algo}
                       onClick={() => setHashAlgo(algo)}
                       className={`px-4 py-2 text-xs font-mono uppercase rounded-md whitespace-nowrap transition-colors ${
                         hashAlgo === algo 
                           ? 'bg-cyber-neon text-black font-bold' 
                           : 'text-gray-400 hover:text-white hover:bg-white/5'
                       }`}
                     >
                       {algo}
                     </button>
                   ))}
                 </div>

                 <button 
                   onClick={handleHash}
                   className="w-full py-3 bg-cyber-neon/20 hover:bg-cyber-neon/30 text-cyber-neon border border-cyber-neon/50 rounded-xl font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(13,240,227,0.3)]"
                 >
                   Compute Hash
                 </button>

                 {hashOutput && (
                   <div className="relative mt-6">
                     <label className="block text-xs text-cyber-neon uppercase mb-2">Hash Output</label>
                     <div className="bg-black p-4 rounded-lg font-mono text-sm break-all text-gray-300 border border-white/5 min-h-[60px] pr-12">
                       {hashOutput}
                     </div>
                     <button 
                       onClick={() => copyToClipboard(hashOutput, 'hash')}
                       className="absolute top-8 right-2 p-2 hover:bg-white/10 rounded"
                     >
                       {copied === 'hash' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                     </button>
                   </div>
                 )}
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SecurityToolkit;
