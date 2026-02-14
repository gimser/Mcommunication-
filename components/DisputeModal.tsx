
import React, { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, Gavel, FileWarning, Camera, Send, CheckCircle2, Image as ImageIcon, Video, Scan, MapPin, Clock, Fingerprint, Loader2 } from 'lucide-react';

// Icons Helper
const HammerIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.4c-.84 0-1.65-.33-2.25-.93L12.9 4.68c-.6-.6-1.4-.93-2.25-.93H4.86c-.55 0-1 .45-1 1v1.25c0 .84-.33 1.65-.93 2.25L2 9.09l8.64 8.64"/></svg>;
const UserXIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>;
const DollarSignIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const ClockIcon = ({size}: {size:number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

interface DisputeModalProps {
  onClose: () => void;
  jobTitle: string;
  partnerName: string;
  onSubmit: (data: any) => void;
}

const REASONS = [
  { id: 'quality', label: 'Poor Quality Work', icon: HammerIcon, severity: 'medium' },
  { id: 'behavior', label: 'Unprofessional Behavior', icon: UserXIcon, severity: 'high' },
  { id: 'pricing', label: 'Overcharging', icon: DollarSignIcon, severity: 'medium' },
  { id: 'noshow', label: 'Did not show up', icon: ClockIcon, severity: 'low' },
];

const DisputeModal: React.FC<DisputeModalProps> = ({ onClose, jobTitle, partnerName, onSubmit }) => {
  const [step, setStep] = useState<'reason' | 'details' | 'analyzing' | 'submitted'>('reason');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [analysisStep, setAnalysisStep] = useState(0); // 0: GPS, 1: Time, 2: AI
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setEvidenceFile(URL.createObjectURL(file));
          setFileType(file.type.startsWith('video/') ? 'video' : 'image');
      }
  };

  const startAnalysis = () => {
    setStep('analyzing');
    
    // Simulate Analysis Steps
    setTimeout(() => setAnalysisStep(1), 1500); // GPS Done -> Check Time
    setTimeout(() => setAnalysisStep(2), 3000); // Time Done -> Check AI
    setTimeout(() => {
        setStep('submitted');
        // Auto trigger parent submit
        setTimeout(() => {
            onSubmit({ reason: selectedReason, details, evidence: evidenceFile });
        }, 2000);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border-t-4 border-red-500">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-red-50">
           <div className="flex items-center gap-2 text-red-700">
              <ShieldAlert size={20} />
              <h2 className="font-bold text-lg">Report Issue</h2>
           </div>
           <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm">
             <X size={18} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6">
           
           {/* STEP 1: SELECT REASON */}
           {step === 'reason' && (
             <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-slate-600 mb-4">
                   We take quality seriously. What went wrong with <strong>{partnerName}</strong>?
                </p>
                <div className="grid grid-cols-1 gap-3">
                   {REASONS.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => setSelectedReason(r.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedReason === r.id ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-red-200'}`}
                      >
                         <div className={`p-2 rounded-full ${selectedReason === r.id ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <r.icon size={20} />
                         </div>
                         <div>
                            <span className={`block font-bold text-sm ${selectedReason === r.id ? 'text-red-900' : 'text-slate-900'}`}>{r.label}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Severity: {r.severity}</span>
                         </div>
                      </button>
                   ))}
                </div>
                <button 
                  disabled={!selectedReason}
                  onClick={() => setStep('details')}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   Next Step
                </button>
             </div>
           )}

           {/* STEP 2: DETAILS & EVIDENCE */}
           {step === 'details' && (
             <div className="space-y-4 animate-slide-in">
                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start border border-blue-100">
                   <Scan size={16} className="text-blue-600 mt-0.5" />
                   <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>AI Verification:</strong> Our system will analyze your photo/video metadata (Location & Time) to validate your claim instantly.
                   </p>
                </div>

                <div>
                   <label className="text-sm font-bold text-slate-700 mb-2 block">Description</label>
                   <textarea 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe the defect or issue..."
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 resize-none"
                   />
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Evidence (Photo or Video)</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${evidenceFile ? 'border-brand-green bg-green-50' : 'border-slate-300 hover:border-red-400'}`}
                    >
                        {evidenceFile ? (
                            fileType === 'video' ? (
                                <div className="flex flex-col items-center text-green-700">
                                    <Video size={32} />
                                    <span className="text-xs font-bold mt-2">Video Attached</span>
                                </div>
                            ) : (
                                <img src={evidenceFile} className="h-full w-full object-cover rounded-xl" />
                            )
                        ) : (
                            <>
                                <div className="flex gap-2 text-slate-400 mb-2">
                                    <Camera size={24} />
                                    <Video size={24} />
                                </div>
                                <span className="text-xs text-slate-500 font-bold">Tap to Upload</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                   <button onClick={() => setStep('reason')} className="px-4 py-3 text-slate-500 font-bold text-sm">Back</button>
                   <button 
                     onClick={startAnalysis}
                     disabled={!details || !evidenceFile}
                     className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                   >
                      Submit for Analysis
                   </button>
                </div>
             </div>
           )}

           {/* STEP 3: SYSTEM ANALYSIS (SCENARIO 3 CORE) */}
           {step === 'analyzing' && (
             <div className="space-y-6 text-center py-4 animate-fade-in">
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
                            <Fingerprint size={48} className="text-slate-300" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-brand-green border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">System Analysis in Progress...</h3>
                </div>

                <div className="space-y-3 text-left max-w-[280px] mx-auto">
                    {/* Check 1: Location */}
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${analysisStep >= 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            {analysisStep > 0 ? <CheckCircle2 size={14} /> : <MapPin size={14} />}
                        </div>
                        <span className={`text-sm font-medium ${analysisStep >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                            Verifying GPS Metadata...
                        </span>
                    </div>

                    {/* Check 2: Time */}
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${analysisStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            {analysisStep > 1 ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        </div>
                        <span className={`text-sm font-medium ${analysisStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                            Checking File Timestamp...
                        </span>
                    </div>

                    {/* Check 3: Defect */}
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${analysisStep >= 2 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            {analysisStep > 2 ? <CheckCircle2 size={14} /> : <Scan size={14} />}
                        </div>
                        <span className={`text-sm font-medium ${analysisStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                            Analyzing Defect Severity...
                        </span>
                    </div>
                </div>
             </div>
           )}

           {/* STEP 4: SUBMITTED */}
           {step === 'submitted' && (
             <div className="text-center py-8 animate-scale-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white relative shadow-lg">
                   <Gavel size={40} className="text-green-700" />
                   <div className="absolute -right-2 -bottom-2 bg-slate-900 text-white p-1.5 rounded-full border-2 border-white">
                       <CheckCircle2 size={16} />
                   </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Evidence Validated</h3>
                <p className="text-slate-500 text-sm">
                   Our automated governance system has verified your evidence. Issuing verdict...
                </p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
