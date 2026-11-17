import React, { useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Minus,
  Star,
  Sparkles,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Zap,
} from 'lucide-react';
import { FeatureTag, UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface QuickCompareModalProps {
  isOpen: boolean;
  selectedProgram: UnifiedProgramItem | null;
  counterpartProgram: UnifiedProgramItem | null;
  counterpartRoleLabel: string;
  onClose: () => void;
  onOpenProgramPage: (programId: string) => void;
  onOpenFullCompare: (leftId: string, rightId: string) => void;
}

interface QuickFeatureRow {
  id: string;
  label: string;
  leftAvailable: boolean;
  rightAvailable: boolean;
  leftNote?: string;
  rightNote?: string;
}

export const QuickCompareModal: React.FC<QuickCompareModalProps> = ({
  isOpen,
  selectedProgram,
  counterpartProgram,
  counterpartRoleLabel,
  onClose,
  onOpenProgramPage,
  onOpenFullCompare,
}) => {
  const {
    t,
    isAr,
    translateFeature,
    translateLicenseCategory,
    translateArabicSupport,
  } = useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const topThreeRows = useMemo<QuickFeatureRow[]>(() => {
    if (!selectedProgram || !counterpartProgram) return [];
    const orderedFeatures: FeatureTag[] = [];

    for (const f of selectedProgram.features) {
      if (!orderedFeatures.includes(f)) orderedFeatures.push(f);
    }
    for (const f of counterpartProgram.features) {
      if (!orderedFeatures.includes(f)) orderedFeatures.push(f);
    }

    const rows: QuickFeatureRow[] = orderedFeatures.slice(0, 3).map((feat) => ({
      id: `feat-${feat}`,
      label: translateFeature(feat),
      leftAvailable: selectedProgram.features.includes(feat),
      rightAvailable: counterpartProgram.features.includes(feat),
    }));

    if (rows.length < 3) {
      rows.push({
        id: 'arabic-support',
        label: t('دعم اللغة العربية', 'Arabic Language Support'),
        leftAvailable: selectedProgram.arabicSupport !== 'محدود',
        rightAvailable: counterpartProgram.arabicSupport !== 'محدود',
        leftNote: translateArabicSupport(selectedProgram.arabicSupport),
        rightNote: translateArabicSupport(counterpartProgram.arabicSupport),
      });
    }

    if (rows.length < 3) {
      rows.push({
        id: 'cross-platform',
        label: t('تعدد أنظمة التشغيل', 'Cross-Platform Support'),
        leftAvailable: selectedProgram.platforms.length >= 2,
        rightAvailable: counterpartProgram.platforms.length >= 2,
        leftNote: selectedProgram.platforms.join(' / '),
        rightNote: counterpartProgram.platforms.join(' / '),
      });
    }

    if (rows.length < 3) {
      rows.push({
        id: 'free-license',
        label: t('مجاني دون اشتراك', 'Free Without Subscription'),
        leftAvailable: selectedProgram.licenseCategory !== 'مدفوع',
        rightAvailable: counterpartProgram.licenseCategory !== 'مدفوع',
        leftNote: translateLicenseCategory(selectedProgram.licenseCategory),
        rightNote: translateLicenseCategory(counterpartProgram.licenseCategory),
      });
    }

    return rows.slice(0, 3);
  }, [
    selectedProgram,
    counterpartProgram,
    translateFeature,
    translateArabicSupport,
    translateLicenseCategory,
    t,
  ]);

  if (!isOpen || !selectedProgram || !counterpartProgram) return null;

  const isSelectedPaid = selectedProgram.licenseCategory === 'مدفوع';
  const isCounterpartPaid = counterpartProgram.licenseCategory === 'مدفوع';
  const primaryHighlightAdvantage =
    counterpartProgram.alternativeEntry?.keyAdvantages?.[0] ??
    selectedProgram.alternativeEntry?.keyAdvantages?.[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-compare-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="quick-compare-title"
                className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate"
              >
                {t('المقارنة السريعة', 'Quick Compare')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t(
                  `أهم 3 ميزات بين ${selectedProgram.name} و${counterpartProgram.name}`,
                  `Top 3 features: ${selectedProgram.name} vs ${counterpartProgram.name}`
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('إغلاق نافذة المقارنة السريعة', 'Close Quick Compare dialog')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Two Program Summary Cards Side-by-Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Selected Program */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2">
              <span className="inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t('البرنامج المختار', 'Selected Program')}
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white font-mono text-xs font-bold shrink-0"
                  style={{ backgroundColor: selectedProgram.accentColor }}
                  aria-hidden="true"
                >
                  {selectedProgram.monogram}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedProgram.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {isAr ? selectedProgram.arabicName : selectedProgram.vendorOrBadge}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span
                  className={`font-semibold ${
                    isSelectedPaid
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {translateLicenseCategory(selectedProgram.licenseCategory)}
                </span>
                {selectedProgram.ratingCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{selectedProgram.rating.toFixed(1)}</span>
                  </span>
                ) : (
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    RAM {selectedProgram.hardwareProfile.minRamGb}GB+
                  </span>
                )}
              </div>
            </div>

            {/* Best Free Alternative / Counterpart */}
            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>{counterpartRoleLabel}</span>
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white font-mono text-xs font-bold shrink-0"
                  style={{ backgroundColor: counterpartProgram.accentColor }}
                  aria-hidden="true"
                >
                  {counterpartProgram.monogram}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
                    {counterpartProgram.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {isAr ? counterpartProgram.arabicName : counterpartProgram.vendorOrBadge}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span
                  className={`font-semibold ${
                    isCounterpartPaid
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isCounterpartPaid
                    ? translateLicenseCategory(counterpartProgram.licenseCategory)
                    : `${translateLicenseCategory(counterpartProgram.licenseCategory)} (0$)`}
                </span>
                {counterpartProgram.ratingCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{counterpartProgram.rating.toFixed(1)}</span>
                  </span>
                ) : counterpartProgram.replacementAssessment ? (
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                    ~{counterpartProgram.replacementAssessment.illustrativePercent}%
                  </span>
                ) : (
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    RAM {counterpartProgram.hardwareProfile.minRamGb}GB+
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top 3 Features Comparison Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-start text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3.5 font-semibold text-start">
                    {t('أهم 3 ميزات', 'Top 3 Features')}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center border-s border-slate-200 dark:border-slate-800">
                    {selectedProgram.name}
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center border-s border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400">
                    {counterpartProgram.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {topThreeRows.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono inline-flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{row.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center border-s border-slate-100 dark:border-slate-800">
                      {row.leftNote ? (
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {row.leftNote}
                        </span>
                      ) : row.leftAvailable ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span>{t('متوفر', 'Yes')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Minus className="w-4 h-4" />
                          <span>{t('غير متوفر', 'No')}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center border-s border-slate-100 dark:border-slate-800">
                      {row.rightNote ? (
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          {row.rightNote}
                        </span>
                      ) : row.rightAvailable ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span>{t('متوفر', 'Yes')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Minus className="w-4 h-4" />
                          <span>{t('غير متوفر', 'No')}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Concise Takeaway */}
          {primaryHighlightAdvantage && (
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 leading-relaxed">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {t('خلاصة سريعة: ', 'Quick Takeaway: ')}
              </span>
              {primaryHighlightAdvantage}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullCompare(selectedProgram.id, counterpartProgram.id);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{t('المقارنة الكاملة', 'Full Comparison')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProgramPage(selectedProgram.id);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t(`صفحة ${selectedProgram.name}`, `${selectedProgram.name} Page`)}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenProgramPage(counterpartProgram.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>{t(`فتح ${counterpartProgram.name}`, `Open ${counterpartProgram.name}`)}</span>
              <NavArrow className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
