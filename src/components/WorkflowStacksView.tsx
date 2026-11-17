import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowUpLeft,
  ArrowUpRight,
  BookmarkCheck,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { WORKFLOW_STACKS, WorkflowStack } from '../data/intelligenceData';
import { UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface WorkflowStacksViewProps {
  programs: UnifiedProgramItem[];
  savedIds: Set<string>;
  onOpenProgramPage: (programId: string) => void;
  onSaveMultiple: (programIds: string[]) => void;
  onOpenCompatibilityLab: () => void;
}

export const WorkflowStacksView: React.FC<WorkflowStacksViewProps> = ({
  programs,
  savedIds,
  onOpenProgramPage,
  onSaveMultiple,
  onOpenCompatibilityLab,
}) => {
  const [selectedStackId, setSelectedStackId] = useState<string>(WORKFLOW_STACKS[0].id);
  const [justSavedStackId, setJustSavedStackId] = useState<string | null>(null);
  const { t, isAr, translateLicenseCategory } = useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  const programMap = useMemo(() => {
    const map = new Map<string, UnifiedProgramItem>();
    for (const p of programs) {
      map.set(p.id, p);
    }
    return map;
  }, [programs]);

  const activeStack: WorkflowStack = useMemo(
    () => WORKFLOW_STACKS.find((s) => s.id === selectedStackId) ?? WORKFLOW_STACKS[0],
    [selectedStackId]
  );

  const stackStageIds = activeStack.stages.map((st) => st.programId);
  const allSavedInToolkit = stackStageIds.every((id) => savedIds.has(id));

  const handleSaveStack = () => {
    onSaveMultiple(stackStageIds);
    setJustSavedStackId(activeStack.id);
    setTimeout(() => setJustSavedStackId(null), 2400);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Layers className="w-4 h-4" />
            <span>{t('منظومات العمل الكاملة', 'Complete Free Engineering Workflow Stacks')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
            {t(
              '7 منظومات عمل مجانية متكاملة حسب التخصص الهندسي',
              '7 Complete Free Workflow Stacks by Engineering Discipline'
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t(
              'بدلاً من تجميع برامج متفرقة، اختر منظومة عمل كاملة من مرحلة التخطيط والنمذجة حتى الإخراج وإدارة المشروع مع ربط مباشر بالبرامج وصيغ التبادل والقيود الواقعية.',
              'Instead of picking isolated tools, adopt an end-to-end free stack covering drafting, modeling, analysis, visualization, and documentation with honest caveats.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCompatibilityLab}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <span>{t('اختبر تبادل الملفات في المختبر', 'Test Interoperability in Lab')}</span>
        </button>
      </div>

      {/* 7 Workflow Stacks Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {WORKFLOW_STACKS.map((stack, index) => {
          const isSelected = stack.id === activeStack.id;
          return (
            <button
              key={stack.id}
              type="button"
              onClick={() => setSelectedStackId(stack.id)}
              className={`text-start p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono opacity-70 tabular-nums">
                <span>0{index + 1}</span>
                <span>{stack.stages.length} {t('مراحل', 'stages')}</span>
              </div>
              <span className="font-display text-sm font-bold leading-snug">
                {isAr ? stack.titleAr : stack.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stack Details Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Stack Overview Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
              {isAr ? activeStack.audienceAr : activeStack.audienceEn}
            </p>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              {isAr ? activeStack.titleAr : activeStack.titleEn}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr ? activeStack.summaryAr : activeStack.summaryEn}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {t('تغني عن التراخيص التجارية التالية:', 'Replaces commercial licenses for:')}
              </span>
              <span>{activeStack.replacesCommercial.join(' · ')}</span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveStack}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                allSavedInToolkit || justSavedStackId === activeStack.id
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>
                {justSavedStackId === activeStack.id
                  ? t('تم حفظ جميع برامج المنظومة!', 'All Stack Tools Saved!')
                  : allSavedInToolkit
                  ? t('المنظومة محفوظة في حقيبة المهندس', 'Stack Saved in Engineer Toolkit')
                  : t('حفظ المنظومة كاملة في الحقيبة', 'Save Full Stack to Toolkit')}
              </span>
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {t('أدنى ذاكرة موصى بها:', 'Minimum practical RAM:')} {activeStack.minimumRamGb} GB
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Stages Table / Timeline */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {activeStack.stages.map((stage) => {
            const linkedProg = programMap.get(stage.programId);

            return (
              <div
                key={`${activeStack.id}-${stage.programId}-${stage.stageEn}`}
                className="p-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-slate-50/70 dark:hover:bg-slate-950/50 transition-colors"
              >
                <div className="lg:col-span-3">
                  <span className="font-display text-sm font-bold text-slate-900 dark:text-white block">
                    {isAr ? stage.stageAr : stage.stageEn}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {stage.formats.join(' · ')}
                  </span>
                </div>

                <div className="lg:col-span-4 flex items-center gap-3 min-w-0">
                  {linkedProg && (
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-mono text-xs font-bold shrink-0"
                      style={{ backgroundColor: linkedProg.accentColor }}
                      aria-hidden="true"
                    >
                      {linkedProg.monogram}
                    </div>
                  )}
                  <div className="min-w-0">
                    <a
                      href={`#program/${stage.programId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenProgramPage(stage.programId);
                      }}
                      className="font-display text-base font-bold text-blue-700 dark:text-blue-400 hover:underline truncate block"
                    >
                      {linkedProg?.name ?? stage.programName}
                    </a>
                    {linkedProg && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                        {translateLicenseCategory(linkedProg.licenseCategory)} ·{' '}
                        {linkedProg.platforms.join(' / ')} · RAM {linkedProg.hardwareProfile.recRamGb}GB
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr ? stage.roleAr : stage.roleEn}
                </div>

                <div className="lg:col-span-1 flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenProgramPage(stage.programId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer whitespace-nowrap"
                  >
                    <span>{t('التفاصيل', 'Open')}</span>
                    <NavArrow className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths, Honest Caveats & Hardware Footnote */}
        <div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('نقاط القوة العملية', 'Key Strengths')}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc ps-4">
              {(isAr ? activeStack.strengthsAr : activeStack.strengthsEn).map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:border-s md:border-slate-200 dark:md:border-slate-800 md:ps-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('حدود وقيود يجب معرفتها بوضوح', 'Honest Limitations & Caveats')}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc ps-4">
              {(isAr ? activeStack.caveatsAr : activeStack.caveatsEn).map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:border-s md:border-slate-200 dark:md:border-slate-800 md:ps-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
              <Cpu className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>{t('متطلبات الجهاز المقترحة', 'Recommended Hardware')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr ? activeStack.hardwareSummaryAr : activeStack.hardwareSummaryEn}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
