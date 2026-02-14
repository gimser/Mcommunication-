
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Music, Zap, RotateCcw, ChevronRight, Check, Type, Scissors, Sticker, ArrowLeft, Upload, Search, Play, Pause, Video, AlertCircle, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { SovereignBackend } from '../services/SovereignBackend'; // Import Session

interface CreateReelModalProps {
  onClose: () => void;
}

const MUSICS = [
  { id: 1, title: 'National Anthem - Remix', artist: 'DJ Watani', duration: '0:30' },
  { id: 2, title: 'Desert Vibes', artist: 'Sahara Beats', duration: '0:15' },
  { id: 3, title: 'Future Tech', artist: 'Innovation Hub', duration: '0:45' },
  { id: 4, title: 'Atlas Mountains', artist: 'Folk Modern', duration: '0:60' },
];

const FILTERS = [
  { id: 'normal', name: 'Normal', style: {} },
  { id: 'vivid', name: 'Vivid', style: { filter: 'saturate(1.5) contrast(1.1)' } },
  { id: 'mono', name: 'Mono', style: { filter: 'grayscale(1)' } },
  { id: 'vintage', name: 'Vintage', style: { filter: 'sepia(0.5) contrast(0.9) brightness(0.9)' } },
  { id: 'cool', name: 'Cool', style: { filter: 'hue-rotate(30deg) contrast(1.1)' } },
  { id: 'warm', name: 'Warm', style: { filter: 'sepia(0.3) saturate(1.2)' } },
  { id: 'dream', name: 'Dream', style: { filter: 'blur(0.5px) brightness(1.1) saturate(1.2)' } },
];

