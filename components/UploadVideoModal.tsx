
import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Film, Play, Image as ImageIcon, CheckCircle2, AlertCircle, ChevronLeft, Tag, Globe, Lock, Eye, Sparkles, Calendar, ArrowRight, ShieldCheck, Wand2, Clock, FileVideo, Plus, Music, Type, Scissors, Palette, Layers, Mic } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { SovereignBackend } from '../services/SovereignBackend'; // Import Session

interface UploadVideoModalProps {
  onClose: () => void;
}

const CATEGORIES = ['Tech & Science', 'Education', 'Lifestyle', 'Vlog', 'News & Politics', 'Creative Arts', 'Gaming'];

const FILTERS = [
  { id: 'normal', name: 'Normal', style: {} },
  { id: 'cinema', name: 'Cinema', style: { filter: 'contrast(1.2) saturate(1.2)' } },
  { id: 'noir', name: 'Noir', style: { filter: 'grayscale(1) contrast(1.1)' } },
  { id: 'vintage', name: 'Vintage', style: { filter: 'sepia(0.4) contrast(0.9)' } },
  { id: 'vivid', name: 'Vivid', style: { filter: 'saturate(1.6)' } },
  { id: 'cold', name: 'Cold', style: { filter: 'hue-rotate(30deg) contrast(0.9)' } },
];

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { addPost } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Workflow State
  const [step, setStep] = useState<'upload' | 'wizard'>('upload');
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Details, 2: Studio (Edit/Checks), 3: Visibility
  
  // Edit Tab State (Step 2)
  const [editTab, setEditTab] = useState<'enhance' | 'elements' | 'checks'>('enhance');
  
  // File State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Upload & Processing Simulation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [checksStatus, setChecksStatus] = useState<'pending' | 'checking' | 'passed'>('pending');
  
  // Metadata State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tech & Science');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [isSchedule, setIsSchedule] = useState(false);
  
  // Effects & Edits State
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [aiAudioClean, setAiAudioClean] = useState(false);
  const [autoCaptions, setAutoCaptions] = useState(false);
  const [addedElements, setAddedElements] = useState<string[]>([]);

  // Initialize Upload Simulation on File Select
  useEffect(() => {
    if (videoFile && step === 'wizard') {
      // Simulate Upload
      const upInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(upInterval);
            // Start Processing
            startProcessing();
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 200);
      return () => clearInterval(upInterval);
    }
  }, [videoFile, step]);

  const startProcessing = () => {
    const procInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(procInterval);
          startChecks();
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 200);
  };

  const startChecks = () => {
    setChecksStatus('checking');
    setTimeout(() => {
      setChecksStatus('passed');
      // AI Autogenerate tags
      setAiTags(['#Innovation', '#FutureTech', '#MoroccoDigital', '#Growth']);
    }, 2000);
  };

  // Function to toggle elements selection
  const toggleElement = (id: string) => {
    setAddedElements(prev => 
      prev.includes(id) 
        ? prev.filter(el => el !== id) 
        : [...prev, id]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        processFile(file);
      }
    }
  };

  const processFile = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setTitle(file.name.split('.')[0]); // Auto-fill title
    setStep('wizard');
  };

  const handlePublish = async () => {
    if (!videoPreview) return;
    
    // Get current user session
    const session = await SovereignBackend.verifySession();
    const user = session?.user;
    
    const displayName = user?.name || 'Anonymous';
    const displayHandle = user ? `@${user.name.replace(/\s+/g, '').toLowerCase()}` : '@user';
    const displayAvatar = user?.role === 'professional' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    // Publish to Feed
    addPost({
      id: `video-${Date.now()}`,
      user: {
        name: displayName,
        handle: displayHandle,
        avatar: displayAvatar,
        isVerified: user?.isVerified || false,
        reputationLabel: 'Creator'
      },
      content: {
        text: `${title}\n\n${description}`,
        media: [videoPreview], // Must be an array
        mediaType: 'video',
        videoDuration: '4:20', // Static duration for demo, real implementation would extract metadata
        contextNote: `${selectedCategory} • ${visibility === 'public' ? 'Public' : 'Restricted'}`,
        hashtags: aiTags
      },
      stats: { likes: 0, comments: 0, shares: 0 },
      timestamp: 'Just now',
      distribution: { phase: 'incubating', healthScore: 95 },
      algoContext: { reason: 'civil_trust', label: 'Studio Upload' },
      isOfficial: false
    });

    onClose();
  };

  const StepIndicator = ({ num, label }: { num: number, label: string }) => (
    <div className={`flex items-center gap-2 ${wizardStep >= num ? 'text-brand-green' : 'text-slate-400'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
        wizardStep > num ? 'bg-brand-green border-brand-green text-white' : 
        wizardStep === num ? 'border-brand-green text-brand-green' : 'border-slate-300'
      }`}>
        {wizardStep > num ? <CheckCircle2 size={14} /> : num}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider hidden md:block">{label}</span>
      {num < 3 && <div className={`w-8 h-0.5 ${wizardStep > num ? 'bg-brand-green' : 'bg-slate-200'} hidden md:block`}></div>}
    </div>
  );

  const activeFilterStyle = FILTERS.find(f => f.id === selectedFilter)?.style || {};

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <h2 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
            <Film className="text-brand-green" size={20} />
            <span>Studio Upload</span>
          </h2>
          
          {step === 'wizard' && (
             <div className="flex items-center gap-4">
                <StepIndicator num={1} label="Details" />
                <StepIndicator num={2} label="Studio" />
                <StepIndicator num={3} label="Visibility" />
             </div>
          )}

          <button 
            onClick={onClose} 
            className="p-2 -mr-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-slate-50 relative flex">
          
          {step === 'upload' ? (
            <div 
              className="w-full flex flex-col items-center justify-center p-8"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-full max-w-lg border-2 border-dashed border-slate-300 rounded-3xl p-16 flex flex-col items-center justify-center bg-white hover:border-brand-green hover:bg-brand-green/5 transition-all group cursor-pointer shadow-sm"
                   onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 group-hover:bg-white group-hover:shadow-xl transition-all transform group-hover:scale-110 duration-500">
                  <UploadCloud size={64} className="text-slate-400 group-hover:text-brand-green" />
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-3">Upload Video</h3>
                <p className="text-slate-500 mb-8 text-center max-w-xs leading-relaxed">
                  Drag and drop video files to upload.<br/>
                  <span className="text-xs opacity-70">Your videos will be private until you publish them.</span>
                </p>
                <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg group-hover:bg-brand-green transition-colors">
                  Select Files
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="mt-8 text-xs text-slate-400 font-medium">
                 By submitting your videos to Mcommunication, you acknowledge that you agree to our Terms of Service.
              </p>
            </div>
          ) : (
            <>
              {/* Main Form (Left) */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                 
                 {/* Step 1: Details */}
                 {wizardStep === 1 && (
                    <div className="space-y-8 max-w-3xl animate-fade-in">
                       <div className="space-y-4">
                          <div className="flex justify-between items-baseline">
                             <h3 className="text-lg font-bold text-slate-900">Details</h3>
                             <button className="text-brand-green text-sm font-bold hover:underline">Reuse details</button>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Title (Required)</label>
                             <input 
                               type="text" 
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green font-medium"
                               placeholder="Add a title that describes your video"
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                             <textarea 
                               rows={6}
                               value={description}
                               onChange={(e) => setDescription(e.target.value)}
                               className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm leading-relaxed resize-none"
                               placeholder="Tell viewers about your video..."
                             />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase">Thumbnail</label>
                          <p className="text-sm text-slate-500 -mt-2 mb-2">Select or upload a picture that shows what's in your video.</p>
                          <div className="flex gap-4 overflow-x-auto pb-2">
                             <button className="w-40 h-24 flex-shrink-0 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-brand-green hover:text-brand-green bg-white">
                                <ImageIcon size={20} />
                                <span className="text-xs font-bold mt-1">Upload</span>
                             </button>
                             {[0, 1, 2].map(i => (
                                <div 
                                  key={i} 
                                  onClick={() => setSelectedThumbnail(i)}
                                  className={`w-40 h-24 flex-shrink-0 bg-black rounded-xl overflow-hidden cursor-pointer relative ${selectedThumbnail === i ? 'ring-2 ring-brand-green ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                >
                                   {videoPreview && (
                                      <video 
                                        src={videoPreview} 
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                        preload="metadata"
                                        onLoadedMetadata={(e) => {
                                           const video = e.currentTarget;
                                           if (isFinite(video.duration)) {
                                              video.currentTime = (video.duration / 3) * (i + 0.5);
                                           }
                                        }}
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                      />
                                   )}
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                          <div className="flex flex-wrap gap-2">
                             {CATEGORIES.map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setSelectedCategory(cat)}
                                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                >
                                   {cat}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Step 2: Creative Studio (Enhance, Elements, Checks) */}
                 {wizardStep === 2 && (
                    <div className="space-y-6 max-w-3xl animate-fade-in h-full flex flex-col">
                       
                       {/* Sub-Navigation for Step 2 */}
                       <div className="flex gap-2 border-b border-slate-200 pb-1">
                          {[
                             { id: 'enhance', label: 'Enhance', icon: Wand2 },
                             { id: 'elements', label: 'Elements', icon: Layers },
                             { id: 'checks', label: 'Checks', icon: ShieldCheck }
                          ].map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setEditTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                                   editTab === tab.id 
                                      ? 'border-brand-green text-brand-green' 
                                      : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                             >
                                <tab.icon size={16} />
                                {tab.label}
                             </button>
                          ))}
                       </div>

                       <div className="flex-1 overflow-y-auto pr-2">
                          
                          {/* --- TAB: ENHANCE (FILTERS & AUDIO) --- */}
                          {editTab === 'enhance' && (
                             <div className="space-y-8 animate-fade-in">
                                
                                {/* Filters */}
                                <div>
                                   <div className="flex justify-between items-center mb-4">
                                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                         <Palette size={16} className="text-brand-blue" />
                                         Video Filters
                                      </h4>
                                      <span className="text-xs font-bold text-brand-green">{selectedFilter !== 'normal' ? 'Active' : ''}</span>
                                   </div>
                                   
                                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                      {FILTERS.map(filter => (
                                         <button 
                                            key={filter.id}
                                            onClick={() => setSelectedFilter(filter.id)}
                                            className={`relative group rounded-xl overflow-hidden aspect-video border-2 transition-all ${selectedFilter === filter.id ? 'border-brand-green ring-2 ring-brand-green ring-offset-2' : 'border-transparent hover:border-slate-300'}`}
                                         >
                                            <div className="w-full h-full bg-slate-200" style={filter.style}>
                                               {videoPreview && (
                                                  <video 
                                                    src={videoPreview} 
                                                    className="w-full h-full object-cover" 
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                  />
                                               )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                               <span className="text-white font-bold text-xs">{filter.name}</span>
                                            </div>
                                            {selectedFilter === filter.id && (
                                               <div className="absolute top-1 right-1 bg-brand-green text-white p-0.5 rounded-full">
                                                  <CheckCircle2 size={12} />
                                               </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-medium">
                                               {filter.name}
                                            </div>
                                         </button>
                                      ))}
                                   </div>
                                </div>

                                {/* Audio Enhancements */}
                                <div>
                                   <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                      <Mic size={16} className="text-brand-blue" />
                                      Audio & Smart Tools
                                   </h4>
                                   
                                   <div className="space-y-3">
                                      <div className={`p-4 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${aiAudioClean ? 'bg-brand-green/5 border-brand-green' : 'bg-white border-slate-200 hover:border-slate-300'}`} onClick={() => setAiAudioClean(!aiAudioClean)}>
                                         <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${aiAudioClean ? 'bg-brand-green text-white' : 'bg-slate-100 text-slate-500'}`}>
                                               <Sparkles size={20} />
                                            </div>
                                            <div>
                                               <p className="font-bold text-sm text-slate-900">AI Audio Clean</p>
                                               <p className="text-xs text-slate-500">Remove background noise & enhance speech</p>
                                            </div>
                                         </div>
                                         <div className={`w-12 h-6 rounded-full relative transition-colors ${aiAudioClean ? 'bg-brand-green' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${aiAudioClean ? 'left-7' : 'left-1'}`}></div>
                                         </div>
                                      </div>

                                      <div className="p-4 rounded-xl border bg-white border-slate-200 opacity-60 cursor-not-allowed">
                                         <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                               <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                                                  <Scissors size={20} />
                                               </div>
                                               <div>
                                                  <p className="font-bold text-sm text-slate-900">Smart Trim</p>
                                                  <p className="text-xs text-slate-500">Auto-remove silence (Coming Soon)</p>
                                               </div>
                                            </div>
                                            <Lock size={16} className="text-slate-400" />
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {/* --- TAB: ELEMENTS (SUBTITLES & END SCREEN) --- */}
                          {editTab === 'elements' && (
                             <div className="space-y-6 animate-fade-in">
                                <h4 className="text-sm font-bold text-slate-900 mb-2">Interactive Elements</h4>
                                
                                {/* Auto Captions */}
                                <div className={`p-4 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${autoCaptions ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200 hover:border-slate-300'}`} onClick={() => setAutoCaptions(!autoCaptions)}>
                                   <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${autoCaptions ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                         <Type size={20} />
                                      </div>
                                      <div>
                                         <p className="font-bold text-sm text-slate-900">Auto-Captions (CC)</p>
                                         <p className="text-xs text-slate-500">Generate subtitles automatically</p>
                                      </div>
                                   </div>
                                   {autoCaptions ? (
                                      <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-200">Generated</span>
                                   ) : (
                                      <Plus size={20} className="text-slate-400" />
                                   )}
                                </div>

                                {/* Standard Elements */}
                                {[
                                   { id: 'endscreen', label: 'Add End Screen', icon: ArrowRight, desc: 'Promote related content' },
                                   { id: 'cards', label: 'Add Info Cards', icon: AlertCircle, desc: 'Link to websites or playlists' }
                                ].map((item) => {
                                   const isAdded = addedElements.includes(item.id);
                                   return (
                                     <div key={item.id} className={`flex justify-between items-center p-4 bg-white border rounded-xl transition-all cursor-pointer hover:border-slate-300 ${isAdded ? 'border-brand-green shadow-sm' : 'border-slate-200'}`} onClick={() => toggleElement(item.id)}>
                                        <div className="flex items-center gap-3">
                                           <div className={`p-2 rounded-lg transition-colors ${isAdded ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                              <item.icon size={20} />
                                           </div>
                                           <div>
                                              <p className="font-bold text-sm text-slate-700">{item.label}</p>
                                              <p className="text-xs text-slate-400">{item.desc}</p>
                                           </div>
                                        </div>
                                        {isAdded ? <CheckCircle2 size={20} className="text-brand-green" /> : <Plus size={20} className="text-slate-400" />}
                                     </div>
                                   );
                                })}
                             </div>
                          )}

                          {/* --- TAB: CHECKS --- */}
                          {editTab === 'checks' && (
                             <div className="space-y-6 animate-fade-in">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                   <div className="flex items-start gap-4">
                                      <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl">
                                         <ShieldCheck size={24} />
                                      </div>
                                      <div className="flex-1">
                                         <h4 className="font-bold text-slate-900">Safety & Copyright</h4>
                                         <p className="text-sm text-slate-500 mt-1">We checked your video for potential issues.</p>
                                         
                                         <div className="mt-6 space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                               <div className="flex items-center gap-3">
                                                  <div className={`w-2 h-2 rounded-full ${checksStatus === 'passed' ? 'bg-brand-green' : 'bg-brand-yellow animate-pulse'}`}></div>
                                                  <div>
                                                     <span className="font-bold text-sm text-slate-900">Copyright Check</span>
                                                     {checksStatus === 'checking' && <span className="text-xs text-slate-400 ml-2">Processing...</span>}
                                                  </div>
                                               </div>
                                               {checksStatus === 'passed' ? <CheckCircle2 size={20} className="text-brand-green" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-brand-green animate-spin"></div>}
                                            </div>

                                            {checksStatus === 'passed' && (
                                               <div className="p-4 bg-brand-yellow/5 rounded-xl border border-brand-yellow/20">
                                                  <div className="flex items-center gap-2 mb-2">
                                                     <Sparkles size={16} className="text-brand-yellow-dark" />
                                                     <span className="text-xs font-bold text-brand-yellow-dark uppercase">AI Suggestions</span>
                                                  </div>
                                                  <div className="flex flex-wrap gap-2">
                                                     {aiTags.map(tag => (
                                                        <span key={tag} className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{tag}</span>
                                                     ))}
                                                  </div>
                                               </div>
                                            )}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                       </div>
                    </div>
                 )}

                 {/* Step 3: Visibility */}
                 {wizardStep === 3 && (
                    <div className="space-y-8 max-w-3xl animate-fade-in">
                       <h3 className="text-lg font-bold text-slate-900">Visibility</h3>
                       
                       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                          <div className="p-6 space-y-4">
                             <div className="flex items-start gap-3">
                                <input 
                                  type="radio" 
                                  name="vis" 
                                  id="vis-private" 
                                  className="mt-1 accent-brand-green"
                                  checked={visibility === 'private'}
                                  onChange={() => setVisibility('private')}
                                />
                                <div>
                                   <label htmlFor="vis-private" className="font-bold text-sm text-slate-900 block">Private</label>
                                   <p className="text-xs text-slate-500">Only you and people you choose can watch your video</p>
                                </div>
                             </div>
                             
                             <div className="flex items-start gap-3">
                                <input 
                                  type="radio" 
                                  name="vis" 
                                  id="vis-connections" 
                                  className="mt-1 accent-brand-green"
                                  checked={visibility === 'connections'}
                                  onChange={() => setVisibility('connections')}
                                />
                                <div>
                                   <label htmlFor="vis-connections" className="font-bold text-sm text-slate-900 block">Connections Only</label>
                                   <p className="text-xs text-slate-500">Visible to your professional network</p>
                                </div>
                             </div>

                             <div className="flex items-start gap-3">
                                <input 
                                  type="radio" 
                                  name="vis" 
                                  id="vis-public" 
                                  className="mt-1 accent-brand-green"
                                  checked={visibility === 'public'}
                                  onChange={() => setVisibility('public')}
                                />
                                <div>
                                   <label htmlFor="vis-public" className="font-bold text-sm text-slate-900 block">Public</label>
                                   <p className="text-xs text-slate-500">Everyone can watch your video</p>
                                </div>
                             </div>
                          </div>

                          <div className="bg-slate-50 p-6 border-t border-slate-100">
                             <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  id="schedule" 
                                  className="accent-slate-900"
                                  checked={isSchedule}
                                  onChange={() => setIsSchedule(!isSchedule)}
                                />
                                <div>
                                   <label htmlFor="schedule" className="font-bold text-sm text-slate-900 block">Schedule</label>
                                   <p className="text-xs text-slate-500">Select a date to make your video public</p>
                                </div>
                             </div>
                             
                             {isSchedule && (
                                <div className="mt-4 flex gap-4 animate-fade-in-down">
                                   <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                      <Calendar size={16} className="text-slate-400" />
                                      <span className="text-sm font-medium text-slate-700">Oct 24, 2024</span>
                                   </div>
                                   <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                      <Clock size={16} className="text-slate-400" />
                                      <span className="text-sm font-medium text-slate-700">10:00 AM</span>
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl flex gap-3">
                          <AlertCircle size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-700 leading-relaxed">
                             <strong>Important:</strong> Before you publish, check the following:
                             <ul className="list-disc list-inside mt-1 opacity-80">
                                <li>Do children appear in this video?</li>
                                <li>Does the content follow our Community Guidelines?</li>
                             </ul>
                          </div>
                       </div>
                    </div>
                 )}

              </div>

              {/* Sidebar (Right) - Status Summary */}
              <div className="w-80 bg-white border-l border-slate-100 hidden md:flex flex-col">
                 <div className="p-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative mb-4 flex items-center justify-center group">
                       {videoPreview ? (
                          <video 
                            src={videoPreview} 
                            className="w-full h-full object-cover" 
                            controls 
                            playsInline
                            style={activeFilterStyle}
                            onError={(e) => {
                               console.warn("Video preview failed to load"); // Removed event object to prevent circular structure error
                               e.currentTarget.style.display = 'none';
                            }}
                          />
                       ) : (
                          <div className="text-white/50 text-xs">No Video Selected</div>
                       )}
                       
                       {/* Filter Badge on Preview */}
                       {selectedFilter !== 'normal' && (
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                             {FILTERS.find(f => f.id === selectedFilter)?.name}
                          </div>
                       )}
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">File Name</p>
                          <p className="text-sm font-medium text-slate-700 truncate">{videoFile?.name}</p>
                       </div>
                       
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Processing</p>
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-green transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
                             </div>
                             <span className="text-[10px] font-mono text-slate-500">{Math.round(processingProgress)}%</span>
                          </div>
                          {processingProgress === 100 && (
                             <p className="text-[10px] text-brand-green font-bold mt-1 flex items-center gap-1">
                                <CheckCircle2 size={10} /> 4K Available
                             </p>
                          )}
                       </div>

                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Checks</p>
                          <div className="flex items-center gap-2 text-xs">
                             {checksStatus === 'pending' && <span className="text-slate-500">Waiting...</span>}
                             {checksStatus === 'checking' && <span className="text-brand-blue animate-pulse">Running checks...</span>}
                             {checksStatus === 'passed' && (
                                <span className="text-brand-green font-bold flex items-center gap-1">
                                   <CheckCircle2 size={12} /> No issues found
                                </span>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                       <button 
                         onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                         disabled={wizardStep === 1}
                         className="text-slate-500 font-bold text-sm hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                       >
                         Back
                       </button>
                       {wizardStep < 3 ? (
                          <button 
                            onClick={() => setWizardStep(prev => Math.min(3, prev + 1))}
                            className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Next
                          </button>
                       ) : (
                          <button 
                            onClick={handlePublish}
                            disabled={checksStatus !== 'passed' && processingProgress < 100}
                            className="px-6 py-2.5 bg-brand-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Publish
                          </button>
                       )}
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;
