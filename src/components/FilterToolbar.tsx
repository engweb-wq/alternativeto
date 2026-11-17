import React, { useState } from 'react';
import { Youtube, Sun, Moon, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp, ArrowLeftRight, Github } from 'lucide-react';
import { CATEGORIES, FEATURE_TAGS } from '../data/catalog';
import {
  FeatureTag,
  LicenseCategory,
  OperatingSystem,
  SoftwareCategory,
} from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

export type SortOption = 'popular' | 'highest-rated' | 'bim-first' | 'most-alternatives';
export type DirectoryViewMode = 'alternatives' | 'unified';

interface FilterToolbarProps {
  selectedCategory: SoftwareCategory | 'all';
  onCategoryChange: (cat: SoftwareCategory | 'all') => void;
  selectedLicense: LicenseCategory | 'all';
  onLicenseChange: (lic: LicenseCategory | 'all') => void;
  selectedOSList: OperatingSystem[];
  onToggleOS: (os: OperatingSystem) => void;
  selectedFeatures: FeatureTag[];
  onToggleFeature: (feat: FeatureTag) => void;
  onlyBimTutorials: boolean;
  onToggleBimTutorials: () => void;
  onlyArabicOrigin: boolean;
  onToggleArabicOrigin: () => void;
  onlyGithub: boolean;
  onToggleGithub: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: DirectoryViewMode;
  onViewModeChange: (mode: DirectoryViewMode) => void;
  isDark: boolean;
  onToggleDark: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const OS_OPTIONS: OperatingSystem[] = ['Windows', 'macOS', 'Linux', 'Web'];
const LICENSE_VALUES: Array<LicenseCategory | 'all'> = ['all', 'مجاني', 'مفتوح المصدر', 'مدفوع'];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedLicense,
  onLicenseChange,
  selectedOSList,
  onToggleOS,
  selectedFeatures,
  onToggleFeature,
  onlyBimTutorials,
  onToggleBimTutorials,
  onlyArabicOrigin,
  onToggleArabicOrigin,
  onlyGithub,
  onToggleGithub,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isDark,
  onToggleDark,
  compareCount,
  onOpenCompare,
  resultCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  const { t, translateCategory, translateFeature, translateLicenseCategory } = useLanguage();
  const [showAllFeatures, setShowAllFeatures] = useState(true);

  return (
    <section
      id="directory"
      aria-label={t('البحث المتقدم وتصفية البرامج', 'Advanced search and software filters')}
      className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-5">
        {/* Top Row: Category Tabs & Theme/View Mode Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div
            role="tablist"
            aria-label={t('تصنيفات البرامج', 'Software categories')}
            className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-lg overflow-x-auto max-w-full"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => onCategoryChange('all')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('جميع الفئات', 'All Categories')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {translateCategory(cat.id)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {/* View mode toggle */}
            <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900 rounded-lg">
              <button
                type="button"
                onClick={() => onViewModeChange('alternatives')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'alternatives'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('البرامج والبدائل', 'Pairs & Alternatives')}
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('unified')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'unified'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('نتائج البحث الفردية', 'All Programs')}
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{t(`مقارنة البرامج (${compareCount})`, `Compare (${compareCount})`)}</span>
            </button>

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? t('التبديل إلى الوضع النهاري', 'Switch to light mode') : t('التبديل إلى الوضع الليلي', 'Switch to dark mode')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{isDark ? t('نهاري', 'Light') : t('ليلي', 'Dark')}</span>
            </button>
          </div>
        </div>

        {/* Advanced Search Filters Panel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>
                {t(
                  'البحث المتقدم: نظام التشغيل، نوع الترخيص، والميزات الرئيسية',
                  'Advanced Filters: OS, License, and Key Features'
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {t(`${resultCount} نتيجة مطابقة`, `${resultCount} results`)}
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs text-slate-500 dark:text-slate-400">
                  {t('ترتيب:', 'Sort:')}
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="popular">{t('الأكثر تصويتاً', 'Most Popular')}</option>
                  <option value="highest-rated">{t('الأعلى تقييماً بالنجوم', 'Highest Rated')}</option>
                  <option value="bim-first">{t('شروحات بيم أرابيا أولاً', 'BIM Arabia First')}</option>
                  <option value="most-alternatives">{t('الأكثر بدائل متاحة', 'Most Alternatives')}</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('إعادة ضبط', 'Reset')}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* License Filter */}
            <div className="lg:col-span-4 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('نوع الترخيص', 'License Type')}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {LICENSE_VALUES.map((licVal) => (
                  <button
                    key={licVal}
                    type="button"
                    aria-pressed={selectedLicense === licVal}
                    onClick={() => onLicenseChange(licVal)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedLicense === licVal
                        ? 'bg-blue-700 border-blue-700 text-white dark:bg-blue-600 dark:border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {licVal === 'all' ? t('كل التراخيص', 'All Licenses') : translateLicenseCategory(licVal)}
                  </button>
                ))}
              </div>
            </div>

            {/* Operating System Multi-Select Filter */}
            <div className="lg:col-span-4 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('نظام التشغيل (يمكن اختيار أكثر من نظام)', 'Operating System (Multi-select)')}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {OS_OPTIONS.map((os) => {
                  const active = selectedOSList.includes(os);
                  return (
                    <button
                      key={os}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleOS(os)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {os}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Content Filters: BIM Arabia, Arabic Origin, GitHub */}
            <div className="lg:col-span-4 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('فلاتر المحتوى والشروحات', 'Tutorials & Sources')}
              </span>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={onlyBimTutorials}
                  onClick={onToggleBimTutorials}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyBimTutorials
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Youtube className="w-4 h-4 shrink-0" />
                  <span>{t('شروحات بيم أرابيا', 'BIM Arabia')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={onlyArabicOrigin}
                  onClick={onToggleArabicOrigin}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyArabicOrigin
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span>{t('بدائل عربية', 'Arabic Origin')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={onlyGithub}
                  onClick={onToggleGithub}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyGithub
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Github className="w-3.5 h-3.5 shrink-0" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Features Filter */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('الميزات الرئيسية', 'Key Features')}{' '}
                {selectedFeatures.length > 0
                  ? t(`(تم اختيار ${selectedFeatures.length})`, `(${selectedFeatures.length} selected)`)
                  : ''}
              </span>
              <button
                type="button"
                onClick={() => setShowAllFeatures((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>
                  {showAllFeatures
                    ? t('إخفاء الميزات', 'Hide Features')
                    : t('عرض الميزات', 'Show Features')}
                </span>
                {showAllFeatures ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showAllFeatures && (
              <div className="flex flex-wrap items-center gap-1.5">
                {FEATURE_TAGS.map((feat) => {
                  const active = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleFeature(feat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-emerald-700 border-emerald-700 text-white dark:bg-emerald-600 dark:border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {translateFeature(feat)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

