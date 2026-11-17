import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ExternalLink,
  Plus,
  ThumbsUp,
  Youtube,
  Search,
} from 'lucide-react';
import { BIM_ARABIA_CHANNEL_URL, CATEGORIES } from '../data/catalog';
import {
  BimArabiaTutorial,
  FreeAlternative,
  LicenseType,
  OperatingSystem,
  UnifiedProgramItem,
} from '../types/software';

interface ProgramPageProps {
  program: UnifiedProgramItem;
  relatedPrograms: UnifiedProgramItem[];
  likedAltIds: Set<string>;
  savedAltIds: Set<string>;
  onBack: () => void;
  onOpenProgramPage: (programId: string) => void;
  onToggleLike: (altId: string) => void;
  onToggleSave: (altId: string) => void;
  onAddAlternativeToSoftware: (
    softwareId: string,
    newAlt: Omit<FreeAlternative, 'id' | 'likes' | 'isBestFree'>
  ) => void;
  onAttachBimTutorial: (programId: string, tutorial: BimArabiaTutorial) => void;
}

export const ProgramPage: React.FC<ProgramPageProps> = ({
  program,
  relatedPrograms,
  likedAltIds,
  savedAltIds,
  onBack,
  onOpenProgramPage,
  onToggleLike,
  onToggleSave,
  onAddAlternativeToSoftware,
  onAttachBimTutorial,
}) => {
  const [compareAltId, setCompareAltId] = useState<string | null>(null);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [showBimAttachForm, setShowBimAttachForm] = useState(false);

  // Suggest alternative state
  const [altName, setAltName] = useState('');
  const [altTagline, setAltTagline] = useState('');
  const [altLicense, setAltLicense] = useState<LicenseType>('مفتوح المصدر');
  const [altUrl, setAltUrl] = useState('');
  const [altPlatforms, setAltPlatforms] = useState<OperatingSystem[]>(['Windows']);

  // Attach BIM Arabia video state
  const [bimVideoUrl, setBimVideoUrl] = useState('');
  const [bimVideoTitle, setBimVideoTitle] = useState('');

  const categoryLabel = CATEGORIES.find((c) => c.id === program.category)?.label ?? program.category;
  const commercial = program.commercialEntry;
  const sortedAlternatives = commercial
    ? [...commercial.alternatives].sort((a, b) => {
        if (a.isBestFree !== b.isBestFree) return a.isBestFree ? -1 : 1;
        return b.likes - a.likes;
      })
    : [];

  const activeCompareAlt =
    sortedAlternatives.find((a) => a.id === compareAltId) ?? sortedAlternatives[0] ?? null;

  const bimSearchUrl = `${BIM_ARABIA_CHANNEL_URL}/search?query=${encodeURIComponent(program.name)}`;

  const togglePlatform = (os: OperatingSystem) => {
    setAltPlatforms((prev) =>
      prev.includes(os) ? (prev.length > 1 ? prev.filter((p) => p !== os) : prev) : [...prev, os]
    );
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercial || !altName.trim() || !altTagline.trim()) return;

    onAddAlternativeToSoftware(commercial.id, {
      name: altName.trim(),
      tagline: altTagline.trim(),
      description: altTagline.trim(),
      license: altLicense,
      licenseCategory: altLicense === 'مفتوح المصدر' ? 'مفتوح المصدر' : 'مجاني',
      licenseCode: altLicense === 'مفتوح المصدر' ? 'Open Source' : 'Freeware',
      platforms: altPlatforms,
      features: commercial.features,
      websiteUrl: altUrl.trim() || 'https://alternativeto.net/',
      keyAdvantages: ['مقترح من مجتمع بديلك'],
      fileFormats: commercial.fileFormats,
      arabicSupport: 'جيد',
    });

    setAltName('');
    setAltTagline('');
    setAltUrl('');
    setShowSuggestForm(false);
  };

  const handleAttachBimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bimVideoUrl.trim()) return;

    onAttachBimTutorial(program.id, {
      hasTutorial: true,
      title: bimVideoTitle.trim() || `فيديو شرح ${program.name} على قناة بيم أرابيا`,
      url: bimVideoUrl.trim(),
      topics: ['رابط فيديو مضاف من المستخدم لصفحة البرنامج'],
      target: program.kind === 'commercial' ? 'commercial' : 'alternative',
    });

    setBimVideoUrl('');
    setBimVideoTitle('');
    setShowBimAttachForm(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            الدليل الرئيسي
          </button>
          <span aria-hidden="true">/</span>
          <span>{categoryLabel}</span>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{program.name}</span>
        </nav>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الدليل</span>
        </button>
      </div>

      {/* Main Two-Column Program Page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Program Details & Alternatives */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-mono text-lg font-bold shrink-0"
                  style={{ backgroundColor: program.accentColor }}
                  aria-hidden="true"
                >
                  {program.monogram}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                    <span
                      className={`font-semibold ${
                        program.licenseCategory === 'مفتوح المصدر'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : program.licenseCategory === 'مجاني'
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {program.licenseCategory}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{categoryLabel}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{program.licenseLabel}</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {program.name}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {program.arabicName} · {program.vendorOrBadge}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {program.kind === 'alternative' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onToggleLike(program.id)}
                      aria-pressed={likedAltIds.has(program.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer tabular-nums ${
                        likedAltIds.has(program.id)
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{program.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSave(program.id)}
                      aria-pressed={savedAltIds.has(program.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        savedAltIds.has(program.id)
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {savedAltIds.has(program.id) ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      <span>{savedAltIds.has(program.id) ? 'في حقيبة أدواتي' : 'حفظ في حقيبة أدواتي'}</span>
                    </button>
                  </>
                )}

                <a
                  href={program.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>الموقع الرسمي</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {program.description}
            </p>

            {/* Technical Spec Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">أنظمة التشغيل المدعومة</p>
                <p className="font-medium text-slate-900 dark:text-white">{program.platforms.join(' · ')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">دعم اللغة العربية</p>
                <p className="font-medium text-slate-900 dark:text-white">{program.arabicSupport}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">الميزات الرئيسية</p>
                <p className="font-medium text-slate-900 dark:text-white">{program.features.join(' · ')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">صيغ الملفات</p>
                <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white">
                  {program.fileFormats.join(', ')}
                </p>
              </div>
            </div>

            {program.kind === 'alternative' && program.alternativeEntry && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  أبرز مزايا {program.name}
                </h2>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc pr-5">
                  {program.alternativeEntry.keyAdvantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>

                {program.parentCommercial && (
                  <div className="pt-3">
                    <a
                      href={`#program/${program.parentCommercial.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenProgramPage(program.parentCommercial!.id);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      <span>عرض صفحة البرنامج التجاري المقابل ({program.parentCommercial.name}) ومقارنته</span>
                      <ArrowUpLeft className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* If Commercial Program: Ranked Free Alternatives + Comparison Matrix */}
          {commercial && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    البدائل المجانية ومفتوحة المصدر لـ {commercial.name} ({sortedAlternatives.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowSuggestForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>اقترح بديلاً مجانياً</span>
                  </button>
                </div>

                {showSuggestForm && (
                  <form
                    onSubmit={handleSuggestSubmit}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          اسم البديل المجاني *
                        </label>
                        <input
                          type="text"
                          required
                          value={altName}
                          onChange={(e) => setAltName(e.target.value)}
                          placeholder="مثال: FreeCAD"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          نوع الترخيص
                        </label>
                        <select
                          value={altLicense}
                          onChange={(e) => setAltLicense(e.target.value as LicenseType)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                        >
                          <option value="مفتوح المصدر">مفتوح المصدر</option>
                          <option value="مجاني بالكامل">مجاني بالكامل</option>
                          <option value="مجاني للاستخدام الشخصي">مجاني للاستخدام الشخصي</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        أبرز ميزة في البديل *
                      </label>
                      <input
                        type="text"
                        required
                        value={altTagline}
                        onChange={(e) => setAltTagline(e.target.value)}
                        placeholder="وصف مختصر..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          الموقع الرسمي
                        </label>
                        <input
                          type="url"
                          value={altUrl}
                          onChange={(e) => setAltUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['Windows', 'macOS', 'Linux', 'Web'] as OperatingSystem[]).map((os) => (
                          <button
                            key={os}
                            type="button"
                            onClick={() => togglePlatform(os)}
                            className={`px-2.5 py-1.5 rounded text-xs font-medium border cursor-pointer ${
                              altPlatforms.includes(os)
                                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-700 dark:text-blue-300'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600'
                            }`}
                          >
                            {os}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSuggestForm(false)}
                        className="px-3.5 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        إضافة البديل
                      </button>
                    </div>
                  </form>
                )}

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  {sortedAlternatives.map((alt, idx) => (
                    <div key={alt.id} className="p-5 sm:p-6 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                            <span className="font-mono font-semibold text-slate-500 tabular-nums">
                              #{idx + 1}
                            </span>
                            {alt.isBestFree && (
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                أفضل بديل مجاني
                              </span>
                            )}
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {alt.license} ({alt.licenseCode})
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-slate-500 dark:text-slate-400">{alt.platforms.join(' / ')}</span>
                          </div>

                          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                            <a
                              href={`#program/${alt.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onOpenProgramPage(alt.id);
                              }}
                              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            >
                              {alt.name}
                            </a>
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleLike(alt.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer tabular-nums ${
                              likedAltIds.has(alt.id)
                                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{alt.likes}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleSave(alt.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                              savedAltIds.has(alt.id)
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {savedAltIds.has(alt.id) ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                            <span>{savedAltIds.has(alt.id) ? 'محفوظ' : 'حفظ'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {alt.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={`#program/${alt.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onOpenProgramPage(alt.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors"
                        >
                          <span>صفحة {alt.name}</span>
                          <ArrowUpLeft className="w-3.5 h-3.5" />
                        </a>

                        {alt.bimArabiaTutorial?.hasTutorial && (
                          <a
                            href={alt.bimArabiaTutorial.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold transition-colors"
                          >
                            <Youtube className="w-4 h-4" />
                            <span>فيديو الشرح في بيم أرابيا</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setCompareAltId(alt.id)}
                          className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          مقارنة في الجدول أدناه
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeCompareAlt && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    مقارنة مباشرة: {commercial.name} مقابل {activeCompareAlt.name}
                  </h2>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                    <table className="w-full text-right text-xs sm:text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4 font-semibold">المعيار</th>
                          <th className="py-3 px-4 font-semibold">{commercial.name}</th>
                          <th className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                            {activeCompareAlt.name}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="py-3 px-4 font-medium">الترخيص</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{commercial.pricingNote}</td>
                          <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">
                            {activeCompareAlt.license} ({activeCompareAlt.licenseCode})
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">الأنظمة</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{commercial.platforms.join(' · ')}</td>
                          <td className="py-3 px-4">{activeCompareAlt.platforms.join(' · ')}</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">صيغ الملفات</td>
                          <td className="py-3 px-4 font-mono text-xs">{commercial.fileFormats.join(', ')}</td>
                          <td className="py-3 px-4 font-mono text-xs">{activeCompareAlt.fileFormats.join(', ')}</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">دعم العربية</td>
                          <td className="py-3 px-4">{commercial.arabicSupport}</td>
                          <td className="py-3 px-4">{activeCompareAlt.arabicSupport}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Side Column: BIM Arabia YouTube Verification Right Next to Program Info */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
              <Youtube className="w-5 h-5 shrink-0" />
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                فيديو الشرح في قناة بيم أرابيا
              </h2>
            </div>

            {program.bimArabiaTutorial?.hasTutorial ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>تم التحقق: يتوفر شرح لهذا البرنامج على قناة بيم أرابيا (م. عمر سليم)</span>
                </div>

                <div>
                  <p className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {program.bimArabiaTutorial.title}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pr-4">
                    {program.bimArabiaTutorial.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <a
                  href={program.bimArabiaTutorial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                  <span>فتح رابط الشرح على يوتيوب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  نتيجة التحقق: لا يوجد رابط فيديو مخصص لبرنامج <span className="font-semibold text-slate-900 dark:text-white">{program.name}</span> مسجل في الدليل بعد ضمن قناة بيم أرابيا.
                </p>

                <a
                  href={bimSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>التحقق والبحث في قناة @omar_selim1</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowBimAttachForm((v) => !v)}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {program.bimArabiaTutorial?.hasTutorial
                  ? 'تحديث أو إضافة رابط فيديو مباشر من القناة'
                  : 'وجدت فيديو شرح في القناة؟ أضف الرابط هنا'}
              </button>

              {showBimAttachForm && (
                <form onSubmit={handleAttachBimSubmit} className="mt-3 space-y-2.5">
                  <input
                    type="url"
                    required
                    value={bimVideoUrl}
                    onChange={(e) => setBimVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="text"
                    value={bimVideoTitle}
                    onChange={(e) => setBimVideoTitle(e.target.value)}
                    placeholder="عنوان الفيديو (اختياري)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    ربط الفيديو بصفحة البرنامج
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Related Programs in same category */}
          {relatedPrograms.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                برامج أخرى في فئة {categoryLabel}
              </h2>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {relatedPrograms.map((rel) => (
                  <li key={rel.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <a
                        href={`#program/${rel.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenProgramPage(rel.id);
                        }}
                        className="font-display text-sm font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 truncate block"
                      >
                        {rel.name}
                      </a>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {rel.licenseCategory}
                      </span>
                    </div>
                    <a
                      href={`#program/${rel.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenProgramPage(rel.id);
                      }}
                      className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0"
                    >
                      عرض
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
