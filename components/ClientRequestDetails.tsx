
import React, { useState, useEffect } from 'react';
import { X, Star, Clock, CheckCircle2, Shield, MapPin, ChevronRight, MessageCircle, AlertTriangle, ShieldCheck, Zap, DollarSign, LayoutList, Columns, ThumbsUp, Activity, Users, Lock } from 'lucide-react';
import { useContent, Offer } from '../contexts/ContentContext';
import { useLanguage } from '../contexts/LanguageContext';
import ArbounModal from './ArbounModal'; // Import new modal

interface ClientRequestDetailsProps {
  onClose: () => void;
}

const ClientRequestDetails: React.FC<ClientRequestDetailsProps> = ({ onClose }) => {
  const { clientRequest, acceptOffer } = useContent();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');
  const [showHesitationNudge, setShowHesitationNudge] = useState(false);
  
  // Arboun State
  const [selectedOfferForArboun, setSelectedOfferForArboun] = useState<Offer | null>(null);

  // SCENARIO 7: HESITATION DETECTOR
  useEffect(() => {
      const timer = setTimeout(() => {
          setShowHesitationNudge(true);
      }, 6000); // 6 seconds dwell time
      return () => clearTimeout(timer);
  }, []);

  const handleAcceptClick = (offer: Offer) => {
      setSelectedOfferForArboun(offer);
  };

  const handleArbounConfirmed = () => {
      if (selectedOfferForArboun) {
          acceptOffer(selectedOfferForArboun);
          setSelectedOfferForArboun(null);
          onClose();
      }
  };

  if (!clientRequest) return null;

  const hasOffers = clientRequest.offers && clientRequest.offers.length > 0;
  const minPrice = hasOffers ? Math.min(...clientRequest.offers.map(o => o.price)) : 0;
  const maxRating = hasOffers ? Math.max(...clientRequest.offers.map(o => o.rating)) : 0;
  const bestOffer = hasOffers ? (clientRequest.offers.find(o => o.rating === maxRating) || clientRequest.offers[0]) : null;

  const renderComparisonView = () => (
    <div className="space-y-4 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max px-2">
            {clientRequest.offers.map(offer => (
                <div key={offer.id} className={`w-64 bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col relative ${bestOffer && offer.id === bestOffer.id && showHesitationNudge ? 'border-brand-green ring-2 ring-brand-green ring-offset-2' : 'border-slate-200'}`}>
                    
                    {/* Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col items-center text-center relative">
                        <div className="relative mb-2">
                            <img src={offer.proAvatar} className="w-16 h-16 rounded-2xl object-cover" />
                            {offer.isTrusted && (
                                <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-1 rounded-full border-2 border-white">
                                    <ShieldCheck size={12} />
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900">{offer.proName}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                            <span className="font-bold text-slate-900">{offer.rating}</span>
                            <span>({offer.jobsDone})</span>
                        </div>
                    </div>

                    {/* Matrix */}
                    <div className="p-4 space-y-4 flex-1">
                        
                        {/* FEATURE: Neighbor's Guarantee (Social Proof) */}
                        {offer.rating > 4.8 && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-[10px] text-indigo-800 font-bold flex items-center gap-2">
                                <Users size={12} className="text-indigo-600" />
                                <span>Used by 3 neighbors in Maârif</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="pt-2">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Estimated Cost</p>
                            <div className="flex items-center justify-between">
                                <span className={`text-xl font-bold ${offer.price === minPrice ? 'text-green-600' : 'text-slate-900'}`}>
                                    {offer.price} <span className="text-xs">MAD</span>
                                </span>
                                {offer.price === minPrice && (
                                    <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Best Value</span>
                                )}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Duration</p>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" />
                                <span className="font-medium text-sm">{offer.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 pt-0 mt-auto">
                        <button 
                             onClick={() => handleAcceptClick(offer)}
                             className={`w-full py-3 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${bestOffer && offer.id === bestOffer.id && showHesitationNudge ? 'bg-brand-green hover:bg-green-700 animate-pulse-slow' : 'bg-slate-900 hover:bg-slate-800'}`}
                        >
                            Accept & Pay Arboun
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
        {clientRequest.offers.map(offer => (
            <div key={offer.id} className={`bg-white rounded-xl p-4 border shadow-sm relative group transition-all animate-slide-up ${bestOffer && offer.id === bestOffer.id && showHesitationNudge ? 'border-brand-green ring-1 ring-brand-green' : 'border-slate-200 hover:border-brand-green'}`}>
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                {offer.badges.map(badge => (
                    <span key={badge} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === 'Best Price' ? 'bg-green-100 text-green-700' : 'bg-brand-yellow/20 text-brand-yellow-dark'}`}>
                        {badge}
                    </span>
                ))}
                </div>

                <div className="flex gap-4 mb-4">
                <div className="relative">
                    <img src={offer.proAvatar} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                    {offer.isTrusted && (
                        <div className="absolute -bottom-1 -right-1 bg-brand-blue text-white p-0.5 rounded-full border-2 border-white">
                            <Shield size={10} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{offer.proName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                        <span className="font-bold text-slate-800">{offer.rating}</span>
                        <span>({offer.jobsDone} jobs)</span>
                    </div>
                </div>
                </div>

                {/* Neighbor Guarantee Inline */}
                <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                    {offer.rating >= 4.8 && (
                        <span className="text-[10px] font-bold text-slate-600 bg-indigo-50 px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1 border border-indigo-100">
                            <Users size={10} className="text-indigo-600" /> 3 Neighbors Used
                        </span>
                    )}
                    {offer.jobsDone > 100 && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-green-600" /> 120+ Jobs Done
                        </span>
                    )}
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-4 text-xs text-slate-600 italic border border-slate-100">
                "{offer.note}"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Price</span>
                        <span className="text-lg font-bold text-slate-900">{offer.price} <span className="text-xs">MAD</span></span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Duration</span>
                        <span className="text-sm font-bold text-brand-green">{offer.duration}</span>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                        <MessageCircle size={20} />
                    </button>
                    <button 
                        onClick={() => handleAcceptClick(offer)}
                        className={`px-4 py-2 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105 ${bestOffer && offer.id === bestOffer.id && showHesitationNudge ? 'bg-brand-green animate-pulse' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                        Accept <Lock size={12} />
                    </button>
                </div>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="bg-white p-6 border-b border-slate-200">
           <div className="flex justify-between items-start mb-4">
              <div>
                 <h2 className="text-xl font-display font-bold text-slate-900">{clientRequest.category}</h2>
                 <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                    <Clock size={12} />
                    <span>Posted {clientRequest.time}</span>
                    <span>•</span>
                    <MapPin size={12} />
                    <span>{clientRequest.location}</span>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                 <X size={20} />
              </button>
           </div>
           
           <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 animate-pulse">
                        {clientRequest.offers.length} Offers Received
                    </div>
                    {clientRequest.offers.length === 0 && (
                        <span className="text-xs text-slate-400">Waiting for quotes...</span>
                    )}
                </div>

                {/* VIEW TOGGLE */}
                {clientRequest.offers.length > 1 && (
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
                        >
                            <LayoutList size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('compare')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'compare' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
                        >
                            <Columns size={16} />
                        </button>
                    </div>
                )}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
           {clientRequest.offers.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                   <div className="w-10 h-10 border-4 border-slate-300 border-t-brand-green rounded-full animate-spin mb-4"></div>
                   <p className="text-sm">Broadcasting your request to Maâlems...</p>
               </div>
           ) : (
               viewMode === 'list' ? renderListView() : renderComparisonView()
           )}
        </div>

        {/* SCENARIO 7: SMART NUDGE (Floating at bottom) */}
        {showHesitationNudge && bestOffer && clientRequest.offers.length > 0 && !selectedOfferForArboun && (
            <div className="absolute bottom-4 left-4 right-4 z-50 animate-slide-up">
                <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border-t-4 border-brand-green">
                    <div className="flex items-start gap-3">
                        <div className="bg-brand-green/20 p-2 rounded-full mt-1">
                            <Activity size={20} className="text-brand-green" />
                        </div>
                        <div>
                            <p className="text-xs text-brand-green font-bold uppercase mb-1">{t('trust.nudge_title')}</p>
                            <p className="text-sm font-medium">{t('trust.nudge_body')}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{t('trust.insight')}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleAcceptClick(bestOffer)}
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors whitespace-nowrap"
                    >
                        Choose {bestOffer.proName.split(' ')[0]}
                    </button>
                    <button onClick={() => setShowHesitationNudge(false)} className="absolute -top-2 -right-2 bg-white text-slate-900 rounded-full p-1 shadow-md">
                        <X size={12} />
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* ARBOUN MODAL OVERLAY */}
      {selectedOfferForArboun && (
          <ArbounModal 
             onClose={() => setSelectedOfferForArboun(null)}
             onConfirm={handleArbounConfirmed}
             providerName={selectedOfferForArboun.proName}
             totalPrice={selectedOfferForArboun.price}
          />
      )}
    </div>
  );
};

export default ClientRequestDetails;
