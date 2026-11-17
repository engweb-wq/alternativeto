import React from 'react';
import { ArrowUpLeft, Youtube } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { SoftwareCategory, UnifiedProgramItem } from '../types/software';

interface CategoryDirectorySectionProps {
  unifiedPrograms: UnifiedProgramItem[];
  onOpenProgramPage: (programId: string) => void;
  onSelectCategoryFilter: (cat: SoftwareCategory) => void;
}

export const CategoryDirectorySection: React.FC<CategoryDirectorySectionProps> = ({
  unifiedPrograms,
  onOpenProgramPage,
  onSelectCategoryFilter,
}) => {
  return (
    <section
      id="categories-directory"
      className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
            تصنيف شامل للبرامج المتوفرة
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance mb-3">
            دليل البرامج المصنّف حسب الفئات
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            استعرض قائمة البرامج التجارية والمجانية ومفتوحة المصدر موزعة على فئات الإنتاجية، التصميم، التطوير، الألعاب، الهندسة والـ BIM، والمونتاج والصوتيات مع رابط مباشر لصفحة كل برنامج.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((category) => {
            const categoryPrograms = unifiedPrograms.filter((p) => p.category === category.id);

            return (
              <div
                key={category.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {category.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {category.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
                      {categoryPrograms.length} برنامج
                    </span>
                  </div>

                  <ul className="divide-y divide-slate-100 dark:divide-slate-800 my-2">
                    {categoryPrograms.map((prog) => (
                      <li key={prog.id} className="py-3.5 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <a
                              href={`#program/${prog.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onOpenProgramPage(prog.id);
                              }}
                              className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            >
                              {prog.name}
                            </a>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                              ·
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                prog.licenseCategory === 'مفتوح المصدر'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : prog.licenseCategory === 'مجاني'
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {prog.licenseCategory}
                            </span>
                            {prog.bimArabiaTutorial?.hasTutorial && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                                  ·
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
                                  <Youtube className="w-3.5 h-3.5" />
                                  <span>شرح بيم أرابيا</span>
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {prog.shortSummary}
                          </p>
                        </div>

                        <a
                          href={`#program/${prog.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onOpenProgramPage(prog.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 mt-0.5"
                        >
                          <span>صفحة البرنامج</span>
                          <ArrowUpLeft className="w-3.5 h-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategoryFilter(category.id);
                      document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    تصفية البحث المتقدم على فئة {category.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
