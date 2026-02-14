import React from 'react';

const Audience: React.FC = () => {
  return (
    <section id="audience" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-3">Community</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold">Built For The Makers</h3>
          </div>
          <div className="mt-6 md:mt-0">
             <p className="text-slate-400 max-w-md text-right md:text-left">
               Whether you are coding the next unicorn, leading a youth initiative, or digitizing your business.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-2xl font-bold font-display mb-2">Youth & Students</h4>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Access scholarships, internships, and digital literacy programs endorsed by the state.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Entrepreneurs" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-2xl font-bold font-display mb-2">Entrepreneurs</h4>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Streamlined business registration, tax incentives, and government grant applications.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Tech Leaders" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-2xl font-bold font-display mb-2">Tech Leaders</h4>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Collaborate on national digital infrastructure projects and policy formulation.
                </p>
              </div>
            </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-[2px] rounded-full bg-gradient-brand">
            <button className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
              Register Your Interest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;