import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  Layers,
  ArrowUpLeft,
  Sparkles,
  Youtube,
  CornerDownLeft,
} from 'lucide-react';
import { UnifiedProgramItem } from '../types/software';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCommercial: number;
  totalFreeAlternatives: number;
  totalBimTutorials: number;
  savedCount: number;
  programs: UnifiedProgramItem[];
  onSelectProgram: (programId: string) => void;
  onQuickSearch: (term: string) => void;
}

interface AutocompleteSuggestion {
  item: UnifiedProgramItem;
  score: number;
  topAlternatives: Array<{ id: string; name: string; isBestFree: boolean }>;
}

const QUICK_TERMS = ['Revit', 'AutoCAD', 'ChatGPT', 'Navisworks', 'Primavera', 'Photoshop'];

function scoreProgramMatch(item: UnifiedProgramItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const name = item.name.toLowerCase();
  const arabicName = item.arabicName.toLowerCase();
  const parentName = item.parentCommercial?.name.toLowerCase() ?? '';
  const parentArabicName = item.parentCommercial?.arabicName.toLowerCase() ?? '';
  const vendor = item.vendorOrBadge.toLowerCase();
  const formats = item.fileFormats.join(' ').toLowerCase();
  const summary = item.shortSummary.toLowerCase();

  let score = 0;

  if (name === q || arabicName === q) {
    score = 120;
  } else if (name.startsWith(q) || arabicName.startsWith(q)) {
    score = 90;
  } else if (
    name.split(/[\s/()-]+/).some((part) => part.startsWith(q)) ||
    arabicName.split(/[\s/()-]+/).some((part) => part.startsWith(q))
  ) {
    score = 70;
  } else if (name.includes(q) || arabicName.includes(q)) {
    score = 55;
  } else if (
    item.kind === 'alternative' &&
    (parentName.includes(q) || parentArabicName.includes(q))
  ) {
    score = item.alternativeEntry?.isBestFree ? 52 : 36;
  } else if (vendor.includes(q) || formats.includes(q)) {
    score = 24;
  } else if (summary.includes(q)) {
    score = 12;
  }

  if (score > 0 && item.kind === 'commercial') {
    score += 4;
  }

  return score;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lowerText.indexOf(lowerQ);
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 rounded-xs px-0.5 font-bold">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  totalCommercial,
  totalFreeAlternatives,
  totalBimTutorials,
  savedCount,
  programs,
  onSelectProgram,
  onQuickSearch,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = searchQuery.trim();

  const { suggestions, totalMatches } = useMemo(() => {
    if (!trimmedQuery) {
      return { suggestions: [] as AutocompleteSuggestion[], totalMatches: 0 };
    }

    const matched: AutocompleteSuggestion[] = [];
    for (const item of programs) {
      const score = scoreProgramMatch(item, trimmedQuery);
      if (score > 0) {
        const topAlternatives =
          item.kind === 'commercial' && item.commercialEntry
            ? [...item.commercialEntry.alternatives]
                .sort((a, b) => Number(b.isBestFree) - Number(a.isBestFree) || b.likes - a.likes)
                .slice(0, 2)
                .map((alt) => ({
                  id: alt.id,
                  name: alt.name,
                  isBestFree: alt.isBestFree,
                }))
            : [];

        matched.push({ item, score, topAlternatives });
      }
    }

    matched.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.item.likes - a.item.likes;
    });

    return {
      suggestions: matched.slice(0, 8),
      totalMatches: matched.length,
    };
  }, [programs, trimmedQuery]);

  // Reset highlight when query changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [trimmedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const showDropdown = isDropdownOpen && trimmedQuery.length > 0;

  const handleSelectSuggestion = (programId: string) => {
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onSelectProgram(programId);
  };

  const handleJumpToDirectory = () => {
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!trimmedQuery) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) setIsDropdownOpen(true);
      if (suggestions.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      if (showDropdown && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex].item.id);
      } else {
        handleJumpToDirectory();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

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

            {/* Instant Search Bar with Autocomplete Dropdown */}
            <div ref={searchContainerRef} className="relative max-w-2xl mb-4 z-20">
              <label htmlFor="directory-search" className="sr-only">
                ابحث عن برنامج أو بديل مجاني
              </label>
              <div className="relative flex items-center">
                <Search
                  className="w-5 h-5 text-slate-400 absolute right-4 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  id="directory-search"
                  type="text"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showDropdown}
                  aria-controls="search-autocomplete-listbox"
                  aria-activedescendant={
                    highlightedIndex >= 0 && suggestions[highlightedIndex]
                      ? `autocomplete-option-${suggestions[highlightedIndex].item.id}`
                      : undefined
                  }
                  autoComplete="off"
                  value={searchQuery}
                  onFocus={() => {
                    if (trimmedQuery.length > 0) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="ابحث باسم البرنامج أو البديل (مثل: Revit، أوتوكاد، ChatGPT، Blender)..."
                  className="w-full h-13 pr-12 pl-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange('');
                      setIsDropdownOpen(false);
                      setHighlightedIndex(-1);
                      inputRef.current?.focus();
                    }}
                    aria-label="مسح البحث"
                    className="absolute left-3 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showDropdown && (
                <div
                  id="search-autocomplete-listbox"
                  role="listbox"
                  aria-label="اقتراحات البحث السريع"
                  className="absolute inset-x-0 top-full mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                >
                  {suggestions.length === 0 ? (
                    <div className="px-4 py-5 text-center space-y-1.5">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        لا توجد نتائج مباشرة لـ "{trimmedQuery}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        جرّب البحث بالاسم الإنجليزي أو العربي أو اسم الصيغة مثل DWG أو IFC
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>اقتراحات سريعة ({totalMatches} نتيجة مطابقة)</span>
                        <span className="hidden sm:inline">اضغط للانتقال الفوري</span>
                      </div>

                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                        {suggestions.map(({ item, topAlternatives }, idx) => {
                          const isHighlighted = idx === highlightedIndex;
                          const isCommercial = item.kind === 'commercial';

                          return (
                            <div
                              key={item.id}
                              id={`autocomplete-option-${item.id}`}
                              role="option"
                              aria-selected={isHighlighted}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`px-3.5 py-2.5 transition-colors ${
                                isHighlighted
                                  ? 'bg-blue-50/90 dark:bg-blue-950/40'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleSelectSuggestion(item.id)}
                                  className="flex items-start gap-3 text-right flex-1 min-w-0 cursor-pointer focus:outline-none"
                                >
                                  <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs shrink-0 mt-0.5"
                                    style={{ backgroundColor: item.accentColor }}
                                  >
                                    {item.monogram}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center flex-wrap gap-1.5">
                                      <span className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                                        <HighlightMatch text={item.name} query={trimmedQuery} />
                                      </span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        (<HighlightMatch text={item.arabicName} query={trimmedQuery} />)
                                      </span>
                                    </div>

                                    <div className="mt-1 flex items-center flex-wrap gap-1.5 text-[11px]">
                                      <span
                                        className={`px-1.5 py-0.5 rounded font-medium ${
                                          isCommercial
                                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60'
                                            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                                        }`}
                                      >
                                        {item.licenseLabel}
                                      </span>

                                      {item.alternativeEntry?.isBestFree && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                                          <Sparkles className="w-3 h-3" />
                                          أفضل بديل
                                        </span>
                                      )}

                                      {item.bimArabiaTutorial?.hasTutorial && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-medium">
                                          <Youtube className="w-3 h-3" />
                                          بيم أرابيا
                                        </span>
                                      )}

                                      {!isCommercial && item.parentCommercial && (
                                        <span className="text-slate-500 dark:text-slate-400 truncate">
                                          بديل لـ {item.parentCommercial.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectSuggestion(item.id)}
                                  aria-label={`فتح صفحة ${item.name}`}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 shrink-0 mt-1 cursor-pointer"
                                >
                                  <span className="hidden sm:inline">فتح</span>
                                  <ArrowUpLeft className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* 1-Click Direct Jump to Top Free Alternatives for Commercial Software */}
                              {isCommercial && topAlternatives.length > 0 && (
                                <div className="mt-2 mr-12 flex items-center flex-wrap gap-1.5 text-[11px]">
                                  <span className="text-slate-500 dark:text-slate-400">
                                    البدائل الأسرع:
                                  </span>
                                  {topAlternatives.map((alt) => (
                                    <button
                                      key={alt.id}
                                      type="button"
                                      onClick={() => handleSelectSuggestion(alt.id)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 font-medium transition-colors cursor-pointer"
                                    >
                                      <span>{alt.name}</span>
                                      <ArrowUpLeft className="w-3 h-3" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleJumpToDirectory}
                          className="inline-flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                          <span>عرض كل النتائج ({totalMatches}) في الدليل الكامل</span>
                        </button>
                        <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500">
                          ↑↓ للتنقل · Enter للفتح · Esc للإغلاق
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
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

