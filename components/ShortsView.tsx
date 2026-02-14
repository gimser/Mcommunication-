

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Music2, Plus, MoreHorizontal, Play, Pause, Volume2, VolumeX, ShieldCheck, Send, X, Bookmark, Zap, Eye, CheckCircle2, Info, Hand, Film, TrendingUp, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Reel {
  id: number;
  videoUrl: string; // Using high-res images to simulate video for stability
  user: {
    name: string;
    handle: string;
    avatar: string;
    isOfficial?: boolean;
    isFollowing?: boolean;
    isMe?: boolean; // New: Identify if the user is the creator
  };
  description: string;
  music: string;
  stats: {
    likes: string;
    comments: string;
    shares: string;
  };
  tags: string[];
  // Meaning Metrics (Creator Only)
  impactStats?: {
    reachLabel: string;
    completionRate: string;
    saves: number;
  }
}

// SCENARIO 6: PRE-POPULATED REEL
const reelsData: Reel[] = [
  {
    id: 600,
    videoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', // Electrician working
    user: {
      name: 'Youssef Electric',
      handle: '@youssef_elec',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      isOfficial: true,
      isFollowing: false,
      isMe: true // Simulating "Me" for the scenario to show the impact board
    },
    description: 'Professional technique for safe hidden wiring. ⚡️ Clean setup is key! #San3a #Electrician',
    music: 'Work Flow - Beats',
    stats: { likes: '1.2k', comments: '45', shares: '12' },
    tags: ['#San3a', '#Tutorial', '#Pro', '#ViralCandidate'],
    impactStats: {
        reachLabel: 'Local',
        completionRate: '15%',
        saves: 2
    }
  },
  {
    id: 601,
    videoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=800&q=80', // Mechanic
    user: {
      name: 'Auto Fix',
      handle: '@autofix_maroc',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
      isOfficial: false,
      isFollowing: true,
      isMe: false
    },
    description: 'Engine diagnostics made simple. 🚗🔧',
    music: 'Garage Sound',
    stats: { likes: '850', comments: '20', shares: '5' },
    tags: ['#Mechanic', '#Auto', '#Fix'],
  }
];

const ViralSuccessOverlay = ({ onDismiss }: { onDismiss: () => void }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="text-center p-6 bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/50 rounded-3xl shadow-2xl relative overflow-hidden max-w-xs mx-4 animate-scale-in">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            
            {/* Rocket Icon */}
            <div className="relative z-10 mb-4 inline-block">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-50 animate-pulse"></div>
                <TrendingUp size={64} className="text-purple-400 relative z-10" />
            </div>

            <h2 className="relative z-10 text-3xl font-display font-black text-white italic tracking-tighter mb-1 uppercase">
                GOING VIRAL
            </h2>
            <p className="relative z-10 text-purple-200 text-xs font-bold uppercase tracking-widest mb-6">
                Scenario 6: Star Created
            </p>

            <div className="space-y-3 relative z-10 text-left">
                <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-brand-green" />
                        <span className="text-sm font-bold text-white">Reach</span>
                    </div>
                    <span className="text-brand-green font-mono font-bold">+15k</span>
                </div>
                
                <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-brand-yellow" />
                        <span className="text-sm font-bold text-white">Reputation</span>
                    </div>
                    <span className="text-brand-yellow font-mono font-bold">+50 Pts</span>
                </div>

                <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between border border-white/20">
                    <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-blue-400" />
                        <span className="text-sm font-bold text-white">Job Requests</span>
                    </div>
                    <span className="text-blue-400 font-mono font-bold">3 New</span>
                </div>
            </div>

            <button 
                onClick={onDismiss}
                className="relative z-10 mt-6 w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
            >
                Awesome
            </button>
        </div>
    </div>
);

