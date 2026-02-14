
import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Globe, ChevronDown, Loader2, Sparkles, AlertTriangle, ArrowRight, Camera, ShoppingBag, ListChecks, Hash, Wand2, Lock, Users, Smile, Calendar, Plus, XCircle, BarChart3, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext'; 
import { SovereignBackend } from '../services/SovereignBackend';
import PostCard from './PostCard'; // Import for Live Preview

interface CreatePostModalProps {
  onClose: () => void;
}

type PostType = 'status' | 'media' | 'product' | 'poll' | 'urgent';

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { addPost } = useContent(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- STATE ---
  const [postType, setPostType] = useState<PostType>('status');
  const [text, setText] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [audience, setAudience] = useState<'public' | 'connections' | 'private'>('public');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  // Product Mode
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  
  // Poll Mode
  const [pollOptions, setPollOptions] = useState(['', '']);

  // AI & Analytics
  const [impactScore, setImpactScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  
  // User Data
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);

  // --- EFFECTS ---

  // Load User
  useEffect(() => {
    const loadUser = async () => {
        const session = await SovereignBackend.verifySession();
        if (session) {
            setCurrentUser(session.user);
        } else {
            // Fallback mock
            setCurrentUser({
                name: 'Guest User',
                handle: '@guest',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                role: 'citizen'
            });
        }
    };
    loadUser();
  }, []);

  // Real-time Impact Analysis
  useEffect(() => {
    const calculateImpact = () => {
        let score = 10;
        if (text.length > 20) score += 20;
        if (text.length > 100) score += 10;
        if (media.length > 0) score += 30;
        if (postType === 'product' && productPrice) score += 20;
        if (postType === 'urgent') score += 10;
        if (hashtags.length > 0) score += 10;
        
        setImpactScore(Math.min(100, score));
    };
    
    // Debounce
    const timer = setTimeout(calculateImpact, 500);
    return () => clearTimeout(timer);
  }, [text, media, postType, productPrice, hashtags]);

  // --- HANDLERS ---

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setMedia(prev => [...prev, url]);
      if (postType === 'status') setPostType('media');
    }
  };

  const removeMedia = (index: number) => {
      setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleMagicRefine = () => {
      if (!text) return;
      setIsRefining(true);
      setTimeout(() => {
          // Simulation of AI refinement
          setText(prev => prev.trim() + " ✨ (Refined for clarity)");
          setIsRefining(false);
      }, 1000);
  };

  const handlePost = () => {
    setIsPosting(true);
    
    setTimeout(() => {
      let contextNote = '';
      if (postType === 'product') contextNote = `Selling: ${productName} • ${productPrice} MAD`;
      if (postType === 'urgent') contextNote = "Emergency Alert (L'3ar)";
      if (postType === 'poll') contextNote = "Community Poll";

      addPost({
        id: `post-${Date.now()}`,
        user: {
          name: currentUser?.name || 'User',
          handle: currentUser?.handle || '@user',
          avatar: currentUser?.avatar || '',
          isVerified: currentUser?.isVerified,
          reputationLabel: currentUser?.role === 'professional' ? 'Maâlem' : 'Citizen'
        },
        content: {
          text: text,
          media: media,
          mediaType: media.length > 0 ? 'image' : undefined,
          contextNote: contextNote,
          hashtags: hashtags
        },
        stats: { likes: 0, comments: 0, shares: 0 },
        timestamp: 'Just now',
        distribution: { phase: 'incubating', healthScore: impactScore },
        isUrgentAppeal: postType === 'urgent',
      });

      setIsPosting(false);
      onClose();
    }, 1500);
  };

  // --- RENDER HELPERS ---

  const renderPreview = () => {
      // Create a mock post object for the PostCard component
      const mockPostData = {
          id: 'preview',
          user: {
              name: currentUser?.name || 'Sarah Jenkins',
              handle: '@sarah_j',
              avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
              reputationLabel: currentUser?.role === 'professional' ? 'Maâlem' : 'Citizen',
              isVerified: currentUser?.isVerified
          },
          content: {
              text: text || (postType === 'product' ? `Selling ${productName} for ${productPrice} MAD` : 'Preview your post content here...'),
              media: media,
              mediaType: 'image' as const, // Force cast for preview
              contextNote: postType === 'urgent' ? "Emergency Appeal" : (postType === 'product' ? `Product: ${productPrice} MAD` : undefined)
          },
          stats: { likes: 0, comments: 0, shares: 0 },
          timestamp: 'Now',
          isUrgentAppeal: postType === 'urgent'
      };

      return (
          <div className="pointer-events-none transform scale-90 origin-top">
              <PostCard {...mockPostData} />
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* TOP BAR */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-20 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-lg font-display font-bold text-slate-900 hidden md:block">Create Post</h2>
            </div>

            {/* Post Type Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-hide max-w-[250px] md:max-w-none">
                {[
                    { id: 'status', label: 'Post', icon: null },
                    { id: 'media', label: 'Media', icon: Camera },
                    { id: 'product', label: 'Sell', icon: ShoppingBag },
                    { id: 'poll', label: 'Poll', icon: ListChecks },
                    { id: 'urgent', label: "L'3ar", icon: AlertTriangle }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => setPostType(type.id as PostType)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                            postType === type.id 
                            ? (type.id === 'urgent' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-slate-900 shadow-sm') 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {type.icon && <type.icon size={14} />}
                        {type.label}
                    </button>
                ))}
            </div>

            <div className="w-10 md:w-24"></div> {/* Spacer */}
        </div>

        {/* MAIN SPLIT CONTENT */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT: EDITOR (Scrollable) */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-slate-100 relative">
                
                <div className="p-6 space-y-6">
                    {/* User & Audience */}
                    <div className="flex items-center gap-3">
                        <img src={currentUser?.avatar || "https://via.placeholder.com/40"} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">{currentUser?.name || 'Loading...'}</h3>
                            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors">
                                {audience === 'public' ? <Globe size={10} /> : <Users size={10} />}
                                <span>{audience === 'public' ? 'Public' : 'Connections'}</span>
                                <ChevronDown size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Text Input */}
                    <div className="relative">
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={postType === 'product' ? "Describe what you are selling..." : (postType === 'urgent' ? "Describe the emergency situation..." : "What's on your mind?")}
                            className="w-full min-h-[150px] text-lg text-slate-800 placeholder-slate-300 outline-none resize-none bg-transparent"
                        />
                        {/* Magic Fix Button (Floating) */}
                        {text.length > 10 && (
                            <button 
                                onClick={handleMagicRefine}
                                disabled={isRefining}
                                className="absolute bottom-2 right-2 text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-brand-blue/20 transition-colors"
                            >
                                {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {isRefining ? 'Refining...' : 'AI Refine'}
                            </button>
                        )}
                    </div>

                    {/* Specialized Inputs based on Type */}
                    {postType === 'product' && (
                        <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100 animate-slide-up">
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Product Name" 
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:border-brand-green"
                                />
                                <div className="relative w-32">
                                    <input 
                                        type="number" 
                                        placeholder="Price" 
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-8 py-2 text-sm font-bold outline-none focus:border-brand-green"
                                    />
                                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">MAD</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {postType === 'poll' && (
                        <div className="space-y-2 animate-slide-up">
                            {pollOptions.map((opt, idx) => (
                                <input 
                                    key={idx}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                        const newOpts = [...pollOptions];
                                        newOpts[idx] = e.target.value;
                                        setPollOptions(newOpts);
                                    }}
                                    placeholder={`Option ${idx + 1}`}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                            ))}
                            <button className="text-xs text-brand-green font-bold flex items-center gap-1 hover:underline">
                                <Plus size={12} /> Add Option
                            </button>
                        </div>
                    )}

                    {/* Media Grid */}
                    {media.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 animate-fade-in">
                            {media.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => removeMedia(i)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {media.length < 4 && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-green hover:text-brand-green transition-colors"
                                >
                                    <Camera size={24} />
                                    <span className="text-xs font-bold mt-1">Add</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-brand-green bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <ImageIcon size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MapPin size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Hash size={20} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Smile size={20} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleMediaUpload} />
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="mt-auto bg-slate-50 p-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} /> AI Impact Score
                        </span>
                        <span className={`text-xs font-bold ${impactScore > 70 ? 'text-green-600' : 'text-slate-500'}`}>
                            {impactScore}/100
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-700 ease-out ${impactScore > 70 ? 'bg-gradient-brand' : 'bg-slate-400'}`}
                            style={{ width: `${impactScore}%` }}
                        ></div>
                    </div>
                    {impactScore < 40 && text.length > 0 && (
                        <p className="text-[10px] text-slate-400 mt-2">
                            Tip: Add a photo or write more to increase reach.
                        </p>
                    )}
                </div>
            </div>

            {/* RIGHT: PREVIEW (Desktop Only) */}
            <div className="hidden lg:flex w-[400px] bg-slate-50 flex-col border-l border-slate-200">
                <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Live Preview</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
                    {renderPreview()}
                </div>
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Best time to post:</span>
                        <span className="font-bold text-slate-900 bg-green-100 px-2 py-0.5 rounded">Now (High Traffic)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white z-20 shrink-0">
            <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                    <input type="checkbox" className="accent-slate-900" />
                    Turn off commenting
                </label>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Schedule</span>
                </button>
                <button 
                    onClick={handlePost}
                    disabled={(!text && media.length === 0) || isPosting}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                        (!text && media.length === 0) 
                        ? 'bg-slate-300 cursor-not-allowed' 
                        : (postType === 'urgent' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200')
                    }`}
                >
                    {isPosting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Publishing...</span>
                        </>
                    ) : (
                        <>
                            <span>Post Now</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;
