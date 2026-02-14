
import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Video, Film, Radio, FileText, Mic, Users, Lock, Globe, Hash, CheckCircle2, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CreatePostModal from './CreatePostModal';
import UploadVideoModal from './UploadVideoModal';
import CreateReelModal from './CreateReelModal';
import GoLiveModal from './GoLiveModal';
import CreativeStudioModal from './CreativeStudioModal';

interface CreateContentModalProps {
  onClose: () => void;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'menu' | 'post_editor' | 'video_upload' | 'reel_creator' | 'go_live' | 'create_group' | 'creative_studio'>('menu');

  // Group Creation State
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'private' | 'buzz'>('private');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOptionClick = (id: string) => {
    if (id === 'post') setView('post_editor');
    else if (id === 'video') setView('video_upload');
    else if (id === 'shorts') setView('reel_creator');
    else if (id === 'live') setView('go_live');
    else if (id === 'group') setView('create_group');
    else if (id === 'studio') setView('creative_studio');
    else handleClose();
  };

  const handleCreateGroup = () => {
    setIsCreatingGroup(true);
    setTimeout(() => {
      setIsCreatingGroup(false);
      handleClose();
      // In a real app, this would trigger a toast or redirect to the new group
      alert(`Created ${groupType === 'buzz' ? 'Buzz Zone' : 'Private Cluster'}: ${groupName}`);
    }, 1500);
  };

  // Sub-Modal Renders
  if (view === 'post_editor') return <CreatePostModal onClose={onClose} />;
  if (view === 'video_upload') return <UploadVideoModal onClose={onClose} />;
  if (view === 'reel_creator') return <CreateReelModal onClose={onClose} />;
  if (view === 'go_live') return <GoLiveModal onClose={onClose} />;
  if (view === 'creative_studio') return <CreativeStudioModal onClose={onClose} />;

  // Group Creator View
  if (view === 'create_group') {
    return (
      <div className={`fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/60 backdrop-blur-md pointer-events-auto`}>
        <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-slate-900">Create Community</h2>
            <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Community Name</label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Future Tech Founders"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Community Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setGroupType('private')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${groupType === 'private' ? 'border-brand-green bg-green-50 text-brand-green' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <Lock size={24} />
                  <span className="text-xs font-bold">Private Cluster</span>
                </button>
                <button 
                  onClick={() => setGroupType('buzz')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${groupType === 'buzz' ? 'border-brand-yellow bg-yellow-50 text-yellow-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <Hash size={24} />
                  <span className="text-xs font-bold">Buzz Zone</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                {groupType === 'private' 
                  ? 'Best for teams, projects, and closed circles.' 
                  : 'Best for trends, movements, and public discussions.'}
              </p>
            </div>

            <button 
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || isCreatingGroup}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCreatingGroup ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Building Space...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Launch Community</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const options = [
    { 
      id: 'studio', 
      label: 'Creative Studio', 
      icon: Palette, 
      color: 'bg-purple-100 text-purple-600',
      desc: 'Design & Visuals' 
    },
    { 
      id: 'post', 
      label: 'New Post', 
      icon: FileText, 
      color: 'bg-blue-100 text-blue-600',
      desc: 'Share text & photos' 
    },
    { 
      id: 'video', 
      label: 'Upload Video', 
      icon: Video, 
      color: 'bg-green-100 text-green-600',
      desc: 'Long form content' 
    },
    { 
      id: 'shorts', 
      label: 'Create Reel', 
      icon: Film, 
      color: 'bg-brand-yellow/20 text-yellow-700',
      desc: 'Short vertical clips' 
    },
    { 
      id: 'live', 
      label: 'Go Live', 
      icon: Radio, 
      color: 'bg-red-100 text-red-600',
      desc: 'Broadcast now' 
    },
    { 
      id: 'group', 
      label: 'New Group', 
      icon: Users, 
      color: 'bg-slate-100 text-slate-600',
      desc: 'Create a Community' 
    }
  ];

  return (
    <div className={`fixed inset-0 z-[120] flex items-end md:items-center justify-center pointer-events-none`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-6 pointer-events-auto transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'} relative`}
      >
        {/* Drag Handle (Mobile) */}
        <div className="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <div>
             <h2 className="text-xl font-display font-bold text-slate-900">Create Content</h2>
             <p className="text-sm text-slate-500">Select format to publish</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <button 
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-green/30 hover:shadow-lg hover:-translate-y-1 transition-all group text-center ${option.id === 'studio' ? 'col-span-2 flex-row gap-4 bg-purple-50 border-purple-100' : ''}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${option.id === 'studio' ? 'mb-0' : ''} ${option.color} group-hover:scale-110 transition-transform`}>
                <option.icon size={26} strokeWidth={2.5} />
              </div>
              <div className={option.id === 'studio' ? 'text-left' : ''}>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{option.label}</h3>
                <p className="text-xs text-slate-400">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Upload Area */}
        <div className="mt-6 pt-6 border-t border-slate-100">
           <div 
             onClick={() => handleOptionClick('post')}
             className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-brand-blue cursor-pointer transition-colors"
           >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ImageIcon size={20} className="text-slate-400" />
              </div>
              <div className="flex-1 text-left rtl:text-right">
                <p className="text-sm font-bold text-slate-700">Quick Photo Upload</p>
                <p className="text-[10px] text-slate-400">Select from gallery</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContentModal;
