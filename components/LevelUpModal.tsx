
import React from 'react';
import { X, Award, TrendingUp, Zap, ShieldCheck, Star, CheckCircle2, Crown } from 'lucide-react';
import Logo from './Logo';

interface LevelUpModalProps {
  onClose: () => void;
  stats: {
    jobs: number;
    rating: number;
  };
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ onClose, stats }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
      {/* Background Confetti Effect (CSS Simulated) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
         <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-brand-green rounded-full animate-ping delay-100"></div>
         <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
      </div>

      <div className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-in border-4 border-yellow-400/30">
        
        {/* Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 animate-pulse"></div>

        <div className="p-8 text-center relative z-10">
           
           {/* The Badge */}
           <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-pulse-slow blur-xl"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                 <Crown size={64} className="text-white drop-shadow-md" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                 Level 2
              </div>
           </div>

           <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">Top Maâlem</h2>
           <p className="text-yellow-600 font-bold text-sm uppercase tracking-widest mb-6">Status Unlocked</p>

           <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                 <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                    <Zap size={18} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900 text-sm">2x Visibility Boost</p>
                    <p className="text-xs text-slate-500">You appear first in search results.</p>
                 </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                 <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                    <ShieldCheck size={18} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-900 text-sm">Trust Badge</p>
                    <p className="text-xs text-slate-500">Clients trust verified Pros 3x more.</p>
                 </div>
              </div>
           </div>

           <button 
             onClick={onClose}
             className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
           >
             <span>Claim Rewards</span>
             <TrendingUp size={20} className="text-yellow-400 group-hover:-translate-y-1 transition-transform" />
           </button>

        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
