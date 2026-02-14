
import React, { useState } from 'react';
import { X, MapPin, Mic, Camera, Zap, Clock, CheckCircle2, ChevronRight, Search, AlertTriangle, Hammer, Wrench, Plug, Building2, User, Scan, Sparkles, Loader2, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext'; 

interface ServiceRequestModalProps {
  onClose: () => void;
  onSubmit: (request: any) => void;
  preSelectedProvider?: any; 
}

const CATEGORIES = [
  { id: 'electrician', label: 'Electricity', icon: Plug, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'plumber', label: 'Plumbing', icon: Wrench, color: 'bg-blue-100 text-blue-700' },
  { id: 'mason', label: 'Masonry', icon: Hammer, color: 'bg-orange-100 text-orange-700' },
  { id: 'appliance', label: 'Appliances', icon: Zap, color: 'bg-purple-100 text-purple-700' },
];

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ onClose, onSubmit, preSelectedProvider }) => {
  const { t } = useLanguage();
  const { requestService, requestDirectService } = useContent(); 
  
  const [category, setCategory] = useState(preSelectedProvider ? 'Direct' : '');
  const [projectScale, setProjectScale] = useState<'standard' | 'corporate'>('standard');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [description, setDescription] = useState('');
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mediaAttached, setMediaAttached] = useState(false);
  
  const handleSubmit = () => {
    // TRIGGER AI ANALYSIS BEFORE SUBMIT
    setIsAnalyzing(true);
    
    setTimeout(() => {
        setIsAnalyzing(false);
        
        if (preSelectedProvider) {
            requestDirectService(preSelectedProvider, {
                category: 'Direct Hire',
                projectScale,
                urgency,
                description,
                timestamp: new Date().toISOString()
            });
        } else {
            requestService({
                category,
                projectScale,
                urgency,
                description,
                timestamp: new Date().toISOString()
            });
        }
        
        onClose();
    }, 2000); // 2 second fake analysis
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-end md:items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden relative flex flex-col h-[90vh] md:h-auto">
        
        {/* Loading Overlay for AI Analysis */}
        {isAnalyzing && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-green/30 animate-ping absolute inset-0"></div>
                    <div className="w-24 h-24 rounded-full border-4 border-t-brand-green border-r-transparent border-b-brand-green border-l-transparent animate-spin relative z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Scan size={32} className="text-brand-green" />
                    </div>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Analyzing Request...</h3>
                <p className="text-slate-400 text-sm">Matching with available Maâlems & estimating costs.</p>
            </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
           <h2 className="font-display font-bold text-lg text-slate-900">
               {preSelectedProvider ? `Book ${preSelectedProvider.name}` : "Request Service"}
           </h2>
           <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
             <div className="space-y-8">
                
                {/* 1. Category (Skip if Direct Booking) */}
                {!preSelectedProvider && (
                    <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 block">What do you need?</label>
                    <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES.map(cat => (
                            <button 
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${category === cat.id ? 'border-brand-green bg-green-50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`p-2 rounded-full ${cat.color}`}>
                                <cat.icon size={24} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                    </div>
                )}

                {/* 1.5 Project Scale */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-900 block">Project Scale</label>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setProjectScale('standard')}
                        className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${projectScale === 'standard' ? 'border-slate-800 bg-slate-50 text-slate-900' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                         <User size={20} />
                         <span className="font-bold text-xs">Home / Personal</span>
                      </button>
                      <button 
                        onClick={() => setProjectScale('corporate')}
                        className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${projectScale === 'corporate' ? 'border-brand-yellow bg-yellow-50 text-yellow-800' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                         <Building2 size={20} />
                         <span className="font-bold text-xs">Company / Major</span>
                      </button>
                   </div>
                   {projectScale === 'corporate' && (
                       <div className="flex items-center gap-2 text-[10px] text-yellow-700 bg-yellow-100/50 p-2 rounded-lg border border-yellow-100">
                          <CheckCircle2 size={12} />
                          <span>Strictly limited to <strong>Verified Top Maâlems</strong> (High Karné Score).</span>
                       </div>
                   )}
                </div>

                {/* 2. Urgency */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-900 block">How urgent is it?</label>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setUrgency('normal')}
                        className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${urgency === 'normal' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500'}`}
                      >
                         <Clock size={20} />
                         <span className="font-bold text-sm">Flexible</span>
                      </button>
                      <button 
                        onClick={() => setUrgency('urgent')}
                        className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${urgency === 'urgent' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-500'}`}
                      >
                         <AlertTriangle size={20} />
                         <span className="font-bold text-sm">Urgent (L'3ar)</span>
                      </button>
                   </div>
                </div>

                {/* 3. Details (Enhanced) */}
                <div className="space-y-3">
                   <label className="text-sm font-bold text-slate-900 block">Details (Visual Diagnosis)</label>
                   <div className="relative">
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the issue (e.g., Water leak in kitchen)..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green min-h-[120px] text-sm"
                      />
                      
                      {/* Media Buttons */}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                         <button className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-brand-blue border border-slate-200">
                            <Mic size={18} />
                         </button>
                         {urgency === 'urgent' ? (
                             <button 
                                onClick={() => setMediaAttached(!mediaAttached)}
                                className={`p-2 rounded-full shadow-sm border transition-colors ${mediaAttached ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}
                             >
                                <Video size={18} />
                             </button>
                         ) : (
                             <button 
                                onClick={() => setMediaAttached(!mediaAttached)}
                                className={`p-2 rounded-full shadow-sm border transition-colors ${mediaAttached ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-slate-500 border-slate-200'}`}
                             >
                                <Camera size={18} />
                             </button>
                         )}
                      </div>
                   </div>
                   {mediaAttached && (
                       <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 p-2 rounded-lg border border-green-100">
                           <CheckCircle2 size={12} />
                           <span>Media Attached for Diagnosis</span>
                       </div>
                   )}
                </div>

                {/* 4. Location */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-blue-800 uppercase">Location</p>
                         <p className="text-sm font-bold text-slate-900">Maârif, Casablanca</p>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-blue-600 hover:underline">Change</button>
                </div>

             </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100">
           <button 
             onClick={handleSubmit}
             disabled={(!category && !preSelectedProvider) || !description}
             className="w-full py-4 bg-gradient-brand text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
           >
              {urgency === 'urgent' ? (
                  <>
                    <Zap size={20} className="fill-white" />
                    <span>Broadcast Emergency</span>
                  </>
              ) : (
                  <>
                    <span>{preSelectedProvider ? "Confirm Booking" : "Find Maâlem"}</span>
                    <ChevronRight size={20} />
                  </>
              )}
           </button>
        </div>

      </div>
    </div>
  );
};

export default ServiceRequestModal;
