import React from 'react';

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
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome('top');
          }}
          className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          بديلك
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
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
            البحث المتقدم
          </a>
          <a
            href="#categories-directory"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('categories-directory');
            }}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            دليل الفئات
          </a>
          <a
            href="#bim-arabia"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('bim-arabia');
            }}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            شروحات بيم أرابيا
          </a>
          <button
            type="button"
            onClick={onOpenToolkit}
            className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-8 decoration-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            حقيبة أدواتي
          </button>
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            أضف برنامج أو شرح
          </button>
        </div>
      </div>
    </header>
  );
};
