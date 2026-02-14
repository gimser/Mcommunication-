
import React, { useState, useEffect } from 'react';
import { SovereignBackend, UserSession } from './services/SovereignBackend';
import AuthScreen from './components/AuthScreen';
import SocialSidebar from './components/SocialSidebar';
import SocialBottomNav from './components/SocialBottomNav';
import FeedView from './components/FeedView';
import ShortsView from './components/ShortsView';
import ExploreView from './components/ExploreView';
import ChatView from './components/ChatView';
import ProfileView from './components/ProfileView';
import NotificationsView from './components/NotificationsView';
import LiveView from './components/LiveView';
import MaalemDashboard from './components/MaalemDashboard'; 
import ClientHome from './components/ClientHome'; 
import JobsView from './components/JobsView';
import SettingsView from './components/SettingsView';
import ArchitectureView from './components/ArchitectureView';
import ActiveJobView from './components/ActiveJobView';
import DigitalIDModal from './components/DigitalIDModal';
import { Loader2, Zap } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContentProvider } from './contexts/ContentContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Types
export type UserRole = 'MAALEM' | 'CLIENT';
// Expanded ViewState to accommodate both interfaces
export type ViewState = 
  // Shared
  | 'messages' | 'notifications' | 'profile' | 'settings' | 'system'
  // Maalem Specific
  | 'dashboard' | 'jobs' | 'live'
  // Client Specific
  | 'client-home' | 'explore' | 'my-requests' | 'shorts'; 

export type CitizenshipMode = 'active' | 'silent';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; 

const AppContent: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('client-home'); // Default temp
  const [userRole, setUserRole] = useState<UserRole>('CLIENT');
  const [citizenshipMode, setCitizenshipMode] = useState<CitizenshipMode>('active');
  const [showIDModal, setShowIDModal] = useState(false);
  
  const [viewingProfile, setViewingProfile] = useState<any>(null);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      const stored = await SovereignBackend.verifySession();
      if (stored) {
        setSession(stored);
        const role = stored.user.role === 'professional' ? 'MAALEM' : 'CLIENT';
        setUserRole(role);
        // Set Default View based on Role
        setCurrentView(role === 'MAALEM' ? 'dashboard' : 'client-home');
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const handleLogin = async () => {
    const s = await SovereignBackend.verifySession();
    if (s) {
      setSession(s);
      const role = s.user.role === 'professional' ? 'MAALEM' : 'CLIENT';
      setUserRole(role);
      // Correctly route to specific home page
      setCurrentView(role === 'MAALEM' ? 'dashboard' : 'client-home');
    }
  };

  const handleLogout = async () => {
    await SovereignBackend.logout();
    setSession(null);
    setCurrentView('client-home'); // Reset to safe default
  };

  const handleViewChange = (view: ViewState) => {
    if (view === 'profile') {
        setViewingProfile(null);
    }
    setCurrentView(view);
  };

  const handleNavigateToProfile = (user: any) => {
    setViewingProfile(user);
    setCurrentView('profile');
  };

  // Render Content based on Role and View
  const renderContent = () => {
    switch (currentView) {
      // --- SHARED VIEWS ---
      case 'messages': return <ChatView />;
      case 'notifications': return <NotificationsView />;
      case 'profile': return <ProfileView onViewChange={setCurrentView} citizenshipMode={citizenshipMode} session={session} targetProfile={viewingProfile} />;
      case 'settings': return <SettingsView onLogout={handleLogout} citizenshipMode={citizenshipMode} onModeChange={setCitizenshipMode} />;
      case 'system': return <ArchitectureView />;
      
      // --- MAALEM SPECIFIC ---
      case 'dashboard': return <MaalemDashboard currentView={currentView} user={session?.user} />;
      case 'jobs': return <JobsView />; // Market for Maalem
      case 'live': return <LiveView />; // Maalems go live to show expertise
      
      // --- CLIENT SPECIFIC ---
      case 'client-home': return <ClientHome currentView={currentView} />;
      case 'explore': return <ExploreView onNavigateToProfile={handleNavigateToProfile} />;
      case 'my-requests': return <JobsView />; // Reusing JobsView but simpler for client history
      case 'shorts': return <ShortsView />; // Clients watch reels

      // Fallbacks
      default: return userRole === 'MAALEM' ? <MaalemDashboard currentView={currentView} user={session?.user} /> : <ClientHome currentView={currentView} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-green" size={32} />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0 relative overflow-hidden">
      
      {/* Global Overlays */}
      <ActiveJobView userRole={userRole} onNavigate={handleViewChange} />
      {showIDModal && <DigitalIDModal onClose={() => setShowIDModal(false)} />}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:flex w-20 lg:w-64 border-r border-slate-200 bg-white flex-col z-20">
           <div className="p-6">
             <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 cursor-pointer" onClick={() => handleViewChange(userRole === 'MAALEM' ? 'dashboard' : 'client-home')}>
                <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center text-white">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="hidden lg:block">M-Comm</span>
             </div>
           </div>
           
           <SocialSidebar 
             currentView={currentView} 
             onViewChange={handleViewChange} 
             onLogout={handleLogout}
             citizenshipMode={citizenshipMode}
             userRole={userRole} // Passing Role
           />

           {/* User Mini Profile */}
           <div className="mt-auto p-4 border-t border-slate-100">
              <div 
                onClick={() => setShowIDModal(true)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                 <img src={session.user.avatar || (userRole === 'MAALEM' ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100")} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                 <div className="hidden lg:block">
                    <p className="text-sm font-bold text-slate-900 truncate w-32">{session.user.name}</p>
                    <p className="text-[10px] text-brand-green font-bold uppercase">{userRole === 'MAALEM' ? 'Maâlem ID' : 'Citizen ID'}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50 scrollbar-hide w-full" id="main-scroll">
          <div className="max-w-7xl mx-auto w-full">
             {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <SocialBottomNav currentView={currentView} onViewChange={handleViewChange} userRole={userRole} />

    </div>
  );
};

const App: React.FC = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LanguageProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </LanguageProvider>
  </GoogleOAuthProvider>
);

export default App;
