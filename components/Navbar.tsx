
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, Globe, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#' },
    { name: t('nav.vision'), href: '#vision' },
    { name: t('nav.services'), href: '#features' },
    { name: t('nav.community'), href: '#audience' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <Logo className="h-10 md:h-12" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-slate-600 hover:text-brand-green font-medium transition-colors text-sm uppercase tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <button className="text-slate-500 hover:text-slate-800 transition-colors">
            <Globe size={20} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
            <User size={16} />
            <span>{t('nav.login_id')}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl p-6 flex flex-col space-y-4 animate-slide-up">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-slate-800 font-semibold text-lg py-2 border-b border-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
             <button className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white font-medium">
              <User size={18} />
              <span>{t('nav.login_id')}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
