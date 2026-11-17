import React, { useState } from 'react';
import { Youtube, Sun, Moon, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, FEATURE_TAGS } from '../data/catalog';
import {
  FeatureTag,
  LicenseCategory,
  OperatingSystem,
  SoftwareCategory,
} from '../types/software';

export type SortOption = 'popular' | 'bim-first' | 'most-alternatives';
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
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: DirectoryViewMode;
  onViewModeChange: (mode: DirectoryViewMode) => void;
  isDark: boolean;
  onToggleDark: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const OS_OPTIONS: OperatingSystem[] = ['Windows', 'macOS', 'Linux', 'Web'];
const LICENSE_OPTIONS: Array<{ value: LicenseCategory | 'all'; label: string }> = [
  { value: 'all', label: 'كل التراخيص' },
  { value: 'مجاني', label: 'مجاني' },
  { value: 'مفتوح المصدر', label: 'مفتوح المصدر' },
  { value: 'مدفوع', label: 'مدفوع' },
];

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
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isDark,
  onToggleDark,
  resultCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(true);

  return (
    <section
      id="directory"
      aria-label="البحث المتقدم وتصفية البرامج"
      className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-5">
        {/* Top Row: Category Tabs & Theme/View Mode Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div
            role="tablist"
            aria-label="تصنيفات البرامج"
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
              جميع الفئات
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
                {cat.label}
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
                البرامج والبدائل
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
                نتائج البحث الفردية
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{isDark ? 'نهاري' : 'ليلي'}</span>
            </button>
          </div>
        </div>

        {/* Advanced Search Filters Panel */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>البحث المتقدم: نظام التشغيل، نوع الترخيص، والميزات الرئيسية</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {resultCount} نتيجة مطابقة
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs text-slate-500 dark:text-slate-400">
                  ترتيب:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="popular">الأكثر تصويتاً</option>
                  <option value="bim-first">شروحات بيم أرابيا أولاً</option>
                  <option value="most-alternatives">الأكثر بدائل متاحة</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* License Filter */}
            <div className="lg:col-span-5 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                نوع الترخيص
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {LICENSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selectedLicense === opt.value}
                    onClick={() => onLicenseChange(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedLicense === opt.value
                        ? 'bg-blue-700 border-blue-700 text-white dark:bg-blue-600 dark:border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operating System Multi-Select Filter */}
            <div className="lg:col-span-4 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                نظام التشغيل (يمكن اختيار أكثر من نظام)
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

            {/* BIM Arabia Video Filter */}
            <div className="lg:col-span-3 space-y-1.5">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                فيديوهات قناة بيم أرابيا
              </span>
              <button
                type="button"
                aria-pressed={onlyBimTutorials}
                onClick={onToggleBimTutorials}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  onlyBimTutorials
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>فقط البرامج المشروحة في بيم أرابيا</span>
              </button>
            </div>
          </div>

          {/* Key Features Filter */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                الميزات الرئيسية {selectedFeatures.length > 0 ? `(تم اختيار ${selectedFeatures.length})` : ''}
              </span>
              <button
                type="button"
                onClick={() => setShowAllFeatures((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <span>{showAllFeatures ? 'إخفاء الميزات' : 'عرض الميزات'}</span>
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
                      {feat}
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
