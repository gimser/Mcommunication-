
import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Wallet, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

interface ArbounModalProps {
  onClose: () => void;
  onConfirm: () => void;
  providerName: string;
  totalPrice: number;
}

const ArbounModal: React.FC<ArbounModalProps> = ({ onClose, onConfirm, providerName, totalPrice }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const arbounAmount = Math.ceil(totalPrice * 0.1); // 10% Deposit
  const remainingAmount = totalPrice - arbounAmount;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fade-in p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
           <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
             <X size={20} />
           </button>
           <ShieldCheck size={40} className="mx-auto mb-3 text-brand-green" />
           <h2 className="text-xl font-display font-bold">Secure Commitment</h2>
           <p className="text-slate-400 text-xs uppercase tracking-widest">Digital Arboun (العربون)</p>
        </div>

        <div className="p-6 space-y-6">
           <div className="text-center space-y-1">
              <p className="text-sm text-slate-500">You are booking</p>
              <h3 className="text-lg font-bold text-slate-900">{providerName}</h3>
           </div>

           {/* Breakdown */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Total Price</span>
                 <span className="font-bold text-slate-900">{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-brand-green font-bold flex items-center gap-1">
                    <Lock size={12} /> Arboun (10%)
                 </span>
                 <span className="font-bold text-brand-green">{arbounAmount} MAD</span>
              </div>
              <div className="h-px bg-slate-200"></div>
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Pay on Completion</span>
                 <span className="font-bold text-slate-700">{remainingAmount} MAD</span>
              </div>
           </div>

           <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                 Your Arboun is held in a <strong>Secure Escrow</strong>. It is only released to the Maâlem when the job starts.
              </p>
           </div>

           <button 
             onClick={handlePay}
             disabled={isProcessing}
             className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
           >
             {isProcessing ? (
                <>Processing Payment...</>
             ) : (
                <>
                   <Wallet size={18} /> Pay {arbounAmount} MAD Arboun
                </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
};

export default ArbounModal;
