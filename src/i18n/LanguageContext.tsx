import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FeatureTag,
  FunctionSupportLevel,
  GpuRequirementTier,
  LicenseCategory,
  LicenseType,
  MaintenanceStatus,
  ReplacementTier,
  SoftwareCategory,
} from '../types/software';

export type AppLanguage = 'ar' | 'en';

interface LanguageContextValue {
  lang: AppLanguage;
  dir: 'rtl' | 'ltr';
  isAr: boolean;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
  t: (arText: string, enText: string) => string;
  translateCategory: (catId: SoftwareCategory) => string;
  translateCategoryDesc: (catId: SoftwareCategory) => string;
  translateFeature: (feat: FeatureTag) => string;
  translateLicenseCategory: (lic: LicenseCategory) => string;
  translateLicenseType: (lic: LicenseType) => string;
  translateArabicSupport: (level: 'ممتاز' | 'جيد' | 'محدود') => string;
  translateReplacementTier: (tier: ReplacementTier) => string;
  translateFunctionStatus: (status: FunctionSupportLevel) => string;
  translateMaintenanceStatus: (status: MaintenanceStatus) => string;
  translateGpuTier: (tier: GpuRequirementTier) => string;
}

const LANG_STORAGE_KEY = 'badeelak_lang_v1';

const CATEGORY_TRANSLATIONS: Record<
  SoftwareCategory,
  { ar: string; en: string; descAr: string; descEn: string }
> = {
  'bim-engineering': {
    ar: 'الهندسة والـ BIM',
    en: 'Engineering & BIM',
    descAr: 'نمذجة معلومات المباني، الرسم الهندسي CAD، التنسيق، والتصميم الإنشائي والميكانيكي.',
    descEn: 'BIM authoring, 2D/3D CAD drafting, coordination, and structural/MEP engineering tools.',
  },
  'ai-tools': {
    ar: 'الذكاء الاصطناعي',
    en: 'Artificial Intelligence',
    descAr: 'نماذج المحادثة المحلية، توليد الصور والفيديو، وكلاء الذكاء الاصطناعي، والأدوات الهندسية الذكية.',
    descEn: 'Local LLMs, AI image & video generation, coding agents, OCR, and smart engineering tools.',
  },
  design: {
    ar: 'التصميم',
    en: 'Design & Creative',
    descAr: 'تصميم الجرافيك، معالجة الصور، الواجهات الرقمية، والنمذجة والإظهار ثلاثي الأبعاد.',
    descEn: 'Graphic design, photo editing, vector graphics, UI/UX prototyping, and 3D visualization.',
  },
  productivity: {
    ar: 'الإنتاجية',
    en: 'Productivity',
    descAr: 'إدارة المشاريع، الجداول الزمنية، حزم المكتب، تحرير PDF، ورسم المخططات.',
    descEn: 'Project management, scheduling, office suites, PDF editors, notes, and diagramming.',
  },
  development: {
    ar: 'التطوير',
    en: 'Development',
    descAr: 'بيئات البرمجة، البرمجة البصرية للـ BIM، الحوسبة العلمية، وأدوات تطوير الأنظمة.',
    descEn: 'Code editors, Git clients, API & database tools, visual programming, and DevOps.',
  },
  games: {
    ar: 'الألعاب',
    en: 'Game Dev',
    descAr: 'محركات تطوير الألعاب ثنائية وثلاثية الأبعاد، التحريك، وبناء الرسوميات التفاعلية.',
    descEn: '2D & 3D game engines, pixel art, level editors, and interactive graphics pipelines.',
  },
  'video-audio': {
    ar: 'المونتاج والصوتيات',
    en: 'Video & Audio',
    descAr: 'تحرير الفيديو، تصحيح الألوان، البث وتسجيل الشروحات، وهندسة الصوت.',
    descEn: 'Video editing, screen recording, streaming, audio production, and music notation.',
  },
};

const FEATURE_TRANSLATIONS: Record<FeatureTag, string> = {
  'OpenBIM / IFC': 'OpenBIM / IFC',
  'رسم 2D / DWG': '2D CAD / DWG',
  'نمذجة 3D': '3D Modeling',
  'إظهار معماري': 'Arch Visualization',
  'ذكاء اصطناعي': 'AI-Powered',
  'دعم العربية': 'Arabic Support',
  'إدارة مشاريع': 'Project Management',
  'أتمتة وبرمجة': 'Automation & Code',
  'محركات ألعاب': 'Game Engines',
  'تعديل PDF': 'PDF Editing',
  'تحرير صور وفيكتور': 'Photo & Vector',
  'مونتاج فيديو': 'Video Editing',
  'يعمل على الويب': 'Web-Based',
};

const LICENSE_CATEGORY_TRANSLATIONS: Record<LicenseCategory, string> = {
  مدفوع: 'Paid',
  مجاني: 'Free',
  'مفتوح المصدر': 'Open Source',
};

const LICENSE_TYPE_TRANSLATIONS: Record<LicenseType, string> = {
  'مفتوح المصدر': 'Open Source',
  'مجاني بالكامل': 'Completely Free',
  'مجاني للاستخدام الشخصي': 'Free for Personal Use',
};

const ARABIC_SUPPORT_TRANSLATIONS: Record<'ممتاز' | 'جيد' | 'محدود', string> = {
  ممتاز: 'Excellent',
  جيد: 'Good',
  محدود: 'Limited',
};

