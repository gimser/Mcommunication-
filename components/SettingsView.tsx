
import React, { useState } from 'react';
import { 
  Shield, Bell, Moon, Smartphone, Globe, Lock, Eye, 
  HelpCircle, ChevronRight, LogOut, ToggleLeft, ToggleRight, CheckCircle2,
  ArrowLeft, Key, Save, Check, FileText, ShieldCheck, Search, Database, FileDigit, Activity, UserCog, Zap, Coffee,
  Clock, EyeOff, AlertTriangle, Fingerprint, HardDrive, FileWarning, X, Map, Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CitizenshipMode } from '../App';

interface SettingsViewProps {
  onLogout: () => void;
  citizenshipMode: CitizenshipMode;
  onModeChange: (mode: CitizenshipMode) => void;
}

type SubPage = 'main' | 'security' | 'language' | 'help' | 'digital-id' | 'data-control' | 'citizenship-model';

// Helper components
const SectionTitle = ({ children }: React.PropsWithChildren<{}>) => (
  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-6 px-4">
    {children}
  </h3>
);

const SettingItem = ({ icon: Icon, label, value, type = 'arrow', onClick, isDestructive = false }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 bg-white border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${isDestructive ? 'hover:bg-red-50' : ''}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isDestructive ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-sm font-medium ${isDestructive ? 'text-red-600' : 'text-slate-900'}`}>{label}</span>
    </div>
    
    <div className="flex items-center gap-2">
      {value && typeof value !== 'boolean' && <span className="text-xs text-slate-500 font-medium">{value}</span>}
      {type === 'arrow' && <ChevronRight size={16} className="text-slate-400 rtl:rotate-180" />}
      {type === 'toggle' && (
         <button className={`text-2xl transition-colors ${value ? 'text-brand-green' : 'text-slate-300'} rtl:rotate-180`}>
           {value ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
         </button>
      )}
    </div>
  </div>
);

const SettingsView: React.FC<SettingsViewProps> = ({ onLogout, citizenshipMode, onModeChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activePage, setActivePage] = useState<SubPage>('main');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
      showToast("Dark Mode Enabled");
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.filter = 'none';
      showToast("Light Mode Enabled");
    }
  };

  const SubPageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
      <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 rtl:rotate-180">
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );

  // --- Data Control Page (Previously Sovereignty) ---
  const DataControlPage = () => {
    const dataAccessLogs = [
      {
        id: 101,
        entity: "Ministry of Health",
        service: "Vaccine Pass",
        timestamp: "2 mins ago",
        status: "Active",
        canRevoke: false
      },
      {
        id: 103,
        entity: "StartUp Hub",
        service: "Grant Application",
        timestamp: "12 Oct 2023",
        status: "Shared",
        canRevoke: true
      },
      {
        id: 104,
        entity: "Mcommunication",
        service: "Personalization",
        timestamp: "Continuous",
        status: "Active",
        canRevoke: true
      }
    ];

    return (
      <div className="min-h-full bg-slate-50">
        <SubPageHeader title="Data & Privacy Control" onBack={() => setActivePage('main')} />
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          
          {/* Data Residency Card - Calm & Informative */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                  <Map size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Your Data stays in Morocco</h3>
                  <p className="text-xs text-slate-500">Stored securely in National Data Centers.</p>
               </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-full"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">Protection Level: High</p>
          </div>

          <div className="space-y-4">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Recent Data Usage</h4>

             {dataAccessLogs.map((log) => (
               <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                        <Database size={18} />
                     </div>
                     <div>
                        <h5 className="font-bold text-slate-900 text-sm">{log.entity}</h5>
                        <p className="text-xs text-slate-500">{log.service}</p>
                     </div>
                  </div>
                  
                  {log.canRevoke ? (
                     <button 
                       onClick={() => showToast(`Access revoked for ${log.entity}`)}
                       className="text-slate-500 hover:text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                     >
                       Manage
                     </button>
                  ) : (
                     <span className="text-slate-400 text-[10px] font-bold px-3 py-1.5 bg-slate-50 rounded-lg">
                       Required
                     </span>
                  )}
               </div>
             ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
             <Info size={20} className="text-blue-500 flex-shrink-0" />
             <p className="text-xs text-blue-800 leading-relaxed">
               You have the right to request a copy of your data or correction of inaccuracies at any time.
             </p>
          </div>

        </div>
      </div>
    );
  };

  // --- Other Sub-Pages (Simplified for brevity) ---
  const SecurityPage = () => (
    <div className="min-h-full bg-slate-50">
      <SubPageHeader title={t('settings.passwordSecurity')} onBack={() => setActivePage('main')} />
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Key size={18} className="text-brand-blue" /> {t('settings.changePassword')}
          </h3>
          <div className="space-y-4">
            <input type="password" placeholder={t('settings.currentPassword')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="password" placeholder={t('settings.newPassword')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <button onClick={() => { setActivePage('main'); showToast("Password updated"); }} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">
              {t('settings.updatePassword')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LanguagePage = () => (
    <div className="min-h-full bg-slate-50">
      <SubPageHeader title={t('settings.languageRegion')} onBack={() => setActivePage('main')} />
      <div className="p-4 space-y-2 max-w-2xl mx-auto">
        {['en', 'ar', 'fr', 'es'].map(code => (
          <button key={code} onClick={() => { 
            // @ts-ignore
            setLanguage(code); setActivePage('main'); 
          }} className="w-full p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-sm font-bold text-slate-800">
            {code === 'en' ? 'English' : code === 'ar' ? 'العربية' : code === 'fr' ? 'Français' : 'Español'}
            {language === code && <Check size={18} className="text-brand-green" />}
          </button>
        ))}
      </div>
    </div>
  );

  const HelpPage = () => (
    <div className="min-h-full bg-slate-50">
      <SubPageHeader title={t('settings.helpCenter')} onBack={() => setActivePage('main')} />
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
           <p className="text-sm text-slate-600">Contact support@mcom.gov.ma for assistance.</p>
        </div>
      </div>
    </div>
  );

  const DigitalIDPage = () => (
    <div className="min-h-full bg-slate-50">
      <SubPageHeader title={t('settings.idStatus')} onBack={() => setActivePage('main')} />
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
             <ShieldCheck size={40} />
           </div>
           <h2 className="font-bold text-lg text-slate-900">Verified Citizen</h2>
           <p className="text-sm text-slate-500 mt-1">ID: 849-221-9901</p>
        </div>
      </div>
    </div>
  );

  const CitizenshipModelPage = () => (
    <div className="min-h-full bg-slate-50">
      <SubPageHeader title="Experience Mode" onBack={() => setActivePage('main')} />
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
         <button onClick={() => onModeChange('active')} className={`w-full p-4 rounded-xl border-2 text-left ${citizenshipMode === 'active' ? 'border-brand-green bg-green-50' : 'border-slate-200 bg-white'}`}>
            <h4 className="font-bold text-sm">Active Citizen</h4>
            <p className="text-xs text-slate-500">Gamified experience with rewards.</p>
         </button>
         <button onClick={() => onModeChange('silent')} className={`w-full p-4 rounded-xl border-2 text-left ${citizenshipMode === 'silent' ? 'border-slate-600 bg-slate-100' : 'border-slate-200 bg-white'}`}>
            <h4 className="font-bold text-sm">Silent Citizen</h4>
            <p className="text-xs text-slate-500">Utility-focused experience.</p>
         </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (activePage === 'security') return <SecurityPage />;
  if (activePage === 'language') return <LanguagePage />;
  if (activePage === 'help') return <HelpPage />;
  if (activePage === 'digital-id') return <DigitalIDPage />;
  if (activePage === 'data-control') return <DataControlPage />;
  if (activePage === 'citizenship-model') return <CitizenshipModelPage />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:rounded-2xl overflow-hidden relative">
      
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={16} className="text-brand-green" />
            {toastMessage}
          </div>
        </div>
      )}

      <div className="bg-white p-6 border-b border-slate-200 sticky top-0 z-10">
        <h2 className="text-xl font-display font-bold text-slate-900">{t('settings.title')}</h2>
        <p className="text-sm text-slate-500">{t('settings.desc')}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        
        <SectionTitle>Experience</SectionTitle>
        <div className="bg-white border-y md:border border-slate-200 md:rounded-xl overflow-hidden">
           <SettingItem 
            icon={UserCog} 
            label="Experience Mode" 
            value={citizenshipMode === 'active' ? 'Active' : 'Silent'}
            onClick={() => setActivePage('citizenship-model')}
          />
        </div>

        <SectionTitle>{t('settings.account')}</SectionTitle>
        <div className="bg-white border-y md:border border-slate-200 md:rounded-xl overflow-hidden">
          <SettingItem 
            icon={Shield} 
            label={t('settings.id')} 
            value={t('settings.verified')}
            onClick={() => setActivePage('digital-id')}
          />
          <SettingItem 
            icon={Lock} 
            label={t('settings.passwordSecurity')}
            onClick={() => setActivePage('security')}
          />
          <SettingItem 
            icon={Globe} 
            label={t('settings.lang')} 
            value={language === 'en' ? 'English' : language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : 'Español'} 
            onClick={() => setActivePage('language')}
          />
        </div>

        {/* Renamed Section for Invisible Security */}
        <SectionTitle>Data & Privacy</SectionTitle>
        <div className="bg-white border-y md:border border-slate-200 md:rounded-xl overflow-hidden">
           <SettingItem 
            icon={Database} 
            label="Data Control" 
            value="Managed"
            onClick={() => setActivePage('data-control')}
          />
           <SettingItem 
            icon={FileText} 
            label="Usage History" 
            onClick={() => setActivePage('data-control')}
          />
        </div>

        <SectionTitle>{t('settings.preferences')}</SectionTitle>
        <div className="bg-white border-y md:border border-slate-200 md:rounded-xl overflow-hidden">
          <SettingItem 
            icon={Moon} 
            label={t('settings.darkMode')}
            type="toggle" 
            value={darkMode} 
            onClick={handleDarkModeToggle} 
          />
          <SettingItem 
            icon={Bell} 
            label={t('settings.notifications')}
            type="toggle" 
            value={notifications} 
            onClick={() => {
              const newVal = !notifications;
              setNotifications(newVal);
              showToast(`Notifications ${newVal ? 'On' : 'Off'}`);
            }} 
          />
        </div>

        <SectionTitle>{t('settings.support')}</SectionTitle>
        <div className="bg-white border-y md:border border-slate-200 md:rounded-xl overflow-hidden">
          <SettingItem 
            icon={HelpCircle} 
            label={t('settings.help')}
            onClick={() => setActivePage('help')}
          />
          <SettingItem 
            icon={LogOut} 
            label={t('nav.logout')}
            type="none" 
            isDestructive 
            onClick={onLogout} 
          />
        </div>

        <div className="p-8 text-center">
          <p className="text-xs text-slate-400">Mcommunication v3.0.0</p>
          <p className="text-[10px] text-slate-300 mt-1">{t('settings.officialPlatform')}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
