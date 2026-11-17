import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenToolkit: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenToolkit,
  onNavigateHome,
}) => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome('top');
          }}
          className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          {t('بديلك', 'Badeelak')}
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label={t('التنقل الرئيسي', 'Primary Navigation')}
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <a
            href="#directory"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('directory');
            }}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            {t('البحث المتقدم', 'Advanced Search')}
          </a>
          <a
            href="#categories-directory"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('categories-directory');
            }}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            {t('دليل الفئات', 'Categories')}
          </a>
          <a
            href="#bim-arabia"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('bim-arabia');
            }}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            {t('شروحات بيم أرابيا', 'BIM Arabia')}
          </a>
          <button
            type="button"
            onClick={onOpenToolkit}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t('حقيبة أدواتي', 'My Toolkit')}
          </button>
        </nav>

        {/* Zone 3: Language Switcher + 1 primary CTA action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('تبديل اللغة إلى الإنجليزية', 'Switch language to Arabic')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            {t('أضف برنامج أو شرح', 'Add Software')}
          </button>
        </div>
      </div>
    </header>
  );
};