const REPLACEMENT_TIER_TRANSLATIONS: Record<ReplacementTier, { ar: string; en: string }> = {
  'near-equivalent': {
    ar: 'بديل مطابق تقريباً',
    en: 'Near-equivalent replacement',
  },
  'most-tasks': {
    ar: 'بديل يؤدي معظم المهام',
    en: 'Covers most workflows',
  },
  'single-task': {
    ar: 'بديل يؤدي وظيفة واحدة',
    en: 'Single-task alternative',
  },
  complementary: {
    ar: 'برنامج مكمل وليس بديلاً',
    en: 'Complementary tool, not a replacement',
  },
  'no-practical': {
    ar: 'لا يوجد بديل عملي حتى الآن',
    en: 'No practical replacement yet',
  },
};

const FUNCTION_STATUS_TRANSLATIONS: Record<FunctionSupportLevel, string> = {
  ممتاز: 'Excellent',
  جيد: 'Good',
  محدود: 'Limited',
  مختلف: 'Different approach',
  'غير متوفر': 'Not available',
  'يحتاج تقييم': 'Project-dependent',
};

const MAINTENANCE_STATUS_TRANSLATIONS: Record<MaintenanceStatus, { ar: string; en: string }> = {
  active: { ar: 'تطوير نشط', en: 'Actively maintained' },
  caution: { ar: 'تحديثات بطيئة', en: 'Slow release cadence' },
  abandoned: { ar: 'مهجور / متوقف', en: 'Abandoned / Discontinued' },
};

const GPU_TIER_TRANSLATIONS: Record<GpuRequirementTier, { ar: string; en: string }> = {
  integrated: { ar: 'كرت شاشة مدمج يكفي', en: 'Integrated GPU sufficient' },
  mid: { ar: 'كرت شاشة متوسط (4GB VRAM)', en: 'Mid-range GPU (4GB VRAM)' },
  dedicated: { ar: 'كرت شاشة قوي مخصص (8GB+ VRAM)', en: 'Dedicated GPU (8GB+ VRAM)' },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function loadInitialLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    // Ignore storage read errors
  }
  return 'ar';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => loadInitialLanguage());

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
  const isAr = lang === 'ar';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    document.title =
      lang === 'ar'
        ? 'بديلك — منظومة استخبارات البرامج الهندسية والبدائل المجانية'
        : 'Badeelak — Engineering Software Intelligence & Open-Source Alternatives';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage write errors
    }
  }, [lang, dir]);

  const setLang = useCallback((nextLang: AppLanguage) => {
    setLangState(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = useCallback(
    (arText: string, enText: string) => (lang === 'ar' ? arText : enText),
    [lang]
  );

  const translateCategory = useCallback(
    (catId: SoftwareCategory) =>
      lang === 'ar' ? CATEGORY_TRANSLATIONS[catId].ar : CATEGORY_TRANSLATIONS[catId].en,
    [lang]
  );

  const translateCategoryDesc = useCallback(
    (catId: SoftwareCategory) =>
      lang === 'ar' ? CATEGORY_TRANSLATIONS[catId].descAr : CATEGORY_TRANSLATIONS[catId].descEn,
    [lang]
  );

  const translateFeature = useCallback(
    (feat: FeatureTag) => (lang === 'ar' ? feat : FEATURE_TRANSLATIONS[feat] ?? feat),
    [lang]
  );

  const translateLicenseCategory = useCallback(
    (lic: LicenseCategory) => (lang === 'ar' ? lic : LICENSE_CATEGORY_TRANSLATIONS[lic] ?? lic),
    [lang]
  );

  const translateLicenseType = useCallback(
    (lic: LicenseType) => (lang === 'ar' ? lic : LICENSE_TYPE_TRANSLATIONS[lic] ?? lic),
    [lang]
  );

  const translateArabicSupport = useCallback(
    (level: 'ممتاز' | 'جيد' | 'محدود') =>
      lang === 'ar' ? level : ARABIC_SUPPORT_TRANSLATIONS[level] ?? level,
    [lang]
  );

  const translateReplacementTier = useCallback(
    (tier: ReplacementTier) =>
      lang === 'ar' ? REPLACEMENT_TIER_TRANSLATIONS[tier].ar : REPLACEMENT_TIER_TRANSLATIONS[tier].en,
    [lang]
  );

  const translateFunctionStatus = useCallback(
    (status: FunctionSupportLevel) =>
      lang === 'ar' ? status : FUNCTION_STATUS_TRANSLATIONS[status] ?? status,
    [lang]
  );

  const translateMaintenanceStatus = useCallback(
    (status: MaintenanceStatus) =>
      lang === 'ar' ? MAINTENANCE_STATUS_TRANSLATIONS[status].ar : MAINTENANCE_STATUS_TRANSLATIONS[status].en,
    [lang]
  );

  const translateGpuTier = useCallback(
    (tier: GpuRequirementTier) =>
      lang === 'ar' ? GPU_TIER_TRANSLATIONS[tier].ar : GPU_TIER_TRANSLATIONS[tier].en,
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir,
      isAr,
      setLang,
      toggleLang,
      t,
      translateCategory,
      translateCategoryDesc,
      translateFeature,
      translateLicenseCategory,
      translateLicenseType,
      translateArabicSupport,
      translateReplacementTier,
      translateFunctionStatus,
      translateMaintenanceStatus,
      translateGpuTier,
    }),
    [
      lang,
      dir,
      isAr,
      setLang,
      toggleLang,
      t,
      translateCategory,
      translateCategoryDesc,
      translateFeature,
      translateLicenseCategory,
      translateLicenseType,
      translateArabicSupport,
      translateReplacementTier,
      translateFunctionStatus,
      translateMaintenanceStatus,
      translateGpuTier,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
