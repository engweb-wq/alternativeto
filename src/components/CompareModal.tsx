import React, { useMemo, useState } from 'react';
import {
  X,
  Check,
  Minus,
  Star,
  Plus,
  Trash2,
  ExternalLink,
  Youtube,
  ArrowLeftRight,
} from 'lucide-react';
import { FeatureTag, OperatingSystem, UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrograms: UnifiedProgramItem[];
  allPrograms: UnifiedProgramItem[];
  onAddProgram: (programId: string) => void;
  onRemoveProgram: (programId: string) => void;
  onSetPreset?: (programIds: string[]) => void;
  onClearAll: () => void;
  onOpenProgramPage: (programId: string) => void;
}

const ALL_OS: OperatingSystem[] = ['Windows', 'macOS', 'Linux', 'Web'];

const QUICK_COMPARE_PRESETS = [
  { labelAr: 'BIM: Revit × Bonsai × FreeCAD', labelEn: 'BIM: Revit × Bonsai × FreeCAD', ids: ['autodesk-revit', 'bonsai-blenderbim', 'freecad-bim'] },
  { labelAr: '2D CAD: AutoCAD × LibreCAD × nanoCAD', labelEn: '2D CAD: AutoCAD × LibreCAD × nanoCAD', ids: ['autocad', 'librecad', 'nanocad-free'] },
  { labelAr: 'AI: ChatGPT × Ollama × Open WebUI', labelEn: 'AI: ChatGPT × Ollama × Open WebUI', ids: ['chatgpt-plus', 'ollama', 'open-webui'] },
];

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  selectedPrograms,
  allPrograms,
  onAddProgram,
  onRemoveProgram,
  onSetPreset,
  onClearAll,
  onOpenProgramPage,
}) => {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [pickerId, setPickerId] = useState('');
  const {
    t,
    translateCategory,
    translateFeature,
    translateLicenseCategory,
    translateArabicSupport,
    translateReplacementTier,
    translateGpuTier,
  } = useLanguage();

  const availableToAdd = useMemo(
    () => allPrograms.filter((p) => !selectedPrograms.some((sel) => sel.id === p.id)),
    [allPrograms, selectedPrograms]
  );

  // Collect union of features across selected programs
  const unionFeatures = useMemo(() => {
    const set = new Set<FeatureTag>();
    for (const p of selectedPrograms) {
      for (const f of p.features) {
        set.add(f);
      }
    }
    return Array.from(set);
  }, [selectedPrograms]);

  // Identify differences for clear highlighting & "Only Differences" filter
  const diffFlags = useMemo(() => {
    if (selectedPrograms.length < 2) {
      return {
        licenseDiffers: false,
        ratingDiffers: false,
        osDiffers: false,
        arabicDiffers: false,
        bimDiffers: false,
        differingFeatures: new Set<FeatureTag>(),
      };
    }

    const licenses = new Set(selectedPrograms.map((p) => p.licenseCategory));
    const ratings = new Set(
      selectedPrograms.map((p) => (p.ratingCount > 0 ? p.rating.toFixed(1) : 'unrated'))
    );
    const osSignatures = new Set(selectedPrograms.map((p) => [...p.platforms].sort().join(',')));
    const arabicSet = new Set(selectedPrograms.map((p) => p.arabicSupport));
    const bimSet = new Set(selectedPrograms.map((p) => Boolean(p.bimArabiaTutorial?.hasTutorial)));

    const differingFeatures = new Set<FeatureTag>();
    for (const feat of unionFeatures) {
      const hasCount = selectedPrograms.filter((p) => p.features.includes(feat)).length;
      if (hasCount > 0 && hasCount < selectedPrograms.length) {
        differingFeatures.add(feat);
      }
    }

    return {
      licenseDiffers: licenses.size > 1,
      ratingDiffers: ratings.size > 1,
      osDiffers: osSignatures.size > 1,
      arabicDiffers: arabicSet.size > 1,
      bimDiffers: bimSet.size > 1,
      differingFeatures,
    };
  }, [selectedPrograms, unionFeatures]);

  // Highest rating among selected locally-rated programs
  const ratedSelected = useMemo(
    () => selectedPrograms.filter((p) => p.ratingCount > 0),
    [selectedPrograms]
  );
  const maxRating = useMemo(
    () => (ratedSelected.length > 0 ? Math.max(...ratedSelected.map((p) => p.rating)) : 0),
    [ratedSelected]
  );

  // Automatic concise differences summary
  const summaryPoints = useMemo(() => {
    if (selectedPrograms.length < 2) return [];
    const points: string[] = [];

    const freeOnes = selectedPrograms.filter((p) => p.licenseCategory !== 'مدفوع');
    const paidOnes = selectedPrograms.filter((p) => p.licenseCategory === 'مدفوع');
    if (freeOnes.length > 0 && paidOnes.length > 0) {
      points.push(
        t(
          `التكلفة: ${freeOnes.map((p) => p.name).join(' و ')} متاح بدون رسوم اشتراك، مقارنة بـ ${paidOnes
            .map((p) => p.name)
            .join(' و ')} (${paidOnes[0].licenseLabel}).`,
          `Pricing: ${freeOnes.map((p) => p.name).join(', ')} are free with no subscription, compared to ${paidOnes
            .map((p) => p.name)
            .join(', ')} (${paidOnes[0].licenseLabel}).`
        )
      );
    }

    if (ratedSelected.length > 0 && diffFlags.ratingDiffers) {
      const topRated = ratedSelected.filter((p) => p.rating === maxRating);
      points.push(
        t(
          `الأعلى تقييماً محلياً: ${topRated.map((p) => p.name).join(' و ')} بمتوسط ${maxRating.toFixed(1)} من 5 نجوم.`,
          `Highest locally rated: ${topRated.map((p) => p.name).join(', ')} with ${maxRating.toFixed(1)} / 5 stars.`
        )
      );
    }

    if (diffFlags.osDiffers) {
      const linuxOnes = selectedPrograms.filter((p) => p.platforms.includes('Linux'));
      const webOnes = selectedPrograms.filter((p) => p.platforms.includes('Web'));
      if (linuxOnes.length > 0 && linuxOnes.length < selectedPrograms.length) {
        points.push(
          t(
            `دعم الأنظمة: ${linuxOnes.map((p) => p.name).join(' و ')} يدعم نظام Linux.`,
            `OS support: ${linuxOnes.map((p) => p.name).join(', ')} support Linux.`
          )
        );
      } else if (webOnes.length > 0 && webOnes.length < selectedPrograms.length) {
        points.push(
          t(
            `التشغيل السحابي: ${webOnes.map((p) => p.name).join(' و ')} يعمل مباشرة من المتصفح (Web).`,
            `Web access: ${webOnes.map((p) => p.name).join(', ')} run directly in the browser.`
          )
        );
      }
    }

    if (diffFlags.differingFeatures.size > 0) {
      const sample = Array.from(diffFlags.differingFeatures).slice(0, 3).map(translateFeature);
      points.push(
        t(
          `فروق الميزات الرئيسية تشمل: ${sample.join('، ')}.`,
          `Key feature differences include: ${sample.join(', ')}.`
        )
      );
    }

    return points;
  }, [selectedPrograms, diffFlags, maxRating, t, translateFeature]);

  if (!isOpen) return null;

  const handleAddFromPicker = () => {
    if (!pickerId) return;
    onAddProgram(pickerId);
    setPickerId('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            <div>
              <h2
                id="compare-modal-title"
                className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              >
                {t('مقارنة البرامج', 'Compare Programs')} ({selectedPrograms.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(
                  'قارن السعر، أنظمة التشغيل، الميزات الرئيسية، والتقييم بالنجوم مع توضيح الفروق',
                  'Compare licensing, supported platforms, key features, and user ratings side by side'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedPrograms.length >= 2 && (
              <button
                type="button"
                aria-pressed={onlyDifferences}
                onClick={() => setOnlyDifferences((v) => !v)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  onlyDifferences
                    ? 'bg-blue-700 border-blue-700 text-white dark:bg-blue-600'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {onlyDifferences
                  ? t('عرض الفروق فقط (مفعّل)', 'Differences Only (Active)')
                  : t('إبراز الفروق فقط', 'Show Differences Only')}
              </button>
            )}

            {selectedPrograms.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                {t('مسح الكل', 'Clear All')}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={t('إغلاق نافذة المقارنة', 'Close comparison dialog')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick 3-Way Comparison Presets + Program Adder */}
          <div className="space-y-3">
            {onSetPreset && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  {t('مقارنات ثلاثية جاهزة:', 'Quick 3-Program Presets:')}
                </span>
                {QUICK_COMPARE_PRESETS.map((preset) => (
                  <button
                    key={preset.labelEn}
                    type="button"
                    onClick={() => onSetPreset(preset.ids)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-blue-600 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    {t(preset.labelAr, preset.labelEn)}
                  </button>
                ))}
              </div>
            )}

            {availableToAdd.length > 0 && selectedPrograms.length < 5 && (
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label htmlFor="compare-picker" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('أضف برنامجاً للمقارنة:', 'Add a program to compare:')}
                </label>
                <select
                  id="compare-picker"
                  value={pickerId}
                  onChange={(e) => setPickerId(e.target.value)}
                  className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                >
                  <option value="">{t('اختر برنامجاً من الدليل...', 'Select a program from directory...')}</option>
                  {availableToAdd.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({translateLicenseCategory(p.licenseCategory)})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddFromPicker}
                  disabled={!pickerId}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('إضافة للجدول', 'Add to Table')}</span>
                </button>
              </div>
            )}
          </div>

          {selectedPrograms.length < 2 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                {t('اختر برنامجين على الأقل لعرض جدول المقارنة', 'Select at least 2 programs to compare')}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t(
                  'يمكنك اختيار برنامج إضافي من القائمة أعلاه أو النقر على زر "قارن" في بطاقات البرامج.',
                  'Pick another program from the dropdown above or click "Compare" on any software card.'
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Concise Differences Summary */}
              {summaryPoints.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {t('ملخص أبرز الفروق بين البرامج المختارة:', 'Key Differences Summary:')}
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc ps-5">
                    {summaryPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simplified Comparison Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-start text-xs sm:text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300 min-w-[160px] text-start">
                        {t('معيار المقارنة', 'Criteria')}
                      </th>
                      {selectedPrograms.map((prog) => {
                        const catLabel = translateCategory(prog.category);

                        return (
                          <th
                            key={prog.id}
                            className="py-4 px-4 align-top min-w-[200px] border-s border-slate-200 dark:border-slate-800 text-start"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-md flex items-center justify-center text-white font-mono text-xs font-bold shrink-0"
                                  style={{ backgroundColor: prog.accentColor }}
                                  aria-hidden="true"
                                >
                                  {prog.monogram}
                                </div>
                                <div className="min-w-0">
                                  <a
                                    href={`#program/${prog.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onClose();
                                      onOpenProgramPage(prog.id);
                                    }}
                                    className="font-display text-sm font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 block truncate"
                                  >
                                    {prog.name}
                                  </a>
                                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                    {catLabel}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveProgram(prog.id)}
                                aria-label={t(`إزالة ${prog.name} من المقارنة`, `Remove ${prog.name} from comparison`)}
                                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {/* Price / License Row */}
                    {(!onlyDifferences || diffFlags.licenseDiffers) && (
                      <tr className={diffFlags.licenseDiffers ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>{t('السعر والترخيص', 'Price & License')}</div>
                          {diffFlags.licenseDiffers && (
                            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                              {t('يوجد فرق', 'Differs')}
                            </span>
                          )}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800"
                          >
                            <span
                              className={`font-semibold block ${
                                prog.licenseCategory === 'مفتوح المصدر'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : prog.licenseCategory === 'مجاني'
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-amber-700 dark:text-amber-400'
                              }`}
                            >
                              {prog.licenseCategory === 'مدفوع'
                                ? t('مدفوع', 'Paid')
                                : t('مجاني (0$)', 'Free ($0)')}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {prog.licenseLabel}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Replacement Readiness Tier Row */}
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <div>{t('جاهزية الاستبدال', 'Replacement Readiness')}</div>
                        <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                          {t('تقدير توضيحي للبدائل', 'Illustrative for alternatives')}
                        </span>
                      </td>
                      {selectedPrograms.map((prog) => (
                        <td
                          key={prog.id}
                          className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800 text-xs"
                        >
                          {prog.replacementAssessment ? (
                            <div className="space-y-0.5">
                              <span className="font-semibold text-blue-700 dark:text-blue-400 block">
                                {translateReplacementTier(prog.replacementAssessment.tier)}
                              </span>
                              <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                                ~{prog.replacementAssessment.illustrativePercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">
                              {t('برنامج مرجعي تجاري', 'Commercial reference')}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Hardware & Portability Row */}
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {t('متطلبات العتاد والعمل', 'Hardware & Runtime')}
                      </td>
                      {selectedPrograms.map((prog) => (
                        <td
                          key={prog.id}
                          className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800 text-xs space-y-0.5 tabular-nums"
                        >
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 block">
                            RAM {prog.hardwareProfile.minRamGb}GB / {prog.hardwareProfile.recRamGb}GB ({prog.hardwareProfile.actualRamUsage})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block">
                            {translateGpuTier(prog.hardwareProfile.gpuTier)}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block">
                            {prog.offlineCapable ? t('دون إنترنت', 'Offline') : t('سحابي', 'Cloud')}
                            {prog.portableAvailable ? ' · Portable' : ''}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Star Rating Row */}
                    {(!onlyDifferences || diffFlags.ratingDiffers) && (
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>{t('تقييم المستخدمين المحلي', 'Local User Rating')}</div>
                        </td>
                        {selectedPrograms.map((prog) => {
                          const hasLocal = prog.ratingCount > 0;
                          const isTop = hasLocal && diffFlags.ratingDiffers && prog.rating === maxRating;
                          return (
                            <td
                              key={prog.id}
                              className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800 tabular-nums"
                            >
                              {hasLocal ? (
                                <>
                                  <div className="inline-flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                                    <span
                                      className={`font-bold ${
                                        isTop
                                          ? 'text-emerald-700 dark:text-emerald-400'
                                          : 'text-slate-900 dark:text-white'
                                      }`}
                                    >
                                      {prog.rating.toFixed(1)} / 5
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {prog.ratingCount} {t('تقييم', 'ratings')}
                                    {isTop ? ` · ${t('الأعلى', 'Top')}` : ''}
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {t('لم يقيّم محلياً بعد', 'No local ratings yet')}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )}

                    {/* Operating Systems Matrix */}
                    {(!onlyDifferences || diffFlags.osDiffers) && (
                      <tr className={diffFlags.osDiffers ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>{t('أنظمة التشغيل', 'Operating Systems')}</div>
                          {diffFlags.osDiffers && (
                            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                              {t('يوجد فرق', 'Differs')}
                            </span>
                          )}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800"
                          >
                            <div className="grid grid-cols-2 gap-1.5 text-xs">
                              {ALL_OS.map((os) => {
                                const supported = prog.platforms.includes(os);
                                return (
                                  <span
                                    key={os}
                                    className={`inline-flex items-center gap-1 ${
                                      supported
                                        ? 'text-slate-800 dark:text-slate-100 font-medium'
                                        : 'text-slate-400 dark:text-slate-600'
                                    }`}
                                  >
                                    {supported ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Minus className="w-3.5 h-3.5" />
                                    )}
                                    <span>{os}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Key Features Comparison Rows */}
                    {unionFeatures
                      .filter((f) => !onlyDifferences || diffFlags.differingFeatures.has(f))
                      .map((feat) => {
                        const differs = diffFlags.differingFeatures.has(feat);
                        return (
                          <tr
                            key={feat}
                            className={differs ? 'bg-amber-50/35 dark:bg-amber-950/10' : ''}
                          >
                            <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                              <span>
                                {t('ميزة:', 'Feature:')} {translateFeature(feat)}
                              </span>
                              {differs && (
                                <span className="block text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                  {t('فرق بين البرامج', 'Differs')}
                                </span>
                              )}
                            </td>
                            {selectedPrograms.map((prog) => {
                              const hasFeat = prog.features.includes(feat);
                              return (
                                <td
                                  key={prog.id}
                                  className="py-3 px-4 border-s border-slate-100 dark:border-slate-800 text-xs"
                                >
                                  {hasFeat ? (
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                                      <Check className="w-4 h-4" />
                                      <span>{t('متوفر', 'Available')}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                      <Minus className="w-4 h-4" />
                                      <span>{t('غير متوفر', 'Not listed')}</span>
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}

                    {/* Arabic Support Row */}
                    {(!onlyDifferences || diffFlags.arabicDiffers) && (
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {t('دعم اللغة العربية', 'Arabic Support')}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                          >
                            {translateArabicSupport(prog.arabicSupport)}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* BIM Arabia Tutorial Row */}
                    {(!onlyDifferences || diffFlags.bimDiffers) && (
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {t('شرح قناة بيم أرابيا', 'BIM Arabia Tutorial')}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-s border-slate-100 dark:border-slate-800"
                          >
                            {prog.bimArabiaTutorial?.hasTutorial ? (
                              <a
                                href={prog.bimArabiaTutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
                              >
                                <Youtube className="w-4 h-4" />
                                <span>{t('مشاهدة الشرح', 'Watch Tutorial')}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">
                                {t('لا يوجد شرح مسجل', 'No tutorial listed')}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
