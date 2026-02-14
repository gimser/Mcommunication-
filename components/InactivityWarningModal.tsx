
import React from 'react';
import { X, TrendingDown, Clock, AlertTriangle, Activity, RefreshCw, Users } from 'lucide-react';

interface InactivityWarningModalProps {
  onClose: () => void;
  onReactivate: () => void;
}

const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({ onClose, onReactivate }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative border-t-8 border-orange-500">
        
        <div className="p-8">
           
           <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Clock size={40} className="text-orange-600" />
              <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-1.5 border-4 border-white">
                 <TrendingDown size={16} />
              </div>
           </div>

           <h2 className="text-2xl font-display font-bold text-slate-900 text-center mb-2">Account Dormant</h2>
           <p className="text-slate-500 text-sm text-center mb-8">
              You haven't been active for 2 weeks. To maintain market fairness, the system has prioritized active Maâlems.
           </p>

           <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <TrendingDown size={14} /> Ranking Drop
                 </span>
                 <span className="text-red-600 font-bold">-25 Positions</span>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Users size={14} /> Missed Jobs
                 </span>
                 <span className="text-slate-900 font-bold">14 Opportunities</span>
              </div>
           </div>

           <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start mb-6">
              <Activity size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                 <strong>Tip:</strong> The algorithm favors consistency. Complete 1 job today to restore your visibility.
              </p>
           </div>

           <button 
             onClick={onReactivate}
             className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
           >
             <RefreshCw size={18} />
             I'm Back - Reactivate
           </button>
           
           <button onClick={onClose} className="w-full mt-3 py-2 text-slate-400 font-bold text-xs hover:text-slate-600">
              Close & Remain Offline
           </button>

        </div>
      </div>
    </div>
  );
};

export default InactivityWarningModal;
