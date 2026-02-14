
import React from 'react';
import { X, AlertOctagon, TrendingDown, FileWarning, ShieldCheck, Scale, RefreshCw, Wallet, Frown } from 'lucide-react';
import { DisputeVerdict } from '../contexts/ContentContext';

interface VerdictModalProps {
  onClose: () => void;
  verdict: DisputeVerdict;
}

const VerdictModal: React.FC<VerdictModalProps> = ({ onClose, verdict }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative border-t-8 border-red-600">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="p-8 text-center relative z-10">
           
           <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
              <Scale size={48} className="text-red-600" />
           </div>

           <h2 className="text-2xl font-display font-bold text-slate-900 mb-1">Dispute Resolved</h2>
           <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-6">Automated Governance Decision</p>

           <div className="space-y-3 mb-8">
              
              {/* Outcome: Refund */}
              {verdict.refundAmount && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                     <div className="bg-green-200 p-2 rounded-lg text-green-800">
                        <Wallet size={24} />
                     </div>
                     <div className="text-left">
                        <p className="text-xs font-bold text-green-800 uppercase">Compensated</p>
                        <p className="font-bold text-slate-900 text-lg">+{verdict.refundAmount} MAD</p>
                        <p className="text-[10px] text-slate-500">Refunded to Wallet</p>
                     </div>
                  </div>
              )}

              {/* Outcome: Penalty */}
              {verdict.penaltyPoints && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-4">
                     <div className="bg-red-200 p-2 rounded-lg text-red-800">
                        <Frown size={24} />
                     </div>
                     <div className="text-left">
                        <p className="text-xs font-bold text-red-800 uppercase">Provider Penalty</p>
                        <p className="font-bold text-slate-900 text-lg">-{verdict.penaltyPoints} Karné Pts</p>
                        <p className="text-[10px] text-slate-500">Trust Score Impacted</p>
                     </div>
                  </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Reasoning</p>
                 <p className="text-sm font-medium text-slate-800 leading-snug">{verdict.reason}</p>
              </div>
           </div>

           <button 
             onClick={onClose}
             className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
           >
             Acknowledge & Close
           </button>

        </div>
      </div>
    </div>
  );
};

export default VerdictModal;
