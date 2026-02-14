
import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, CheckCircle2, ShieldCheck, Play, Pause, Volume2, VolumeX, Image as ImageIcon, Send, ArrowRight, MessageSquare, AlertCircle, FileSignature, Globe, MapPin, AlertTriangle, Scale, Fingerprint, Eye, Info, Clock, TrendingUp, Award, FileText, Sparkles, Map, Building2, Handshake, Repeat, Users, Radio, GitCommit, CornerDownRight, BrainCircuit, Lightbulb, Zap, Palette, Star, Flag, Hexagon, Hammer, ArrowLeftRight, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export type DistributionPhase = 'incubating' | 'expanding' | 'nationwide' | 'halted';

export interface PostProps {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
    isDistinguished?: boolean; 
    title?: string;
    reputationLabel?: string; 
  };
  content: {
    text: string;
    media?: string[];
    mediaType?: 'image' | 'video' | 'audio' | 'before_after'; 
    hashtags?: string[];
    audioDuration?: string;
    videoDuration?: string; 
    isTrustedSource?: boolean; 
    contextNote?: string; 
    // New: Studio Design Data
    studioDesign?: {
      elements: any[];
      backgroundColor: string;
      aspectRatio: string;
    };
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  isOfficial?: boolean; 
  isCivil?: boolean; 
  civilValidator?: string; 
  isOpinion?: boolean;
  isNationalAnnouncement?: boolean;
  isLocalAlert?: boolean;
  isUrgentAppeal?: boolean; 
  isProofOfWork?: boolean;
  locationScope?: string;
  impactTrace?: {
    status: 'received' | 'reviewing' | 'debating' | 'approved';
    progress: number; 
    ministry: string;
  };
  distribution?: {
    phase: DistributionPhase;
    healthScore: number; 
  };
  affinityContext?: {
    type: 'discussion_resume' | 'common_ground' | 'familiar_faces' | 'reflection_pending';
    label: string; 
    relatedAvatars: string[]; 
  };
  algoContext?: {
    reason: 'priority_safety' | 'chronological' | 'geo_relevance' | 'impact_tracking' | 'civil_trust';
    label: string;
  };
  cta?: {
    label: string;
    action: () => void;
    type?: 'primary' | 'secondary';
  };
  onInteraction?: () => void;
  onNavigateToProfile?: (user: any) => void;
}

