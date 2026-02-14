import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, Download, Send, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

interface ShareModalProps {
  onClose: () => void;
  userData?: {
    name: string;
    handle: string;
    title: string;
    avatar: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, userData = {
  name: "Alex Designer",
  handle: "@alex_uiux",
  title: "Senior Product Designer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
} }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const profileUrl = `https://mcom.gov.ma/${userData.handle.replace('@', '')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Share2 size={20} className="text-brand-green" />
            Share Profile
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50">
          {/* Digital Card Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative transform transition-transform hover:scale-[1.02] duration-300">
             {/* Official Header Strip */}
             <div className="h-2 bg-gradient-brand w-full"></div>
             
             <div className="p-6 flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-2xl p-1 bg-white border border-slate-100 shadow-sm mb-4 relative">
                 <img src={userData.avatar} className="w-full h-full object-cover rounded-xl" alt="Profile" />
                 <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-1 rounded-full border-2 border-white">
                   <QrCode size={12} />
                 </div>
               </div>
               
               <h2 className="text-xl font-display font-bold text-slate-900">{userData.name}</h2>
               <p className="text-brand-green font-medium text-xs uppercase tracking-wide mb-1">{userData.title}</p>
               <p className="text-slate-400 text-sm mb-6">{userData.handle}</p>

               {/* QR Placeholder */}
               <div className="bg-slate-900 p-4 rounded-xl mb-4">
                 <QrCode size={64} className="text-white" />
               </div>
               
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
                  <span>M-Comm Identity</span>
                  <span className="w-1 h-1 rounded-full bg-brand-yellow"></span>
                  <span>Verified</span>
               </div>
             </div>
             
             {/* Bottom Decorations */}
             <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-yellow/10 rounded-tr-full"></div>
             <div className="absolute top-10 right-0 w-8 h-8 bg-brand-green/5 rounded-bl-full"></div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          {/* Copy Link Input */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 mb-6">
             <div className="flex-1 px-2 overflow-hidden">
               <p className="text-xs text-slate-400 mb-0.5">Profile Link</p>
               <p className="text-sm font-medium text-slate-700 truncate">{profileUrl}</p>
             </div>
             <button 
               onClick={handleCopy}
               className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white shadow-sm text-slate-600 hover:text-brand-blue'}`}
             >
               {copied ? <Check size={20} /> : <Copy size={20} />}
             </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
             <button className="flex flex-col items-center gap-2 group">
               <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                 <Send size={20} className="ltr:ml-1 rtl:mr-1" />
               </div>
               <span className="text-xs text-slate-600 font-medium">WhatsApp</span>
             </button>

             <button className="flex flex-col items-center gap-2 group">
               <div className="w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                 <Linkedin size={20} />
               </div>
               <span className="text-xs text-slate-600 font-medium">LinkedIn</span>
             </button>

             <button className="flex flex-col items-center gap-2 group">
               <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1">
                 <Twitter size={20} />
               </div>
               <span className="text-xs text-slate-600 font-medium">X</span>
             </button>

             <button 
              onClick={handleDownload}
              className="flex flex-col items-center gap-2 group"
             >
               <div className="w-12 h-12 rounded-full bg-brand-yellow text-yellow-900 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1 relative">
                 {isDownloading ? (
                   <div className="w-5 h-5 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Download size={20} />
                 )}
               </div>
               <span className="text-xs text-slate-600 font-medium">Save Img</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;