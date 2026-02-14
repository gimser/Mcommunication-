
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, MessageSquare, ShieldCheck, Navigation, CheckCircle2, Siren, AlertOctagon, CornerUpRight, Volume2, Layers, Compass, Minus, Plus, Car, Zap, ArrowRight, Clock } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import JobCompletionModal from './JobCompletionModal';
import DisputeModal from './DisputeModal'; 
import VerdictModal from './VerdictModal';
import { ViewState } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import L from 'leaflet';

interface ActiveJobViewProps {
  userRole: 'MAALEM' | 'CLIENT';
  onNavigate?: (view: ViewState) => void;
}

const ActiveJobView: React.FC<ActiveJobViewProps> = ({ userRole, onNavigate }) => {
  const { t } = useLanguage();
  const { activeJob, updateJobStatus, cancelJob, raiseDispute, activeVerdict, clearVerdict } = useContent();
  const [showCompletion, setShowCompletion] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  
  // Real Map State
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  
  const [eta, setEta] = useState(12); // Minutes

  // --- 0. VERDICT SCREEN (If Dispute Resolved) ---
  if (activeVerdict) {
      return <VerdictModal onClose={clearVerdict} verdict={activeVerdict} />;
  }

  if (!activeJob) return null;

  const isUrgent = activeJob.urgency === 'urgent';

  const handleCall = () => {
      const phoneNumber = activeJob.provider?.phone || '0600000000';
      window.location.href = `tel:${phoneNumber}`;
  };

  const handleMessage = () => {
      if (onNavigate) onNavigate('messages');
  };

  const handleStartNavigation = () => {
      // Open Waze or Google Maps with Coordinates
      // Using generic coordinates for Casablanca Maârif
      window.open(`https://www.google.com/maps/dir/?api=1&destination=33.5898,-7.6335`, '_blank');
  };

  // --- 1. EMERGENCY SEARCHING STATE ---
  if (activeJob.status === 'searching' && isUrgent) {
      return (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            {/* Pulsing Radar */}
            <div className="relative mb-12">
                <div className="w-48 h-48 bg-red-600/20 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-48 h-48 bg-red-600/10 rounded-full animate-pulse absolute inset-0 delay-75"></div>
                <div className="relative z-10 bg-gradient-to-br from-red-600 to-red-800 w-48 h-48 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-red-500">
                    <Siren size={64} className="text-white animate-bounce" />
                </div>
            </div>

            <h2 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-2 animate-pulse">
                L'3AR ALERT ACTIVE
            </h2>
            <p className="text-red-200 text-lg font-medium mb-8 max-w-xs mx-auto">
                Broadcasting high-priority signal to nearby Maâlems...
            </p>

            <button onClick={cancelJob} className="mt-8 text-white/50 hover:text-white text-sm font-bold underline decoration-white/30">
                Cancel Emergency
            </button>
        </div>
      );
  }

  if (activeJob.status === 'searching') return null;

  // --- 2. REAL MAP ENGINE (LEAFLET) ---
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Coordinates for Casablanca (Maarif Area)
    // Provider Start: Twin Center
    const startCoords: [number, number] = [33.5862, -7.6335]; 
    // Client End: Near Parc de la Ligue Arabe
    const endCoords: [number, number] = [33.5910, -7.6250]; 

    // Init Map
    const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
    }).setView([33.5885, -7.629], 15);

    // Add Tile Layer (CartoDB Voyager for clean look or OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    leafletMap.current = map;

    // Custom Icons using DivIcon to embed Lucide SVGs (simulated via HTML string)
    const clientIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #EF4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    const providerIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #009746; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transform: rotate(45deg);"><svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add Markers
    L.marker(endCoords, { icon: clientIcon }).addTo(map);
    const providerMarker = L.marker(startCoords, { icon: providerIcon }).addTo(map);
    markerRef.current = providerMarker;

    // Draw Route (Simulated Polyline)
    const routeCoords: [number, number][] = [
        startCoords,
        [33.5870, -7.6320],
        [33.5880, -7.6300],
        [33.5895, -7.6280],
        endCoords
    ];

    const polyline = L.polyline(routeCoords, {
        color: '#4285F4',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round'
    }).addTo(map);
    routeLineRef.current = polyline;

    // Fit Bounds
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    // Animation Loop
    if (activeJob.status === 'accepted' || activeJob.status === 'arrived') {
        let step = 0;
        const totalSteps = 1000;
        
        const animateMarker = () => {
            step++;
            if (step > totalSteps) step = 0; // Loop for demo
            
            // Simple linear interpolation between route points for demo
            // In a real app, use a proper routing engine output
            const progress = step / totalSteps;
            const currentLat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
            const currentLng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;
            
            providerMarker.setLatLng([currentLat, currentLng]);
            requestAnimationFrame(animateMarker);
        };
        requestAnimationFrame(animateMarker);
    }

    return () => {
        if (leafletMap.current) {
            leafletMap.current.remove();
            leafletMap.current = null;
        }
    };
  }, [activeJob.status]); // Re-run if status changes significantly

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans">
       
       {/* REAL MAP CONTAINER */}
       <div ref={mapRef} className="absolute inset-0 z-0" />

       {/* --- TOP: GOOGLE MAPS NAVIGATION BAR --- */}
       {activeJob.status === 'accepted' && (
           <div className="absolute top-0 left-0 right-0 z-30 p-2 pt-safe">
               <div className="bg-[#007F3F] rounded-2xl overflow-hidden shadow-xl flex flex-col text-white mx-2 mt-2">
                   <div className="p-4 flex gap-4 items-start">
                       <div className="mt-1 opacity-90">
                           <CornerUpRight size={48} />
                       </div>
                       <div className="flex-1 min-w-0">
                           <div className="font-medium text-lg leading-none mb-1 opacity-90">200 m</div>
                           <div className="font-bold text-2xl leading-tight truncate">
                               Bd. Zerktouni
                           </div>
                           <div className="text-sm opacity-80 mt-1 truncate">
                               Vers / Towards Maarif Center
                           </div>
                       </div>
                   </div>
                   {/* Lane Guidance (Simulated) */}
                   <div className="bg-[#006030] px-6 py-2 flex gap-4">
                       <div className="opacity-40"><ArrowRight size={20} className="rotate-[-90deg]" /></div>
                       <div className="opacity-100 font-bold"><ArrowRight size={20} className="rotate-[-45deg]" /></div>
                       <div className="opacity-40"><ArrowRight size={20} className="rotate-[0deg]" /></div>
                   </div>
               </div>
           </div>
       )}

       {/* --- TOP: WAITING STATUS --- */}
       {activeJob.status !== 'accepted' && (
           <div className="absolute top-4 left-4 right-4 z-20 pt-safe">
                <div className={`backdrop-blur-xl p-4 rounded-2xl shadow-xl space-y-1 border ${isUrgent ? 'bg-red-900/90 border-red-500 text-white' : 'bg-slate-900/90 border-slate-700 text-white'}`}>
                    <div className="flex items-center justify-between">
                        <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${isUrgent ? 'text-white animate-pulse' : 'text-brand-green'}`}>
                            {activeJob.status === 'arrived' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {activeJob.status === 'arrived' ? t('job.arrived_status') : t('job.work_in_progress')}
                        </p>
                        <span className="text-xs font-mono opacity-70">JOB-{activeJob.id.slice(-4)}</span>
                    </div>
                    <h3 className="font-bold text-lg">{activeJob.serviceType}</h3>
                </div>
           </div>
       )}

       {/* --- FLOATING ACTION BUTTON (Google Maps External) --- */}
       {userRole === 'MAALEM' && activeJob.status === 'accepted' && (
           <button 
             onClick={handleStartNavigation}
             className="absolute bottom-48 right-6 z-30 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-200 hover:scale-105 transition-transform animate-bounce-in"
             title="Open in Google Maps"
           >
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" className="w-8 h-8" alt="GMaps" />
           </button>
       )}

       {/* --- BOTTOM SHEET --- */}
       <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 pb-8 z-30 animate-slide-up">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

          {/* Profile Section */}
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <img 
                     src={userRole === 'CLIENT' ? activeJob.provider?.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                     className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-md ${isUrgent ? 'border-red-500' : 'border-white'}`}
                   />
                   <div className={`absolute -bottom-1 -right-1 text-white p-1 rounded-full border-2 border-white ${isUrgent ? 'bg-red-600' : 'bg-brand-green'}`}>
                      <ShieldCheck size={12} />
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 text-lg">
                      {userRole === 'CLIENT' ? activeJob.provider?.name : activeJob.clientName}
                   </h3>
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-brand-yellow-dark font-bold">
                         ★ {userRole === 'CLIENT' ? activeJob.provider?.rating : t('dashboard.verified')}
                      </span>
                      {activeJob.status === 'accepted' && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                              {eta} min
                          </span>
                      )}
                   </div>
                </div>
             </div>
             
             <div className="flex gap-2">
                <button 
                    onClick={handleCall}
                    className="w-12 h-12 bg-green-50 text-green-600 rounded-full border border-green-100 hover:bg-green-100 transition-colors flex items-center justify-center shadow-sm"
                >
                   <Phone size={22} />
                </button>
                <button 
                    onClick={handleMessage}
                    className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center shadow-sm"
                >
                   <MessageSquare size={22} />
                </button>
             </div>
          </div>

          {/* Status Actions */}
          <div className="space-y-3">
             {userRole === 'MAALEM' ? (
                <>
                   {activeJob.status === 'accepted' && (
                      <button 
                        onClick={() => updateJobStatus('arrived')}
                        className="w-full py-4 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 text-lg hover:bg-green-700 transition-all"
                      >
                         <MapPin size={24} /> {t('job.arrived')}
                      </button>
                   )}
                   {activeJob.status === 'arrived' && (
                      <button 
                        onClick={() => updateJobStatus('working')}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                         <Zap size={20} /> {t('job.start_work')}
                      </button>
                   )}
                   {activeJob.status === 'working' && (
                      <button 
                        onClick={() => setShowCompletion(true)}
                        className="w-full py-4 bg-brand-green text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                         <CheckCircle2 size={20} /> {t('job.complete')}
                      </button>
                   )}
                </>
             ) : (
                // Client View Actions
                <>
                    <div className={`p-4 rounded-xl border text-center ${isUrgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-sm font-bold mb-1 ${isUrgent ? 'text-red-800' : 'text-slate-700'}`}>
                            {activeJob.status === 'working' ? t('job.working') : t('job.driver_way')}
                        </p>
                        <p className={`text-xs ${isUrgent ? 'text-red-600' : 'text-slate-500'}`}>
                            {activeJob.status === 'working' ? t('job.ensure_safe') : `${t('job.estimated_arrival')}: ${eta} min.`}
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowDispute(true)}
                        className="w-full py-3 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <AlertOctagon size={16} /> {t('job.report')}
                    </button>
                </>
             )}
             
             {activeJob.status !== 'working' && userRole === 'MAALEM' && (
               <button onClick={cancelJob} className="w-full py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors">
                  {t('job.cancel')}
               </button>
             )}
          </div>
       </div>

       {/* Completion Modal */}
       {showCompletion && (
          <JobCompletionModal 
             onClose={() => {
                setShowCompletion(false);
                updateJobStatus('idle'); // Clear job
             }}
             jobData={{
                id: activeJob.id,
                role: userRole === 'MAALEM' ? 'provider' : 'client',
                amount: activeJob.price,
                partnerName: userRole === 'MAALEM' ? activeJob.clientName : activeJob.provider?.name || 'Partner'
             }}
          />
       )}

       {/* DISPUTE MODAL */}
       {showDispute && (
           <DisputeModal 
              onClose={() => setShowDispute(false)}
              jobTitle={activeJob.serviceType}
              partnerName={activeJob.provider?.name || "Provider"}
              onSubmit={(data) => {
                  setShowDispute(false);
                  raiseDispute(activeJob.id, data.reason, data.details);
              }}
           />
       )}
    </div>
  );
};

export default ActiveJobView;
