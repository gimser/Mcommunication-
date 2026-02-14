
import React from 'react';
import { Home, Compass, Radio, MessageCircle, User, LogOut, Bell, Database, Film, Briefcase, LayoutDashboard, Settings, Activity, Anchor, Clock, Map, Search, History } from 'lucide-react';
import { CitizenshipMode, ViewState, UserRole } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface SocialSidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onLogout?: () => void;
  citizenshipMode?: CitizenshipMode;
  userRole?: UserRole;
}

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  badge?: string | number;
}

const SocialSidebar: React.FC<SocialSidebarProps> = ({ currentView, onViewChange, onLogout, citizenshipMode = 'active', userRole = 'CLIENT' }) => {
  const { t } = useLanguage();

  // 1. MAALEM MENU (Professional Interface)
  const maalemItems: MenuItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { id: 'jobs', icon: Briefcase, label: t('sidebar.market'), badge: 'New' },
    { id: 'messages', icon: MessageCircle, label: t('nav.messages'), badge: 3 },
    { id: 'live', icon: Radio, label: t('sidebar.live') },
    { id: 'notifications', icon: Bell, label: t('nav.notifications') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  // 2. CLIENT MENU (Service Seeker Interface)
  const clientItems: MenuItem[] = [
    { id: 'client-home', icon: Home, label: t('nav.home') },
    { id: 'explore', icon: Search, label: t('nav.explore') },
    { id: 'my-requests', icon: History, label: t('sidebar.my_requests') },
    { id: 'shorts', icon: Film, label: t('sidebar.watch') },
    { id: 'messages', icon: MessageCircle, label: t('nav.messages') },
    { id: 'notifications', icon: Bell, label: t('nav.notifications') },
    { id: 'profile', icon: User, label: t('nav.profile') },
  ];

  const menuItems = userRole === 'MAALEM' ? maalemItems : clientItems;

  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
        
        {/* Role Label (Debug/Clarity) */}
        <div className="px-4 pb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${userRole === 'MAALEM' ? 'bg-slate-900 text-white' : 'bg-brand-green/10 text-brand-green'}`}>
                {userRole === 'MAALEM' ? t('sidebar.professional_space') : t('sidebar.client_space')}
            </span>
        </div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewState)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={22} className={currentView === item.id ? 'text-brand-green' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-bold text-sm hidden lg:block">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full hidden lg:block ${item.badge === 'New' ? 'bg-brand-green text-white' : 'bg-red-500 text-white'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100">
           <button
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === 'settings'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={22} className={currentView === 'settings' ? 'text-brand-yellow' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-medium text-sm hidden lg:block">{t('settings.title')}</span>
            </div>
          </button>

           <button
            onClick={() => onViewChange('system')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === 'system'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database size={22} className={currentView === 'system' ? 'text-brand-yellow' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="font-medium text-sm hidden lg:block">{t('nav.system')}</span>
            </div>
          </button>
        </div>
      </nav>

      {/* REPUTATION MONITOR (Only visible for Maalem in active mode) */}
      {citizenshipMode === 'active' && userRole === 'MAALEM' && (
        <div className="px-4 pb-4 hidden lg:block">
           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative overflow-hidden shadow-sm group hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-2 relative z-10">
                 <div className="flex items-center gap-2">
                   <Anchor size={16} className="text-slate-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('sidebar.reputation')}</span>
                 </div>
                 <div className="flex items-center gap-1 text-[10px] bg-white px-2 py-0.5 rounded text-slate-700 font-bold border border-slate-100 shadow-sm">
                   <Activity size={10} className="text-brand-green" />
                   <span>{t('sidebar.growing')}</span>
                 </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                 <h3 className="font-display font-bold text-slate-900 text-sm">Professional Standing</h3>
              </div>
           </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-200 lg:hidden">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default SocialSidebar;