const ReelItem: React.FC<{ reel: Reel; isActive: boolean }> = ({ reel, isActive }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTbarkallah, setIsTbarkallah] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showHandAnimation, setShowHandAnimation] = useState(false);
  const [showImpactBoard, setShowImpactBoard] = useState(true); 
  
  // SCENARIO 6 STATES
  const [hasShared, setHasShared] = useState(false);
  const [viralStage, setViralStage] = useState<'idle' | 'triggered' | 'complete'>('idle');

  // Reset state when active changes
  useEffect(() => {
    setIsPlaying(isActive);
    if (!isActive) setProgress(0);
  }, [isActive]);

  // Simulate Video Progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && viralStage !== 'triggered') { // Pause progress if viral modal is open
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viralStage]);

  // SCENARIO 6: VIRAL TRIGGER LOGIC
  useEffect(() => {
      // Condition: High Retention (>70%) + Saved + Shared
      if (progress > 70 && isSaved && hasShared && viralStage === 'idle') {
          setIsPlaying(false); // Pause video
          setViralStage('triggered');
      }
  }, [progress, isSaved, hasShared, viralStage]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTbarkallah(true);
    setShowHandAnimation(true);
    setTimeout(() => setShowHandAnimation(false), 800);
  };

  const handleShare = () => {
      setHasShared(true);
      // Simulate share sheet closing immediately for demo
  };

  return (
    <div className="relative h-full w-full snap-start flex items-center justify-center bg-slate-900 overflow-hidden">
      
      {/* SCENARIO 6: OVERLAY */}
      {viralStage === 'triggered' && (
          <ViralSuccessOverlay onDismiss={() => { setViralStage('complete'); setIsPlaying(true); }} />
      )}

      {/* Video Content Layer */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {/* Simulate Video with Image */}
        <img 
          src={reel.videoUrl} 
          className="h-full w-full object-cover opacity-90 transition-transform duration-700" 
          style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }}
          alt="Reel content" 
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>

        {/* Play/Pause Icon Overlay */}
        {!isPlaying && viralStage !== 'triggered' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Tbarkallah Hand Animation (Khamsa) */}
        {showHandAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce-in">
             <Hand size={100} className="text-white fill-white drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-20">
         <h3 className="font-display font-bold text-white drop-shadow-md opacity-80">Reels</h3>
         <button onClick={toggleMute} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
         </button>
      </div>

      {/* ================= CREATOR IMPACT BOARD (SCENARIO 2 & 6 Update) ================= */}
      {reel.user.isMe && reel.impactStats && (
         <div className="absolute top-16 left-4 right-4 z-30 animate-fade-in-down">
            <div className={`backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl transition-all duration-500 ${viralStage === 'complete' ? 'bg-purple-900/60 border-purple-500/50' : 'bg-black/40'}`}>
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     {viralStage === 'complete' ? <TrendingUp size={14} className="text-purple-400" /> : <Zap size={14} className="text-brand-yellow" fill="currentColor" />}
                     <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                         {viralStage === 'complete' ? 'Viral Status: ACTIVE' : 'Qualitative Impact'}
                     </h4>
                  </div>
                  <button onClick={() => setShowImpactBoard(!showImpactBoard)} className="text-white/50 hover:text-white">
                     <Info size={14} />
                  </button>
               </div>
               
               <p className="text-sm font-bold text-white leading-tight mb-3">
                  {viralStage === 'complete' ? 'Your content is exploding! 🚀' : <span>Your Reel reached people who <span className="text-brand-green">truly care</span>.</span>}
               </p>

               <div className="flex gap-4">
                  <div className="bg-white/10 rounded-lg p-2 flex-1">
                     <span className="block text-[10px] text-white/60 uppercase">Completion Rate</span>
                     <span className={`text-lg font-bold ${viralStage === 'complete' ? 'text-purple-300' : 'text-brand-green'}`}>
                         {viralStage === 'complete' ? '85%' : reel.impactStats.completionRate}
                     </span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 flex-1">
                     <span className="block text-[10px] text-white/60 uppercase">Saves & Shares</span>
                     <span className={`text-lg font-bold ${viralStage === 'complete' ? 'text-purple-300' : 'text-brand-yellow'}`}>
                         {viralStage === 'complete' ? '1.2k' : reel.impactStats.saves}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-30">
        
        {/* User Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 rounded-full border-2 border-white p-0.5 overflow-hidden">
             <img src={reel.user.avatar} className="w-full h-full rounded-full object-cover" />
          </div>
          {!reel.user.isFollowing && !reel.user.isMe && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-brand-green rounded-full p-0.5 border border-white">
              <Plus size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Tbarkallah Action */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsTbarkallah(!isTbarkallah)}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
            title="Tbarkallah (Blessing)"
          >
            <Hand size={26} className={isTbarkallah ? "fill-brand-green text-brand-green" : ""} />
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">{viralStage === 'complete' ? '12k' : reel.stats.likes}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setShowComments(true)}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
          >
            <MessageCircle size={26} />
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">{viralStage === 'complete' ? '300' : reel.stats.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
             onClick={() => setIsSaved(!isSaved)}
             className={`p-3 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90 ${isSaved ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-white/10'}`}
          >
            <Bookmark size={26} className={isSaved ? "fill-brand-yellow" : ""} />
          </button>
          <span className="text-white text-xs font-bold drop-shadow-md">Save</span>
        </div>

        <div className="flex flex-col items-center gap-1">
            <button 
                onClick={handleShare}
                className={`p-3 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90 ${hasShared ? 'bg-brand-green/20 text-brand-green' : 'bg-white/10'}`}
            >
            <Share2 size={26} />
            </button>
            <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
        </div>

        <button className="text-white/80 hover:text-white mt-2">
           <MoreHorizontal size={24} />
        </button>
        
        {/* Music Disc */}
        <div className="mt-4 relative">
           <div className={`w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
             <Music2 size={16} className="text-white" />
           </div>
           <div className="absolute -top-4 -left-2 text-white/50 animate-float-up">♪</div>
           <div className="absolute -top-8 -right-2 text-white/50 animate-float-up delay-700">♫</div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-0 bottom-0 right-16 z-20 p-4 pb-8 text-white bg-gradient-to-t from-black/80 to-transparent">
        <div className="mb-3">
           <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg shadow-black drop-shadow-md">{reel.user.name}</h3>
              {reel.user.isOfficial && <ShieldCheck size={16} className="text-brand-green fill-white" />}
              <span className="text-white/80 text-xs font-medium opacity-80">{reel.user.handle}</span>
           </div>
           
           <p className="text-sm mb-2 leading-relaxed opacity-90 line-clamp-2">{reel.description}</p>
           
           <div className="flex flex-wrap gap-2 text-xs font-bold text-white/90 mb-3">
              {reel.tags.map(tag => <span key={tag}>{tag}</span>)}
           </div>

           <div className="flex items-center gap-2 text-xs font-bold bg-white/10 backdrop-blur-md self-start px-3 py-1.5 rounded-full w-max">
             <Music2 size={12} />
             <div className="overflow-hidden w-24">
                <span className="whitespace-nowrap animate-marquee inline-block">{reel.music} • Original Audio</span>
             </div>
           </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-brand-green transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Comments Sheet (Simulated) */}
      {showComments && (
        <div className="absolute inset-0 z-40 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          ></div>
          <div className="relative w-full bg-white rounded-t-2xl h-[60%] flex flex-col animate-slide-up">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Comments ({reel.stats.comments})</h3>
                <button onClick={() => setShowComments(false)}><X size={20} className="text-slate-400" /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 flex items-center justify-center">
                <p className="text-slate-400 text-sm">No comments yet. Be the first!</p>
             </div>
             <div className="p-3 border-t border-slate-100 flex items-center gap-2">
                <input type="text" placeholder="Add a comment..." className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-green outline-none" />
                <button className="p-2 text-brand-green"><Send size={20} /></button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ShortsView: React.FC = () => {
  if (reelsData.length === 0) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white p-8 rounded-none md:rounded-2xl">
        <Film size={48} className="mb-4 opacity-50" />
        <h3 className="font-display font-bold text-xl mb-2">No Reels Yet</h3>
        <p className="text-white/60 text-center text-sm">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth rounded-none md:rounded-2xl scrollbar-hide">
      {reelsData.map((reel, index) => (
        <ReelItem key={reel.id} reel={reel} isActive={true} />
      ))}
    </div>
  );
};

export default ShortsView;
