
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Ban, Fingerprint, MapPin, Clock, Siren, Lock, AlertTriangle, XCircle, ScanFace, FileQuestion } from 'lucide-react';

interface FraudDetectionModalProps {
  onClose: () => void;
  fraudType: 'gps_mismatch' | 'fake_review' | 'bot_behavior';
}

const FraudDetectionModal: React.FC<FraudDetectionModalProps> = ({ onClose, fraudType }) => {
  const [step, setStep] = useState<'analyzing' | 'detected' | 'penalty'>('analyzing');

  useEffect(() => {
    // Step 1: AI Analysis Simulation
    setTimeout(() => setStep('detected'), 2000);
    
    // Step 2: Verdict & Penalty
    setTimeout(() => setStep('penalty'), 4500);
  }, []);

  const getFraudDetails = () => {
    switch (fraudType) {
      case 'gps_mismatch': return { title: 'Location Spoofing', desc: 'User coordinates do not match Job Site.' };
      case 'fake_review': return { title: 'Review Manipulation', desc: 'Pattern matches self-review bot farm.' };
      case 'bot_behavior': return { title: 'Automated Script', desc: 'Interaction velocity exceeds human limits.' };
    }
  };

  const details = getFraudDetails();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-fade-in p-4">
      <div className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border-4 transition-all duration-500 ${step === 'analyzing' ? 'border-blue-500 bg-slate-800' : 'border-red-600 bg-slate-900'}`}>
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        {/* --- STEP 1: ANALYZING --- */}
        {step === 'analyzing' && (
          <div className="p-8 flex flex-col items-center text-center">
             <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <ScanFace size={48} className="text-blue-400 animate-pulse" />
                </div>
             </div>
             <h2 className="text-2xl font-mono font-bold text-blue-400 mb-2">SYSTEM SCAN</h2>
             <div className="space-y-1 text-xs font-mono text-blue-200/70">
                <p>Verifying Biometrics...</p>
                <p>Cross-referencing GPS Data...</p>
                <p>Analyzing Timestamp Delta...</p>
             </div>
          </div>
        )}

        {/* --- STEP 2: DETECTED --- */}
        {step === 'detected' && (
          <div className="p-8 flex flex-col items-center text-center animate-shake">
             <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                <Siren size={48} className="text-red-500 animate-pulse" />
             </div>
             <h2 className="text-3xl font-display font-black text-red-500 mb-2 uppercase tracking-widest">Fraud Detected</h2>
             <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl w-full mb-4">
                <p className="text-red-400 font-bold text-sm uppercase flex items-center justify-center gap-2">
                   <AlertTriangle size={16} /> {details.title}
                </p>
                <p className="text-red-200/70 text-xs mt-1 font-mono">{details.desc}</p>
             </div>
          </div>
        )}

        {/* --- STEP 3: PENALTY --- */}
        {step === 'penalty' && (
          <div className="p-8 flex flex-col items-center text-center animate-scale-in">
             <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-slate-700">
                <Lock size={40} className="text-slate-400" />
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-1">Action Taken</h2>
             <p className="text-slate-400 text-sm mb-6">Market Integrity Protocol Executed</p>

             <div className="w-full space-y-3 mb-8">
                <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                   <span className="text-red-400 text-xs font-bold uppercase flex items-center gap-2">
                      <Fingerprint size={14} /> Karné Score
                   </span>
                   <span className="text-red-500 font-mono font-bold">-50 PTS</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 border border-slate-700 rounded-lg">
                   <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                      <Clock size={14} /> Account Status
                   </span>
                   <span className="text-yellow-500 font-mono font-bold text-xs">SUSPENDED (24H)</span>
                </div>
             </div>

             <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10 text-sm"
                >
                  Acknowledge Penalty
                </button>
                <button 
                  onClick={() => alert("Clarification Request Sent to Support.")}
                  className="w-full py-3 text-slate-400 font-bold rounded-xl hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                >
                  <FileQuestion size={16} /> Request Clarification / Appeal
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FraudDetectionModal;
