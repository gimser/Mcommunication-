
import React, { useState } from 'react';
import { X, DollarSign, Clock, MessageSquare, Send, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';

interface OfferModalProps {
  onClose: () => void;
  jobTitle: string;
  clientName: string;
  onSubmit: (offer: any) => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ onClose, jobTitle, clientName, onSubmit }) => {
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1 Day');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        onSubmit({ price, duration, note });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-end md:items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl"></div>
           <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
             <X size={24} />
           </button>
           <h2 className="font-display font-bold text-xl relative z-10">Submit Proposal</h2>
           <p className="text-slate-400 text-sm relative z-10">For: {jobTitle} • {clientName}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
           
           {/* Competitive Insight */}
           <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-3 items-start">
              <TrendingUp size={18} className="text-blue-600 mt-0.5" />
              <div>
                 <p className="text-xs font-bold text-blue-800 uppercase">Competition Insight</p>
                 <p className="text-xs text-blue-700 leading-relaxed">
                    2 other Maâlems are viewing this. Average bid is approx 250 MAD.
                 </p>
              </div>
           </div>

           {/* Price Input */}
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Price (MAD)</label>
              <div className="relative">
                 <DollarSign className="absolute left-4 top-3.5 text-slate-400" size={20} />
                 <input 
                   type="number" 
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green font-bold text-lg"
                   placeholder="0.00"
                 />
              </div>
           </div>

           {/* Duration Input */}
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Duration</label>
              <div className="grid grid-cols-3 gap-2">
                 {['2 Hours', '1 Day', '2 Days'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${duration === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
                    >
                       {d}
                    </button>
                 ))}
              </div>
           </div>

           {/* Note Input */}
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Note to Client</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green text-sm resize-none"
                placeholder="I can start immediately. I have the tools..."
                rows={3}
              />
           </div>

           {/* Commit Button */}
           <button 
             onClick={handleSubmit}
             disabled={!price || isSubmitting}
             className="w-full py-4 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isSubmitting ? (
                <span>Sending...</span>
             ) : (
                <>
                   <Send size={18} />
                   <span>Send Offer</span>
                </>
             )}
           </button>
           
           <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck size={12} />
              <span>Binding Commitment under Karné Rules</span>
           </div>

        </div>
      </div>
    </div>
  );
};

export default OfferModal;
