
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Fingerprint, QrCode, Copy, RefreshCw, Smartphone, Loader2, Wifi, Lock, AlertTriangle, ShieldAlert, Cpu, Network } from 'lucide-react';
import Logo from './Logo';
import { SovereignBackend, IdentityToken } from '../services/SovereignBackend';

interface DigitalIDModalProps {
  onClose: () => void;
}

type SessionState = 'handshake' | 'active' | 'expired';

const DigitalIDModal: React.FC<DigitalIDModalProps> = ({ onClose }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // State
  const [sessionState, setSessionState] = useState<SessionState>('handshake');
  const [identityToken, setIdentityToken] = useState<IdentityToken | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0); 
  const [handshakeStep, setHandshakeStep] = useState<string>('Connecting...');

  // Start Secure Handshake on Mount
  useEffect(() => {
    initiateHandshake();
  }, []);

  const initiateHandshake = async () => {
    setSessionState('handshake');
    setProgress(0);
    setHandshakeStep('Secure Connection...');
    
    // Simulate handshake progress steps (Simplified jargon)
    const steps = [
        { pct: 30, text: 'Verifying...' },
        { pct: 60, text: 'Generating Secure Token...' },
        { pct: 90, text: 'Finalizing...' },
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
          setProgress(steps[stepIndex].pct);
          setHandshakeStep(steps[stepIndex].text);
          stepIndex++;
      }
    }, 400);

    try {
      const token = await SovereignBackend.issueZeroTrustToken('verification_portal');
      
      clearInterval(progressInterval);
      setProgress(100);
      setHandshakeStep('Ready.');
      
      setTimeout(() => {
          setIdentityToken(token);
          setSessionState('active');
          
          // Calculate remaining time
          const remaining = Math.floor((token.expiresAt - Date.now()) / 1000);
          setTimeLeft(remaining > 0 ? remaining : 0);
      }, 500);

    } catch (error) {
      console.error("Handshake failed", error);
      setHandshakeStep('Connection Failed.');
    }
  };

  // Timer Countdown Logic
  useEffect(() => {
    if (sessionState !== 'active' || !identityToken) return;

    const timer = setInterval(() => {
      const remaining = Math.floor((identityToken.expiresAt - Date.now()) / 1000);
      
      if (remaining <= 0) {
        setTimeLeft(0);
        setSessionState('expired');
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState, identityToken]);

  // Holographic effect based on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md flex flex-col items-center">
        
        {/* Top Info */}
        <div className="text-center mb-6 text-white animate-fade-in-up w-full">
           <div className="flex justify-between items-center mb-2 px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Wifi size={12} className={sessionState === 'active' ? "text-brand-green" : "text-slate-500"} />
                <span>{sessionState === 'active' ? 'SECURE' : 'CONNECTING...'}</span>
              </div>
              {identityToken && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <Smartphone size={10} />
                  Mobile Token
                </div>
              )}
           </div>
           
           <h2 className="text-2xl font-display font-bold">My Digital ID</h2>
           <p className="text-slate-400 text-sm">Official & Secure</p>
        </div>

        {/* The Card Container */}
        <div 
          className="relative w-full aspect-[1.586/1] perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* The 3D Card */}
          <div 
            className="w-full h-full rounded-2xl shadow-2xl transition-transform duration-200 ease-out transform-style-3d relative overflow-hidden bg-white"
            style={{ 
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // Subtle texture
            }}
          >
            {/* Holographic Overlay (Only visible when active) */}
            {sessionState === 'active' && (
              <div 
                className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay bg-gradient-to-tr from-transparent via-brand-green/20 to-brand-yellow/20"
                style={{
                  background: `linear-gradient(${115 + rotation.y}deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(0,151,70,0.2) 50%, transparent 55%)`
                }}
              ></div>
            )}

            {/* --- STATE: HANDSHAKE (Loading) --- */}
            {sessionState === 'handshake' && (
              <div className="absolute inset-0 z-30 bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                 <div className="relative mb-6">
                   <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <h3 className="text-slate-900 font-bold text-lg mb-2">Connecting...</h3>
                 <p className="text-slate-500 text-xs mb-4">{handshakeStep}</p>
              </div>
            )}

            {/* --- STATE: EXPIRED --- */}
            {sessionState === 'expired' && (
              <div className="absolute inset-0 z-30 bg-slate-900/95 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                   <Lock size={32} className="text-white" />
                 </div>
                 <h3 className="text-white font-bold text-xl mb-2">Timeout</h3>
                 <button 
                   onClick={initiateHandshake}
                   className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center gap-2 transition-all mt-4"
                 >
                   <RefreshCw size={18} />
                   Refresh ID
                 </button>
              </div>
            )}

            {/* --- STATE: ACTIVE (Content) --- */}
            <div className={`h-full flex flex-col relative z-10 ${sessionState !== 'active' ? 'blur-sm grayscale' : ''}`}>
              
              {/* Header Strip */}
              <div className="h-16 bg-gradient-brand p-4 flex justify-between items-center text-white">
                <Logo className="h-6" variant="white" />
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/20">
                  <ShieldCheck size={14} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Official</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 flex items-center justify-between gap-6">
                
                {/* Left: User Details */}
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                       <img 
                         src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" 
                         className="w-full h-full rounded-[10px] object-cover" 
                         alt="User"
                       />
                     </div>
                     <div>
                       <h3 className="font-bold text-slate-900 text-sm">Sarah Jenkins</h3>
                       <p className="text-[10px] text-slate-500 font-mono uppercase">Cit-ID: 849-***-901</p>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                        <span className="text-xs font-bold text-brand-green">Verified</span>
                     </div>
                   </div>
                </div>

                {/* Right: QR & Timer */}
                <div className="flex flex-col items-center gap-3">
                   <div className="relative p-2 bg-white border-2 border-slate-900 rounded-xl shadow-inner">
                      <QrCode size={80} className="text-slate-900" />
                      {/* Scan Line Animation - Subtle */}
                      {sessionState === 'active' && (
                        <div className="absolute inset-0 bg-brand-green/5 h-1 w-full animate-scan pointer-events-none"></div>
                      )}
                   </div>
                   
                   {/* Countdown Timer */}
                   <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-slate-900'}`}>
                      <span>00:{timeLeft.toString().padStart(2, '0')}</span>
                   </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-100">
                 <div className="flex items-center gap-2 text-[10px] text-slate-400">
                   <Cpu size={12} />
                   <span className="font-mono">Encrypted</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-slate-400">
                   <Network size={12} />
                   <span className="font-mono">Online</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4 animate-fade-in-up delay-100">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-colors font-bold text-sm"
          >
            Close
          </button>
          {sessionState === 'active' && (
            <button className="px-6 py-3 rounded-full bg-brand-green text-white hover:bg-green-600 transition-colors font-bold text-sm shadow-lg shadow-brand-green/20 flex items-center gap-2">
              <Copy size={16} />
              Copy Ref
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DigitalIDModal;
