
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Grid, MapPin, Link as LinkIcon, ShieldCheck, QrCode, Award, Share2, CheckCircle2, Users, Lock, Edit3, ArrowLeftRight, UserPlus, Check, PlayCircle, AlertOctagon, RefreshCcw, BookOpen, Skull, Crown, ThumbsUp, Clock, AlertTriangle, Wrench, Star, X, Sparkles, Activity, MessageCircle, Phone, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ViewState, CitizenshipMode } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { UserSession, SovereignBackend } from '../services/SovereignBackend';
import EditProfileModal from './EditProfileModal';
import ShareModal from './ShareModal';
import LevelUpModal from './LevelUpModal';
import ServiceRequestModal from './ServiceRequestModal';
import AddServiceModal from './AddServiceModal'; 
import { useContent } from '../contexts/ContentContext'; 

interface ProfileViewProps {
  onViewChange: (view: ViewState) => void;
  citizenshipMode?: CitizenshipMode;
  session?: UserSession | null;
  targetProfile?: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onViewChange, citizenshipMode = 'active', session, targetProfile }) => {
  const { t } = useLanguage();
  const { addContact } = useContent(); 
  const [activeTab, setActiveTab] = useState<'portfolio' | 'services'>('portfolio');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false); 
  
  // State for editing a specific service
  const [editingService, setEditingService] = useState<any>(null);
  
  const [isPublicView, setIsPublicView] = useState(false); 
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');

  const [isTopMaalem, setIsTopMaalem] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [stats, setStats] = useState({ jobs: 2, rating: 4.5, onTime: '98%' });

  // SCENARIO 2: Hesitation Nudge State
  const [showHesitationNudge, setShowHesitationNudge] = useState(false);

  // Custom Cover Image State
  const [customCover, setCustomCover] = useState<string | null>(null);
  
  // Gallery Upload Ref
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initial Services Data
  const [services, setServices] = useState([
      { id: 1, title: "Consultation", price: "Free", unit: "Estimate", description: "Initial site visit and quote estimation." },
      { id: 2, title: "Full Day Work", price: "500", unit: "Start", description: "8 hours of professional labor." },
      { id: 3, title: "Urgent Repair", price: "Quote", unit: "Required", description: "Emergency intervention within 1 hour." }
  ]);

  const [profileData, setProfileData] = useState({
    name: 'User',
    handle: '@user',
    id: 'ID-000',
    title: 'Professional',
    bio: 'Welcome to Mcommunication 3.0.',
    location: 'Morocco',
    website: 'mcom.gov.ma',
    joined: '2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    gallery: [] as string[]
  });

  useEffect(() => {
    if (targetProfile) {
        setProfileData({
            name: targetProfile.name || 'Unknown User',
            handle: targetProfile.handle || '@user',
            id: targetProfile.id || 'ID-XXX',
            title: targetProfile.title || targetProfile.reputationLabel || 'Professional',
            bio: targetProfile.bio || 'Professional on Mcommunication 3.0.',
            location: targetProfile.location || 'Morocco',
            website: `mcom.gov.ma/${(targetProfile.handle || 'user').replace('@', '')}`,
            joined: '2024',
            avatar: targetProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            gallery: targetProfile.gallery || []
        });
        setIsTopMaalem(targetProfile.isDistinguished || targetProfile.reputationLabel === 'Top Maâlem');
        setIsPublicView(true);
    } else if (session && session.user) {
        const p = session.user.profile;
        const u = session.user;

        setProfileData({
            name: u.name,
            handle: `@${u.name.replace(/\s+/g, '').toLowerCase()}`,
            id: u.id,
            title: p?.trade || (u.role === 'professional' ? 'Maâlem' : 'Client'),
            bio: p?.trade ? `Professional ${p.trade} available for work.` : 'Digital Citizen on Mcommunication.',
            location: p?.city || 'Morocco',
            website: `mcom.gov.ma/${u.name.replace(/\s+/g, '').toLowerCase()}`,
            joined: new Date().getFullYear().toString(),
            avatar: u.avatar || (u.role === 'professional' 
                ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' 
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
            gallery: p?.gallery || []
        });
        
        if (p?.cover) {
            setCustomCover(p.cover);
        }

        if (u.isVerified) {
            setIsTopMaalem(true); 
        }
        setIsPublicView(false);
    }
  }, [session, targetProfile]);

  // SCENARIO 2: Hesitation Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPublicView) {
        // If user is viewing a profile (as a client) and waits 6 seconds...
        timer = setTimeout(() => {
            setShowHesitationNudge(true);
        }, 6000);
    } else {
        setShowHesitationNudge(false);
    }
    return () => clearTimeout(timer);
  }, [isPublicView]);

  const handleSaveProfile = async (updatedData: any) => {
    // Update cover if present
    if (updatedData.cover !== undefined) {
        setCustomCover(updatedData.cover);
    }
    
    setProfileData(prev => ({
      ...prev,
      ...updatedData
    }));

    // PERSISTENCE: Save to Backend
    if (session && session.user) {
        await SovereignBackend.updateProfile(session.user.id, {
            fullName: updatedData.name,
            city: updatedData.location,
            avatar: updatedData.avatar,
            cover: updatedData.cover
        });
    }

    setIsEditModalOpen(false);
  };

  const handleAddFriend = () => {
      setFriendStatus('pending');
      if (targetProfile) {
          addContact({
              id: targetProfile.id || `user-${Date.now()}`,
              name: targetProfile.name,
              avatar: targetProfile.avatar,
              reputationLabel: targetProfile.reputationLabel,
              isVerified: targetProfile.isVerified
          });
      }
  };

  const handleMessage = () => {
      if (targetProfile) {
          addContact({
              id: targetProfile.id || `user-${Date.now()}`,
              name: targetProfile.name,
              avatar: targetProfile.avatar,
              reputationLabel: targetProfile.reputationLabel,
              isVerified: targetProfile.isVerified
          });
      }
      onViewChange('messages');
  };

  const handleCall = () => {
      const phoneNumber = "0600000000"; // In real app, get from profileData
      window.location.href = `tel:${phoneNumber}`;
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      const newGallery = [imageUrl, ...profileData.gallery];
      setProfileData(prev => ({
        ...prev,
        gallery: newGallery
      }));

      // Persist gallery update
      if (session && session.user) {
          SovereignBackend.updateProfile(session.user.id, {
              gallery: newGallery
          });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
      if (isPublicView) return;
      if (confirm("Delete this photo?")) {
          const newGallery = profileData.gallery.filter((_, i) => i !== index);
          setProfileData(prev => ({
            ...prev,
            gallery: newGallery
          }));
          
          if (session && session.user) {
            SovereignBackend.updateProfile(session.user.id, {
                gallery: newGallery
            });
          }
      }
  };

  // SERVICE MANAGEMENT HANDLERS
  const handleAddService = (newService: any) => {
      const service = {
          id: Date.now(),
          title: newService.title,
          price: newService.price,
          unit: newService.unit,
          description: newService.description
      };
      setServices(prev => [...prev, service]);
  };

  const handleUpdateService = (updatedService: any) => {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...updatedService, id: s.id } : s));
      setEditingService(null);
  };

  const handleDeleteService = (id: number) => {
      if(window.confirm("Are you sure you want to delete this service?")) {
          setServices(prev => prev.filter(s => s.id !== id));
      }
  };

  const handleServiceClick = (service: any) => {
      if (isPublicView) {
          setIsRequestModalOpen(true);
      }
  };

  const renderServices = () => (
    <div className="space-y-3 animate-fade-in-up pb-8">
       {/* Add Service Button (Owner Only) */}
       {!isPublicView && (
           <button 
             onClick={() => setIsAddServiceModalOpen(true)}
             className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:border-brand-green hover:text-brand-green hover:bg-green-50 transition-all mb-4"
           >
              <Plus size={20} />
              {t('profile.add_service')}
           </button>
       )}

       {services.map((srv) => (
           <div 
             key={srv.id} 
             onClick={isPublicView ? () => handleServiceClick(srv) : undefined}
             className={`flex justify-between items-start p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition-all group relative overflow-hidden ${isPublicView ? 'hover:border-brand-green cursor-pointer hover:shadow-md' : 'cursor-default'}`}
           >
               <div className="flex gap-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                       <Wrench size={20} />
                   </div>
                   <div>
                       <h4 className="font-bold text-slate-900 text-base">{srv.title}</h4>
                       {srv.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{srv.description}</p>}
                       <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                          <Clock size={10} /> Available
                       </div>
                   </div>
               </div>
               
               <div className="flex flex-col items-end gap-2 relative z-10">
                   <div className="text-right">
                       <span className="block font-display font-bold text-lg text-slate-900">{srv.price} <span className="text-xs font-sans">MAD</span></span>
                       <span className="text-[10px] text-slate-400 font-medium uppercase">{srv.unit}</span>
                   </div>
                   
                   {/* Owner Actions */}
                   {!isPublicView && (
                       <div className="flex items-center gap-1">
                           <button 
                             onClick={(e) => { 
                                 e.stopPropagation();
                                 e.nativeEvent.stopImmediatePropagation();
                                 setEditingService(srv); 
                             }}
                             className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm z-50 relative"
                             title="Edit Service"
                             type="button"
                           >
                              <Edit3 size={18} />
                           </button>
                           <button 
                             onClick={(e) => { 
                                 e.stopPropagation();
                                 e.nativeEvent.stopImmediatePropagation();
                                 handleDeleteService(srv.id); 
                             }}
                             className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100 shadow-sm cursor-pointer z-50 relative"
                             title="Delete Service"
                             type="button"
                           >
                              <Trash2 size={18} />
                           </button>
                       </div>
                   )}

                   {/* Client Actions */}
                   {isPublicView && (
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                           <ArrowRight size={16} className="text-brand-green" />
                       </div>
                   )}
               </div>
           </div>
       ))}

       {services.length === 0 && (
           <div className="text-center py-10 text-slate-400">
               <p>No services listed yet.</p>
           </div>
       )}
    </div>
  );

  return (
    <>
      <div className="bg-white min-h-screen pb-20">
        
        {/* Dynamic Cover Image */}
        <div 
            className={`h-48 md:h-64 relative overflow-hidden transition-all duration-1000 ${isFlagged ? 'bg-red-900' : (isTopMaalem ? 'bg-slate-900' : 'bg-gradient-brand')}`}
            style={customCover && !isFlagged ? { backgroundImage: `url(${customCover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {/* Default Overlay Textures if no custom cover */}
          {!customCover && (
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          )}
          
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header Controls */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all"
            >
              <QrCode size={20} />
            </button>
            
            <div className="flex items-center gap-2">
                {!targetProfile && (
                    <button 
                        onClick={() => setIsPublicView(!isPublicView)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isPublicView ? 'bg-white text-slate-900 border-white' : 'bg-black/30 text-white border-white/30'}`}
                    >
                        {isPublicView ? t('profile.client_view') : t('profile.owner_view')}
                    </button>
                )}

                {!isPublicView && (
                    <button 
                    onClick={() => onViewChange('settings')}
                    className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all hover:rotate-90"
                    >
                    <Settings size={20} />
                    </button>
                )}
            </div>
          </div>
        </div>

        <div className="px-5 md:px-8">
          {/* Info Header */}
          <div className="relative -mt-20 mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="flex items-end gap-5 group">
              <div className="relative">
                <div className={`w-36 h-36 rounded-2xl bg-white p-1.5 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-300 relative ${isFlagged ? 'ring-4 ring-red-500 ring-offset-2' : (isTopMaalem ? 'ring-4 ring-yellow-400 ring-offset-2' : '')}`}>
                  <img 
                    src={profileData.avatar} 
                    alt="Profile" 
                    className={`w-full h-full rounded-xl object-cover bg-slate-100 ${isFlagged ? 'grayscale contrast-125' : ''}`}
                  />
                  
                  {!isFlagged && (
                    <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-1.5 rounded-full border-4 border-white shadow-sm z-10" title="Verified Pro">
                        <ShieldCheck size={18} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-2 md:mb-4">
                <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
                  {profileData.name}
                  {isTopMaalem && !isFlagged && (
                      <span className="text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full text-xs border border-yellow-200 uppercase tracking-wider hidden sm:inline-block">
                          {t('profile.top_maalem')}
                      </span>
                  )}
                </h1>
                <p className="text-slate-500 font-medium font-mono text-sm tracking-wide">{profileData.handle} • {profileData.title}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              {/* Action Buttons Logic ... */}
              {!isPublicView && (
                  <button 
                      onClick={() => setIsEditModalOpen(true)}
                      disabled={isFlagged}
                      className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                      <span>{t('profile.edit')}</span>
                  </button>
              )}
              {isPublicView && (
                  <>
                    <button 
                      onClick={handleCall}
                      className="px-4 py-3 bg-white border border-slate-200 text-brand-green font-bold rounded-xl hover:bg-green-50 transition-colors shadow-sm"
                      title="Call Now"
                    >
                        <Phone size={20} />
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                      title="Message"
                    >
                        <MessageCircle size={20} />
                    </button>
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="flex-1 md:flex-none px-6 py-3 bg-brand-green text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                    >
                        <CheckCircle2 size={18} /> {t('profile.book_now')}
                    </button>
                  </>
              )}
            </div>
          </div>

          <div className="mb-8 max-w-2xl">
            <p className="text-slate-700 mb-4 text-base leading-relaxed whitespace-pre-line">
              {profileData.bio}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 hover:text-brand-green transition-colors cursor-pointer">
                <MapPin size={16} />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-brand-green transition-colors cursor-pointer">
                <LinkIcon size={16} />
                <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{profileData.website}</a>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-200 mb-6 sticky top-0 bg-white z-20 pt-2">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 text-sm transition-colors ${activeTab === 'portfolio' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-700 font-medium'}`}
            >
              <Grid size={18} />
              <span>{t('profile.work_gallery')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 border-b-2 text-sm transition-colors ${activeTab === 'services' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-700 font-medium'}`}
            >
              <Wrench size={18} />
              <span>{t('profile.services')}</span>
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'services' ? (
                renderServices()
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                    {/* Upload Button for Owner */}
                    {!isPublicView && (
                        <div 
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-video rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-green-50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform border border-slate-100">
                                <Plus size={24} className="text-brand-green" />
                            </div>
                            <span className="text-sm font-bold text-slate-500 group-hover:text-brand-green transition-colors">{t('profile.add_photo')}</span>
                            <input 
                                type="file" 
                                ref={galleryInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleGalleryUpload} 
                            />
                        </div>
                    )}

                    {profileData.gallery.map((img, idx) => (
                        <div key={idx} className="aspect-video rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 relative group">
                            <img src={img} className="w-full h-full object-cover" />
                            {!isPublicView && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SCENARIO 2: HESITATION NUDGE --- */}
      {showHesitationNudge && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-slate-900 text-white p-4 rounded-xl shadow-2xl animate-slide-up z-[60] border-l-4 border-brand-green flex items-center justify-between">
           <div className="flex gap-3 items-center">
              <div className="p-2 bg-brand-green/20 rounded-full">
                 <Sparkles size={18} className="text-brand-green" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-0.5">AI Insight</p>
                 <p className="text-sm font-bold leading-tight">⭐ هذا المعلم أنهى 12 مهمة في حيك هذا الأسبوع</p>
              </div>
           </div>
           <button onClick={() => setShowHesitationNudge(false)} className="text-white/50 hover:text-white p-1">
              <X size={16} />
           </button>
        </div>
      )}

      {isEditModalOpen && (
        <EditProfileModal 
          onClose={() => setIsEditModalOpen(false)} 
          currentData={{ ...profileData, cover: customCover || undefined }}
          onSave={handleSaveProfile}
        />
      )}
      
      {isShareModalOpen && (
        <ShareModal 
          onClose={() => setIsShareModalOpen(false)} 
          userData={profileData}
        />
      )}

      {showLevelUp && (
          <LevelUpModal 
            onClose={() => setShowLevelUp(false)}
            stats={stats}
          />
      )}

      {isRequestModalOpen && (
        <ServiceRequestModal
            onClose={() => setIsRequestModalOpen(false)}
            onSubmit={(data) => setIsRequestModalOpen(false)}
            preSelectedProvider={{
                name: profileData.name,
                avatar: profileData.avatar,
                rating: stats.rating,
                title: profileData.title
            }}
        />
      )}

      {/* Add Service Modal */}
      {isAddServiceModalOpen && (
          <AddServiceModal 
             onClose={() => setIsAddServiceModalOpen(false)}
             onSave={handleAddService}
          />
      )}

      {/* Edit Service Modal */}
      {editingService && (
          <AddServiceModal 
             onClose={() => setEditingService(null)}
             onSave={handleUpdateService}
             initialData={editingService}
          />
      )}
    </>
  );
};

export default ProfileView;
