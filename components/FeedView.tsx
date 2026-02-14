
import React, { useState, useEffect } from 'react';
import PostCard, { PostProps } from './PostCard';
import { 
  Plus, TrendingUp, Zap, Calendar, Image as ImageIcon, Radio, 
  CheckCircle2, Siren, Shield, Info, Filter, ChevronDown, 
  FileText, Activity, Briefcase, ShieldCheck, Film, Play, Eye, 
  X, Heart, MessageCircle, Share2, Music2, Bookmark, ChevronUp, 
  Edit3, Coffee, Lock, BrainCircuit, Landmark, GraduationCap, 
  Stethoscope, Bus, Coins, Fingerprint, Sun, Map, MapPin, ArrowRight, Award, Cloud, Users, Flame, Trophy, Timer, Target, Globe, Swords, Crosshair, RefreshCw,
  Feather, Battery, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Sparkles, History, GitMerge, ScanFace, Scale, Building, ChevronRight, Moon, Lightbulb, Handshake, Ticket, Infinity, Compass, BookOpen, Star, Palette, Megaphone, Wrench, Hammer, Camera
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import CreateContentModal from './CreateContentModal';
import VerificationModal from './VerificationModal';
import { BehaviorEngine, WellbeingStatus, Reflection, AbsenceDigest, MentalState, ContentRecommendation, GravityResult, FlowPace, FeedLayer } from '../services/BehaviorEngine';
import { CitizenshipMode } from '../App';
import { SovereignBackend } from '../services/SovereignBackend'; // Added for fetching user session

interface FeedViewProps {
  isEmergency?: boolean;
  citizenshipMode?: CitizenshipMode;
  onInteraction?: () => void;
  onNavigateToProfile?: (user: any) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ isEmergency = false, citizenshipMode = 'active', onInteraction, onNavigateToProfile }) => {
  const { t, language } = useLanguage();
  const { posts, activeLive } = useContent(); 
  
  const [greeting, setGreeting] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'raslhanout' | 'community' | 'official'>('raslhanout');
  
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [absenceDigest, setAbsenceDigest] = useState<AbsenceDigest | null>(null);
  
  const [flowPace, setFlowPace] = useState<FlowPace>('accelerated');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showAlgoInfo, setShowAlgoInfo] = useState(false);
  const [selectedReel, setSelectedReel] = useState<any | null>(null);
  
  // Current User State for Avatar Display
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [wellbeingStatus, setWellbeingStatus] = useState<WellbeingStatus>({ 
    status: 'healthy', 
    sessionDuration: 0, 
    interactionVelocity: 0, 
    cognitiveMode: 'immersive' 
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting(t('greeting.morning'));
    } else if (hour >= 12 && hour < 18) {
      setGreeting(t('greeting.welcome'));
    } else {
      setGreeting(t('greeting.evening'));
    }
  }, [t]);

  // Fetch Current User on Mount
  useEffect(() => {
      const fetchUser = async () => {
          const session = await SovereignBackend.verifySession();
          if (session) {
              setCurrentUser(session.user);
          }
      };
      fetchUser();
  }, []);

  // Reel Logic
  const closeReel = () => {
    setSelectedReel(null);
  };

  const handleVerificationSuccess = () => {
    setIsUserVerified(true);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'official') return post.isOfficial;
    if (activeTab === 'community') return !post.isOfficial;
    return true; // 'raslhanout' shows all prioritized
  });

  const sovereignPosts = filteredPosts.filter(p => BehaviorEngine.classifyPostLayer(p) === 'sovereign');
  const mainStreamPosts = filteredPosts.filter(p => BehaviorEngine.classifyPostLayer(p) !== 'sovereign');

  // Determine avatar to show
  const userAvatar = currentUser?.avatar || (currentUser?.role === 'professional' 
    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' 
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');

  return (
    <div className={`w-full relative transition-all duration-1000 bg-slate-50`}>
      
      {/* Platform Header with Arabesque Texture and Zellige Strip */}
      <div className={`bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs font-mono border-b border-slate-800 sticky top-0 z-40 relative overflow-hidden`}>
         {/* Background Pattern */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none"></div>
         
         {/* Top Zellige Decorative Strip */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-green opacity-80"></div>

         <div className="flex items-center gap-2 relative z-10 pt-1">
           <Wrench size={12} className="text-brand-green" />
           <span className="opacity-80">System:</span>
           <strong className="text-brand-green">Electro Gim Services OS</strong>
         </div>
         
         <div className="flex items-center gap-3 relative z-10 pt-1">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wide bg-blue-900/50 border-blue-700 text-blue-300`}>
               <Activity size={10} />
               <span>Market Active</span>
            </div>
         </div>
      </div>

      {/* Greeting Header */}
      <div className="px-4 py-6 md:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
         <div>
           <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
             <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span className="flex items-center gap-1 text-brand-green"><MapPin size={12} /> Casablanca</span>
           </div>
           <h1 className={`text-3xl font-display font-bold text-slate-900`}>
             {greeting}, <span className={`text-transparent bg-clip-text bg-gradient-brand`}>Maâlem</span>
           </h1>
         </div>
      </div>

      {/* Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-0 md:px-0 relative z-10">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Action */}
          <div className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group border-slate-100`}>
            {/* Subtle Zellige Border Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-green opacity-50"></div>
            
            <div className="flex gap-4 mb-4 mt-2">
               <div className="relative cursor-pointer transition-transform hover:scale-105" onClick={() => setIsCreateModalOpen(true)}>
                 <img src={userAvatar} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="My Avatar" />
                 <div className="absolute -bottom-1 -right-1 bg-brand-green text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                   <Plus size={10} strokeWidth={4} />
                 </div>
               </div>
               
               <div onClick={() => setIsCreateModalOpen(true)} className="flex-grow bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center px-4 cursor-pointer transition-colors border border-transparent hover:border-slate-200 group-hover:bg-white group-hover:shadow-inner">
                 <span className="text-slate-400 font-medium text-sm flex items-center gap-2">
                    <Camera size={16} />
                    {t('feed.whatsHappening')}
                 </span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
             <div className="flex gap-4">
               <button 
                 onClick={() => setActiveTab('raslhanout')}
                 className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'raslhanout' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 {t('feed.trending')}
               </button>
               <button 
                 onClick={() => setActiveTab('community')}
                 className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'community' ? 'border-brand-yellow text-brand-yellow-dark' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 {t('feed.suggested')}
               </button>
             </div>
             <button className="text-slate-400 hover:text-slate-600 pb-3">
               <Filter size={18} />
             </button>
          </div>

          <div className="space-y-6">
            {/* LAYER 1: Sovereign / Admin Posts */}
            {sovereignPosts.map(post => (
               <PostCard key={post.id} {...post} onInteraction={onInteraction} onNavigateToProfile={onNavigateToProfile} />
            ))}

            {/* LAYER 2: Professional Work Showcase */}
            {mainStreamPosts.map(post => (
              <PostCard key={post.id} {...post} onInteraction={onInteraction} onNavigateToProfile={onNavigateToProfile} />
            ))}
          </div>
        </div>

        {/* 5. Right Sidebar (National Dashboard) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
             <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
               <Zap size={16} className="text-brand-green" /> Quick Actions
             </h3>
             <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pro ID', icon: <Fingerprint size={22} />, color: 'text-white bg-gradient-brand' },
                  { label: 'Market', icon: <Briefcase size={22} />, color: 'text-brand-yellow-dark bg-brand-yellow/20' },
                  { label: 'Repairs', icon: <Wrench size={22} />, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Learn', icon: <GraduationCap size={22} />, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Suppliers', icon: <TruckIcon size={22} />, color: 'text-orange-500 bg-orange-50' }, // Changed Icon
                  { label: 'Support', icon: <LifeBuoyIcon size={22} />, color: 'text-slate-700 bg-slate-100' }, // Changed Icon
                ].map((svc, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${svc.color} group-hover:scale-105 transition-transform`}>
                       {svc.icon}
                     </div>
                     <span className="text-[10px] font-bold text-slate-600">{svc.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* 'RAS DERB' WIDGET (MOROCCAN HYPER-LOCAL NEWS) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                   <Megaphone size={16} className="text-brand-yellow" /> {t('local.rasderb')}
                 </h3>
                 <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white/80">3 min walk</span>
               </div>
               
               <div className="space-y-3 relative z-10">
                  <div className="flex gap-3 items-start border-b border-white/10 pb-3">
                     <div className="w-10 h-10 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
                        <Hammer size={18} className="text-white" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-white leading-tight mb-1">New Construction Site in Hay Riad.</p>
                        <p className="text-[10px] text-white/50">Looking for 3 Electricians.</p>
                     </div>
                  </div>
               </div>
            </div>

          <div className="text-xs text-slate-400 flex flex-wrap gap-2 px-2">
              <a href="#" className="hover:underline">Privacy</a> • 
              <a href="#" className="hover:underline">Terms</a> • 
              <a href="#" className="hover:underline">Community Guidelines</a> • 
              <span>© 2024 Electro Gim</span>
          </div>
        </div>
      </div>

      {isCreateModalOpen && <CreateContentModal onClose={() => setIsCreateModalOpen(false)} />}
      
      {isVerificationModalOpen && (
        <VerificationModal 
          onClose={() => setIsVerificationModalOpen(false)} 
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

// Icon helpers
const TruckIcon = ({size}: {size: number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const LifeBuoyIcon = ({size}: {size: number}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>;

export default FeedView;