const CreateReelModal: React.FC<CreateReelModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { addPost } = useContent(); // CONSUME CONTEXT
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<'capture' | 'preview' | 'details'>('capture');
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [selectedMusic, setSelectedMusic] = useState<typeof MUSICS[0] | null>(null);
  
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [overlayText, setOverlayText] = useState('');

  const [caption, setCaption] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      if (step !== 'capture') return;

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: cameraFacingMode,
            width: { ideal: 1080 },
            height: { ideal: 1920 }
          },
          audio: true
        });

        if (mounted) {
          setHasPermission(true);
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (mounted) setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacingMode, step]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            stopRecording();
            return 100;
          }
          return prev + 1;
        });
      }, 50 * (1/selectedSpeed)); 
    }
    return () => clearInterval(interval);
  }, [isRecording, selectedSpeed]);

  const toggleCamera = () => {
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const startRecording = () => {
    setRecordingProgress(0);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setStep('preview');
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Get current user session
    const session = await SovereignBackend.verifySession();
    const user = session?.user;
    
    const displayName = user?.name || 'Anonymous';
    const displayHandle = user ? `@${user.name.replace(/\s+/g, '').toLowerCase()}` : '@user';
    const displayAvatar = user?.role === 'professional' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    setTimeout(() => {
      // Create a Post representation of the Reel for the main Feed
      // Following the "Calm Video Protocol"
      addPost({
        id: `reel-${Date.now()}`,
        user: {
          name: displayName,
          handle: displayHandle,
          avatar: displayAvatar,
          isVerified: user?.isVerified || false
        },
        content: {
          text: caption,
          mediaType: 'video', // This triggers the Calm Video player in PostCard
          media: ['https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'], // Simulated URL
          videoDuration: '45s', // For Micro-Story indicator
        },
        stats: { likes: 0, comments: 0, shares: 0 },
        timestamp: 'Just now',
        distribution: { phase: 'incubating', healthScore: 85 }
      });

      setIsPublishing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-fade-in">
      <div className="bg-black w-full h-full md:h-[85vh] md:max-w-[400px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-800">
        
        {step === 'capture' && (
          <div className="relative h-full flex flex-col">
            
            <div className="absolute inset-0 bg-slate-900 overflow-hidden">
              {hasPermission === false ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Video size={32} className="text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Camera Access Denied</h3>
                  <p className="text-sm text-slate-400 mb-6">Please enable camera permissions in your browser settings to create a Reel.</p>
                  <button onClick={onClose} className="px-6 py-2 bg-slate-700 rounded-full font-bold">Close</button>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform scale-105" 
                    style={selectedFilter.style}
                  />
                  {overlayText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-white font-bold text-2xl px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm shadow-xl">
                        {overlayText}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="relative z-10 flex justify-between items-center p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
              <button onClick={onClose} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
                <X size={24} />
              </button>
              
              <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                 <Zap size={12} className="text-brand-yellow" />
                 <span className="text-xs font-bold text-white">Create Micro-Story</span>
              </div>
              
              <div className="w-10"></div> 
            </div>

            <div className="absolute right-4 top-24 z-10 flex flex-col gap-6 items-center">
              {[
                { icon: RotateCcw, label: 'Flip', action: toggleCamera },
                { icon: Type, label: 'Text', action: () => setShowTextEditor(true) },
                { icon: Music, label: 'Sound', action: () => setShowMusicPicker(true) },
              ].map((tool, idx) => (
                <button 
                  key={idx} 
                  onClick={tool.action}
                  className="flex flex-col items-center gap-1 group relative"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur-md text-white transition-colors shadow-lg bg-black/30 group-hover:bg-black/50`}>
                    <tool.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-white shadow-md">{tool.label}</span>
                </button>
              ))}
            </div>

            {!isRecording && (
               <div className="absolute bottom-32 inset-x-0 flex justify-center pointer-events-none z-10">
                  <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
                     <p className="text-xs text-white font-medium flex items-center gap-2">
                        <Lightbulb size={12} className="text-brand-yellow" />
                        Focus on one clear idea. 60s max.
                     </p>
                  </div>
               </div>
            )}

            <div className="mt-auto relative z-10 pb-8 pt-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              
              <div className="flex justify-center gap-4 mb-8 overflow-x-auto px-4 scrollbar-hide py-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter)}
                    className={`flex flex-col items-center gap-1 min-w-[50px] transition-transform ${selectedFilter.id === filter.id ? 'scale-110' : 'opacity-70 scale-90'}`}
                  >
                    <div className={`w-12 h-12 rounded-full border-2 ${selectedFilter.id === filter.id ? 'border-brand-yellow shadow-[0_0_10px_rgba(255,209,0,0.5)]' : 'border-white'} overflow-hidden relative bg-gray-500`}>
                      <div className="w-full h-full" style={{...filter.style, backgroundColor: '#888'}}></div>
                    </div>
                    <span className={`text-[10px] font-bold ${selectedFilter.id === filter.id ? 'text-brand-yellow' : 'text-white'} shadow-sm`}>{filter.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between px-10">
                <button className="flex flex-col items-center gap-1 text-white group">
                   <div className="w-10 h-10 rounded-lg border-2 border-white/30 bg-white/10 flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors">
                     <Upload size={20} />
                   </div>
                   <span className="text-[10px] font-bold shadow-sm">Upload</span>
                </button>

                <button 
                  onClick={toggleRecording}
                  disabled={!hasPermission}
                  className="relative group transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-200 ${isRecording ? 'border-brand-yellow scale-110' : 'border-white'}`}>
                    <div className={`rounded-full transition-all duration-200 ${isRecording ? 'w-8 h-8 rounded-md bg-brand-yellow' : 'w-16 h-16 bg-brand-green group-hover:bg-brand-green/90'}`}></div>
                  </div>
                  {isRecording && (
                     <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="46" fill="none" stroke="transparent" strokeWidth="4" />
                       <circle 
                          cx="50" cy="50" r="46" 
                          fill="none" 
                          stroke="#FFD100" 
                          strokeWidth="4" 
                          strokeDasharray="289"
                          strokeDashoffset={289 - (289 * recordingProgress) / 100}
                          className="transition-all duration-100 ease-linear"
                       />
                     </svg>
                  )}
                </button>

                <div className="w-10"></div>
              </div>
            </div>
            
            {showMusicPicker && (
              <div className="absolute inset-x-0 bottom-0 top-1/3 bg-slate-900 rounded-t-3xl z-30 p-6 animate-slide-up border-t border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Choose Audio</h3>
                  <button onClick={() => setShowMusicPicker(false)}><X className="text-white" /></button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input type="text" placeholder="Search songs..." className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green" />
                </div>
                <div className="space-y-2 overflow-y-auto max-h-[300px]">
                  {MUSICS.map(music => (
                    <div key={music.id} onClick={() => { setSelectedMusic(music); setShowMusicPicker(false); }} className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-xl cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center text-white">
                          <Play size={16} fill="white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{music.title}</p>
                          <p className="text-slate-400 text-xs">{music.artist} • {music.duration}</p>
                        </div>
                      </div>
                      {selectedMusic?.id === music.id && <Check size={18} className="text-brand-green" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showTextEditor && (
              <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-4">
                <input 
                  autoFocus
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Type something..."
                  className="bg-transparent text-white text-3xl font-bold text-center placeholder-white/50 focus:outline-none w-full mb-8"
                />
                <div className="flex gap-4">
                  <button onClick={() => setShowTextEditor(false)} className="px-6 py-2 bg-white text-black font-bold rounded-full">Done</button>
                  <button onClick={() => { setOverlayText(''); setShowTextEditor(false); }} className="px-6 py-2 border border-white text-white font-bold rounded-full">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {(step === 'preview' || step === 'details') && (
          <div className="relative h-full flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
               <button onClick={() => setStep('capture')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                 <ArrowLeft size={24} />
               </button>
               <h3 className="font-bold text-slate-900">New Micro-Story</h3>
               <button 
                onClick={() => setStep(step === 'preview' ? 'details' : 'details')} 
                className={`text-brand-green font-bold text-sm ${step === 'details' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
               >
                 Next
               </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="w-full aspect-[9/16] bg-black relative mb-6 overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    className="w-full h-full object-cover" 
                    style={selectedFilter.style}
                    alt="Reel Preview"
                  />
                  
                  {overlayText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white font-bold text-xl px-3 py-1 bg-black/50 rounded-lg">
                        {overlayText}
                      </span>
                    </div>
                  )}

                  {selectedMusic && (
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                       <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                         <Music size={12} className="text-brand-yellow" />
                         <span className="text-white text-xs font-bold">{selectedMusic.title}</span>
                       </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                     <div className="bg-black/50 px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-md">
                       Preview Mode
                     </div>
                  </div>
              </div>

              {step === 'details' && (
                <div className="px-6 pb-20 animate-fade-in-up">
                   <div className="mb-6">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                     <textarea 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's the core idea?"
                        rows={3}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-green resize-none text-sm"
                     />
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-700">Allow Remixing</span>
                           <span className="text-xs text-slate-400">Let others build on your idea</span>
                        </div>
                        <div className="w-10 h-5 bg-brand-green rounded-full relative cursor-pointer">
                           <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {step === 'details' && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-white border-t border-slate-100">
                 <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full py-3.5 bg-brand-green text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
                 >
                   {isPublishing ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Posting...</span>
                     </>
                   ) : (
                     <>
                       <Check size={20} />
                       <span>Share Micro-Story</span>
                     </>
                   )}
                 </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateReelModal;
