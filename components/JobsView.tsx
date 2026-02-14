
import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, Search, Filter, Lock, Crown, Clock, AlertTriangle, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import OfferModal from './OfferModal';
import { useContent } from '../contexts/ContentContext';
import ClientRequestDetails from './ClientRequestDetails';
import { useLanguage } from '../contexts/LanguageContext';

interface Job {
    id: number;
    title: string;
    location: string;
    price: string;
    type: 'corporate' | 'standard';
    category: string;
    urgency: 'urgent' | 'normal';
    minReputation: number;
}

// Mock Jobs Data
const JOBS: Job[] = [
  { 
    id: 888, 
    title: 'HQ Office Renovation (5000sqm)', 
    location: 'Marina, Casablanca', 
    price: '50,000+', 
    type: 'corporate',
    category: 'General Contractor',
    urgency: 'normal',
    minReputation: 85 // Scenario 5: High Requirement
  },
  { id: 101, title: 'Fix Circuit Breaker', location: 'Maârif, Casablanca', price: '450', type: 'standard', category: 'Electricity', urgency: 'urgent', minReputation: 0 },
  { id: 102, title: 'Install New Sink', location: 'Hay Hassani', price: '150-200', type: 'standard', category: 'Plumbing', urgency: 'normal', minReputation: 0 },
  { id: 103, title: 'Paint Living Room', location: 'Bourgogne', price: '500-700', type: 'standard', category: 'Painting', urgency: 'normal', minReputation: 0 },
];

const JobsView: React.FC = () => {
  const { t, language } = useLanguage();
  const { clientRequest } = useContent(); 
  const [activeTab, setActiveTab] = useState<'opportunities' | 'active'>('opportunities');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMyRequest, setShowMyRequest] = useState(false);
  
  // SCENARIO 5 DEMO: Toggle to simulate user's reputation state
  const [userReputation, setUserReputation] = useState(60); // Default to "Verified" but not "Elite"

  const handleOpenOffer = (job: Job) => {
    // Check requirements
    if (userReputation < (job.minReputation || 0)) {
        alert("You need a higher Karné Score to access this Corporate Job.");
        return;
    }
    setSelectedJob(job);
    setIsOfferModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="bg-white p-6 border-b border-slate-200 sticky top-0 z-20">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-display font-bold text-slate-900">{t('market.title')}</h1>
            
            {/* Demo Toggle for Scenario 5 */}
            <button 
                onClick={() => setUserReputation(prev => prev === 60 ? 90 : 60)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${userReputation === 90 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
            >
                {userReputation === 90 ? t('market.elite_mode') : t('market.basic_mode')}
            </button>
         </div>

         <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('opportunities')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeTab === 'opportunities' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
               {t('market.opportunities')}
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeTab === 'active' ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-slate-600 border-slate-200'}`}
            >
               {t('market.active_requests')} {clientRequest && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full ml-1">1</span>}
            </button>
         </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-4">
         
         {/* ACTIVE REQUEST CARD (CLIENT SIDE) */}
         {activeTab === 'active' && clientRequest && (
             <div onClick={() => setShowMyRequest(true)} className={`bg-white rounded-2xl p-5 border-2 shadow-lg cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden ${clientRequest.isEmergency ? 'border-red-500' : 'border-brand-green'}`}>
                 <div className={`absolute top-0 ${language === 'ar' ? 'left-0 rounded-br-xl' : 'right-0 rounded-bl-xl'} text-white text-[10px] font-bold px-3 py-1 ${clientRequest.isEmergency ? 'bg-red-500 animate-pulse' : 'bg-brand-green'}`}>
                    {clientRequest.isEmergency ? t('market.l3ar_broadcast') : t('market.live_broadcast')}
                 </div>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${clientRequest.isEmergency ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'} animate-pulse`}>
                            <Loader2 size={24} className="animate-spin" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{clientRequest.category}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {clientRequest.isEmergency ? (
                                    <span className="text-red-600 font-bold">{t('market.auto_matching')}</span>
                                ) : (
                                    <>
                                        <span>{clientRequest.offers.length} {t('market.offers_received')}</span>
                                        <span>•</span>
                                        <span>{t('market.waiting_selection')}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className={`text-slate-300 group-hover:text-brand-green transition-colors ${language === 'ar' ? 'rotate-180' : ''}`} />
                 </div>
             </div>
         )}

         {activeTab === 'active' && !clientRequest && (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
               <Clock size={48} className="mx-auto mb-4 opacity-50" />
               <p>{t('market.no_requests')}</p>
            </div>
         )}

         {activeTab === 'opportunities' && JOBS.map(job => {
            const isLocked = userReputation < (job.minReputation || 0);

            return (
                <div key={job.id} className={`bg-white rounded-2xl p-5 border shadow-sm relative overflow-hidden transition-all ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''} ${job.urgency === 'urgent' ? 'border-red-200 ring-2 ring-red-100' : (job.type === 'corporate' ? 'border-brand-yellow/50' : 'border-slate-100')}`}>
                
                {/* LOCKED OVERLAY */}
                {isLocked && (
                    <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 text-slate-400">
                            <Lock size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm">
                            {t('market.locked_desc')}
                        </span>
                    </div>
                )}

                <div className={`absolute top-0 ${language === 'ar' ? 'left-0 rounded-br-xl' : 'right-0 rounded-bl-xl'} flex`}>
                    {job.urgency === 'urgent' && (
                        <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1 animate-pulse">
                            <AlertTriangle size={10} /> {t('local.l3ar')}
                        </div>
                    )}
                    {job.type === 'corporate' && (
                        <div className="bg-brand-yellow text-slate-900 text-[10px] font-bold px-3 py-1 flex items-center gap-1">
                            <Building2 size={10} /> CORPORATE
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.urgency === 'urgent' ? 'bg-red-100 text-red-600' : (job.type === 'corporate' ? 'bg-brand-yellow/10 text-brand-yellow-dark' : 'bg-slate-100 text-slate-600')}`}>
                            {job.type === 'corporate' ? <Building2 size={24} /> : (job.urgency === 'urgent' ? <AlertTriangle size={24} /> : <Briefcase size={24} />)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {job.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">{t('market.budget')}</p>
                        <p className={`text-slate-900 font-bold ${job.urgency === 'urgent' ? 'text-red-600' : ''}`}>{job.price} MAD</p>
                    </div>
                    <button 
                        onClick={() => handleOpenOffer(job)}
                        disabled={isLocked}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${isLocked ? 'bg-slate-200 text-slate-400 shadow-none' : (job.urgency === 'urgent' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' : (job.type === 'corporate' ? 'bg-gradient-to-r from-brand-yellow to-yellow-600 text-white hover:shadow-yellow-500/30' : 'bg-slate-900 text-white hover:bg-slate-800'))}`}
                    >
                        {isLocked ? t('dashboard.locked') : (job.urgency === 'urgent' ? t('market.quick_accept') : (job.type === 'corporate' ? t('market.place_bid') : t('market.send_offer')))}
                    </button>
                </div>
                </div>
            );
         })}
      </div>

      {isOfferModalOpen && selectedJob && (
         <OfferModal 
            onClose={() => setIsOfferModalOpen(false)}
            jobTitle={selectedJob.title}
            clientName="Verified Client"
            onSubmit={() => { setIsOfferModalOpen(false); alert("Offer Sent!"); }}
         />
      )}

      {showMyRequest && clientRequest && (
          <ClientRequestDetails onClose={() => setShowMyRequest(false)} />
      )}

    </div>
  );
};

export default JobsView;
