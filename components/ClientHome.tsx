
import React, { useState } from 'react';
import { ViewState } from '../App';
import { Search, MapPin, Zap, Hammer, Wrench, Plug, Paintbrush, Star, ChevronRight, AlertTriangle, ShieldCheck, Filter, Flame, Timer } from 'lucide-react';
import ServiceRequestModal from './ServiceRequestModal';
import { useLanguage } from '../contexts/LanguageContext';

interface ClientHomeProps {
  currentView: ViewState;
}

const ClientHome: React.FC<ClientHomeProps> = ({ currentView }) => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const CATEGORIES = [
    { id: 'elec', label: t('cat.elec'), icon: Plug, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'plumb', label: t('cat.plumb'), icon: Wrench, color: 'bg-blue-100 text-blue-700' },
    { id: 'mason', label: t('cat.mason'), icon: Hammer, color: 'bg-orange-100 text-orange-700' },
    { id: 'paint', label: t('cat.paint'), icon: Paintbrush, color: 'bg-purple-100 text-purple-700' },
    { id: 'appliance', label: t('cat.appliance'), icon: Zap, color: 'bg-green-100 text-green-700' },
  ];

  const PROS = [
    { id: 1, name: 'Hassan M.', trade: t('cat.plumb'), rating: 4.9, jobs: 120, dist: '0.5km', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', verified: true },
    { id: 2, name: 'Karim E.', trade: t('cat.elec'), rating: 4.8, jobs: 85, dist: '1.2km', img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80', verified: true },
    { id: 3, name: 'Said B.', trade: t('cat.carpenter'), rating: 4.5, jobs: 42, dist: '2.0km', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', verified: false },
  ];

  const handlePostRequest = (data: any) => {
      console.log("Request posted:", data);
      setIsRequestModalOpen(false);
      // In a real app, update state/backend here
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto" dir={dir}>
      
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 max-w-xl">
           <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
             {t('home.hero_title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">{t('home.hero_title_2')}</span> {t('home.hero_title_3')}
           </h1>
           
           <div className="flex gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 mt-6">
              <div className="flex-1 relative">
                 <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-3.5 text-slate-400`} size={20} />
                 <input 
                   type="text" 
                   placeholder={t('home.search_placeholder')} 
                   className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-green placeholder-slate-400`}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="bg-brand-green hover:bg-green-600 text-white px-6 rounded-xl font-bold transition-colors">
                 {t('home.search_btn')}
              </button>
           </div>
        </div>
      </div>

      {/* FEATURE: Houta Alert (Flash Deals) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-1 shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
         <div className="bg-white rounded-[20px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Flame size={24} className="animate-pulse" />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <h3 className="font-bold text-slate-900 text-lg">{t('home.houta_title')}</h3>
                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">-20%</span>
                  </div>
                  <p className="text-sm text-slate-500">Maâlem Karim {t('home.houta_desc')}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t('home.expires')}</p>
                  <p className="font-mono font-bold text-red-500 flex items-center gap-1 justify-end"><Timer size={14} /> 45m:12s</p>
               </div>
               <button className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors whitespace-nowrap">
                  {t('home.grab_deal')}
               </button>
            </div>
         </div>
      </div>

      {/* Emergency Action */}
      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-red-100 text-red-600 rounded-full animate-pulse-slow">
              <AlertTriangle size={32} />
           </div>
           <div>
              <h3 className="font-bold text-red-700 text-lg">{t('home.emergency_title')}</h3>
              <p className="text-red-600/80 text-sm">{t('home.emergency_desc')}</p>
           </div>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          {t('home.request_urgent')}
        </button>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex justify-between items-end mb-4 px-2">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('home.services_title')}</h3>
           <button className="text-brand-green text-xs font-bold hover:underline">{t('home.view_all')}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className={`p-4 rounded-full ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon size={28} />
              </div>
              <span className="text-sm font-bold text-slate-700">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Pros */}
      <div>
        <div className="flex justify-between items-end mb-4 px-2">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('home.top_rated')}</h3>
           <button className="text-slate-400 hover:text-slate-600">
              <Filter size={20} />
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROS.map(pro => (
            <div key={pro.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                 <div className="relative">
                    <img src={pro.img} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm" alt={pro.name} />
                    {pro.verified && (
                       <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-1 rounded-full border-2 border-white">
                          <ShieldCheck size={12} />
                       </div>
                    )}
                 </div>
                 <div className="bg-slate-50 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                    <span className="text-xs font-bold text-slate-700">{pro.rating}</span>
                 </div>
              </div>
              
              <div className="mb-4">
                 <h4 className="font-bold text-slate-900 text-lg">{pro.name}</h4>
                 <p className="text-xs text-brand-green font-bold uppercase">{pro.trade}</p>
                 <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <MapPin size={12} /> {pro.dist}
                    <span>•</span>
                    <span>{pro.jobs} Jobs</span>
                 </div>
              </div>

              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm group-hover:bg-brand-green transition-colors flex items-center justify-center gap-2">
                 {t('nav.profile')} <ChevronRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isRequestModalOpen && (
        <ServiceRequestModal 
          onClose={() => setIsRequestModalOpen(false)} 
          onSubmit={handlePostRequest} 
        />
      )}

    </div>
  );
};

export default ClientHome;
