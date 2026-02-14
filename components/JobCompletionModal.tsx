
import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Star, DollarSign, Award, ThumbsUp, ArrowRight, ShieldCheck, Share2, AlertTriangle, Skull, Camera, UploadCloud, Mic, Square, Tag, UserCheck } from 'lucide-react';
import Logo from './Logo';
import FraudDetectionModal from './FraudDetectionModal';

interface JobCompletionModalProps {
  onClose: () => void;
  jobData: {
    id: string;
    role: 'provider' | 'client';
    amount: number;
    partnerName: string;
  };
}

const JobCompletionModal: React.FC<JobCompletionModalProps> = ({ onClose, jobData }) => {
  // If provider, start with PROOF step. If client, start with RATING.
  const [step, setStep] = useState<'proof' | 'rating' | 'success'>(
      jobData.role === 'provider' ? 'proof' : 'rating'
  );
  
  const [rating, setRating] = useState(0);
  const [coinsAnimating, setCoinsAnimating] = useState(false);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // NEW: Audio Proof State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // NEW: Client Rating Tags
  const [clientTags, setClientTags] = useState<string[]>([]);
  
  // FRAUD SIMULATION STATE (SCENARIO 4)
  const [simulateFraud, setSimulateFraud] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);

  // Audio Timer
  useEffect(() => {
      let interval: any;
      if (isRecording) {
          interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      }
      return () => clearInterval(interval);
  }, [isRecording]);

  const handleRate = (stars: number) => {
    setRating(stars);
  };

  const toggleClientTag = (tag: string) => {
      setClientTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setProofFile(URL.createObjectURL(e.target.files[0]));
      }
  };

  const toggleRecording = () => {
      if (isRecording) {
          setIsRecording(false);
          setAudioBlob(true); // Simulate save
      } else {
          setRecordingTime(0);
          setIsRecording(true);
          setAudioBlob(false);
      }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitProof = () => {
      if (proofFile) {
          // Scenario 4: If Fraud is simulated, trigger detection instead of proceeding
          if (simulateFraud) {
              setShowFraudModal(true);
          } else {
              setStep('rating');
          }
      }
  };

  const handleSubmitRating = () => {
    setStep('success');
    setTimeout(() => setCoinsAnimating(true), 500);
  };

  const handleFraudClose = () => {
      setShowFraudModal(false);
      onClose();
  };

  return (
    <>
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-fade-in p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Background Confetti Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti-doodles.png')] opacity-10 pointer-events-none"></div>

        {/* --- STEP 1: PROOF OF WORK (Provider Only) --- */}
        {step === 'proof' && (
            <div className="p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-green/20">
                    <Camera size={32} className="text-brand-green" />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-2">Proof of Work (San3a)</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Upload a photo/video and record a voice confirmation to release payment.
                </p>

                {/* Visual Evidence */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all mb-4 ${proofFile ? 'border-brand-green bg-green-50 p-2' : 'border-slate-300 hover:border-brand-green hover:bg-slate-50'}`}
                >
                    {proofFile ? (
                        <img src={proofFile} className="w-full h-full object-cover rounded-lg shadow-sm" />
                    ) : (
                        <>
                            <UploadCloud size={32} className="text-slate-400 mb-2" />
                            <span className="text-xs font-bold text-slate-500">Tap to Upload Photo/Video</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleProofUpload} />
                </div>

                {/* NEW: Audio Consent */}
                <div className={`flex items-center justify-between p-3 rounded-xl border transition-all mb-6 ${audioBlob ? 'bg-green-50 border-brand-green' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : (audioBlob ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500')}`}>
                            <Mic size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-900">Voice Consent</p>
                            <p className="text-[10px] text-slate-500">
                                {isRecording ? `Recording ${formatTime(recordingTime)}` : (audioBlob ? "Audio Attached" : "Record verbal confirmation")}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleRecording}
                        className={`p-2 rounded-lg font-bold text-xs ${isRecording ? 'bg-red-500 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}
                    >
                        {isRecording ? <Square size={16} fill="currentColor" /> : (audioBlob ? "Redo" : "Record")}
                    </button>
                </div>

                {/* SCENARIO 4: FRAUD SIMULATION TOGGLE */}
                <div className="mb-6 flex items-center justify-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-red-500 cursor-pointer p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                        <input 
                            type="checkbox" 
                            checked={simulateFraud}
                            onChange={(e) => setSimulateFraud(e.target.checked)}
                            className="accent-red-500 w-4 h-4"
                        />
                        <AlertTriangle size={14} />
                        Simulate GPS Fraud
                    </label>
                </div>

                <button 
                    onClick={submitProof}
                    disabled={!proofFile}
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    Submit & Continue <ArrowRight size={16} />
                </button>
            </div>
        )}

        {/* --- STEP 2: RATING --- */}
        {step === 'rating' && (
          <div className="p-8 text-center animate-slide-in">
             <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-brand-green" />
             </div>
             
             <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Job Completed!</h2>
             <p className="text-slate-500 text-sm mb-8">
               {jobData.role === 'provider' 
                 ? `How was your experience with ${jobData.partnerName}?`
                 : `${jobData.partnerName} has finished the job. Please rate.`
               }
             </p>

             <div className="bg-slate-50 rounded-2xl p-6 mb-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rate Experience</p>
                <div className="flex justify-center gap-2 mb-6">
                   {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        onClick={() => handleRate(star)}
                        className={`p-1 transition-transform hover:scale-125 ${rating >= star ? 'text-brand-yellow fill-brand-yellow' : 'text-slate-300'}`}
                      >
                         <Star size={32} />
                      </button>
                   ))}
                </div>

                {/* NEW: Client Rating Criteria (If Provider) */}
                {jobData.role === 'provider' && rating > 0 && (
                    <div className="animate-fade-in border-t border-slate-200 pt-4">
                        <p className="text-xs font-bold text-slate-500 mb-2">What went well?</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Fast Payment', 'Polite', 'Clear Specs', 'Respectful'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleClientTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${clientTags.includes(tag) ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-slate-500 border-slate-200'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
             </div>

             <button 
               onClick={handleSubmitRating}
               disabled={rating === 0}
               className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               Confirm & Close
             </button>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 'success' && (
          <div className="p-8 text-center relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-green/30 animate-bounce-in">
                   <Award size={48} className="text-white" />
                </div>

                <h2 className="text-3xl font-display font-bold text-slate-900 mb-1 animate-fade-in-up">Awesome!</h2>
                <p className="text-slate-500 text-sm mb-8 animate-fade-in-up delay-100">Reputation Updated</p>

                <div className="space-y-4 animate-fade-in-up delay-200">
                   {/* Earnings Card (Only for Provider) */}
                   {jobData.role === 'provider' && (
                     <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="bg-green-100 p-2 rounded-full text-green-700">
                              <DollarSign size={20} />
                           </div>
                           <div className="text-left">
                              <p className="text-xs font-bold text-green-800 uppercase">Earnings</p>
                              <p className="text-lg font-bold text-slate-900">{jobData.amount} MAD</p>
                           </div>
                        </div>
                        <div className="text-green-600 font-bold text-sm">+ Balance</div>
                     </div>
                   )}

                   {/* Karné Points Card */}
                   <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="bg-brand-yellow/20 p-2 rounded-full text-yellow-700">
                              <ShieldCheck size={20} />
                           </div>
                           <div className="text-left">
                              <p className="text-xs font-bold text-yellow-800 uppercase">Karné Score</p>
                              <p className="text-lg font-bold text-slate-900">+5 Points</p>
                           </div>
                        </div>
                        <div className="text-yellow-700 font-bold text-sm">Level Up</div>
                   </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg mt-8 hover:bg-slate-800 transition-all"
                >
                  Return to Dashboard
                </button>
             </div>
          </div>
        )}

      </div>
    </div>

    {/* SHOW FRAUD MODAL IF TRIGGERED */}
    {showFraudModal && (
        <FraudDetectionModal 
            onClose={handleFraudClose}
            fraudType="gps_mismatch"
        />
    )}
    </>
  );
};

export default JobCompletionModal;
