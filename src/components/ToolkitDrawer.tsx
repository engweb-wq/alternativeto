import React, { useState } from 'react';
import { X, Trash2, ExternalLink, Copy, Check, Youtube } from 'lucide-react';
import { FreeAlternative, SoftwareEntry } from '../types/software';

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
}

export const ToolkitDrawer: React.FC<ToolkitDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveSaved,
  onOpenSoftware,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = async () => {
    const lines = [
      '# حقيبة أدواتي المجانية (من دليل بديلك)',
      '',
      ...savedItems.map(
        ({ software, alternative }) =>
          `- **${alternative.name}** (بديل ${software.name}) — ${alternative.license} | ${alternative.websiteUrl}${
            alternative.bimArabiaTutorial
              ? ` | شرح بيم أرابيا: ${alternative.bimArabiaTutorial.url}`
              : software.bimArabiaTutorial
              ? ` | شرح بيم أرابيا: ${software.bimArabiaTutorial.url}`
              : ''
          }`
      ),
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
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2
              id="toolkit-drawer-title"
              className="font-display text-lg font-bold text-slate-900 dark:text-white"
            >
              حقيبة أدواتي المجانية ({savedItems.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              البدائل التي اخترتها لتجهيز جهازك دون اشتراكات
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق حقيبة الأدوات"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
                حقيبتك فارغة حالياً
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                اضغط على زر "حفظ" بجانب أي بديل مجاني في الدليل لإضافته إلى قائمتك وتصديرها لاحقاً.
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
                          className="font-display text-base font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 text-right cursor-pointer"
                        >
                          {alternative.name}
                        </button>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          بديل {software.name} · {alternative.license}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveSaved(alternative.id)}
                        aria-label={`إزالة ${alternative.name}`}
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
                        <span>الموقع الرسمي</span>
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
                          <span>شرح بيم أرابيا</span>
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
              <span>{copied ? 'تم نسخ القائمة بصيغة Markdown' : 'نسخ قائمة أدواتي (Markdown)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
