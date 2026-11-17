import React, { useState } from 'react';
import { Search, X, Layers } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCommercial: number;
  totalFreeAlternatives: number;
  totalBimTutorials: number;
  savedCount: number;
  onQuickSearch: (term: string) => void;
}

const QUICK_TERMS = ['Revit', 'AutoCAD', 'Navisworks', 'Primavera', 'Photoshop', '3ds Max'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  totalCommercial,
  totalFreeAlternatives,
  totalBimTutorials,
  savedCount,
  onQuickSearch,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Text & Search Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-3">
              دليل البرامج الهندسية والتصميمية · بدائل مجانية ومفتوحة المصدر
            </p>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 dark:text-white leading-[1.2] text-balance mb-4">
              ابحث عن أي برنامج مدفوع واكتشف أفضل بديل مجاني له
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-7">
              موسوعة عربية على غرار AlternativeTo تقارن البرامج التجارية بأقوى البدائل المجانية ومفتوحة المصدر، مع ربط مباشر بالشروحات العملية على قناة بيم أرابيا للمهندس عمر سليم.
            </p>

            {/* Instant Search Bar */}
            <div className="relative max-w-2xl mb-4">
              <label htmlFor="directory-search" className="sr-only">
                ابحث عن برنامج أو بديل مجاني
              </label>
              <div className="relative flex items-center">
                <Search
                  className="w-5 h-5 text-slate-400 absolute right-4 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="directory-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="ابحث باسم البرنامج أو البديل (مثل: Revit، أوتوكاد، Blender، GIMP)..."
                  className="w-full h-13 pr-12 pl-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="مسح البحث"
                    className="absolute left-3 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>أشهر عمليات البحث:</span>
              {QUICK_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onQuickSearch(term)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full min-h-[240px] lg:min-h-[320px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_bim_workspace_1794894118705.jpg"
                  alt="بيئة عمل معمارية وهندسية لنمذجة معلومات المباني"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-slate-600 dark:text-slate-300">
                  <Layers className="w-12 h-12 mb-3 text-blue-700 dark:text-blue-400" />
                  <p className="font-display font-bold text-lg">بيئة عمل الهندسة والـ BIM المفتوحة</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-5">
                <p className="text-xs text-slate-200 font-medium">
                  تكامل مع معايير OpenBIM و IFC · روابط تعليمية مباشرة لقناة بيم أرابيا
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip below Hero Split */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">البرامج المفهرسة</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalCommercial}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">البدائل المجانية والحرة</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {totalFreeAlternatives}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">برامج بشروحات بيم أرابيا</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {totalBimTutorials}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">أدواتك المحفوظة</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {savedCount}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
