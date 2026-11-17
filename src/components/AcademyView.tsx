import React from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  FolderKanban,
  Milestone,
} from 'lucide-react';
import { PRACTICE_PROJECTS, SAMPLE_TEST_FILES } from '../data/intelligenceData';
import { BimArabiaSection } from './BimArabiaSection';
import { useLanguage } from '../i18n/LanguageContext';

interface AcademyViewProps {
  onOpenProgramPage: (programId: string) => void;
  onOpenBimFilteredDirectory: () => void;
  onOpenMigrationPaths: () => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  onOpenProgramPage,
  onOpenBimFilteredDirectory,
  onOpenMigrationPaths,
}) => {
  const { t, isAr } = useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="space-y-2">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span>{t('مسارات التعلم والمشاريع التطبيقية', 'Learning Tracks & Practice Projects')}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
              {t(
                'أكاديمية بديلك: مشاريع تدريبية جاهزة وملفات IFC / DWG عملية',
                'Badeelak Academy: Guided Practice Projects & Sample IFC / CAD Files'
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(
                'بدلاً من الاكتفاء بروابط فيديو متفرقة، ابدأ بمشاريع تطبيقية محددة المخرجات، حمل ملفات اختبار معيارية، وتابع شروحات قناة بيم أرابيا.',
                'Move beyond isolated video links: complete hands-on engineering projects with clear deliverables, standard test datasets, and BIM Arabia playlists.'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMigrationPaths}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Milestone className="w-4 h-4" />
            <span>{t('عرض مسارات الانتقال الأسبوعية', 'View Weekly Migration Plans')}</span>
          </button>
        </div>

        {/* Hands-On Practice Projects */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {t('مشاريع تدريبية جاهزة لتجربة البدائل عملياً', 'Hands-On Practice Projects')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PRACTICE_PROJECTS.map((proj) => (
              <article
                key={proj.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {isAr ? proj.levelAr : proj.levelEn}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {proj.formats.join(' · ')}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {isAr ? proj.titleAr : proj.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr ? proj.deliverablesAr : proj.deliverablesEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                    {t('الأدوات المستخدمة في المشروع:', 'Project Toolset:')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {proj.tools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => onOpenProgramPage(tool.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer"
                      >
                        <span>{tool.name}</span>
                        <NavArrow className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sample Files */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {t('ملفات تدريبية ومشاريع مفتوحة المصدر جاهزة للاختبار', 'Standard Sample Files for Learning')}
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {SAMPLE_TEST_FILES.map((file) => (
              <div
                key={file.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono">{file.format}</span> · {file.size} ·{' '}
                    {isAr ? file.purposeAr : file.purposeEn}
                  </p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('المصدر', 'Download / Repo')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BimArabiaSection onFilterBimOnly={onOpenBimFilteredDirectory} />
    </div>
  );
};
