import React from 'react';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo className="h-10" />
            <p className="text-slate-500 text-sm leading-relaxed mt-4">
              The official national platform fostering digital innovation, youth empowerment, and secure communication.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-green transition-colors">Digital ID</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">Services Catalog</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">Open Data</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Legal/Gov */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Governance</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-brand-green transition-colors">Ministry Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-blue" />
                <span>support@mcom30.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-blue" />
                <span>1900-DIGITAL</span>
              </li>
              <li className="text-xs text-slate-400 mt-2">
                Available Mon-Fri, 09:00 - 17:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Mcommunication 3.0. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <span>Government Official Portal</span>
             <span className="h-3 w-px bg-slate-300"></span>
             <span>Powered by National Tech Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;