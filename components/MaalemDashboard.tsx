
import React, { useState, useEffect } from 'react';
import { ViewState } from '../App';
import { MapPin, Clock, CheckCircle2, TrendingUp, ShieldCheck, DollarSign, Eye, PlayCircle, Lock, AlertTriangle, ArrowRight, Crown, BarChart3, Briefcase, ShoppingBag, Zap, Flame, GraduationCap, Play } from 'lucide-react';
import LevelUpModal from './LevelUpModal';
import ProShopModal from './ProShopModal';
import { useContent } from '../contexts/ContentContext';
import { useLanguage } from '../contexts/LanguageContext';

interface MaalemDashboardProps {
  currentView: ViewState;
  user?: any; // Receive user data
}

const MaalemDashboard: React.FC<MaalemDashboardProps> = ({ currentView, user }) => {
  const { t } = useLanguage();
  const { activeJob, acceptOpportunity } = useContent(); 
  const [isOnline, setIsOnline] = useState(true);
  const [isHoutaMode, setIsHoutaMode] = useState(false); // NEW: Houta Mode State
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showProShop, setShowProShop] = useState(false);

  // SCENARIO 5: REPUTATION SIMULATION STATE
  const [simulatedScore, setSimulatedScore] = useState(65); // Start at mid-level

  // Trigger Level Up Modal when score crosses 85
  useEffect(() => {
      if (simulatedScore === 85) {
          setShowLevelUp(true);
      }
  }, [simulatedScore]);

  // Derived Stats based on Reputation Score
  const getLevelInfo = (score: number) => {
      if (score < 40) return { 
          label: t('dashboard.beginner'), 
          color: 'text-slate-500', 
          bg: 'bg-slate-100', 
          rate: '150 DH', 
          access: 'Small Repairs',
          icon: ShieldCheck,
          rank: 'beginner' as const
      };
      if (score < 85) return { 
          label: t('dashboard.verified'), 
          color: 'text-brand-green', 
          bg: 'bg-green-50', 
          rate: '300 DH', 
          access: 'Standard Jobs',
          icon: CheckCircle2,
          rank: 'beginner' as const
      };
      return { 
          label: t('dashboard.elite'), 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-50', 
          rate: '800+ DH', 
          access: 'Corporate Contracts',
          icon: Crown,
          rank: 'elite' as const
      };
  };

  const level = getLevelInfo(simulatedScore);
  const LevelIcon = level.icon;

  const opportunities = [
    { id: 101, type: 'Plumbing', location: 'Maârif (0.8km)', problem: 'Water leak', budget: '200-300 DH', urgent: true, reqScore: 0 },
    { id: 102, type: 'Electric', location: 'Bourgogne (1.2km)', problem: 'Install chandelier', budget: '150 DH', urgent: false, reqScore: 0 },
    { id: 888, type: 'Corporate', location: 'Marina (HQ)', problem: 'Full Office Renovation', budget: '50,000 DH', urgent: false, reqScore: 85 }, // Elite Job
  ];

  // Get display name safely
  const displayName = user?.name ? user.name.split(' ')[0] : 'Maâlem';

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header: Status & Availability */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">{t('dashboard.welcome')} {displayName} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">{t('dashboard.manage')}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            {/* NEW FEATURE: HOUTA MODE (Flash Deal) */}
            <button 
                onClick={() => setIsHoutaMode(!isHoutaMode)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all shadow-lg border ${isHoutaMode ? 'bg-orange-500 text-white border-orange-600 animate-pulse' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
                title="Signal availability for quick, discounted jobs"
            >
                <Flame size={18} fill={isHoutaMode ? "currentColor" : "none"} />
                {isHoutaMode ? t('dashboard.houta_active') : t('dashboard.houta_start')}
            </button>

            <button 
                onClick={() => setShowProShop(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg"
            >
                <ShoppingBag size={18} /> {t('dashboard.store')}
            </button>
            <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg ${isOnline ? 'bg-brand-green text-white shadow-brand-green/20' : 'bg-slate-200 text-slate-500'}`}
            >
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
            {isOnline ? t('dashboard.online') : t('dashboard.offline')}
            </button>
        </div>
      </div>

      {/* --- SCENARIO 5: REPUTATION SIMULATOR --- */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
              <div className="flex justify-between items-end mb-6">
                  <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                          <BarChart3 className="text-brand-green" /> {t('dashboard.career')}
                      </h3>
                      <p className="text-slate-400 text-sm">Drag slider to 85+ to unlock "Top Maâlem" status.</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${level.bg} ${level.color} border-current`}>
                      <LevelIcon size={20} />
                      <span className="font-bold uppercase tracking-wider text-sm">{level.label}</span>
                  </div>
              </div>

              {/* Slider */}
              <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                      <span>{t('dashboard.beginner')} (0)</span>
                      <span>{t('dashboard.verified')} (50)</span>
                      <span className="text-brand-yellow">{t('dashboard.elite')} (85+)</span>
                  </div>
                  <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={simulatedScore} 
                      onChange={(e) => setSimulatedScore(parseInt(e.target.value))}
                      className="w-full h-4 bg-slate-700 rounded-full appearance-none cursor-pointer accent-brand-green"
                  />
              </div>

              {/* Dynamic Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Stat 1: Trust Score */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('dashboard.karne_score')}</p>
                      <p className={`text-3xl font-mono font-bold ${simulatedScore > 80 ? 'text-brand-yellow' : 'text-white'}`}>
                          {simulatedScore}
                      </p>
                  </div>

                  {/* Stat 2: Daily Rate */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-green/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1 relative z-10">{t('dashboard.market_value')}</p>
                      <div className="flex items-center gap-2 relative z-10">
                          <p className="text-3xl font-mono font-bold text-white">{level.rate}</p>
                          <TrendingUp size={16} className="text-brand-green" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 relative z-10">{t('dashboard.per_day')}</p>
                  </div>

                  {/* Stat 3: Access Level */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('dashboard.access')}</p>
                      <p className="text-lg font-bold text-white leading-tight">{level.access}</p>
                      {simulatedScore < 85 && (
                          <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                              <Lock size={10} /> {t('dashboard.corporate_locked')}
                          </p>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left: Active Radar (Opportunities) */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">
               {t('dashboard.available_jobs')}
            </h3>
            
            {/* Opportunities List with Locking Logic */}
            {opportunities.map(opp => {
               const isLocked = simulatedScore < opp.reqScore;
               
               return (
                  <div key={opp.id} className={`rounded-2xl p-5 border shadow-sm transition-all relative overflow-hidden group ${isLocked ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                     
                     {/* Lock Overlay for Elite Jobs */}
                     {isLocked && (
                         <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-4">
                             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                                 <Lock size={20} className="text-slate-500" />
                             </div>
                             <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">
                                 {t('dashboard.locked')}
                             </span>
                             <p className="text-[10px] text-slate-500 mt-1">Requires Karné Score 85+</p>
                         </div>
                     )}

                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opp.type === 'Corporate' ? 'bg-brand-yellow/10 text-brand-yellow-dark' : (opp.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600')}`}>
                              {opp.type === 'Corporate' ? <Briefcase size={24} /> : <MapPin size={24} />}
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                  {opp.type}
                                  {opp.type === 'Corporate' && <span className="bg-brand-yellow text-slate-900 text-[10px] px-2 py-0.5 rounded font-bold">ELITE</span>}
                              </h4>
                              <p className="text-sm text-slate-500">{opp.problem} • {opp.location}</p>
                           </div>
                        </div>
                        <div className="text-right mt-6 sm:mt-0">
                           <p className={`font-bold text-lg ${opp.type === 'Corporate' ? 'text-brand-green' : 'text-slate-900'}`}>{opp.budget}</p>
                        </div>
                     </div>
                     <div className="flex gap-3 pt-2 border-t border-slate-50">
                        <button 
                            onClick={() => acceptOpportunity(opp)}
                            disabled={isLocked} 
                            className={`flex-1 py-3 text-white rounded-xl font-bold text-sm transition-colors ${isLocked ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
                        >
                           {isLocked ? t('dashboard.locked') : t('dashboard.accept_job')}
                        </button>
                        <button disabled={isLocked} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50">
                           {t('dashboard.ignore')}
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Right: Insights & Academy */}
         <div className="space-y-4">
            
            {/* NEW FEATURE: MAALEM ACADEMY WIDGET */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <GraduationCap size={18} className="text-purple-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{t('dashboard.academy')}</h4>
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex gap-3 items-center cursor-pointer group">
                        <div className="w-16 h-12 bg-slate-200 rounded-lg relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle size={20} className="text-white fill-black/50" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">Advanced Safety Standards</p>
                            <p className="text-[10px] text-green-600 font-bold">+5 Karné Points</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center cursor-pointer group">
                        <div className="w-16 h-12 bg-slate-200 rounded-lg relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1556740758-90de2929e759?w=100&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle size={20} className="text-white fill-black/50" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">How to quote Corporate Jobs</p>
                            <p className="text-[10px] text-green-600 font-bold">+10 Karné Points</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 pb-4">
                    <button className="w-full py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors">
                        {t('dashboard.visit_academy')}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
               <h4 className="font-bold text-slate-900 text-sm mb-3">Rate Evolution</h4>
               <div className="relative h-24 flex items-end gap-2">
                   {/* Simple Chart */}
                   <div className="w-1/3 bg-slate-200 rounded-t-lg h-[30%] relative group">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">150DH</span>
                   </div>
                   <div className="w-1/3 bg-brand-green/50 rounded-t-lg h-[60%] relative group">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">300DH</span>
                   </div>
                   <div className={`w-1/3 rounded-t-lg h-[100%] relative group transition-colors ${simulatedScore > 85 ? 'bg-brand-yellow' : 'bg-slate-200'}`}>
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand-yellow-dark opacity-100">800DH</span>
                   </div>
               </div>
               <p className="text-[10px] text-slate-400 mt-2 text-center">Your projected growth based on performance.</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
               <h4 className="font-bold text-blue-900 text-sm mb-2">Did you know?</h4>
               <p className="text-xs text-blue-700 leading-relaxed">
                  Elite Maâlems get access to "Pre-Approved" financing from partner banks for new equipment.
               </p>
            </div>
         </div>

      </div>

      {showLevelUp && (
        <LevelUpModal onClose={() => setShowLevelUp(false)} stats={{ jobs: 25, rating: 4.9 }} />
      )}

      {showProShop && (
          <ProShopModal onClose={() => setShowProShop(false)} rank={level.rank} />
      )}
    </div>
  );
};

export default MaalemDashboard;
