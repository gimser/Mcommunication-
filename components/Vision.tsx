import React from 'react';

const Vision: React.FC = () => {
  return (
    <section id="vision" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Using a placeholder that represents tech/connection/people */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Young professionals collaborating" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                  <p className="text-white font-medium">"Bridging the gap between state institutions and the digital generation."</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl"></div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-3">Our Vision</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Institutional Trust.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600">
                Youthful Innovation.
              </span>
            </h3>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Mcommunication 3.0 represents a paradigm shift in how national entities interact with the digital society. We are moving beyond traditional bureaucracy into a dynamic ecosystem where credibility meets creativity.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Sovereign Data Protection Standards",
                "Direct Channels to Decision Makers",
                "Digital Identity for the Web 3.0 Era"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <button className="text-brand-blue font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Read the Manifesto <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;