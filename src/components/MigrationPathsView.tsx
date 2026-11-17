import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ExternalLink,
  History,
  Milestone,
  RotateCcw,
  Youtube,
} from 'lucide-react';
import {
  ABANDONED_SOFTWARE_WATCH,
  LICENSE_PRICING_CHANGES,
  MIGRATION_PATHS,
  MigrationPath,
} from '../data/intelligenceData';
import { useLanguage } from '../i18n/LanguageContext';

interface MigrationPathsViewProps {
  completedSteps: Record<string, boolean>;
  onToggleStep: (stepKey: string) => void;
  onResetPathSteps: (pathId: string) => void;
  onOpenProgramPage: (programId: string) => void;
}

export const MigrationPathsView: React.FC<MigrationPathsViewProps> = ({
  completedSteps,
  onToggleStep,
  onResetPathSteps,
  onOpenProgramPage,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>(MIGRATION_PATHS[0].id);
  const { t, isAr } = useLanguage();

  const activePath: MigrationPath = useMemo(
    () => MIGRATION_PATHS.find((p) => p.id === selectedPathId) ?? MIGRATION_PATHS[0],
    [selectedPathId]
  );

  const progress = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const week of activePath.weeks) {
      week.actionChecklistAr.forEach((_, idx) => {
        total += 1;
        const key = `${activePath.id}-w${week.weekNumber}-i${idx}`;
        if (completedSteps[key]) done += 1;
      });
    }
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pct };
  }, [activePath, completedSteps]);

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <Milestone className="w-4 h-4" />
          <span>{t('من البرنامج المدفوع إلى البديل المجاني', 'From Paid Software to Free Alternatives')}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
          {t(
            'خطط انتقال تدريجية أسبوعاً بأسبوع دون إيقاف مشاريعك',
            'Gradual Week-by-Week Migration Plans Without Disrupting Live Work'
          )}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(
            'المهندس المحترف لا يترك أداته المعتادة فجأة. اتبع مسار انتقال عملي يجمع بين التعلم التطبيقي وإدارة الملفات المتبادلة وسجل تحولات التراخيص والبرامج المهجورة.',
            'Seasoned engineers rarely switch overnight. Follow practical multi-week transition roadmaps alongside a license/pricing watch and abandoned software list.'
          )}
        </p>
      </div>

      {/* Path Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MIGRATION_PATHS.map((path) => {
          const isSelected = path.id === activePath.id;
          return (
            <button
              key={path.id}
              type="button"
              onClick={() => setSelectedPathId(path.id)}
              className={`text-start p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] font-mono opacity-75">
                {path.commercialName} → {path.targetName}
              </span>
              <span className="font-display text-sm font-bold leading-snug">
                {isAr ? path.titleAr : path.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Migration Roadmap */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                {t('خطة تعلم تطبيقية · المدة المقدرة:', 'Applied Learning Plan · Est. Time:')}{' '}
                {isAr ? activePath.estimatedTransitionTimeAr : activePath.estimatedTransitionTimeEn}
              </p>
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {isAr ? activePath.titleAr : activePath.titleEn}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isAr ? activePath.subtitleAr : activePath.subtitleEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenProgramPage(activePath.targetProgramId)}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                {t(`صفحة ${activePath.targetName}`, `${activePath.targetName} Page`)}
              </button>

              <a
                href={activePath.bimArabiaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('شروحات بيم أرابيا', 'BIM Arabia Tutorials')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Progress bar & honesty box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="lg:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {t('تقدمك التطبيقي في هذا المسار:', 'Your Practical Progress:')}
                </span>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                    {progress.done}/{progress.total} ({progress.pct}%)
                  </span>
                  {progress.done > 0 && (
                    <button
                      type="button"
                      onClick={() => onResetPathSteps(activePath.id)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('تصفير', 'Reset')}</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>

            <div className="lg:col-span-6 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                {t('متى تحتفظ بالبرنامج المدفوع مؤقتاً؟ ', 'When to temporarily keep paid tool: ')}
              </span>
              {isAr ? activePath.keepCommercialForAr : activePath.keepCommercialForEn}
            </div>
          </div>
        </div>

        {/* Week-by-Week Hairline-Divided Plan */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {activePath.weeks.map((week) => {
            const checklist = isAr ? week.actionChecklistAr : week.actionChecklistEn;
            return (
              <div key={week.weekNumber} className="p-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-4 space-y-1">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                    {t(`الأسبوع ${week.weekNumber}`, `Week ${week.weekNumber}`)}
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {isAr ? week.titleAr : week.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr ? week.goalAr : week.goalEn}
                  </p>
                </div>

                <div className="lg:col-span-5 space-y-2">
                  {checklist.map((itemText, idx) => {
                    const stepKey = `${activePath.id}-w${week.weekNumber}-i${idx}`;
                    const checked = Boolean(completedSteps[stepKey]);
                    return (
                      <label
                        key={stepKey}
                        className="flex items-start gap-2.5 text-xs sm:text-sm cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleStep(stepKey)}
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                        />
                        <span
                          className={
                            checked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                          }
                        >
                          {itemText}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="lg:col-span-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('مخرج الأسبوع العملي:', 'Practical Deliverable:')}</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr ? week.practiceDeliverableAr : week.practiceDeliverableEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing/License Shifts + Abandoned Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* License & Pricing History */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t('سجل تغييرات الأسعار والتراخيص', 'License & Pricing Change Log')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(
                  'توثيق البرامج التي ألغت النسخ المجانية أو فرضت اشتراكات متزايدة',
                  'Track software that discontinued perpetual licenses or tightened free tiers'
                )}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {LICENSE_PRICING_CHANGES.map((entry) => (
              <li key={entry.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {entry.softwareName}
                  </span>
                  <span className="font-mono text-xs text-amber-700 dark:text-amber-400">
                    {entry.changeYear}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {isAr ? entry.shiftAr : entry.shiftEn}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{isAr ? entry.impactAr : entry.impactEn}</span>
                  <button
                    type="button"
                    onClick={() => onOpenProgramPage(entry.recommendedAlternativeId)}
                    className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {t('البديل الآمن:', 'Open alternative:')} {entry.recommendedAlternativeName}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Abandoned Software Watchlist */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t('قائمة البرامج المهجورة والمتوقفة', 'Abandoned & Discontinued Watchlist')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(
                  'تجنب بدء مشاريع جديدة على أدوات توقف تطويرها',
                  'Avoid starting new production projects on unmaintained or retired software'
                )}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {ABANDONED_SOFTWARE_WATCH.map((item) => (
              <li key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isAr ? item.categoryAr : item.categoryEn}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {isAr ? item.statusNoteAr : item.statusNoteEn}
                </p>
                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenProgramPage(item.replacementId)}
                    className="font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {t('البديل النشط الموصى به:', 'Recommended active replacement:')}{' '}
                    {item.replacementName}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
