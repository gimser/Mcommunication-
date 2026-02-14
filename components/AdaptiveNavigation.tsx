
import React from 'react';
import { Home, Briefcase, MessageSquare, Wallet, User, Search, History, Bell, LogOut, Wrench } from 'lucide-react';
import { ViewState } from '../App';

interface NavProps {
  role: 'MAALEM' | 'CLIENT';
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  mode: 'sidebar' | 'bottom';
  onLogout?: () => void;
}

const AdaptiveNavigation: React.FC<NavProps> = ({ role, currentView, onNavigate, mode, onLogout }) => {
  
  // Define menus based on role
  const maalemMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase }, // Active/Upcoming
    { id: 'messages', label: 'Messages', icon: MessageSquare }, // Client Chat
    { id: 'wallet', label: 'Earnings', icon: Wallet }, // Income
    { id: 'profile', label: 'Profile', icon: User }, // Skills/Gallery
  ];

  const clientMenu = [
    { id: 'search', label: 'Find Pro', icon: Search },
    { id: 'history', label: 'My Requests', icon: History },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Account', icon: User },
  ];

  const menu = role === 'MAALEM' ? maalemMenu : clientMenu;

  if (mode === 'bottom') {
    return (
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-lg">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === item.id 
                ? (role === 'MAALEM' ? 'text-brand-green' : 'text-brand-yellow-dark') 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-8 px-2 flex items-center gap-2 text-slate-900 font-display font-bold text-xl">
        <Wrench className={role === 'MAALEM' ? 'text-brand-green' : 'text-brand-yellow'} />
        <span>M-Services</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? (role === 'MAALEM' ? 'bg-green-50 text-brand-green font-bold' : 'bg-yellow-50 text-yellow-800 font-bold')
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {onLogout && (
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};

export default AdaptiveNavigation;
