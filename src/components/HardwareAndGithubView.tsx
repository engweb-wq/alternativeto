import React, { useMemo, useState } from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  HardDrive,
  Laptop,
  WifiOff,
} from 'lucide-react';
import {
  GITHUB_ENGINEERING_RADAR,
  GithubEngineeringDomain,
} from '../data/intelligenceData';
import { GpuRequirementTier, OperatingSystem, UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface HardwareAndGithubViewProps {
  programs: UnifiedProgramItem[];
  onOpenProgramPage: (programId: string) => void;
}

const GPU_RANK: Record<GpuRequirementTier, number> = {
  integrated: 1,
  mid: 2,
  dedicated: 3,
};

const DOMAINS: Array<GithubEngineeringDomain | 'all'> = [
  'all',
  'BIM & OpenBIM',
  'CAD & CAM',
  'Structural Engineering',
  'GIS',
  'Computational Design',
  'AI for Architecture',
];

export const HardwareAndGithubView: React.FC<HardwareAndGithubViewProps> = ({
  programs,
  onOpenProgramPage,
}) => {
  const [machineRam, setMachineRam] = useState<number>(8);
  const [machineGpu, setMachineGpu] = useState<GpuRequirementTier>('integrated');
  const [machineOs, setMachineOs] = useState<OperatingSystem | 'all'>('all');
  const [onlyOffline, setOnlyOffline] = useState(false);
  const [onlyPortable, setOnlyPortable] = useState(false);
  const [onlyBrowser, setOnlyBrowser] = useState(false);
  const [showAllHardwareRows, setShowAllHardwareRows] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState<GithubEngineeringDomain | 'all'>('all');

  const { t, isAr, translateGpuTier, translateLicenseCategory, translateMaintenanceStatus } =
    useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  const { compatiblePrograms, heavyAlternatives } = useMemo(() => {
    const compat: UnifiedProgramItem[] = [];
    const heavy: UnifiedProgramItem[] = [];

    for (const p of programs) {
      if (machineOs !== 'all' && !p.platforms.includes(machineOs)) continue;
      if (onlyOffline && !p.offlineCapable) continue;
      if (onlyPortable && !p.portableAvailable) continue;
      if (onlyBrowser && !p.hardwareProfile.runsInBrowser) continue;

      const fitsRam = p.hardwareProfile.minRamGb <= machineRam;
      const fitsGpu = GPU_RANK[p.hardwareProfile.gpuTier] <= GPU_RANK[machineGpu];

      if (fitsRam && fitsGpu) {
        compat.push(p);
      } else {
        heavy.push(p);
      }
    }

    compat.sort((a, b) => {
      if (a.licenseCategory !== 'مدفوع' && b.licenseCategory === 'مدفوع') return -1;
      if (a.licenseCategory === 'مدفوع' && b.licenseCategory !== 'مدفوع') return 1;
      if (a.lowSpecFriendly !== b.lowSpecFriendly) return a.lowSpecFriendly ? -1 : 1;
      return a.hardwareProfile.minRamGb - b.hardwareProfile.minRamGb;
    });

    return { compatiblePrograms: compat, heavyAlternatives: heavy };
  }, [programs, machineRam, machineGpu, machineOs, onlyOffline, onlyPortable, onlyBrowser]);

  const displayedCompat = showAllHardwareRows
    ? compatiblePrograms
    : compatiblePrograms.slice(0, 12);

  const filteredGithubRadar = useMemo(() => {
    if (selectedDomain === 'all') return GITHUB_ENGINEERING_RADAR;
    return GITHUB_ENGINEERING_RADAR.filter((repo) => repo.domain === selectedDomain);
  }, [selectedDomain]);

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-12">
      {/* PART 1: HARDWARE COMPATIBILITY DATABASE */}
      <div className="space-y-6">
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Cpu className="w-4 h-4" />
            <span>{t('قاعدة بيانات العتاد ومتطلبات التشغيل', 'Hardware & Runtime Requirements Database')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
            {t('ما البرامج التي يستطيع جهازي تشغيلها؟', 'Which Engineering Software Can My PC Run?')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t(
              'أداة عملية للمهندسين الذين يمتلكون أجهزة متوسطة أو ضعيفة: حدد ذاكرة جهازك وكرت الشاشة، واستعرض استهلاك RAM الفعلي وخيارات العمل دون إنترنت أو بنسخ Portable أو عبر المتصفح.',
              'Enter your machine RAM and GPU tier to see compatible tools, realistic memory usage, low-spec readiness, offline capability, Portable builds, and browser-based alternatives.'
            )}
          </p>
        </div>

        {/* Interactive Machine Selector Bar */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* RAM Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>{t('الذاكرة المتوفرة في جهازك (RAM)', 'Your Device RAM')}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[4, 8, 16, 32].map((gb) => (
                  <button
                    key={gb}
                    type="button"
                    onClick={() => setMachineRam(gb)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border cursor-pointer tabular-nums ${
                      machineRam === gb
                        ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {gb === 32 ? '32+ GB' : `${gb} GB`}
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Tier Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>{t('نوع كرت الشاشة (GPU)', 'Graphics Card Tier')}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'integrated', ar: 'مدمج / ضعيف', en: 'Integrated' },
                    { id: 'mid', ar: 'متوسط (4GB)', en: 'Mid (4GB)' },
                    { id: 'dedicated', ar: 'قوي (8GB+)', en: 'Dedicated (8GB+)' },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setMachineGpu(g.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                      machineGpu === g.id
                        ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isAr ? g.ar : g.en}
                  </button>
                ))}
              </div>
            </div>

            {/* OS + Runtime Modes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>{t('النظام وطريقة التشغيل', 'OS & Runtime Mode')}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'Windows', 'Linux', 'macOS', 'Web'] as const).map((os) => (
                  <button
                    key={os}
                    type="button"
                    onClick={() => setMachineOs(os)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                      machineOs === os
                        ? 'bg-blue-700 border-blue-700 text-white'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {os === 'all' ? t('الكل', 'All') : os}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={onlyOffline}
                onClick={() => setOnlyOffline((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  onlyOffline
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>{t('يعمل دون إنترنت (Offline)', 'Works Offline')}</span>
              </button>

              <button
                type="button"
                aria-pressed={onlyPortable}
                onClick={() => setOnlyPortable((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  onlyPortable
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t('يدعم التشغيل بدون تثبيت (Portable)', 'Portable Available')}
              </button>

              <button
                type="button"
                aria-pressed={onlyBrowser}
                onClick={() => setOnlyBrowser((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  onlyBrowser
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t('يعمل عبر المتصفح مباشرة', 'Runs in Browser')}
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 tabular-nums">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {compatiblePrograms.length}
              </span>{' '}
              {t('برنامج متوافق مع جهازك', 'compatible programs')}
              {heavyAlternatives.length > 0 && (
                <>
                  {' '}
                  ·{' '}
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">
                    {heavyAlternatives.length} {t('يتطلب عتاداً أعلى', 'need higher specs')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hardware Results Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3.5 px-5 font-semibold text-start">{t('البرنامج', 'Program')}</th>
                  <th className="py-3.5 px-5 font-semibold text-start">{t('RAM أدنى / موصى', 'Min / Rec RAM')}</th>
                  <th className="py-3.5 px-5 font-semibold text-start">{t('استهلاك فعلي', 'Actual RAM Use')}</th>
                  <th className="py-3.5 px-5 font-semibold text-start">{t('كرت الشاشة', 'GPU Requirement')}</th>
                  <th className="py-3.5 px-5 font-semibold text-start">{t('الخصائص الميدانية', 'Deployment & Spec')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedCompat.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-950/40">
                    <td className="py-3.5 px-5">
                      <a
                        href={`#program/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenProgramPage(item.id);
                        }}
                        className="font-display font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 block"
                      >
                        {item.name}
                      </a>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {translateLicenseCategory(item.licenseCategory)} ·{' '}
                        {translateMaintenanceStatus(item.maintenanceStatus)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs tabular-nums whitespace-nowrap">
                      {item.hardwareProfile.minRamGb} GB / {item.hardwareProfile.recRamGb} GB
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                      {item.hardwareProfile.actualRamUsage}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="block font-medium">
                        {translateGpuTier(item.hardwareProfile.gpuTier)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isAr ? item.hardwareProfile.gpuNoteAr : item.hardwareProfile.gpuNoteEn}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-300">
                      <span>
                        {item.lowSpecFriendly
                          ? t('مناسب للأجهزة الضعيفة', 'Low-spec friendly')
                          : t('متطلب متوسط/عالٍ', 'Standard/heavy load')}
                      </span>
                      <span> · </span>
                      <span>
                        {item.offlineCapable
                          ? t('يعمل دون إنترنت', 'Offline')
                          : t('سحابي/شبكي', 'Network')}
                      </span>
                      {item.portableAvailable && (
                        <span> · {t('Portable', 'Portable')}</span>
                      )}
                      {item.hardwareProfile.runsInBrowser && (
                        <span> · {t('متصفح Web', 'Browser')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {compatiblePrograms.length > 12 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => setShowAllHardwareRows((v) => !v)}
                className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer tabular-nums"
              >
                {showAllHardwareRows
                  ? t('عرض عدد أقل', 'Show Fewer')
                  : t(
                      `عرض جميع البرامج المتوافقة (${compatiblePrograms.length})`,
                      `Show All ${compatiblePrograms.length} Compatible Programs`
                    )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PART 2: GITHUB OPEN-SOURCE ENGINEERING RADAR */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Github className="w-4 h-4" />
            <span>{t('اكتشف المشاريع مفتوحة المصدر الجديدة والنشطة', 'GitHub Engineering Radar')}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
            {t(
              'راصد مشاريع GitHub في الهندسة، الـ BIM، والذكاء الاصطناعي',
              'Curated Open-Source Engineering Radar Across 6 Domains'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t(
              'نراقب هنا وتيرة التحديثات، عدد المساهمين، الإصدارات، ونضج الاستخدام الهندسي — لأن عدد نجوم GitHub وحده لا يكفي أبداً للحكم على جودة وموثوقية البرنامج الهندسي.',
              'We track release cadence, contributors, license clarity, and engineering validation — because GitHub star count alone never measures engineering reliability.'
            )}
          </p>
        </div>

        {/* Domain Filter */}
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {dom === 'all' ? t('جميع المجالات (6)', 'All Domains (6)') : dom}
            </button>
          ))}
        </div>

        {/* Radar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredGithubRadar.map((repo) => (
            <article
              key={repo.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-400 block">
                      {repo.domain}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {repo.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {isAr ? repo.activityLevelAr : repo.activityLevelEn}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr ? repo.summaryAr : repo.summaryEn}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="block text-[11px] text-slate-400">{t('التحديث:', 'Cadence:')}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {isAr ? repo.lastUpdateCadenceAr : repo.lastUpdateCadenceEn}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">{t('المساهمون:', 'Contributors:')}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                      {repo.contributorsRange}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">{t('الإصدارات:', 'Releases:')}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                      {repo.releasesInfo}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">{t('الترخيص:', 'License:')}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{repo.license}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {isAr ? repo.engineeringNoteAr : repo.engineeringNoteEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <a
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={repo.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>{t('الموقع الرسمي', 'Official')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {repo.programId && (
                  <button
                    type="button"
                    onClick={() => onOpenProgramPage(repo.programId!)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>{t('صفحة البرنامج', 'Program Page')}</span>
                    <NavArrow className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
