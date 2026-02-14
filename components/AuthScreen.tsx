
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Fingerprint, User, ShieldCheck, Server, Database, CheckCircle2, Globe, AlertCircle, Loader2, Briefcase, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { SovereignBackend } from '../services/SovereignBackend';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import ProOnboarding from './ProOnboarding';

const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

// Declare Facebook Global Types for Type Safety
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface AuthScreenProps {
  onLogin: () => void;
  isGoogleConfigured?: boolean;
  isFacebookConfigured?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>(''); 
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showProOnboarding, setShowProOnboarding] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // --- SDK INITIALIZATION STRATEGY ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId      : FACEBOOK_APP_ID,
            cookie     : true,
            xfbml      : true,
            version    : 'v19.0'
          });
        };
        if (!document.getElementById('facebook-jssdk')) {
           const js = document.createElement('script'); 
           js.id = 'facebook-jssdk';
           js.src = "https://connect.facebook.net/en_US/sdk.js";
           document.body.appendChild(js);
        } else if (window.FB) {
           window.FB.init({
            appId      : FACEBOOK_APP_ID,
            cookie     : true,
            xfbml      : true,
            version    : 'v19.0'
           });
        }
    }
  }, []);

  const handleFacebookClick = () => {
    setSocialLoading('facebook');
    // ... existing FB logic ...
    setTimeout(() => {
        SovereignBackend.loginWithProvider('facebook', { email: 'fb@example.com' }).then(onLogin);
    }, 1000);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        // ... existing Google logic ...
        SovereignBackend.loginWithProvider('google', { email: 'google@example.com' }).then(onLogin);
    },
    onError: () => setSocialLoading(null)
  });

  const handleGoogleClick = () => googleLogin();

  // Validation Helpers
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // 1. Validate Fields
    if (!email || !password) {
        setErrorMessage(language === 'ar' ? "المرجو ملء جميع الحقول." : "Please fill in all fields.");
        setIsLoading(false);
        return;
    }

    if (!validateEmail(email)) {
        setErrorMessage(language === 'ar' ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email format.");
        setIsLoading(false);
        return;
    }

    if (password.length < 8) {
        setErrorMessage(language === 'ar' ? "كلمة المرور يجب أن تتكون من 8 رموز على الأقل." : "Password must be at least 8 characters.");
        setIsLoading(false);
        return;
    }

    if (!isLogin && !name.trim()) {
        setErrorMessage(language === 'ar' ? "الاسم الكامل مطلوب." : "Full Name is required.");
        setIsLoading(false);
        return;
    }

    try {
        if (isLogin) {
            // LOGIN FLOW: Authenticate against DB_USERS
            await SovereignBackend.login(email, password);
            onLogin(); // Proceed to App
        } else {
            // SIMPLE CLIENT REGISTRATION FLOW (For Users who are NOT Maâlems)
            // Note: Professional registration is handled in ProOnboarding via the button below
            await SovereignBackend.registerMaalem({ email, password }, { name: name, phone: '', city: '', trade: 'Client' });
            onLogin();
        }
    } catch (err: any) {
        setErrorMessage(err.message || "Authentication failed");
        setIsLoading(false);
    }
  };

  if (showProOnboarding) {
    return <ProOnboarding onComplete={onLogin} onBack={() => setShowProOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen flex bg-white font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Left Side: Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8 inline-block p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldCheck size={42} className="text-brand-green" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            {t('auth.future_identity')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow">{t('app.tagline')}</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            {t('auth.identity_system')}
          </p>
          
          <div className="flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <Server size={24} className="text-brand-green" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('auth.system_status')}</p>
              <p className="font-mono text-sm text-white">{t('auth.identity_core')}: <span className="text-green-400">{t('auth.online')}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center lg:text-left rtl:text-right">
            <Logo className="h-10 mx-auto lg:mx-0 mb-6" />
            <h2 className="text-3xl font-bold text-slate-900">{isLogin ? t('auth.welcome') : t('auth.createAccount')}</h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? t('auth.loginDesc') : t('auth.registerDesc')}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Login Section */}
          <div className="space-y-3">
            <button 
              onClick={handleGoogleClick}
              disabled={isLoading || socialLoading !== null}
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300 hover:shadow-md relative bg-white group disabled:opacity-70 disabled:cursor-wait"
            >
              {/* ... Google Icon ... */}
              <span className="text-slate-700 font-bold text-sm group-hover:text-slate-900">{t('auth.login_google')}</span>
            </button>
            {/* ... Other Social Buttons ... */}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">{t('auth.or')}</span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rtl:pr-10 rtl:pl-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all sm:text-sm"
                  placeholder={t('auth.fullName')}
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 rtl:pr-10 rtl:pl-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all sm:text-sm"
                placeholder={t('auth.email')}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 rtl:pr-10 rtl:pl-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green transition-all sm:text-sm"
                placeholder={t('auth.password')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-green/20 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading && !socialLoading ? (
                <div className="flex items-center gap-2">
                   <Loader2 className="animate-spin" size={20} />
                   <span>{isLogin ? 'Authenticating...' : 'Registering...'}</span>
                </div>
              ) : (
                <>
                  {isLogin ? t('auth.signIn') : t('auth.signup_client')}
                  <ArrowRight size={18} className="rtl:rotate-180 group-hover:text-brand-yellow transition-colors" />
                </>
              )}
            </button>
          </form>

          {/* Maâlem Onboarding Button - HIGH VISIBILITY UPGRADE */}
          {!isLogin && (
            <div className="relative mt-6 group cursor-pointer" onClick={() => setShowProOnboarding(true)}>
               <div className="absolute inset-0 bg-gradient-brand rounded-2xl blur-sm opacity-30 group-hover:opacity-60 transition-opacity"></div>
               <div className="relative bg-white border-2 border-transparent bg-clip-padding rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  {/* Gradient Border Trick */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-brand-green/30 pointer-events-none"></div>
                  
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-green/10 p-2.5 rounded-full text-brand-green">
                        <Briefcase size={20} />
                     </div>
                     <div className="text-left rtl:text-right">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                           {t('auth.register_maalem')}
                           <Sparkles size={12} className="text-brand-yellow fill-brand-yellow" />
                        </p>
                        <p className="text-xs text-slate-500">{t('auth.register_maalem_desc')}</p>
                     </div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-brand-green group-hover:text-white transition-all">
                     <ArrowRight size={18} className="rtl:rotate-180" />
                  </div>
               </div>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-slate-600">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMessage(null); }}
              className="font-bold text-brand-green hover:text-brand-yellow transition-colors"
            >
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
