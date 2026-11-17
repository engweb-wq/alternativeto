import React, { useState } from 'react';
import { X, Trash2, ExternalLink, Copy, Check, Youtube, Milestone } from 'lucide-react';
import { FreeAlternative, SoftwareEntry } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface SavedItem {
  software: SoftwareEntry;
  alternative: FreeAlternative;
}

interface ToolkitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onRemoveSaved: (altId: string) => void;
  onOpenSoftware: (softwareId: string) => void;
  migrationCompletedCount?: number;
  onOpenMigrationPaths?: () => void;
}

export const ToolkitDrawer: React.FC<ToolkitDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveSaved,
  onOpenSoftware,
  migrationCompletedCount = 0,
  onOpenMigrationPaths,
}) => {
  const [copied, setCopied] = useState(false);
  const { t, translateLicenseType } = useLanguage();

  if (!isOpen) return null;

  const handleCopyMarkdown = async () => {
    const lines = [
      t('# حقيبة المهندس المجانية (من منصة بديلك)', '# Engineer Free Toolkit (from Badeelak)'),
      '',
      ...savedItems.map(({ software, alternative }) => {
        const tutUrl = alternative.bimArabiaTutorial?.url ?? software.bimArabiaTutorial?.url;
        const tutLabel = tutUrl ? ` | ${t('شرح بيم أرابيا', 'BIM Arabia')}: ${tutUrl}` : '';
        return `- **${alternative.name}** (${t('بديل', 'Alt for')} ${software.name}) — ${translateLicenseType(
          alternative.license
        )} | ${alternative.websiteUrl}${tutLabel}`;
      }),
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked in iframe
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toolkit-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-s border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2
              id="toolkit-drawer-title"
              className="font-display text-lg font-bold text-slate-900 dark:text-white"
            >
              {t('حقيبة المهندس المجانية', 'Engineer Free Toolkit')} ({savedItems.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t(
                'البرامج ومنظومات العمل التي حفظتها لتجهيز جهازك دون اشتراكات',
                'Tools and workflow stacks you saved to equip your machine without subscriptions'
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('إغلاق حقيبة المهندس', 'Close Engineer Toolkit')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {onOpenMigrationPaths && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
              <div className="text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Milestone className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  <span>{t('تقدم مسارات الانتقال', 'Migration Plan Progress')}</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                  {t(
                    `أنجزت ${migrationCompletedCount} خطوة تطبيقية`,
                    `${migrationCompletedCount} practical steps completed`
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMigrationPaths();
                }}
                className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer shrink-0"
              >
                {t('عرض الخطط', 'View Plans')}
              </button>
            </div>
          )}

          {savedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
                {t('حقيبتك فارغة حالياً', 'Your toolkit is currently empty')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  'احفظ أي بديل من الدليل أو احفظ منظومة عمل كاملة بضغطة واحدة من تبويب منظومات العمل.',
                  'Save any alternative from the directory or add an entire workflow stack from the Workflow Stacks tab.'
                )}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {savedItems.map(({ software, alternative }) => {
                const tutorial = alternative.bimArabiaTutorial ?? software.bimArabiaTutorial;

                return (
                  <div key={alternative.id} className="py-4 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenSoftware(software.id);
                          }}
                          className="font-display text-base font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 text-start cursor-pointer"
                        >
                          {alternative.name}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t(`بديل ${software.name}`, `Alternative to ${software.name}`)} ·{' '}
                          {translateLicenseType(alternative.license)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveSaved(alternative.id)}
                        aria-label={t(`إزالة ${alternative.name}`, `Remove ${alternative.name}`)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={alternative.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        <span>{t('الموقع الرسمي', 'Official Website')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {tutorial && (
                        <a
                          href={tutorial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>{t('شرح بيم أرابيا', 'BIM Arabia Tutorial')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {savedItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copied
                  ? t('تم نسخ القائمة بصيغة Markdown', 'Copied list as Markdown')
                  : t('نسخ قائمة أدواتي (Markdown)', 'Copy My Toolkit (Markdown)')}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
