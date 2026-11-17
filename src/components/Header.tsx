import React from 'react';
import { Globe } from 'lucide-react';
import { WorkspaceProductTab } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  activeTab: WorkspaceProductTab;
  onSelectTab: (tab: WorkspaceProductTab) => void;
  onOpenAddModal: () => void;
  onOpenToolkit: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

const NAV_TABS: Array<{ id: WorkspaceProductTab; ar: string; en: string }> = [
  { id: 'directory', ar: 'الدليل والمهام', en: 'Directory & Tasks' },
  { id: 'stacks', ar: 'منظومات العمل', en: 'Workflow Stacks' },
  { id: 'compatibility', ar: 'مختبر التوافق', en: 'Compatibility Lab' },
  { id: 'migration', ar: 'مسارات الانتقال', en: 'Migration Plans' },
  { id: 'hardware-github', ar: 'العتاد و GitHub', en: 'Hardware & GitHub' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
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
            onSelectTab('directory');
            onNavigateHome('top');
          }}
          className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          {t('بديلك', 'Badeelak')}
        </a>

        {/* Zone 2: 5 concise single-line workspace navigation links */}
        <nav
          aria-label={t('التنقل الرئيسي', 'Primary Navigation')}
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSelectTab(tab.id);
                  onNavigateHome('top');
                }}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer underline-offset-8 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-bold underline decoration-2 decoration-blue-600'
                    : 'hover:text-slate-900 dark:hover:text-white hover:underline decoration-blue-600'
                }`}
              >
                {t(tab.ar, tab.en)}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Toolkit trigger + Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenToolkit}
            className="hidden sm:inline-flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t('حقيبة المهندس', 'Engineer Toolkit')}
          </button>

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

