import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, FEATURE_TAGS } from '../data/catalog';
import {
  FeatureTag,
  LicenseType,
  OperatingSystem,
  SoftwareCategory,
  SoftwareEntry,
} from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSoftware: (entry: SoftwareEntry) => void;
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onAddSoftware }) => {
  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<SoftwareCategory>('bim-engineering');
  const [shortSummary, setShortSummary] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [bimTutorialUrl, setBimTutorialUrl] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureTag[]>(['دعم العربية']);

  // Best free alternative fields
  const [altName, setAltName] = useState('');
  const [altTagline, setAltTagline] = useState('');
  const [altLicense, setAltLicense] = useState<LicenseType>('مفتوح المصدر');
  const [altWebsite, setAltWebsite] = useState('');
  const [altDownloadUrl, setAltDownloadUrl] = useState('');
  const [altPlatforms, setAltPlatforms] = useState<OperatingSystem[]>(['Windows', 'macOS', 'Linux']);

  const { t, translateCategory, translateFeature, translateLicenseType } = useLanguage();

  if (!isOpen) return null;

  const togglePlatform = (os: OperatingSystem) => {
    setAltPlatforms((prev) =>
      prev.includes(os) ? (prev.length > 1 ? prev.filter((p) => p !== os) : prev) : [...prev, os]
    );
  };

  const toggleFeature = (feat: FeatureTag) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !altName.trim() || !altTagline.trim()) return;

    const cleanId = `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const monogram = name.trim().slice(0, 2).toUpperCase() || 'SW';
    const featuresList: FeatureTag[] =
      selectedFeatures.length > 0 ? selectedFeatures : ['دعم العربية'];

    const newEntry: SoftwareEntry = {
      id: cleanId,
      name: name.trim(),
      arabicName: arabicName.trim() || name.trim(),
      vendor: vendor.trim() || t('تجاري', 'Commercial'),
      category,
      licenseCategory: 'مدفوع',
      pricingNote: t('برنامج تجاري / مدفوع', 'Commercial / Paid Software'),
      platforms: ['Windows'],
      features: featuresList,
      shortSummary: shortSummary.trim() || t(`بدائل مجانية لبرنامج ${name.trim()}`, `Free alternatives to ${name.trim()}`),
      description:
        shortSummary.trim() ||
        t(
          `قائمة بأفضل البدائل المجانية ومفتوحة المصدر لبرنامج ${name.trim()}.`,
          `Directory of the best free and open-source alternatives to ${name.trim()}.`
        ),
      fileFormats: ['Standard'],
      arabicSupport: 'جيد',
      websiteUrl: downloadUrl.trim() || 'https://alternativeto.net/',
      downloadUrl: downloadUrl.trim() || 'https://alternativeto.net/',
      accentColor: '#1D4ED8',
      monogram,
      isUserSubmitted: true,
      bimArabiaTutorial: bimTutorialUrl.trim()
        ? {
            hasTutorial: true,
            title: `شرح ${name.trim()} في قناة بيم أرابيا`,
            url: bimTutorialUrl.trim(),
            topics: [t('شرح مضاف من المستخدم', 'User-submitted tutorial')],
            target: 'commercial',
          }
        : undefined,
      alternatives: [
        {
          id: `${cleanId}-alt-1`,
          name: altName.trim(),
          tagline: altTagline.trim(),
          description: altTagline.trim(),
          license: altLicense,
          licenseCategory: altLicense === 'مفتوح المصدر' ? 'مفتوح المصدر' : 'مجاني',
          licenseCode: altLicense === 'مفتوح المصدر' ? 'Open Source' : 'Freeware',
          platforms: altPlatforms,
          features: featuresList,
          websiteUrl: altWebsite.trim() || altDownloadUrl.trim() || 'https://alternativeto.net/',
          downloadUrl: altDownloadUrl.trim() || altWebsite.trim() || 'https://alternativeto.net/',
          isBestFree: true,
          likes: 1,
          keyAdvantages: [altTagline.trim()],
          fileFormats: ['Standard'],
          arabicSupport: 'جيد',
        },
      ],
    };

    onAddSoftware(newEntry);

    setName('');
    setArabicName('');
    setVendor('');
    setShortSummary('');
    setDownloadUrl('');
    setBimTutorialUrl('');
    setAltName('');
    setAltTagline('');
    setAltWebsite('');
    setAltDownloadUrl('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2
            id="add-modal-title"
            className="font-display text-lg font-bold text-slate-900 dark:text-white"
          >
            {t(
              'إضافة برنامج وبديل مجاني ورابط شرح بيم أرابيا',
              'Add Program, Free Alternative & BIM Arabia Link'
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('إغلاق', 'Close')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('بيانات البرنامج التجاري', 'Commercial Software Details')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('اسم البرنامج (بالإنجليزية) *', 'Program Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('مثال: Autodesk Robot', 'e.g. Autodesk Robot')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('الاسم بالعربية', 'Arabic Name (optional)')}
                </label>
                <input
                  type="text"
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  placeholder={t('مثال: روبوت الإنشائي', 'e.g. روبوت الإنشائي')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('الفئة', 'Category')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SoftwareCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {translateCategory(c.id)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('الشركة المطورة', 'Vendor / Developer')}
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder={t('مثال: Autodesk', 'e.g. Autodesk')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('وصف مختصر لوظيفة البرنامج', 'Short Summary')}
              </label>
              <input
                type="text"
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder={t(
                  'مثال: التحليل والتصميم الإنشائي للمباني الخرسانية والمعدنية',
                  'e.g. Structural analysis and design for concrete and steel buildings'
                )}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('رابط التحميل أو الموقع الرسمي (اختياري)', 'Official Website or Download URL (optional)')}
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('رابط الشرح في قناة بيم أرابيا (اختياري)', 'BIM Arabia YouTube Link (optional)')}
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={bimTutorialUrl}
                  onChange={(e) => setBimTutorialUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@omar_selim1/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {t('الميزات الرئيسية:', 'Key Features:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FEATURE_TAGS.map((feat) => (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                      selectedFeatures.includes(feat)
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {translateFeature(feat)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t('أفضل بديل مجاني مقترح', 'Suggested Best Free Alternative')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('اسم البديل المجاني *', 'Free Alternative Name *')}
                </label>
                <input
                  type="text"
                  required
                  value={altName}
                  onChange={(e) => setAltName(e.target.value)}
                  placeholder={t('مثال: CalculiX', 'e.g. CalculiX')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('نوع الترخيص', 'License Type')}
                </label>
                <select
                  value={altLicense}
                  onChange={(e) => setAltLicense(e.target.value as LicenseType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                >
                  <option value="مفتوح المصدر">{translateLicenseType('مفتوح المصدر')}</option>
                  <option value="مجاني بالكامل">{translateLicenseType('مجاني بالكامل')}</option>
                  <option value="مجاني للاستخدام الشخصي">
                    {translateLicenseType('مجاني للاستخدام الشخصي')}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('وصف ميزة البديل المجاني *', 'Alternative Key Advantage *')}
              </label>
              <input
                type="text"
                required
                value={altTagline}
                onChange={(e) => setAltTagline(e.target.value)}
                placeholder={t(
                  'مثال: محرك عناصر محدودة مجاني مفتوح المصدر للتحليل الإنشائي والميكانيكي',
                  'e.g. Free open-source finite element solver for structural & mechanical analysis'
                )}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('رابط الموقع الرسمي للبديل', 'Alternative Official Website')}
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={altWebsite}
                  onChange={(e) => setAltWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('رابط التحميل المباشر للبديل (اختياري)', 'Direct Download URL (optional)')}
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={altDownloadUrl}
                  onChange={(e) => setAltDownloadUrl(e.target.value)}
                  placeholder="https://.../download"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {t('أنظمة التشغيل:', 'Operating Systems:')}
              </span>
              {(['Windows', 'macOS', 'Linux', 'Web'] as OperatingSystem[]).map((os) => (
                <button
                  key={os}
                  type="button"
                  onClick={() => togglePlatform(os)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                    altPlatforms.includes(os)
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t('إلغاء', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
            >
              {t('إضافة إلى الدليل', 'Add to Directory')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
