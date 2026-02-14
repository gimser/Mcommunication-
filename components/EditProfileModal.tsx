
import React, { useState, useRef } from 'react';
import { X, Camera, Save, MapPin, Link as LinkIcon, Briefcase, ShieldCheck, AtSign, Trash2, ScanFace, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EditProfileModalProps {
  onClose: () => void;
  currentData: {
    name: string;
    handle: string;
    bio: string;
    location: string;
    website: string;
    title: string;
    id?: string;
    avatar?: string;
    cover?: string;
  };
  onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, currentData, onSave }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Initialize State from currentData
  const [formData, setFormData] = useState({
    name: currentData.name || '',
    handle: currentData.handle ? currentData.handle.replace('@', '') : '',
    bio: currentData.bio || '',
    location: currentData.location || '',
    website: currentData.website || '',
    title: currentData.title || '',
    avatar: currentData.avatar || '',
    cover: currentData.cover || ''
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const imageUrl = await convertToBase64(file);
        // Simulate Biometric Scanning Process
        setIsScanningPhoto(true);
        setTimeout(() => {
          setFormData(prev => ({ ...prev, avatar: imageUrl }));
          setIsScanningPhoto(false);
        }, 1500); 
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const imageUrl = await convertToBase64(file);
        setFormData(prev => ({ ...prev, cover: imageUrl }));
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
  };

  const handleRemoveCover = () => {
    setFormData(prev => ({ ...prev, cover: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const formattedData = {
        ...formData,
        handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`
      };
      onSave(formattedData);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:max-w-xl bg-white h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs font-bold text-slate-500">Updating Records...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="font-display font-bold text-lg text-slate-900">{t('profile.edit')}</h2>
          <button 
            onClick={handleSave}
            className="text-brand-green font-bold text-sm hover:text-brand-yellow transition-colors flex items-center gap-1"
          >
            <Save size={18} />
            <span>Save</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-10">
          
          {/* COVER IMAGE SECTION */}
          <div className="relative group h-32 md:h-40 w-full bg-slate-100 overflow-hidden">
             {formData.cover ? (
                <img src={formData.cover} className="w-full h-full object-cover" alt="Cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                   <ImageIcon size={32} className="opacity-50" />
                </div>
             )}
             
             {/* Cover Actions Overlay */}
             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                   onClick={() => coverInputRef.current?.click()}
                   className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-white/30"
                >
                   <Camera size={14} /> Change Cover
                </button>
                {formData.cover && (
                   <button 
                      onClick={handleRemoveCover}
                      className="bg-red-500/80 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-red-600"
                   >
                      <Trash2 size={14} />
                   </button>
                )}
             </div>
             <input 
                type="file" 
                ref={coverInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleCoverChange}
             />
          </div>

          {/* AVATAR SECTION */}
          <div className="px-6 relative -mt-10 mb-6 flex flex-col items-center md:items-start">
             <div className="relative group">
                <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 ${isScanningPhoto ? 'border-brand-green shadow-[0_0_20px_rgba(0,151,70,0.4)]' : 'border-white shadow-lg'} bg-slate-100 relative transition-all duration-300`}>
                  <img 
                    src={formData.avatar}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isScanningPhoto ? 'opacity-50 grayscale' : ''}`}
                    alt="Profile"
                  />
                  {isScanningPhoto && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                       <ScanFace size={24} className="text-brand-green animate-pulse mb-1" />
                       <div className="w-full h-1 bg-brand-green/50 absolute top-0 animate-scan"></div>
                    </div>
                  )}
                </div>

                {!isScanningPhoto && (
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-full hover:bg-brand-green transition-colors shadow-lg border-2 border-white"
                  >
                    <Camera size={14} />
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
             </div>
             
             <div className="mt-2 text-center md:text-left">
                <div className="bg-brand-green/10 text-brand-green px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                   <ShieldCheck size={10} /> Verified ID
                </div>
             </div>
          </div>

          <hr className="border-slate-100 mb-6" />

          {/* Form Fields */}
          <div className="px-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={14} /> Professional Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Digital ID</label>
                  <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-sm flex items-center justify-between cursor-not-allowed">
                    <span>{currentData.id || '849-***-901'}</span>
                    <ShieldCheck size={14} className="text-brand-green" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Professional Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Software Engineer"
                    className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Profile</h3>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
                  <input 
                    type="text" 
                    value={formData.handle}
                    onChange={(e) => setFormData({...formData, handle: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Bio</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green text-sm leading-relaxed resize-none"
                  placeholder="Tell the community about yourself..."
                />
                <p className="text-xs text-slate-400 text-right">{formData.bio.length}/250</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Website</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
                    <input 
                      type="text" 
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
