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
import { CATEGORIES } from '../data/catalog';
import { FeatureTag, OperatingSystem, UnifiedProgramItem } from '../types/software';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrograms: UnifiedProgramItem[];
  allPrograms: UnifiedProgramItem[];
  onAddProgram: (programId: string) => void;
  onRemoveProgram: (programId: string) => void;
  onClearAll: () => void;
  onOpenProgramPage: (programId: string) => void;
}

const ALL_OS: OperatingSystem[] = ['Windows', 'macOS', 'Linux', 'Web'];

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  selectedPrograms,
  allPrograms,
  onAddProgram,
  onRemoveProgram,
  onClearAll,
  onOpenProgramPage,
}) => {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [pickerId, setPickerId] = useState('');

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
    const ratings = new Set(selectedPrograms.map((p) => p.rating.toFixed(1)));
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

  // Highest rating among selected
  const maxRating = useMemo(
    () => (selectedPrograms.length > 0 ? Math.max(...selectedPrograms.map((p) => p.rating)) : 0),
    [selectedPrograms]
  );

  // Automatic concise differences summary
  const summaryPoints = useMemo(() => {
    if (selectedPrograms.length < 2) return [];
    const points: string[] = [];

    const freeOnes = selectedPrograms.filter((p) => p.licenseCategory !== 'مدفوع');
    const paidOnes = selectedPrograms.filter((p) => p.licenseCategory === 'مدفوع');
    if (freeOnes.length > 0 && paidOnes.length > 0) {
      points.push(
        `التكلفة: ${freeOnes.map((p) => p.name).join(' و ')} متاح بدون رسوم اشتراك، مقارنة بـ ${paidOnes
          .map((p) => p.name)
          .join(' و ')} (${paidOnes[0].licenseLabel}).`
      );
    }

    if (diffFlags.ratingDiffers) {
      const topRated = selectedPrograms.filter((p) => p.rating === maxRating);
      points.push(
        `الأعلى تقييماً: ${topRated.map((p) => p.name).join(' و ')} بمتوسط ${maxRating.toFixed(1)} من 5 نجوم.`
      );
    }

    if (diffFlags.osDiffers) {
      const linuxOnes = selectedPrograms.filter((p) => p.platforms.includes('Linux'));
      const webOnes = selectedPrograms.filter((p) => p.platforms.includes('Web'));
      if (linuxOnes.length > 0 && linuxOnes.length < selectedPrograms.length) {
        points.push(`دعم الأنظمة: ${linuxOnes.map((p) => p.name).join(' و ')} يدعم نظام Linux.`);
      } else if (webOnes.length > 0 && webOnes.length < selectedPrograms.length) {
        points.push(`التشغيل السحابي: ${webOnes.map((p) => p.name).join(' و ')} يعمل مباشرة من المتصفح (Web).`);
      }
    }

    if (diffFlags.differingFeatures.size > 0) {
      const sample = Array.from(diffFlags.differingFeatures).slice(0, 3);
      points.push(`فروق الميزات الرئيسية تشمل: ${sample.join('، ')}.`);
    }

    return points;
  }, [selectedPrograms, diffFlags, maxRating]);

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
                مقارنة البرامج ({selectedPrograms.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قارن السعر، أنظمة التشغيل، الميزات الرئيسية، والتقييم بالنجوم مع توضيح الفروق
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
                {onlyDifferences ? 'عرض الفروق فقط (مفعّل)' : 'إبراز الفروق فقط'}
              </button>
            )}

            {selectedPrograms.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                مسح الكل
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق نافذة المقارنة"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Program Adder */}
          {availableToAdd.length > 0 && selectedPrograms.length < 5 && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <label htmlFor="compare-picker" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                أضف برنامجاً للمقارنة:
              </label>
              <select
                id="compare-picker"
                value={pickerId}
                onChange={(e) => setPickerId(e.target.value)}
                className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100"
              >
                <option value="">اختر برنامجاً من الدليل...</option>
                {availableToAdd.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.licenseCategory})
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
                <span>إضافة للجدول</span>
              </button>
            </div>
          )}

          {selectedPrograms.length < 2 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                اختر برنامجين على الأقل لعرض جدول المقارنة
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                يمكنك اختيار برنامج إضافي من القائمة أعلاه أو النقر على زر "قارن" في بطاقات البرامج.
              </p>
            </div>
          ) : (
            <>
              {/* Concise Differences Summary */}
              {summaryPoints.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    ملخص أبرز الفروق بين البرامج المختارة:
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc pr-5">
                    {summaryPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simplified Comparison Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-right text-xs sm:text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-300 min-w-[160px]">
                        معيار المقارنة
                      </th>
                      {selectedPrograms.map((prog) => {
                        const catLabel =
                          CATEGORIES.find((c) => c.id === prog.category)?.label ?? prog.category;

                        return (
                          <th
                            key={prog.id}
                            className="py-4 px-4 align-top min-w-[200px] border-r border-slate-200 dark:border-slate-800"
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
                                aria-label={`إزالة ${prog.name} من المقارنة`}
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
                          <div>السعر والترخيص</div>
                          {diffFlags.licenseDiffers && (
                            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                              يوجد فرق
                            </span>
                          )}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-r border-slate-100 dark:border-slate-800"
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
                              {prog.licenseCategory === 'مدفوع' ? 'مدفوع' : 'مجاني (0$)'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {prog.licenseLabel}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Star Rating Row */}
                    {(!onlyDifferences || diffFlags.ratingDiffers) && (
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>التقييم</div>
                          {diffFlags.ratingDiffers && (
                            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                              يوجد فرق
                            </span>
                          )}
                        </td>
                        {selectedPrograms.map((prog) => {
                          const isTop = diffFlags.ratingDiffers && prog.rating === maxRating;
                          return (
                            <td
                              key={prog.id}
                              className="py-3.5 px-4 border-r border-slate-100 dark:border-slate-800 tabular-nums"
                            >
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
                                {prog.ratingCount} تقييم {isTop ? '· الأعلى' : ''}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )}

                    {/* Operating Systems Matrix */}
                    {(!onlyDifferences || diffFlags.osDiffers) && (
                      <tr className={diffFlags.osDiffers ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          <div>أنظمة التشغيل</div>
                          {diffFlags.osDiffers && (
                            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                              يوجد فرق
                            </span>
                          )}
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-r border-slate-100 dark:border-slate-800"
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
                              <span>ميزة: {feat}</span>
                              {differs && (
                                <span className="block text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                  فرق بين البرامج
                                </span>
                              )}
                            </td>
                            {selectedPrograms.map((prog) => {
                              const hasFeat = prog.features.includes(feat);
                              return (
                                <td
                                  key={prog.id}
                                  className="py-3 px-4 border-r border-slate-100 dark:border-slate-800 text-xs"
                                >
                                  {hasFeat ? (
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                                      <Check className="w-4 h-4" />
                                      <span>متوفر</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                      <Minus className="w-4 h-4" />
                                      <span>غير متوفر</span>
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
                          دعم اللغة العربية
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-r border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                          >
                            {prog.arabicSupport}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* BIM Arabia Tutorial Row */}
                    {(!onlyDifferences || diffFlags.bimDiffers) && (
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          شرح قناة بيم أرابيا
                        </td>
                        {selectedPrograms.map((prog) => (
                          <td
                            key={prog.id}
                            className="py-3.5 px-4 border-r border-slate-100 dark:border-slate-800"
                          >
                            {prog.bimArabiaTutorial?.hasTutorial ? (
                              <a
                                href={prog.bimArabiaTutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
                              >
                                <Youtube className="w-4 h-4" />
                                <span>مشاهدة الشرح</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">لا يوجد شرح مسجل</span>
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
