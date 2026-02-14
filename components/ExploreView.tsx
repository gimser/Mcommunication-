
import React, { useState } from 'react';
import { Search, MapPin, Star, UserPlus, Briefcase, Lock, CheckCircle2, Filter, ChevronDown, Check, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Mock Data for Moroccan Professionals
const MOCK_PROS = [
  {
    id: 1,
    name: "Maâlem Hassan",
    trade: "Zellij & Tadelakt",
    city: "Casablanca",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&q=80",
    rating: 4.9,
    jobsDone: 124,
    isVerified: true,
    isConnected: false,
    previewImages: [
      "https://images.unsplash.com/photo-1596637508608-c300dc06927d?w=200&q=80",
      "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=200&q=80",
      "https://images.unsplash.com/photo-1620615307223-936b802bf204?w=200&q=80"
    ]
  },
  {
    id: 2,
    name: "Redouane Elec",
    trade: "Électricien (Dépannage)",
    city: "Rabat",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&w=200&q=80",
    rating: 4.7,
    jobsDone: 89,
    isVerified: true,
    isConnected: false,
    previewImages: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
      "https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=200&q=80",
      "https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?w=200&q=80"
    ]
  },
  {
    id: 3,
    name: "Atelier Fatima",
    trade: "Couture Traditionnelle",
    city: "Fes",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&w=200&q=80",
    rating: 5.0,
    jobsDone: 210,
    isVerified: true,
    isConnected: true, // Already connected example
    previewImages: [
      "https://images.unsplash.com/photo-1596901323326-77490f237ebc?w=200&q=80",
      "https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=200&q=80",
      "https://images.unsplash.com/photo-1575402072670-3490772740bc?w=200&q=80"
    ]
  },
  {
    id: 4,
    name: "Karim Plomberie",
    trade: "Plombier Chauffagiste",
    city: "Tangier",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&w=200&q=80",
    rating: 4.5,
    jobsDone: 45,
    isVerified: false,
    isConnected: false,
    previewImages: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=200&q=80",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=80",
      "https://images.unsplash.com/photo-1605117882932-f9e32b03ef3c?w=200&q=80"
    ]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Briefcase },
  { id: 'elec', label: 'Electrician', icon: Briefcase },
  { id: 'plomb', label: 'Plumber', icon: Briefcase },
  { id: 'mason', label: 'Mason', icon: Briefcase },
  { id: 'deco', label: 'Decoration', icon: Briefcase },
];

interface ExploreViewProps {
  onNavigateToProfile?: (user: any) => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onNavigateToProfile }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pros, setPros] = useState(MOCK_PROS);

  const handleConnect = (id: number) => {
    // Optimistic UI update
    setPros(prev => prev.map(pro => 
      pro.id === id ? { ...pro, isConnected: true } : pro
    ));
  };

  const handleViewProfile = (pro: any) => {
    if (onNavigateToProfile) {
        // Map Explore Data format to Profile Data format
        onNavigateToProfile({
            ...pro,
            title: pro.trade,
            location: pro.city,
            gallery: pro.previewImages,
            handle: `@${pro.name.replace(/\s+/g, '').toLowerCase()}`
        });
    }
  };

  const filteredPros = pros.filter(pro => 
    (activeCategory === 'all' || pro.trade.toLowerCase().includes(activeCategory)) &&
    (pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || pro.trade.toLowerCase().includes(searchTerm.toLowerCase()) || pro.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-b-3xl md:rounded-2xl border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-4">{t('nav.explore')}</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-400 rtl:right-3 rtl:left-auto" size={20} />
          <input 
            type="text" 
            placeholder={t('jobs.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
          />
          <button className="absolute right-3 top-3 text-slate-400 rtl:left-3 rtl:right-auto hover:text-slate-600">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPros.map((pro) => (
          <div key={pro.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            
            {/* Pro Header */}
            <div className="p-5 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden p-0.5 ${pro.isVerified ? 'bg-gradient-brand' : 'bg-slate-200'}`}>
                    <img src={pro.avatar} className="w-full h-full object-cover rounded-[10px] border border-white" alt={pro.name} />
                  </div>
                  {pro.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <CheckCircle2 size={16} className="text-brand-green fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1">
                    {pro.name}
                  </h3>
                  <p className="text-sm text-brand-green font-medium mb-1">{pro.trade}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {pro.city}
                    </span>
                    <span className="flex items-center gap-1 text-brand-yellow-dark">
                      <Star size={12} fill="currentColor" /> {pro.rating} ({pro.jobsDone})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Preview (Locked Logic) */}
            <div className="px-5 pb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {pro.isConnected ? "Recent Work" : "Locked Portfolio"}
              </p>
              
              <div className="grid grid-cols-3 gap-2 relative">
                {pro.previewImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden relative bg-slate-100">
                    <img 
                      src={img} 
                      className={`w-full h-full object-cover transition-all duration-500 ${!pro.isConnected ? 'blur-md opacity-80 scale-110' : ''}`} 
                      alt="Work" 
                    />
                  </div>
                ))}

                {/* Lock Overlay */}
                {!pro.isConnected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/30 backdrop-blur-[1px] rounded-lg border border-white/20">
                    <div className="bg-white p-3 rounded-full shadow-xl mb-2">
                      <Lock size={20} className="text-slate-900" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                      Connect to View
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-4 flex items-center justify-between">
               {pro.isConnected ? (
                 <button 
                    onClick={() => handleViewProfile(pro)}
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                 >
                   <Eye size={18} />
                   View Profile
                 </button>
               ) : (
                 <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => handleConnect(pro.id)}
                      className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                      <UserPlus size={18} />
                      Add to Network
                    </button>
                 </div>
               )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;