// ==========================================
// LAYER 1: SOCIAL INTERACTION
// ==========================================
const SocialLayout: React.FC<PostProps> = ({ user, content, stats, timestamp, isOpinion, algoContext, impactTrace, isCivil, civilValidator, onInteraction, distribution, affinityContext, isUrgentAppeal, isProofOfWork, onNavigateToProfile }) => {
  const { t } = useLanguage();
  const [isAppreciated, setIsAppreciated] = useState(false);
  const [isTbarkallah, setIsTbarkallah] = useState(false); 
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false); 
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine "Moul Tawil" or "Top Maâlem" Status (Distinguished)
  const isMoulTawil = user.isDistinguished || (distribution?.healthScore || 0) > 90 || isCivil || isProofOfWork;
  const isTopMaalem = user.reputationLabel === 'Top Maâlem'; // Scenario 5 Check

  const handleAppreciate = () => {
    setIsAppreciated(!isAppreciated);
    if (!isAppreciated && onInteraction) onInteraction();
  };

  const handleTbarkallah = () => {
    setIsTbarkallah(!isTbarkallah);
    if (!isTbarkallah && onInteraction) onInteraction();
  };

  const handlePlayVideo = () => {
    if (videoError) return;
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(e => {
                console.warn("Video play failed", e);
            });
        }
        setIsPlaying(!isPlaying);
    }
  };

  const handleHchouma = () => {
    alert("Reported as 'Hchouma'. Thank you.");
    setShowMenu(false);
  };

  const avatarShapeClass = user.isDistinguished 
    ? "rounded-[14px] border-2 border-teal-400 p-[2px]" 
    : "rounded-full border border-slate-100";

  const getDistributionIcon = () => {
    switch (distribution?.phase) {
      case 'incubating': return <Users size={12} />;
      case 'expanding': return <Radio size={12} />;
      case 'nationwide': return <Globe size={12} />;
      case 'halted': return <AlertTriangle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const getDistributionColor = () => {
    switch (distribution?.phase) {
      case 'incubating': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'expanding': return 'bg-green-50 text-green-700 border-green-200 animate-pulse-slow';
      case 'nationwide': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'halted': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getDistributionLabel = () => {
    switch (distribution?.phase) {
      case 'incubating': return 'Shared with Circle';
      case 'expanding': return 'Content Worth Reading';
      case 'nationwide': return 'Nationwide Visibility';
      case 'halted': return 'Reach Paused (Quality Check)';
      default: return algoContext?.label || 'Recent';
    }
  };

  // Helper to render media content robustly
  const renderMediaContent = () => {
    if (content.studioDesign) {
        return (
             <div 
                className="mt-3 relative rounded-xl overflow-hidden group border border-slate-100 shadow-sm"
                style={{
                   width: '100%',
                   aspectRatio: content.studioDesign.aspectRatio || '4/5',
                   background: content.studioDesign.backgroundColor || '#0F172A',
                   position: 'relative'
                }}
             >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 pointer-events-none"></div>
                {content.studioDesign.elements.filter((e: any) => e.visible).sort((a: any,b: any) => a.zIndex - b.zIndex).map((el: any) => (
                   <div
                      key={el.id}
                      style={{
                         position: 'absolute',
                         left: `${el.x}%`,
                         top: `${el.y}%`,
                         width: el.type === 'text' ? 'auto' : `${el.width}%`,
                         height: el.type === 'shape' ? `${el.height}%` : 'auto',
                         transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.scale})`,
                         opacity: el.opacity,
                         zIndex: el.zIndex,
                         pointerEvents: 'none'
                      }}
                   >
                        {el.type === 'text' || el.type === 'sticker' ? (
                           <div 
                              style={{ 
                                 color: el.color, 
                                 backgroundColor: el.backgroundColor,
                                 backgroundImage: el.backgroundImage,
                                 fontFamily: el.fontFamily, 
                                 fontWeight: el.fontWeight,
                                 fontSize: `${el.fontSize}rem`,
                                 textAlign: el.textAlign,
                                 letterSpacing: `${el.letterSpacing}px`,
                                 lineHeight: el.lineHeight,
                                 textTransform: el.uppercase ? 'uppercase' : 'none',
                                 padding: el.padding,
                                 borderRadius: el.borderRadius,
                                 border: el.border,
                                 whiteSpace: 'pre-wrap',
                                 ...el.customStyle
                              }}
                           >
                              {el.content}
                           </div>
                        ) : el.type === 'image' ? (
                           <img src={el.content} className="w-full h-auto" alt="" />
                        ) : el.type === 'shape' ? (
                           <div style={{ width: '100%', height: '100%', backgroundColor: el.backgroundColor, borderRadius: el.borderRadius }}></div>
                        ) : null}
                   </div>
                ))}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-50">
                   <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap size={8} className="text-white" />
                   </div>
                   <span className="text-[8px] font-bold text-white uppercase tracking-wider">GIM Studio</span>
                </div>
             </div>
        );
    }

    if (!content.media || content.media.length === 0) return null;

    // VIDEO HANDLING
    if (content.mediaType === 'video') {
        return (
            <div className="mt-3 relative rounded-xl overflow-hidden bg-black w-full shadow-sm" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
                {!videoError ? (
                    <video 
                        key={content.media[0]} // Force re-render if src changes
                        ref={videoRef}
                        src={content.media[0]} 
                        className="w-full h-full object-contain bg-black"
                        loop
                        playsInline
                        muted
                        preload="metadata"
                        onClick={handlePlayVideo}
                        onError={() => setVideoError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-100">
                        <AlertCircle size={32} />
                        <span className="text-xs font-bold mt-2">Video Unavailable</span>
                    </div>
                )}

                {/* Play Button Overlay */}
                {!isPlaying && !videoError && (
                    <div 
                        className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer transition-all hover:bg-black/30"
                        onClick={handlePlayVideo}
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl group">
                            <Play size={32} className="text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                )}

                {/* Duration Badge */}
                {content.videoDuration && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                        {content.videoDuration}
                    </div>
                )}
            </div>
        );
    }

    // BEFORE/AFTER HANDLING
    if (content.mediaType === 'before_after' && content.media.length >= 2) {
        return (
            <div className="mt-3 relative flex h-64 border-2 border-brand-green/20 rounded-xl overflow-hidden shadow-sm">
                <div className="w-1/2 relative border-r-2 border-white">
                    <img src={content.media[0]} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">BEFORE</div>
                </div>
                <div className="w-1/2 relative">
                    <img src={content.media[1]} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">AFTER</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100">
                    <ArrowLeftRight size={16} className="text-slate-900" />
                    </div>
                </div>
            </div>
        );
    }

    // STANDARD IMAGE HANDLING
    return (
        <div className="mt-3 relative rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
            <div className={`absolute inset-0 border-[3px] ${isCivil ? 'group-hover:border-indigo-400/50' : 'group-hover:border-brand-yellow/50 border-brand-yellow/0'} transition-all duration-500 rounded-xl z-10 pointer-events-none`}></div>
            <img src={content.media[0]} className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
        </div>
    );
  };

  return (
    <div className={`bg-white border relative rounded-2xl mb-6 shadow-sm hover:shadow-md transition-shadow duration-500 overflow-visible
        ${isUrgentAppeal ? 'border-red-200 shadow-md shadow-red-100' : 
          (isTopMaalem ? 'border-yellow-300 ring-2 ring-yellow-400/20 shadow-lg shadow-yellow-100' :
          (isProofOfWork ? 'border-brand-green/40 ring-1 ring-brand-green/20' : 
          (isMoulTawil ? 'border-brand-green/30 ring-1 ring-brand-green/10' : 
          (isCivil ? 'border-indigo-100' : 
          (impactTrace ? 'border-teal-500/30' : 
          (affinityContext ? 'border-l-4 border-l-brand-yellow border-y-slate-100 border-r-slate-100' : 'border-slate-100'))))))}`}
    >
      
      {/* --- MOUL TAWIL / TOP MAALEM DECORATION --- */}
      {(isMoulTawil || isProofOfWork || isTopMaalem) && !isUrgentAppeal && (
        <div className="absolute -top-1 -left-1 -right-1 h-2 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-repeat-x opacity-20 border-t-2 border-brand-green/20 rounded-t-2xl pointer-events-none"></div>
      )}

      {/* Distribution Label */}
      {!isUrgentAppeal && !isProofOfWork && !isTopMaalem && (
        <div className="absolute top-0 right-0 p-3 z-10">
            <div className={`flex items-center gap-1.5 px-2 py-1 border rounded-full text-[9px] font-mono uppercase tracking-wider cursor-help transition-all ${getDistributionColor()}`} title={`Distribution Phase: ${distribution?.phase}`}>
              {getDistributionIcon()}
              {getDistributionLabel()}
            </div>
        </div>
      )}

      {/* TOP MAALEM HEADER */}
      {isTopMaalem && (
         <div className="bg-gradient-to-r from-yellow-100 to-white border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Crown size={14} className="text-yellow-600 fill-yellow-600" />
                <span className="text-[11px] font-bold text-yellow-800 uppercase tracking-widest">Top Maâlem • Elite Pro</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-yellow-700 font-bold bg-white px-2 py-0.5 rounded-full border border-yellow-200 shadow-sm">
                <Star size={10} className="fill-yellow-500 text-yellow-500" />
                Top Rated
            </div>
         </div>
      )}

      {/* PROOF OF WORK HEADER (SCENARIO 2) */}
      {isProofOfWork && !isTopMaalem && (
        <div className="bg-gradient-to-r from-green-50 to-white border-b border-green-100 px-4 py-2 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Hammer size={14} className="text-brand-green" />
             <span className="text-[11px] font-bold text-green-800 uppercase tracking-widest">Proof of Work (San3a)</span>
           </div>
           <div className="flex items-center gap-1 text-[9px] text-green-700 font-bold bg-white px-2 py-0.5 rounded-full border border-green-100 shadow-sm">
             <Radio size={10} className="animate-pulse" />
             Broadcasting Locally
           </div>
        </div>
      )}

      {/* L'3AR HEADER */}
      {isUrgentAppeal && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <AlertTriangle size={14} className="text-red-600 animate-pulse" />
             <span className="text-[11px] font-bold text-red-700 uppercase tracking-widest">{t('local.l3ar')}</span>
           </div>
           <span className="text-[10px] text-red-500 font-medium">Community Assistance Required</span>
        </div>
      )}

      {/* CIVIL TRUST HEADER */}
      {isCivil && (
        <div className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 px-4 py-2 flex items-center gap-2">
           <Building2 size={14} className="text-indigo-600" />
           <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
             Civil Verified • {civilValidator || 'Trusted Partner'}
           </span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div 
              className={`relative cursor-pointer ${avatarShapeClass}`}
              onClick={() => onNavigateToProfile && onNavigateToProfile(user)}
            >
              <img src={user.avatar} alt={user.name} className={`w-10 h-10 object-cover ${user.isDistinguished ? 'rounded-[10px]' : 'rounded-full'}`} />
              {user.isVerified && !isCivil && (
                <div className="absolute -bottom-1 -right-1 bg-brand-blue text-white rounded-full p-[2px] border-2 border-white">
                  <CheckCircle2 size={8} />
                </div>
              )}
            </div>
            <div>
              <h4 
                className="font-bold text-slate-900 text-sm hover:underline cursor-pointer flex items-center gap-2"
                onClick={() => onNavigateToProfile && onNavigateToProfile(user)}
              >
                {user.name}
                {user.reputationLabel && (
                  <span className={`text-[10px] font-serif italic px-2 py-0.5 rounded-full border ${isTopMaalem ? 'bg-yellow-100 text-yellow-800 border-yellow-200 font-bold' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {user.reputationLabel}
                  </span>
                )}
              </h4>
              <div className="flex items-center text-slate-500 text-xs gap-1">
                 <span className="opacity-80">{user.handle}</span>
                 <span>•</span>
                 <span>{timestamp}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Moul Tawil Seal */}
            {(isMoulTawil || isProofOfWork) && !isUrgentAppeal && !isTopMaalem && (
                <div className="absolute right-8 top-0 p-1">
                    <Hexagon size={24} className="text-brand-yellow/20 fill-brand-yellow/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={10} className="text-brand-yellow" />
                    </div>
                </div>
            )}

            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-scale-in origin-top-right">
                 <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700">
                   <Bookmark size={16} /> Save Post
                 </button>
                 <button onClick={handleHchouma} className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-bold text-red-600">
                   <Flag size={16} /> {t('local.hchouma')}
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          {content.contextNote && (
            <div className={`flex items-center gap-2 ${isProofOfWork ? 'bg-green-50 border-green-100 text-green-800' : 'bg-brand-yellow/5 border-brand-yellow/10 text-yellow-900'} border rounded-lg px-3 py-1.5 mb-3 w-fit`}>
               <Lightbulb size={12} className={isProofOfWork ? "text-green-600" : "text-yellow-700"} />
               <span className="text-xs font-bold leading-tight">{content.contextNote}</span>
            </div>
          )}

          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line mb-3">
            {content.text}
          </p>
          
          {/* Media Rendering */}
          {renderMediaContent()}
        </div>

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1">
            
            {/* Button 1: Appreciate / Rate */}
            <button 
              onClick={handleAppreciate}
              className={`group flex items-center gap-2 text-sm font-medium transition-all px-3 py-2 rounded-full ${
                isAppreciated 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Heart 
                size={20} 
                className={`transition-all duration-300 ${isAppreciated ? 'fill-rose-600 scale-110' : 'group-hover:scale-110'}`} 
              />
              <span className={`text-xs font-bold transition-opacity ${isAppreciated ? 'opacity-100' : 'opacity-80'}`}>
                 {isProofOfWork && isAppreciated ? "Rated Good" : (isAppreciated ? "Appreciated" : (isProofOfWork ? "Rate Work" : "Appreciate"))}
              </span>
            </button>

            {/* Button 2: Tbarkallah */}
            <button 
              onClick={handleTbarkallah}
              className={`group flex items-center gap-2 text-sm font-medium transition-all px-3 py-2 rounded-full ${
                isTbarkallah 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
              title="Tbarkallah (Blessing/Praise)"
            >
              <Star 
                size={20} 
                className={`transition-all duration-300 ${isTbarkallah ? 'fill-emerald-600 scale-110' : 'group-hover:scale-110'}`} 
              />
              <span className={`text-xs font-bold ${isTbarkallah ? 'inline' : 'hidden sm:inline'}`}>
                {t('local.tbarkallah')}
              </span>
            </button>
            
            {/* Button 3: Discuss / Contact */}
            <button 
                onClick={() => onNavigateToProfile && onNavigateToProfile(user)}
                className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-full hover:bg-blue-50"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-bold hidden sm:inline">
                {isProofOfWork ? "Contact Maâlem" : "Discuss"}
              </span>
            </button>

            {/* Button 4: Remix (Not for Urgent) */}
            {!isUrgentAppeal && !isProofOfWork && (
              <button className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-full hover:bg-purple-50">
                <Palette size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-bold hidden sm:inline">Remix</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsSaved(!isSaved)} 
            className={`group p-2 rounded-full transition-colors hover:bg-yellow-50 ${isSaved ? 'text-brand-yellow' : 'text-slate-400 hover:text-brand-yellow'}`}
          >
            <div className={`transition-transform duration-300 ${isSaved ? 'scale-110' : 'group-hover:scale-110'}`}>
               <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// LAYER 2: SOVEREIGN AUTHORITY (Unchanged)
// ==========================================
const SovereignLayout: React.FC<PostProps> = ({ user, content, timestamp, isNationalAnnouncement, isLocalAlert, cta, locationScope, algoContext }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const theme = isNationalAnnouncement 
    ? { bg: 'bg-slate-900', border: 'border-brand-gold', text: 'text-white', accent: 'text-brand-gold' }
    : { bg: 'bg-white', border: 'border-orange-500', text: 'text-slate-900', accent: 'text-orange-600' };

  return (
    <div className={`relative mb-8 rounded-lg overflow-hidden border-l-4 ${theme.bg} ${theme.border} shadow-lg group`}>
      <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none"><ShieldCheck size={200} /></div>
      <div className="flex items-center justify-between p-4 border-b border-black/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded border bg-slate-200 border-slate-300 text-slate-700"><Scale size={20} /></div>
          <div>
            <h3 className={`font-display font-bold text-base leading-none ${theme.text} tracking-wide`}>{user.name.toUpperCase()}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.accent}`}>{isLocalAlert ? `Local Alert • ${locationScope}` : 'Official Communiqué'}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-mono text-[10px] opacity-60 ${theme.text}`}>{timestamp}</p>
        </div>
      </div>
      <div className="p-5 relative z-10">
        <div className={`font-serif text-lg leading-relaxed ${theme.text}`}>{content.text}</div>
        <div className="mt-6 flex items-center justify-between">
           <div className="flex items-center gap-2 opacity-50"><Fingerprint size={24} className={theme.text} /><span className={`text-[8px] font-mono uppercase ${theme.text}`}>Digitally Signed</span></div>
           <button onClick={() => setAcknowledged(true)} className={`px-5 py-2 rounded-md font-bold text-xs uppercase shadow-md flex items-center gap-2 transition-all ${acknowledged ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700'}`}>{acknowledged ? <CheckCircle2 size={14} /> : <Eye size={14} />} {acknowledged ? 'Acknowledged' : 'Mark as Read'}</button>
        </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<PostProps> = (props) => {
  const isSovereign = props.isOfficial || props.isNationalAnnouncement || props.isLocalAlert;
  if (isSovereign) {
    return <SovereignLayout {...props} />;
  }
  return <SocialLayout {...props} />;
};

export default PostCard;
