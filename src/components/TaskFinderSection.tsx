import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowUpLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  Compass,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  ENGINEERING_TASKS,
  EngineeringTask,
  resolveReplacementAssessment,
} from '../data/intelligenceData';
import { SoftwareCategory, UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface TaskFinderSectionProps {
  programs: UnifiedProgramItem[];
  savedIds: Set<string>;
  onOpenProgramPage: (programId: string) => void;
  onFilterByTask: (opts: { searchKeyword: string; category: SoftwareCategory }) => void;
  onOpenInCompatibilityLab: (flowId: string) => void;
  onToggleSave: (altId: string) => void;
}

export const TaskFinderSection: React.FC<TaskFinderSectionProps> = ({
  programs,
  savedIds,
  onOpenProgramPage,
  onFilterByTask,
  onOpenInCompatibilityLab,
  onToggleSave,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(ENGINEERING_TASKS[0].id);
  const {
    t,
    isAr,
    translateLicenseCategory,
    translateReplacementTier,
    translateGpuTier,
  } = useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  const programMap = useMemo(() => {
    const map = new Map<string, UnifiedProgramItem>();
    for (const p of programs) {
      map.set(p.id, p);
    }
    return map;
  }, [programs]);

  const activeTask: EngineeringTask = useMemo(
    () => ENGINEERING_TASKS.find((item) => item.id === selectedTaskId) ?? ENGINEERING_TASKS[0],
    [selectedTaskId]
  );

  const primaryProgram = programMap.get(activeTask.primaryProgramId);
  const commercialProgram = programMap.get(activeTask.commercialCounterpartId);
  const supportingPrograms = activeTask.supportingProgramIds
    .map((id) => programMap.get(id))
    .filter((p): p is UnifiedProgramItem => Boolean(p));

  const assessment = useMemo(() => {
    if (!primaryProgram?.alternativeEntry) return null;
    return resolveReplacementAssessment(
      primaryProgram.alternativeEntry,
      primaryProgram.parentCommercial ?? commercialProgram?.commercialEntry
    );
  }, [primaryProgram, commercialProgram]);

  return (
    <section
      id="task-finder"
      aria-labelledby="task-finder-heading"
      className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <Compass className="w-4 h-4" />
              <span>{t('اكتشاف حسب المهمة الهندسية', 'Task-Based Software Discovery')}</span>
            </div>
            <h2
              id="task-finder-heading"
              className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white"
            >
              {t('ماذا تريد أن تنجز؟', 'What Do You Want to Accomplish?')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {t(
                'اختر المهمة بدلاً من البحث باسم البرنامج ليقترح الدليل الأداة المجانية المناسبة، البدائل المساندة، ومدى قدرتها على الاستغناء عن البرنامج المدفوع.',
                'Pick your engineering task instead of guessing software names to get the right free primary tool, supporting tools, and realistic replacement readiness.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onFilterByTask({
                searchKeyword: activeTask.searchKeyword,
                category: activeTask.recommendedCategory,
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
            <span>{t('اكتشف البرامج المناسبة في الدليل', 'Discover Matching Tools in Directory')}</span>
          </button>
        </div>

        {/* 10 Tasks Selector Grid */}
        <div
          role="radiogroup"
          aria-label={t('المهام الهندسية', 'Engineering tasks')}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5"
        >
          {ENGINEERING_TASKS.map((task, idx) => {
            const isSelected = task.id === activeTask.id;
            return (
              <button
                key={task.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedTaskId(task.id)}
                className={`text-start p-3 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono opacity-70 tabular-nums">
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  <span>{task.keyFormats[0]}</span>
                </div>
                <span className="font-display text-xs sm:text-sm font-bold leading-snug">
                  {isAr ? task.titleAr : task.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Single-Elevation Recommendation Panel */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Primary Recommended Tool */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('الأداة المجانية الأساسية للمهمة', 'Primary Recommended Free Tool')}</span>
                </span>
                {primaryProgram && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{translateLicenseCategory(primaryProgram.licenseCategory)}</span>
                  </>
                )}
              </div>

              <div className="flex items-start gap-3.5">
                {primaryProgram && (
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-mono text-sm font-bold shrink-0"
                    style={{ backgroundColor: primaryProgram.accentColor }}
                    aria-hidden="true"
                  >
                    {primaryProgram.monogram}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    <a
                      href={`#program/${activeTask.primaryProgramId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenProgramPage(activeTask.primaryProgramId);
                      }}
                      className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      {primaryProgram?.name ?? activeTask.primaryProgramName}
                    </a>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {isAr ? activeTask.shortDescAr : activeTask.shortDescEn}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {t('نصيحة سير العمل: ', 'Workflow tip: ')}
                </span>
                {isAr ? activeTask.workflowTipAr : activeTask.workflowTipEn}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenProgramPage(activeTask.primaryProgramId)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>{t('فتح صفحة البرنامج', 'Open Program Page')}</span>
                  <NavArrow className="w-3.5 h-3.5" />
                </button>

                {primaryProgram && primaryProgram.kind === 'alternative' && (
                  <button
                    type="button"
                    onClick={() => onToggleSave(primaryProgram.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      savedIds.has(primaryProgram.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {savedIds.has(primaryProgram.id) ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {savedIds.has(primaryProgram.id)
                        ? t('محفوظ في الحقيبة', 'Saved')
                        : t('حفظ في الحقيبة', 'Save Tool')}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenInCompatibilityLab(activeTask.sampleCompatibilityFlowId)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{t('فحص التوافق في المختبر', 'Check in Lab')}</span>
                </button>
              </div>
            </div>

            {/* Replacement Readiness & Hardware Column */}
            <div className="lg:col-span-4 lg:border-s lg:border-slate-100 dark:lg:border-slate-800 lg:ps-6 space-y-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('تقييم القدرة على الاستغناء عن البديل التجاري', 'Commercial Replacement Readiness')}
              </p>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProgramPage(activeTask.commercialCounterpartId)}
                    className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {t('البرنامج المدفوع المقابل:', 'Replaces:')} {activeTask.commercialCounterpartName}
                  </button>
                  {assessment && (
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      ~{assessment.illustrativePercent}%
                    </span>
                  )}
                </div>

                {assessment && (
                  <>
                    <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {translateReplacementTier(assessment.tier)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t(
                        'نسبة توافق توضيحية وليست نتيجة اختبار فعلي · مبنية على مقارنة المهام الأساسية.',
                        'Illustrative compatibility estimate, not a lab benchmark · based on core workflow coverage.'
                      )}
                    </p>
                  </>
                )}
              </div>

              {primaryProgram && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {t('متطلبات التشغيل والعتاد:', 'Hardware & Portability:')}
                  </p>
                  <p className="tabular-nums">
                    RAM: {primaryProgram.hardwareProfile.minRamGb}GB {t('أدنى', 'min')} ·{' '}
                    {primaryProgram.hardwareProfile.recRamGb}GB {t('موصى به', 'rec')}
                  </p>
                  <p>{translateGpuTier(primaryProgram.hardwareProfile.gpuTier)}</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {primaryProgram.offlineCapable
                      ? t('يعمل دون إنترنت', 'Offline capable')
                      : t('يتطلب اتصالاً/خادماً', 'Requires network')}{' '}
                    ·{' '}
                    {primaryProgram.portableAvailable
                      ? t('نسخة محمولة متاحة', 'Portable build available')
                      : t('تثبيت نظامي', 'Standard install')}
                  </p>
                </div>
              )}
            </div>

            {/* Supporting Tools & Formats Column */}
            <div className="lg:col-span-3 lg:border-s lg:border-slate-100 dark:lg:border-slate-800 lg:ps-6 space-y-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('أدوات مساندة ومكملة', 'Supporting & Alternative Tools')}
              </p>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {supportingPrograms.map((sup) => (
                  <li key={sup.id} className="py-2 first:pt-0 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <a
                        href={`#program/${sup.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenProgramPage(sup.id);
                        }}
                        className="font-display text-sm font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 truncate block"
                      >
                        {sup.name}
                      </a>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {translateLicenseCategory(sup.licenseCategory)} · {sup.platforms.slice(0, 2).join('/')}
                      </span>
                    </div>
                    <NavArrow className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {t('صيغ التبادل المفتوحة:', 'Key Exchange Formats:')}
                </p>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {activeTask.keyFormats.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
