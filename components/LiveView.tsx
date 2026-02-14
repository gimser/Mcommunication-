
import React, { useState, useEffect } from 'react';
import { X, Heart, Send, Eye, UserPlus, MoreVertical, ThumbsUp, MinusCircle } from 'lucide-react';

const LiveView: React.FC = () => {
  const [comments, setComments] = useState<{id: number, user: string, text: string}[]>([]);
  const [isEnded, setIsEnded] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    // Logic removed to simulate empty state initially
    // Simulate end of stream after 15 seconds for demo
    const endTimeout = setTimeout(() => {
        setIsEnded(true);
    }, 15000);

    return () => {
        clearTimeout(endTimeout);
    };
  }, []);

  const handleFeedback = (type: 'positive' | 'neutral') => {
      setFeedbackSent(true);
      // Logic to send feedback to backend
  };

  if (isEnded) {
      return (
        <div className="bg-slate-900 relative h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] w-full md:rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            {!feedbackSent ? (
                <div className="max-w-xs animate-fade-in-up">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Session Ended</h2>
                    <p className="text-slate-400 text-sm mb-8">This conversation has concluded.</p>
                    
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                        <p className="text-white font-bold mb-6">Was this useful?</p>
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => handleFeedback('positive')}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center group-hover:bg-brand-green transition-colors">
                                    <ThumbsUp size={28} className="text-brand-green group-hover:text-white" />
                                </div>
                                <span className="text-xs text-brand-green font-bold">Yes</span>
                            </button>
                            <button 
                                onClick={() => handleFeedback('neutral')}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                                    <MinusCircle size={28} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <span className="text-xs text-slate-400 font-bold">Neutral</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                        <ThumbsUp size={40} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Thanks for your feedback</h3>
                    <p className="text-slate-400 text-sm">We'll use this to improve future recommendations.</p>
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="bg-black relative h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] w-full md:rounded-2xl overflow-hidden shadow-2xl">
      {/* Background Video Simulation */}
      <img 
        src="https://images.unsplash.com/photo-1577724330889-b5f6b21616c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Live Stream"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-3 py-1 rounded-md text-white font-bold text-xs animate-pulse">
            LIVE
          </div>
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs">
            <Eye size={14} />
            <span>0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
             <img src="https://via.placeholder.com/50" className="w-6 h-6 rounded-full" />
             <span className="text-white text-xs font-bold">Guest User</span>
             <button className="bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
               <UserPlus size={10} /> Follow
             </button>
           </div>
           <button className="text-white/80 hover:text-white"><MoreVertical size={24} /></button>
           <button className="text-white/80 hover:text-white"><X size={24} /></button>
        </div>
      </div>

      {/* Bottom Area: Comments and Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Chat Area */}
        <div className="h-40 overflow-hidden flex flex-col justify-end mb-4 mask-image-gradient">
          {comments.map((c) => (
            <div key={c.id} className="mb-2 animate-fade-in-up">
              <span className="font-bold text-white/90 text-sm">{c.user}</span>
              <span className="text-white/80 text-sm ml-2">{c.text}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Say something..." 
            className="flex-grow bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-white/50 placeholder-white/50"
          />
          <button className="bg-brand-blue p-3 rounded-full text-white shadow-lg shadow-brand-blue/40 transform active:scale-95 transition-transform">
            <Send size={20} />
          </button>
          <button className="bg-red-500 p-3 rounded-full text-white shadow-lg shadow-red-500/40 transform active:scale-95 transition-transform">
             <Heart size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
