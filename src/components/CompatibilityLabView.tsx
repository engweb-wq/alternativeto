import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCode2,
  Scale,
} from 'lucide-react';
import {
  FILE_FORMAT_MAP,
  INTEROPERABILITY_FLOWS,
  SAMPLE_TEST_FILES,
  TransferRating,
} from '../data/intelligenceData';
import { UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface CompatibilityLabViewProps {
  programs: UnifiedProgramItem[];
  initialFlowId?: string | null;
  onOpenProgramPage: (programId: string) => void;
  onLaunchPresetCompare: (programIds: string[]) => void;
}

const THREE_WAY_PRESETS = [
  {
    id: 'preset-bim',
    labelAr: 'مقارنة 3 برامج BIM: Revit × Bonsai × FreeCAD',
    labelEn: '3-Way BIM Compare: Revit × Bonsai × FreeCAD',
    ids: ['autodesk-revit', 'bonsai-blenderbim', 'freecad-bim'],
  },
  {
    id: 'preset-2d',
    labelAr: 'مقارنة 3 برامج رسم 2D: AutoCAD × LibreCAD × nanoCAD',
    labelEn: '3-Way 2D CAD: AutoCAD × LibreCAD × nanoCAD',
    ids: ['autocad', 'librecad', 'nanocad-free'],
  },
  {
    id: 'preset-viz',
    labelAr: 'مقارنة 3 برامج إظهار: Lumion × Twinmotion × Blender',
    labelEn: '3-Way ArchViz: Lumion × Twinmotion × Blender',
    ids: ['lumion', 'twinmotion-community', 'blender'],
  },
  {
    id: 'preset-ai',
    labelAr: 'مقارنة 3 أدوات AI: ChatGPT Plus × Ollama × Open WebUI',
    labelEn: '3-Way AI: ChatGPT Plus × Ollama × Open WebUI',
    ids: ['chatgpt-plus', 'ollama', 'open-webui'],
  },
];

function getRatingColorClass(level: TransferRating): string {
  switch (level) {
    case 'ممتاز':
      return 'text-emerald-700 dark:text-emerald-400 font-bold';
    case 'جيد':
      return 'text-blue-700 dark:text-blue-400 font-semibold';
    case 'محدود':
      return 'text-amber-700 dark:text-amber-400 font-semibold';
    default:
      return 'text-red-700 dark:text-red-400 font-semibold';
  }
}

export const CompatibilityLabView: React.FC<CompatibilityLabViewProps> = ({
  programs,
  initialFlowId,
  onOpenProgramPage,
  onLaunchPresetCompare,
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(
    initialFlowId || INTEROPERABILITY_FLOWS[0].id
  );
  const [formatQuery, setFormatQuery] = useState('');
  const { t, isAr } = useLanguage();
  const FlowArrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (initialFlowId) {
      setSelectedFlowId(initialFlowId);
    }
  }, [initialFlowId]);

  const activeFlow = useMemo(
    () => INTEROPERABILITY_FLOWS.find((f) => f.id === selectedFlowId) ?? INTEROPERABILITY_FLOWS[0],
    [selectedFlowId]
  );

  const filteredFormats = useMemo(() => {
    const q = formatQuery.trim().toLowerCase();
    if (!q) return FILE_FORMAT_MAP;
    return FILE_FORMAT_MAP.filter(
      (f) =>
        f.format.toLowerCase().includes(q) ||
        f.fullNameAr.toLowerCase().includes(q) ||
        f.fullNameEn.toLowerCase().includes(q) ||
        f.canOpen.some((p) => p.name.toLowerCase().includes(q)) ||
        f.canEdit.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [formatQuery]);

  const programIdsSet = useMemo(() => new Set(programs.map((p) => p.id)), [programs]);

  const dimensionRows = [
    {
      key: 'geometry',
      labelAr: 'الهندسة والأبعاد',
      labelEn: 'Geometry & Dimensions',
      data: activeFlow.dimensions.geometry,
    },
    {
      key: 'classifications',
      labelAr: 'تصنيفات العناصر',
      labelEn: 'Element Classifications',
      data: activeFlow.dimensions.classifications,
    },
    {
      key: 'properties',
      labelAr: 'الخصائص والبيانات',
      labelEn: 'Properties & Metadata',
      data: activeFlow.dimensions.properties,
    },
    {
      key: 'materials',
      labelAr: 'المواد والخامات',
      labelEn: 'Materials & Finishes',
      data: activeFlow.dimensions.materials,
    },
    {
      key: 'relationships',
      labelAr: 'العلاقات بين العناصر',
      labelEn: 'Element Relationships',
      data: activeFlow.dimensions.relationships,
    },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <ArrowLeftRight className="w-4 h-4" />
          <span>{t('مختبر التوافق والمقارنة', 'Interoperability Lab & 3-Way Comparison')}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
          {t(
            'اختبر تبادل البيانات بين البرامج واعرف ما ينتقل وما يضيع بدقة',
            'Test Cross-Software Data Exchange: What Transfers Cleanly vs. What Is Lost'
          )}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(
            'أداة عملية للمهندسين الذين يعملون في بيئة هجينة بين البرامج المدفوعة والمفتوحة: افحص تدفق الملفات عبر 5 محاور تقنية، واستعرض خريطة الصيغ والملفات التجريبية.',
            'Built for hybrid commercial/open workflows: inspect 5 technical data transfer dimensions, explore the interactive file format map, and download sample test files.'
          )}
        </p>
      </div>

      {/* 1. Workflow Interoperability Path Tester */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          {t('1. اختبر سير العمل بين البرامج (المصدر ← الصيغة ← الوجهة)', '1. Interactive Workflow Path Tester')}
        </h2>

        <div className="flex flex-wrap gap-2">
          {INTEROPERABILITY_FLOWS.map((flow) => {
            const active = flow.id === activeFlow.id;
            return (
              <button
                key={flow.id}
                type="button"
                onClick={() => setSelectedFlowId(flow.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="font-semibold">{flow.sourceName}</span>
                <span className="mx-1.5 opacity-60">→ [{flow.format}] →</span>
                <span className="font-semibold">{flow.targetName}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Pipeline Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => programIdsSet.has(activeFlow.sourceId) && onOpenProgramPage(activeFlow.sourceId)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-display text-base font-bold text-slate-900 dark:text-white hover:border-blue-600 transition-colors cursor-pointer"
              >
                {activeFlow.sourceName}
              </button>
              <FlowArrow className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 font-mono text-sm font-bold text-blue-700 dark:text-blue-300">
                {activeFlow.format}
              </span>
              <FlowArrow className="w-5 h-5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() => programIdsSet.has(activeFlow.targetId) && onOpenProgramPage(activeFlow.targetId)}
                className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 font-display text-base font-bold text-emerald-800 dark:text-emerald-300 hover:border-emerald-600 transition-colors cursor-pointer"
              >
                {activeFlow.targetName}
              </button>
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">
              {isAr ? activeFlow.overallVerdictAr : activeFlow.overallVerdictEn}
            </p>
          </div>

          {/* 5 Dimensions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-6 font-semibold text-start">{t('نوع البيانات المنقولة', 'Data Dimension')}</th>
                  <th className="py-3 px-6 font-semibold text-start">{t('مستوى النقل', 'Transfer Fidelity')}</th>
                  <th className="py-3 px-6 font-semibold text-start">{t('التفاصيل العملية', 'Practical Behavior')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dimensionRows.map((row) => (
                  <tr key={row.key}>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {isAr ? row.labelAr : row.labelEn}
                    </td>
                    <td className={`py-3.5 px-6 whitespace-nowrap ${getRatingColorClass(row.data.level)}`}>
                      {row.data.level}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-300">
                      {isAr ? row.data.noteAr : row.data.noteEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clean vs Lost Comparison */}
          <div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('ما الذي ينتقل دون مشاكل؟', 'What Transfers Cleanly?')}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc ps-4">
                {(isAr ? activeFlow.transfersCleanlyAr : activeFlow.transfersCleanlyEn).map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 md:border-s md:border-slate-200 dark:md:border-slate-800 md:ps-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>{t('ما الذي يضيع أو يتغير عند النقل؟', 'What Is Lost or Altered?')}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc ps-4">
                {(isAr ? activeFlow.lostOrChangedAr : activeFlow.lostOrChangedEn).map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick 3-Way Comparison Presets */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
              <Scale className="w-4 h-4" />
              <span>{t('مقارنة سريعة لاتخاذ قرار أسرع', 'Faster Decision-Making')}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('2. مقارنة 3 برامج هندسية معاً بضغطة واحدة', '2. One-Click 3-Way Program Comparison Presets')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {THREE_WAY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onLaunchPresetCompare(preset.ids)}
              className="text-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer space-y-1.5"
            >
              <span className="font-display text-sm font-bold text-slate-900 dark:text-white block">
                {isAr ? preset.labelAr : preset.labelEn}
              </span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 inline-flex items-center gap-1">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{t('فتح جدول المقارنة الثلاثية', 'Open 3-Way Table')}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive File Format Map */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {t('3. خريطة صيغ الملفات التفاعلية (من يفتح ومن يعدّل؟)', '3. Interactive File Format Map (Can Open vs. Can Edit)')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t(
                'استكشف الصيغ القياسية المفتوحة مقابل المغلقة، والبرامج القادرة على القراءة أو التعديل الكامل.',
                'Distinguish open ISO standards from proprietary formats and see which tools can open or natively edit them.'
              )}
            </p>
          </div>

          <input
            type="text"
            value={formatQuery}
            onChange={(e) => setFormatQuery(e.target.value)}
            placeholder={t('تصفية بالصيغة أو البرنامج (IFC, STEP, DWG)...', 'Filter by format or tool (IFC, STEP, DWG)...')}
            className="w-full sm:w-72 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFormats.map((entry) => (
            <div
              key={entry.format}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-mono text-base font-bold text-slate-900 dark:text-white">
                      {entry.format}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isAr ? entry.fullNameAr : entry.fullNameEn}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap ${
                      entry.isOpenStandard
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {entry.isOpenStandard
                      ? t('معيار مفتوح', 'Open Standard')
                      : t('صيغة تجارية/مختلطة', 'Proprietary / Mixed')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                      {t('تفتحها:', 'Can Open:')}
                    </span>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-blue-700 dark:text-blue-400">
                      {entry.canOpen.map((p, idx) => (
                        <React.Fragment key={p.id}>
                          {idx > 0 && <span className="text-slate-300 dark:text-slate-700">·</span>}
                          <button
                            type="button"
                            onClick={() => programIdsSet.has(p.id) && onOpenProgramPage(p.id)}
                            className="hover:underline cursor-pointer font-medium"
                          >
                            {p.name}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                      {t('تعدّلها:', 'Can Edit:')}
                    </span>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-emerald-700 dark:text-emerald-400">
                      {entry.canEdit.map((p, idx) => (
                        <React.Fragment key={p.id}>
                          {idx > 0 && <span className="text-slate-300 dark:text-slate-700">·</span>}
                          <button
                            type="button"
                            onClick={() => programIdsSet.has(p.id) && onOpenProgramPage(p.id)}
                            className="hover:underline cursor-pointer font-medium"
                          >
                            {p.name}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                {isAr ? entry.notesAr : entry.notesEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sample Test Files for Verification */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {t('ملفات تجريبية جاهزة لاختبار التوافق (IFC / IDS / DWG / STEP)', 'Sample IFC / IDS / DWG Test Files')}
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {SAMPLE_TEST_FILES.map((file) => (
            <div key={file.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5 max-w-2xl">
                <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{file.format}</span> · {file.size} · {file.sourceLabel}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {isAr ? file.purposeAr : file.purposeEn}
                </p>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('فتح مصدر الملفات', 'Open Test Files')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
