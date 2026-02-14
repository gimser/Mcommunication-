import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Fingerprint, Smartphone, CheckCircle2, Lock, Loader2, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'otp' | 'biometric' | 'success'>('intro');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Logic
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const startVerification = () => {
    setStep('otp');
  };

  const verifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('biometric');
    }, 1500);
  };

  const verifyBiometric = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 2500);
  };

  const finishProcess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header Graphic */}
        <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-lg backdrop-blur-md">
                <ShieldCheck size={32} className="text-brand-green" />
             </div>
             <h2 className="text-white font-display font-bold text-xl">Sovereign Identity Gateway</h2>
             <div className="flex items-center gap-1.5 mt-2">
               <Lock size={12} className="text-brand-green" />
               <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">End-to-End Encrypted</p>
             </div>
           </div>

           <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
             <X size={24} />
           </button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upgrade to Verified Citizen</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Access national grants, vote on municipal decisions, and get the official blue badge.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Smartphone size={20} />
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="font-bold text-slate-800 text-sm">Phone Verification</p>
                    <p className="text-xs text-slate-400">Secure OTP check</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Fingerprint size={20} />
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="font-bold text-slate-800 text-sm">Biometric Match</p>
                    <p className="text-xs text-slate-400">FaceID or Fingerprint</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={startVerification}
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Verification</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verify Phone Number</h3>
                <p className="text-slate-500 text-xs mt-1">Enter the 4-digit code sent to +212 6**-**99</p>
              </div>

              <div className="flex justify-center gap-3 my-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-16 border-2 border-slate-200 rounded-2xl text-center text-2xl font-bold text-slate-900 focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green/10 transition-all"
                  />
                ))}
              </div>

              <button 
                onClick={verifyOtp}
                disabled={isLoading || otp.some(d => !d)}
                className="w-full py-3.5 bg-brand-green text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Code'}
              </button>
            </div>
          )}

          {/* STEP 3: BIOMETRIC */}
          {step === 'biometric' && (
            <div className="text-center space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Identity Confirmation</h3>
                <p className="text-slate-500 text-xs mt-1">Please verify your identity using your device.</p>
              </div>

              <div className="relative flex justify-center py-4">
                 <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                    <Fingerprint size={48} className={`text-slate-300 ${isLoading ? 'animate-pulse text-brand-green' : ''}`} />
                    {isLoading && (
                      <div className="absolute inset-0 border-4 border-brand-green rounded-full border-t-transparent animate-spin"></div>
                    )}
                 </div>
              </div>

              <button 
                onClick={verifyBiometric}
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all"
              >
                {isLoading ? 'Scanning...' : 'Scan Biometrics'}
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce-in">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900">Verified Successfully!</h3>
                <p className="text-slate-500 text-sm mt-2">You are now a Verified Citizen. You can now apply for grants and access sovereign services.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-12 h-12 rounded-full object-cover" />
                 <div className="text-left rtl:text-right flex-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1">
                      Sarah Jenkins
                      <ShieldCheck size={14} className="text-brand-green" />
                    </p>
                    <p className="text-xs text-brand-green font-bold">Level 1 Verification Active</p>
                 </div>
              </div>

              <button 
                onClick={finishProcess}
                className="w-full py-3.5 bg-gradient-brand text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40 transition-all"
              >
                Continue to App
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerificationModal;