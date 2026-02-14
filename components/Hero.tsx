
import React from 'react';
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" dir={dir}>
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-brand-green"></span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('hero.badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
            {t('hero.title_1')} <br />
            <span className="text-gradient">{t('hero.title_2')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-brand text-white font-semibold text-lg shadow-lg shadow-brand-green/25 hover:shadow-brand-green/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
              {t('hero.join')}
              <ArrowRight className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <ShieldCheck size={20} className="text-brand-green" />
              {t('hero.verify')}
            </button>
          </div>

          {/* Stats/Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-500 font-medium">{t('hero.stat_secure')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500 font-medium">{t('hero.stat_access')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-slate-900">50k+</p>
              <p className="text-sm text-slate-500 font-medium">{t('hero.stat_users')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-slate-900">3.0</p>
              <p className="text-sm text-slate-500 font-medium">{t('hero.stat_web3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
