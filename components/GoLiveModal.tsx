
import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, RotateCcw, MessageCircle, Heart, Users, Radio, Settings, Share2, StopCircle, Calendar, Send, Globe, Lock, ChevronDown, Briefcase, BookOpen, Video, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GoLiveModalProps {
  onClose: () => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState<'setup' | 'countdown' | 'live' | 'summary' | 'converted'>('setup');
  const [title, setTitle] = useState('');
  
  // New: Intent Selection
  const [topic, setTopic] = useState<'discussion' | 'explanation' | 'event'>('discussion');
  const [audience, setAudience] = useState<'public' | 'professional' | 'private'>('public');
  
  const [isPublic, setIsPublic] = useState(true);
  
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Live Stats
  const [viewerCount, setViewerCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<{id: number, user: string, text: string, color: string, isMe?: boolean}[]>([]);
  const [userComment, setUserComment] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Initialize Camera
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: facingMode,
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

    if (step !== 'summary' && step !== 'converted') {
      startCamera();
    } else {
       // Stop camera on summary
       if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
       }
    }

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, step]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Handle Duration Timer & Simulated Metrics & Ghost Town Logic
  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    let metricsInterval: ReturnType<typeof setInterval>;

    if (step === 'live') {
      // Timer
      timerInterval = setInterval(() => {
        setDuration(prev => {
            const newDuration = prev + 1;
            
            // FIX 1: Smart Auto-Convert (Ghost Town Safety)
            // If 20 seconds pass with 0 viewers, convert to recording to save face.
            if (newDuration > 20 && viewerCount === 0) {
                setStep('converted');
            }
            return newDuration;
        });
      }, 1000);

      // Simulated Viewer/Like Growth
      metricsInterval = setInterval(() => {
        // Simulate organic growth ONLY if public
        const growthChance = audience === 'public' ? 0.6 : 0.2;
        
        if (Math.random() > (1 - growthChance)) { 
            setViewerCount(prev => prev + Math.floor(Math.random() * 3)); 
        }
        
        setLikes(prev => prev + Math.floor(Math.random() * 2));
        
        // Simulated Comments
        if (Math.random() > 0.8 && viewerCount > 0) {
           const newComment = {
             id: Date.now(),
             user: ['User_123', 'Sara.Tech', 'Ahmed_Dev', 'Morocco_Lover', 'Guest99'][Math.floor(Math.random() * 5)],
             text: ['Amazing!', 'Hello from Agadir', 'Can you explain the grant?', '🔥🔥🔥', 'Great initiative'][Math.floor(Math.random() * 5)],
             color: ['text-yellow-400', 'text-brand-green', 'text-white', 'text-blue-400'][Math.floor(Math.random() * 4)]
           };
           setComments(prev => [...prev.slice(-6), newComment]);
        }
      }, 1500);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(metricsInterval);
    };
  }, [step, viewerCount, audience]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleStartSequence = () => {
    if (!title.trim()) return;
    setStep('countdown');
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep('live');
          setViewerCount(0); // Start at 0 to test Ghost Town logic (simulated)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEndStream = () => {
    setStep('summary');
  };

  const handleSendComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userComment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: 'Me',
      text: userComment,
      color: 'text-white',
      isMe: true
    };
    
    setComments(prev => [...prev.slice(-6), newComment]);
    setUserComment('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900 animate-fade-in">
      
      {/* Container */}
      <div className="w-full h-full md:h-[90vh] md:max-w-[420px] md:rounded-3xl relative overflow-hidden bg-black flex flex-col border border-slate-800 shadow-2xl">
        
        {/* Permission Error */}
        {hasPermission === false && (
          <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
            <Radio size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
            <p className="text-slate-400 mb-6">Please enable camera and microphone access to start a live stream.</p>
            <button onClick={onClose} className="px-6 py-2 bg-slate-800 rounded-full font-bold">Close</button>
          </div>
        )}

        {/* Video Feed (Background for Setup, Countdown & Live) */}
        {step !== 'summary' && step !== 'converted' && (
          <div className="absolute inset-0 bg-slate-800">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted // Always mute local playback to avoid feedback
              className="w-full h-full object-cover transform scale-105"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
          </div>
        )}

        {/* --- STEP 1: SETUP --- */}
        {step === 'setup' && (
          <div className="relative z-10 flex flex-col h-full p-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
              <button onClick={onClose} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
                <X size={24} />
              </button>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                 Quiet Broadcast Mode
              </div>
            </div>

            {/* Main Form Area */}
            <div className="mt-8 space-y-6">
               <div className="space-y-2">
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Topic of discussion..."
                    className="w-full bg-transparent text-white text-3xl font-bold placeholder-white/50 focus:outline-none resize-none leading-tight"
                    maxLength={60}
                    autoFocus
                  />
                  <div className="h-1 w-20 bg-brand-green rounded-full"></div>
               </div>

               {/* Topic Selection */}
               <div>
                 <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageCircle size={12} /> Format
                 </p>
                 <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setTopic('discussion')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${topic === 'discussion' ? 'bg-brand-green/20 border-brand-green text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <MessageCircle size={20} />
                       <span className="text-[10px] font-bold">Discussion</span>
                    </button>
                    <button 
                      onClick={() => setTopic('explanation')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${topic === 'explanation' ? 'bg-brand-green/20 border-brand-green text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <BookOpen size={20} />
                       <span className="text-[10px] font-bold">Explain</span>
                    </button>
                    <button 
                      onClick={() => setTopic('event')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${topic === 'event' ? 'bg-brand-green/20 border-brand-green text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <Calendar size={20} />
                       <span className="text-[10px] font-bold">Event</span>
                    </button>
                 </div>
               </div>

               {/* Audience Selection */}
               <div>
                 <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={12} /> Audience
                 </p>
                 <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setAudience('public')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${audience === 'public' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <Globe size={20} />
                       <span className="text-[10px] font-bold">Public</span>
                    </button>
                    <button 
                      onClick={() => setAudience('professional')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${audience === 'professional' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <Briefcase size={20} />
                       <span className="text-[10px] font-bold">Pro</span>
                    </button>
                    <button 
                      onClick={() => setAudience('private')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${audience === 'private' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                       <Lock size={20} />
                       <span className="text-[10px] font-bold">Private</span>
                    </button>
                 </div>
               </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-auto space-y-6">
              
              {/* THE LAUNCH BUTTON */}
              <button 
                onClick={handleStartSequence}
                disabled={!title.trim() || hasPermission === false}
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 relative overflow-hidden group ${
                  title.trim() && hasPermission !== false
                    ? 'bg-gradient-brand hover:shadow-brand-green/40' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {/* Shine Effect */}
                {title.trim() && hasPermission !== false && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                )}
                
                <Radio size={22} className={title.trim() && hasPermission !== false ? "text-white animate-pulse" : "text-slate-500"} />
                <span>
                  {hasPermission === false 
                    ? 'Camera Access Denied' 
                    : (!title.trim() ? 'Enter Title' : 'Start Session')
                  }
                </span>
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: COUNTDOWN --- */}
        {step === 'countdown' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
             <div className="relative">
               <div className="text-[12rem] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 animate-ping absolute inset-0 flex items-center justify-center opacity-50">
                 {countdown}
               </div>
               <div className="text-[12rem] font-display font-bold text-white relative z-10 animate-bounce">
                 {countdown}
               </div>
             </div>
          </div>
        )}

        {/* --- STEP 3: LIVE BROADCAST --- */}
        {step === 'live' && (
          <div className="relative z-10 flex flex-col h-full animate-fade-in">
            {/* Header Stats */}
            <div className="flex justify-between items-start p-4 bg-gradient-to-b from-black/60 to-transparent pb-10">
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                   <div className="bg-red-600 px-2 py-1 rounded-md text-white font-bold text-[10px] animate-pulse shadow-lg flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                     ON AIR
                   </div>
                   <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-md text-white font-mono text-[10px]">
                     {formatTime(duration)}
                   </div>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                   <Users size={14} className="text-white" />
                   <span className="text-white text-xs font-bold">{viewerCount}</span>
                 </div>
                 <button onClick={handleEndStream} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors">
                   <X size={20} />
                 </button>
               </div>
            </div>

            {/* Ghost Town Warning (If no viewers) */}
            {viewerCount === 0 && duration > 5 && (
               <div className="absolute top-20 left-0 right-0 flex justify-center animate-fade-in">
                  <div className="bg-black/60 backdrop-blur-md text-white/80 text-[10px] px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                     <Video size={10} />
                     Recording mode active...
                  </div>
               </div>
            )}

            {/* Floating Hearts Area (Center Right) */}
            <div className="absolute right-4 bottom-32 flex flex-col items-end gap-2 pointer-events-none z-20">
              <div className="animate-float-up text-brand-yellow opacity-0"><Heart fill="currentColor" size={24} /></div>
              <div className="animate-float-up delay-700 text-red-500 opacity-0"><Heart fill="currentColor" size={32} /></div>
              <div className="animate-float-up delay-300 text-brand-green opacity-0"><Heart fill="currentColor" size={20} /></div>
            </div>

            {/* Bottom Controls & Chat */}
            <div className="mt-auto p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12">
              
              {/* Chat Window */}
              <div 
                ref={chatContainerRef}
                className="h-48 overflow-y-auto mb-4 mask-image-gradient flex flex-col space-y-2 scrollbar-hide px-1"
              >
                {/* System Message */}
                <div className="bg-brand-green/20 backdrop-blur-sm self-start px-3 py-1.5 rounded-xl border border-brand-green/30 mb-2">
                   <p className="text-[10px] text-brand-green font-bold">Welcome to the session. Interactions are moderated.</p>
                </div>

                {comments.map((c) => (
                  <div key={c.id} className={`flex flex-col animate-fade-in-up w-max max-w-[85%] ${c.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`px-3 py-2 rounded-2xl backdrop-blur-sm ${c.isMe ? 'bg-brand-blue/80 text-white rounded-br-sm' : 'bg-black/30 text-white rounded-bl-sm border border-white/5'}`}>
                      {!c.isMe && <span className={`font-bold text-[10px] block mb-0.5 ${c.color}`}>{c.user}</span>}
                      <span className="text-xs leading-relaxed">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3">
                <form 
                  onSubmit={handleSendComment}
                  className="flex-1 bg-black/40 backdrop-blur-md rounded-full h-12 flex items-center px-2 border border-white/10 focus-within:border-brand-green/50 transition-colors"
                >
                  <input 
                    type="text"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm px-3 placeholder-white/40"
                  />
                  <button 
                    type="submit"
                    disabled={!userComment.trim()}
                    className={`p-2 rounded-full transition-all ${userComment.trim() ? 'bg-brand-green text-white' : 'text-slate-500'}`}
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="flex gap-2">
                   <button onClick={toggleCamera} className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md hover:bg-white/20">
                      <RotateCcw size={20} />
                   </button>
                   <button className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md hover:bg-white/20">
                      <Share2 size={20} />
                   </button>
                   <button 
                     onClick={handleEndStream}
                     className="p-3 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transform active:scale-95 transition-all"
                   >
                      <StopCircle size={20} fill="currentColor" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 4: GHOST TOWN CONVERSION (Fix 1) --- */}
        {step === 'converted' && (
          <div className="relative z-10 flex flex-col h-full bg-slate-900 text-white p-8 items-center justify-center text-center animate-fade-in">
             <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-2 border-brand-green/50 shadow-xl shadow-brand-green/10">
               <Video size={32} className="text-brand-green" />
             </div>
             
             <h2 className="text-2xl font-display font-bold mb-2">Saved as Recording</h2>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-xs">
                It seems quiet today. We've automatically saved your session as a video so people can watch it later at their own pace.
             </p>

             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full mb-8">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs text-slate-400">Duration</span>
                   <span className="text-sm font-bold">{formatTime(duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-400">Status</span>
                   <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">Ready to Publish</span>
                </div>
             </div>

             <div className="flex flex-col gap-3 w-full">
               <button onClick={onClose} className="w-full py-3.5 bg-brand-green text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg">
                 Publish to Feed
               </button>
               <button onClick={onClose} className="w-full py-3.5 bg-transparent text-slate-400 font-bold rounded-xl hover:text-white transition-colors">
                 Discard
               </button>
             </div>
          </div>
        )}

        {/* --- STEP 5: SUMMARY --- */}
        {step === 'summary' && (
          <div className="relative z-10 flex flex-col h-full bg-slate-900 text-white p-8 items-center justify-center text-center animate-fade-in">
             <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-brand-green/10">
               <Radio size={40} className="text-brand-green" />
             </div>
             
             <h2 className="text-3xl font-display font-bold mb-2">Session Ended</h2>
             <p className="text-slate-400 mb-10">{formatTime(duration)} • {new Date().toLocaleDateString()}</p>

             <div className="grid grid-cols-3 gap-4 w-full mb-10">
               <div className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center border border-slate-700">
                 <span className="text-2xl font-bold text-white">{viewerCount}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Peak</span>
               </div>
               <div className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center border border-slate-700">
                 <span className="text-2xl font-bold text-brand-yellow">{likes}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Likes</span>
               </div>
               <div className="bg-slate-800 p-4 rounded-2xl flex flex-col items-center border border-slate-700">
                 <span className="text-2xl font-bold text-brand-green">{Math.floor(Math.random() * 50)}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Replies</span>
               </div>
             </div>

             <div className="flex flex-col gap-3 w-full">
               <button onClick={onClose} className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                 Save to Profile
               </button>
               <button className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                 View Analytics
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GoLiveModal;
