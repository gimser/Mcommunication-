
import React, { useState } from 'react';
import { X, ShoppingBag, CreditCard, CheckCircle2, Lock, Percent, TrendingUp, Zap, Truck, ShieldCheck, Star } from 'lucide-react';

interface ProShopModalProps {
  onClose: () => void;
  rank: 'beginner' | 'elite';
}

const PRODUCTS = [
  {
    id: 1,
    name: "Bosch Professional Drill 18V",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80",
    price: 2500,
    category: "Tools"
  },
  {
    id: 2,
    name: "Safety Helmet & Vest Kit",
    image: "https://images.unsplash.com/photo-1543169109-72c0d293d6b1?w=400&q=80",
    price: 450,
    category: "Safety"
  },
  {
    id: 3,
    name: "Heavy Duty Ladder (5m)",
    image: "https://images.unsplash.com/photo-1533722247926-24e0736e3c04?w=400&q=80",
    price: 1200,
    category: "Equipment"
  }
];

const ProShopModal: React.FC<ProShopModalProps> = ({ onClose, rank }) => {
  const isElite = rank === 'elite';
  const creditLimit = isElite ? 15000 : 0;

  return (
    <div className="fixed inset-0 z-[180] flex items-end md:items-center justify-center bg-slate-900/90 backdrop-blur-md animate-fade-in p-0 md:p-4">
      <div className="bg-slate-50 w-full h-[95vh] md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sticky top-0 z-20">
           <div className="flex justify-between items-start mb-4">
              <div>
                 <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                    <ShoppingBag className="text-brand-green" /> Maâlem Store
                 </h2>
                 <p className="text-slate-400 text-sm">Official Equipment Partner</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                 <X size={20} />
              </button>
           </div>

           {/* Credit Limit Badge */}
           <div className={`p-4 rounded-xl border flex items-center justify-between ${isElite ? 'bg-gradient-to-r from-brand-green/20 to-brand-green/10 border-brand-green/30' : 'bg-slate-800 border-slate-700'}`}>
              <div className="flex items-center gap-3">
                 <div className={`p-2.5 rounded-full ${isElite ? 'bg-brand-green text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <CreditCard size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Financing Limit (Taqsit)</p>
                    <p className={`text-xl font-mono font-bold ${isElite ? 'text-white' : 'text-slate-500'}`}>
                       {isElite ? `${creditLimit} MAD` : 'LOCKED'}
                    </p>
                 </div>
              </div>
              {!isElite && (
                 <div className="text-right">
                    <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                       Low Trust Score
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Complete jobs to unlock.</p>
                 </div>
              )}
              {isElite && (
                 <div className="text-right">
                    <span className="text-[10px] font-bold text-brand-green bg-brand-green/20 px-2 py-1 rounded border border-brand-green/30 flex items-center gap-1 justify-end">
                       <CheckCircle2 size={10} /> Active
                    </span>
                    <p className="text-[10px] text-slate-300 mt-1">0% Interest Available</p>
                 </div>
              )}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
           
           {/* Banner */}
           <div className="mb-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 text-slate-900 relative overflow-hidden shadow-lg">
              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                 <Zap size={150} />
              </div>
              <div className="relative z-10">
                 <h3 className="font-bold text-2xl mb-1">Ramadan Season Deals</h3>
                 <p className="font-medium opacity-90 mb-4">Up to 40% off for Top Maâlems on Dewalt & Bosch.</p>
                 <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Browse Deals
                 </button>
              </div>
           </div>

           {/* Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRODUCTS.map(product => {
                 const discountPrice = Math.floor(product.price * 0.85); // 15% off for elite
                 const monthlyPayment = Math.floor(discountPrice / 3);

                 return (
                    <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
                       <div className="aspect-[4/3] bg-slate-100 relative">
                          <img src={product.image} className="w-full h-full object-cover mix-blend-multiply" alt={product.name} />
                          {isElite && (
                             <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                <Percent size={12} />
                                <span>-15% PRO</span>
                             </div>
                          )}
                       </div>
                       
                       <div className="p-4 flex-1 flex flex-col">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{product.category}</div>
                          <h4 className="font-bold text-slate-900 text-lg mb-4 leading-tight">{product.name}</h4>
                          
                          <div className="mt-auto space-y-3">
                             {/* Pricing Logic */}
                             <div className="flex justify-between items-end">
                                <div>
                                   <p className="text-xs text-slate-500 mb-0.5">Price</p>
                                   <div className="flex items-baseline gap-2">
                                      <span className={`font-bold text-xl ${isElite ? 'text-green-600' : 'text-slate-900'}`}>
                                         {isElite ? discountPrice : product.price} <span className="text-xs">MAD</span>
                                      </span>
                                      {isElite && (
                                         <span className="text-xs text-slate-400 line-through decoration-slate-400/50">
                                            {product.price}
                                         </span>
                                      )}
                                   </div>
                                </div>
                             </div>

                             {/* Financing Logic */}
                             <div className={`p-3 rounded-xl border ${isElite ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-dashed border-slate-300 opacity-70'}`}>
                                <div className="flex items-center justify-between mb-1">
                                   <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                      <CreditCard size={12} /> 3x Installments
                                   </span>
                                   {!isElite && <Lock size={12} className="text-slate-400" />}
                                </div>
                                {isElite ? (
                                   <div className="text-sm font-bold text-slate-900">
                                      {monthlyPayment} MAD <span className="text-xs font-normal text-slate-500">/ month</span>
                                   </div>
                                ) : (
                                   <div className="text-xs text-slate-400 italic">
                                      Requires Top Maâlem Rank
                                   </div>
                                )}
                             </div>

                             <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                                <ShoppingBag size={18} />
                                <span>Add to Cart</span>
                             </button>
                          </div>
                       </div>
                    </div>
                 );
              })}
           </div>

        </div>
        
        {/* Footer info */}
        <div className="bg-white border-t border-slate-200 p-4 text-center">
           <div className="inline-flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><ShieldCheck size={12} /> Official Warranty</span>
              <span className="flex items-center gap-1"><Truck size={12} /> Free Delivery</span>
              <span className="flex items-center gap-1"><Star size={12} /> Pro Support</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProShopModal;
