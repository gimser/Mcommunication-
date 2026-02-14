
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageCode = 'en' | 'ar' | 'fr' | 'es';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<LanguageCode, Record<string, string>> = {
  ar: {
    // Branding
    'app.name': 'Mcommunication 3.0',
    'app.tagline': 'هوية رقمية للشباب',

    // Auth & Hero Side
    'auth.future_identity': 'مستقبل الهوية الوطنية',
    'auth.identity_system': 'نظام التحقق من الهوية الحقيقي. يتطلب بيانات اعتماد صالحة للوصول.',
    'auth.system_status': 'حالة النظام',
    'auth.identity_core': 'الواجهة المركزية',
    'auth.online': 'متصل',
    'auth.login_google': 'دخول عبر Google',
    'auth.signup_client': 'تسجيل حساب زبون',
    'auth.register_maalem': 'تسجيل كـ "معلم" (حرفي)',
    'auth.register_maalem_desc': 'ابني هويتك الرقمية وابحث عن فرص عمل.',
    
    // Pro Onboarding Steps
    'onboarding.step1_title': 'لنبدا بالاساسيات',
    'onboarding.step1_desc': 'هذه المعلومات تنشئ حسابك المهني الآمن.',
    'onboarding.full_name': 'الاسم الكامل (كما في البطاقة الوطنية)',
    'onboarding.phone_placeholder': '06 00 00 00 00',
    'onboarding.step2_title': 'نطاق العمل الجغرافي',
    'onboarding.step2_desc': 'سنعرض ملفك للزبناء في هذه المناطق.',
    'onboarding.city': 'المدينة',
    'onboarding.neighborhood': 'الحي',
    'onboarding.neighborhood_placeholder': 'اختر الحي',
    'onboarding.address': 'العنوان التفصيلي',
    'onboarding.address_placeholder': 'مثال: زنقة 12 رقم 4...',
    'onboarding.step3_title': 'ما هي حرفتك؟',
    'onboarding.step3_desc': 'اختر تخصصك الرئيسي. يمكنك إضافة المزيد لاحقاً.',
    'onboarding.specializations': 'التخصصات الدقيقة',
    'onboarding.step4_title': 'توثيق الهوية',
    'onboarding.step4_desc': 'المعلمون الموثقون يحصلون على 3 أضعاف الطلبات. امسح بطاقتك الوطنية.',
    'onboarding.scan_id': 'مسح البطاقة الوطنية',
    'onboarding.front_side': 'الوجه الأمامي',
    'onboarding.back_side': 'الوجه الخلفي',
    'onboarding.capture': 'التقاط وتحقق',
    'onboarding.retake': 'إعادة المحاولة',
    'onboarding.privacy_note': 'بياناتك مشفرة وتعالج عبر السحابة السيادية. لا تتم مشاركتها مع أطراف ثالثة.',
    'onboarding.step5_title': 'خطوة أخيرة...',
    'onboarding.step5_desc': 'اعرض أفضل أعمالك لجذب الزبناء.',
    'onboarding.portfolio': 'صور الأعمال السابقة',
    'onboarding.add_photo': 'أضف صورة',
    'onboarding.finish': 'إنهاء وإطلاق',
    'onboarding.continue': 'متابعة',
    'onboarding.skip': 'تخطي التوثيق (حساب محدود)',
    'onboarding.mabrouk': 'مبروك!',
    'onboarding.now_maalem': 'أنت الآن معلم رسمي',
    'onboarding.active_status': 'هويتك الرقمية نشطة.',
    'onboarding.enter_market': 'دخول السوق',
    // ID Validation
    'id.analyzing': 'جاري تحليل الصورة...',
    'id.detecting_face': 'التعرف على الوجه البيومتري...',
    'id.reading_text': 'قراءة البيانات النصية...',
    'id.checking_hologram': 'التحقق من العلامة المائية...',
    'id.success': 'تم التحقق بنجاح',
    'id.error_blur': 'الصورة غير واضحة. يرجى الثبات.',
    'id.detecting_mrz': 'قراءة الرمز الرقمي (MRZ)...',
    'id.error_not_cnie': 'مرفوض: هذه ليست بطاقة وطنية مغربية (CNIE).',
    'id.error_fake': 'تنبيه: تم اكتشاف نسخة مصورة. المرجو استعمال البطاقة الأصلية.',
    'id.error_mrz_missing': 'فشل القراءة: الرمز الشريطي الخلفي غير صالح.',
    'id.retry_instruction': 'ضع البطاقة داخل الإطار بالضبط.',

    // Trades
    'trade.carpenter': 'نجار',
    'trade.electrician': 'كهربائي',
    'trade.plumber': 'رصاص (بلومبي)',
    'trade.painter': 'صباغ',
    'trade.mason': 'بناي',
    'trade.welder': 'سودور',
    'trade.mechanic': 'ميكانيكي سيارات',
    'trade.ac': 'تكييف وتبريد',
    'trade.satellite': 'تركيب صحون (بارابول)',
    'trade.gardener': 'بستاني (جارديني)',
    'trade.upholsterer': 'طابيسيي (تنجيد)',
    'trade.aluminum': 'ألومنيوم و PVC',
    'trade.housekeeper': 'تنظيف منزلي',
    'trade.barber': 'حلاق',
    'trade.tailor': 'خياط',
    'trade.drywall': 'جبص (جباس)',
    'trade.glass': 'زجاج',
    'trade.locksmith': 'صانع أقفال (ساروت)',
    'trade.mover': 'نقل بضائع (رحيل)',
    'trade.appliance_repair': 'إصلاح أجهزة منزلية',
    'trade.tiler': 'زلايجي',
    // New Trades
    'trade.programmer': 'مطور برمجيات / مبرمج',
    'trade.pc_repair': 'صيانة حواسيب (Informatique)',
    'trade.security_systems': 'كاميرات مراقبة وإنذار',
    'trade.phone_repair': 'إصلاح هواتف',
    'trade.graphic_design': 'تصميم جرافيك وطباعة',
    'trade.tutor': 'دروس دعم (Soutien)',
    'trade.caterer': 'ممون حفلات (Traiteur)',
    'trade.photographer': 'مصور (Photographe)',
    'trade.auto_elec': 'كهرباء السيارات',
    'trade.bodywork': 'طولي (Carrosserie)',
    'trade.waterproofing': 'عازل (Etanchéité)',

    // Navigation Sidebar
    'sidebar.dashboard': 'لوحة القيادة',
    'sidebar.market': 'سوق العمل',
    'sidebar.live': 'بث مباشر (تشخيص)',
    'sidebar.my_requests': 'طلباتي',
    'sidebar.watch': 'فيديوهات (حرف)',
    'sidebar.reputation': 'السمعة المهنية',
    'sidebar.growing': 'في تصاعد',
    'sidebar.professional_space': 'فضاء المهنيين',
    'sidebar.client_space': 'فضاء الزبناء',
    'nav.home': 'الرئيسية',
    'nav.vision': 'الرؤية',
    'nav.services': 'الخدمات',
    'nav.community': 'المجتمع',
    'nav.explore': 'ابحث عن معلم',
    'nav.reels': 'أعمال',
    'nav.jobs': 'فرص العمل',
    'nav.live': 'مباشر',
    'nav.messages': 'الرسائل',
    'nav.notifications': 'الإشعارات',
    'nav.profile': 'الملف الشخصي',
    'nav.system': 'النظام',
    'nav.logout': 'خروج',
    'nav.login_id': 'دخول بالهوية الرقمية',

    // Dashboard (Maalem)
    'dashboard.welcome': 'السلام عليكم،',
    'dashboard.manage': 'تتبع سمعتك وأرباحك اليومية.',
    'dashboard.online': 'متصل',
    'dashboard.offline': 'غير متصل',
    'dashboard.houta_start': 'ابدأ "همزة"',
    'dashboard.houta_active': 'الهمزة مفعلة (-20%)',
    'dashboard.store': 'المتجر',
    'dashboard.career': 'المسار المهني',
    'dashboard.beginner': 'مبتدئ',
    'dashboard.verified': 'موثق',
    'dashboard.elite': 'خبير (نخبة)',
    'dashboard.karne_score': 'نقط الكناش',
    'dashboard.market_value': 'قيمة السوق',
    'dashboard.per_day': 'لليوم / للزيارة',
    'dashboard.access': 'مستوى الولوج',
    'dashboard.available_jobs': 'الفرص المتاحة (محاكاة)',
    'dashboard.accept_job': 'قبل الخدمة',
    'dashboard.ignore': 'تجاهل',
    'dashboard.locked': 'مغلق (نخبة)',
    'dashboard.academy': 'أكاديمية المعلم',
    'dashboard.visit_academy': 'زور الأكاديمية',
    'dashboard.corporate_locked': 'خاص بالشركات',

    // Profile
    'profile.work_gallery': 'معرض الصور',
    'profile.services': 'الخدمات',
    'profile.edit': 'تعديل الملف',
    'profile.book_now': 'احجز الآن',
    'profile.call': 'اتصال',
    'profile.message': 'رسالة',
    'profile.client_view': 'رؤية الزبون',
    'profile.owner_view': 'رؤية المالك',
    'profile.add_photo': 'أضف صورة عمل',
    'profile.add_service': 'أضف خدمة جديدة',
    'profile.verified_id': 'هوية موثقة',
    'profile.top_maalem': 'أفضل معلم',

    // Active Job
    'job.arrived': 'وصلت للمكان',
    'job.start_work': 'بدء العمل (الورش)',
    'job.complete': 'إنهاء المهمة',
    'job.cancel': 'إلغاء الطلب',
    'job.report': 'إبلاغ عن مشكل',
    'job.waiting': 'في الانتظار',
    'job.working': 'العمل جاري',
    'job.driver_way': 'المعلم في الطريق',
    'job.ensure_safe': 'المرجو تأمين مكان العمل.',
    'job.estimated_arrival': 'الوصول المتوقع',
    'job.arrived_status': 'وصل إلى الموقع',
    'job.work_in_progress': 'العمل قيد الإنجاز',

    // Market & Jobs (Extensive)
    'market.title': 'سوق العمل',
    'market.opportunities': 'فرص',
    'market.active_requests': 'طلباتي النشطة',
    'market.budget': 'الميزانية',
    'market.urgent': 'عاجل',
    'market.elite_mode': 'تاج النخبة مفعل 👑',
    'market.basic_mode': 'الوضع العادي (اضغط للترقية)',
    'market.locked_desc': 'مغلق • يتطلب رتبة نخبة',
    'market.place_bid': 'دفع عرض',
    'market.quick_accept': 'قبول فوري',
    'market.send_offer': 'إرسال عرض',
    'market.no_requests': 'لا توجد طلبات نشطة حالياً.',
    'market.waiting_selection': 'في انتظار الاختيار...',
    'market.offers_received': 'عروض',
    'market.auto_matching': 'مطابقة تلقائية...',
    'market.l3ar_broadcast': 'نشرة للعار',
    'market.live_broadcast': 'نشرة مباشرة',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.desc': 'تفضيلات الحساب',
    'settings.account': 'الحساب',
    'settings.preferences': 'المظهر',
    'settings.id': 'حالة الهوية',
    'settings.verified': 'موثق',
    'settings.passwordSecurity': 'الأمان وكلمة المرور',
    'settings.lang': 'اللغة',
    'settings.darkMode': 'الوضع الليلي',
    'settings.notifications': 'الإشعارات',
    'settings.help': 'المساعدة',
    'settings.support': 'الدعم',
    'settings.helpCenter': 'مركز المساعدة',
    'settings.idStatus': 'حالة الهوية',
    'settings.officialPlatform': 'المنصة الرسمية',
    'settings.changePassword': 'تغيير كلمة المرور',
    'settings.currentPassword': 'كلمة المرور الحالية',
    'settings.newPassword': 'كلمة المرور الجديدة',
    'settings.updatePassword': 'تحديث',
    'settings.languageRegion': 'اللغة والمنطقة',

    // Feed
    'feed.whatsHappening': 'شنو طاري اليوم؟',
    'feed.trending': 'الرائج (راس الحانوت)',
    'feed.suggested': 'مقترح لك',
    'greeting.morning': 'صباح الخير',
    'greeting.welcome': 'مرحباً',
    'greeting.evening': 'مساء الخير',

    // Chat
    'chat.title': 'المحادثات',
    'chat.search': 'بحث في الرسائل...',

    // Client Home
    'home.search_placeholder': 'فاش محتاج المساعدة اليوم؟',
    'home.search_btn': 'بحث',
    'home.hero_title_1': 'اعثر على',
    'home.hero_title_2': 'معلم محترف',
    'home.hero_title_3': 'لإصلاح منزلك.',
    'home.houta_title': 'همزة (عرض محدود)',
    'home.houta_desc': 'سالي بكري وقريب ليك. متاح دابا.',
    'home.grab_deal': 'خطف الهمزة',
    'home.expires': 'ينتهي خلال',
    'home.emergency_title': 'واش "للعار"؟ (طوارئ)',
    'home.emergency_desc': 'مشكل فالضو، الما، أو الساروت؟ المعلم يجيك فقل من 30 دقيقة.',
    'home.request_urgent': 'طلب استغاثة عاجل',
    'home.services_title': 'الخدمات',
    'home.view_all': 'شوف كلشي',
    'home.top_rated': 'الأكثر طلباً',

    // Categories
    'cat.all': 'الكل',
    'cat.elec': 'كهرباء',
    'cat.plumb': 'رصاص (بلومبي)',
    'cat.mason': 'بناء',
    'cat.paint': 'صباغة',
    'cat.appliance': 'إصلاح أجهزة',
    'cat.carpenter': 'نجارة',

    // Auth
    'auth.welcome': 'مرحباً بك',
    'auth.createAccount': 'إنشاء حساب',
    'auth.loginDesc': 'الولوج لهويتك الرقمية.',
    'auth.registerDesc': 'انضم للشبكة الوطنية.',
    'auth.signUp': 'تسجيل جديد',
    'auth.signIn': 'تسجيل الدخول',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.fullName': 'الاسم الكامل',
    'auth.noAccount': "مازال ماعندك حساب؟",
    'auth.hasAccount': "عندك حساب ديجا؟",
    'auth.or': 'أو',

    // Hero
    'hero.badge': 'مبادرة حكومية رسمية',
    'hero.title_1': 'تمكين',
    'hero.title_2': 'هوية الجيل القادم',
    'hero.subtitle': 'منصة رقمية سيادية تربط ابتكارات الشباب بالمصداقية المؤسساتية.',
    'hero.join': 'انضم للمنصة',
    'hero.verify': 'تحقق من الهوية',
    'hero.stat_secure': 'بيانات آمنة',
    'hero.stat_access': 'ولوج حكومي',
    'hero.stat_users': 'مقاول',
    'hero.stat_web3': 'ويب 3.0',

    // Local
    'local.rasderb': 'راس الدرب (أخبار الحي)',
    'local.l3ar': 'للعار (نداء عاجل)',
    'local.tbarkallah': 'تبارك الله',
    'local.hchouma': 'حشومة (إبلاغ)',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.loading': 'تحميل...',
    
    // Trust
    'trust.nudge_title': 'متردد؟',
    'trust.nudge_body': 'أغلب الجيران اختاروا هذا المعلم.',
    'trust.insight': 'نصيحة النظام: خيار آمن.',
  },
  en: {
    // English Fallbacks
    'app.name': 'Mcommunication 3.0',
    'id.analyzing': 'Analyzing Image...',
    'id.detecting_face': 'Biometric Face Detection...',
    'id.reading_text': 'Extracting Text Data...',
    'id.checking_hologram': 'Verifying Hologram...',
    'id.success': 'Verification Successful',
    'id.error_blur': 'Image too blurry. Please hold still.',
    'id.detecting_mrz': 'Reading MRZ Code...',
    'id.error_not_cnie': 'REJECTED: Not a valid Moroccan CNIE.',
    'id.error_fake': 'WARNING: Copy detected. Original ID required.',
    'id.error_mrz_missing': 'Scan Failed: Back barcode invalid.',
    'id.retry_instruction': 'Align ID exactly within the frame.',
    'trade.programmer': 'Programmer / Developer',
    'trade.pc_repair': 'PC Maintenance',
    'trade.security_systems': 'CCTV & Alarms',
    'trade.phone_repair': 'Phone Repair',
    'trade.graphic_design': 'Graphic Design',
    'trade.tutor': 'Tutor',
    'trade.caterer': 'Caterer',
    'trade.photographer': 'Photographer',
    'trade.auto_elec': 'Auto Electrician',
    'trade.bodywork': 'Car Bodywork',
    'trade.waterproofing': 'Waterproofing',
    'onboarding.step1_title': "Let's start with the basics",
    // ... existing English keys ...
  },
  fr: {
    'app.name': 'Mcommunication 3.0',
    'trade.programmer': 'Programmeur / Développeur',
    // ...
  },
  es: {
    'app.name': 'Mcommunication 3.0',
    // ...
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('ar'); 

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string): string => {
    // Basic fallback to English if key missing in current lang
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
