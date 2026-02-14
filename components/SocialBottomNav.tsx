
import React, { useState } from 'react';
import { Home, Radio, Plus, MessageCircle, User, Film, LayoutDashboard, Briefcase, Search, History } from 'lucide-react';
import { ViewState, UserRole } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import CreateContentModal from './CreateContentModal';

interface SocialBottomNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  userRole?: UserRole;
}

const SocialBottomNav: React.FC<SocialBottomNavProps> = ({ currentView, onViewChange, userRole = 'CLIENT' }) => {
  const { t } = useLanguage();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  
  // Determine if we are in a dark context
  const isDark = currentView === 'shorts';

  const NavButton = ({ id, icon: Icon, active, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-brand-green' : (isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-600')}`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </button>
  );

  return (
    <>
      <div className={`md:hidden fixed bottom-0 w-full border-t px-6 py-3 flex justify-between items-center z-50 pb-safe transition-colors duration-300 ${isDark ? 'bg-black border-white/10' : 'bg-white border-slate-200'}`}>
        
        {/* --- CLIENT NAV --- */}
        {userRole === 'CLIENT' && (
            <>
                <NavButton 
                    id="client-home" 
                    icon={Home} 
                    active={currentView === 'client-home'} 
                    onClick={() => onViewChange('client-home')} 
                />
                
                <NavButton 
                    id="explore" 
                    icon={Search} 
                    active={currentView === 'explore'} 
                    onClick={() => onViewChange('explore')} 
                />

                <div className="relative -mt-10">
                    <button 
                        onClick={() => setIsCreateMenuOpen(true)}
                        className="flex flex-col items-center justify-center bg-gradient-brand text-white h-16 w-16 rounded-full shadow-lg shadow-brand-green/30 transform active:scale-95 transition-all hover:shadow-xl hover:-translate-y-1 border-4 border-white dark:border-slate-900 group"
                    >
                        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <NavButton 
                    id="messages" 
                    icon={MessageCircle} 
                    active={currentView === 'messages'} 
                    onClick={() => onViewChange('messages')} 
                />

                <NavButton 
                    id="profile" 
                    icon={User} 
                    active={currentView === 'profile'} 
                    onClick={() => onViewChange('profile')} 
                />
            </>
        )}

        {/* --- MAALEM NAV --- */}
        {userRole === 'MAALEM' && (
            <>
                <NavButton 
                    id="dashboard" 
                    icon={LayoutDashboard} 
                    active={currentView === 'dashboard'} 
                    onClick={() => onViewChange('dashboard')} 
                />
                
                <NavButton 
                    id="jobs" 
                    icon={Briefcase} 
                    active={currentView === 'jobs'} 
                    onClick={() => onViewChange('jobs')} 
                />

                {/* Create Content (Showcase Work) */}
                <div className="relative -mt-10">
                    <button 
                        onClick={() => setIsCreateMenuOpen(true)}
                        className="flex flex-col items-center justify-center bg-slate-900 text-white h-16 w-16 rounded-full shadow-lg shadow-slate-900/30 transform active:scale-95 transition-all hover:shadow-xl hover:-translate-y-1 border-4 border-white dark:border-slate-900 group"
                    >
                        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <NavButton 
                    id="messages" 
                    icon={MessageCircle} 
                    active={currentView === 'messages'} 
                    onClick={() => onViewChange('messages')} 
                />

                <NavButton 
                    id="profile" 
                    icon={User} 
                    active={currentView === 'profile'} 
                    onClick={() => onViewChange('profile')} 
                />
            </>
        )}

      </div>

      {/* Create Content Modal */}
      {isCreateMenuOpen && (
        <CreateContentModal onClose={() => setIsCreateMenuOpen(false)} />
      )}
    </>
  );
};

export default SocialBottomNav;
