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
  const [bimTutorialUrl, setBimTutorialUrl] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureTag[]>(['دعم العربية']);

  // Best free alternative fields
  const [altName, setAltName] = useState('');
  const [altTagline, setAltTagline] = useState('');
  const [altLicense, setAltLicense] = useState<LicenseType>('مفتوح المصدر');
  const [altWebsite, setAltWebsite] = useState('');
  const [altPlatforms, setAltPlatforms] = useState<OperatingSystem[]>(['Windows', 'macOS', 'Linux']);

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
      vendor: vendor.trim() || 'تجاري',
      category,
      licenseCategory: 'مدفوع',
      pricingNote: 'برنامج تجاري / مدفوع',
      platforms: ['Windows'],
      features: featuresList,
      shortSummary: shortSummary.trim() || `بدائل مجانية لبرنامج ${name.trim()}`,
      description:
        shortSummary.trim() ||
        `قائمة بأفضل البدائل المجانية ومفتوحة المصدر لبرنامج ${name.trim()}.`,
      fileFormats: ['Standard'],
      arabicSupport: 'جيد',
      websiteUrl: 'https://alternativeto.net/',
      accentColor: '#1D4ED8',
      monogram,
      isUserSubmitted: true,
      bimArabiaTutorial: bimTutorialUrl.trim()
        ? {
            hasTutorial: true,
            title: `شرح ${name.trim()} في قناة بيم أرابيا`,
            url: bimTutorialUrl.trim(),
            topics: ['شرح مضاف من المستخدم'],
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
          websiteUrl: altWebsite.trim() || 'https://alternativeto.net/',
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
    setBimTutorialUrl('');
    setAltName('');
    setAltTagline('');
    setAltWebsite('');
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
            إضافة برنامج وبديل مجاني ورابط شرح بيم أرابيا
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              بيانات البرنامج التجاري
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  اسم البرنامج (بالإنجليزية) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: Autodesk Robot"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  الاسم بالعربية
                </label>
                <input
                  type="text"
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  placeholder="مثال: روبوت الإنشائي"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  الفئة
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SoftwareCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  الشركة المطورة
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="مثال: Autodesk"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                وصف مختصر لوظيفة البرنامج
              </label>
              <input
                type="text"
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder="مثال: التحليل والتصميم الإنشائي للمباني الخرسانية والمعدنية"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                رابط الشرح في قناة بيم أرابيا (اختياري)
              </label>
              <input
                type="url"
                value={bimTutorialUrl}
                onChange={(e) => setBimTutorialUrl(e.target.value)}
                placeholder="https://www.youtube.com/@omar_selim1/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                الميزات الرئيسية:
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
                    {feat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              أفضل بديل مجاني مقترح
            </h3>

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
                  placeholder="مثال: CalculiX"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  نوع الترخيص
                </label>
                <select
                  value={altLicense}
                  onChange={(e) => setAltLicense(e.target.value as LicenseType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
                >
                  <option value="مفتوح المصدر">مفتوح المصدر</option>
                  <option value="مجاني بالكامل">مجاني بالكامل</option>
                  <option value="مجاني للاستخدام الشخصي">مجاني للاستخدام الشخصي</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                وصف ميزة البديل المجاني *
              </label>
              <input
                type="text"
                required
                value={altTagline}
                onChange={(e) => setAltTagline(e.target.value)}
                placeholder="مثال: محرك عناصر محدودة مجاني مفتوح المصدر للتحليل الإنشائي والميكانيكي"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                رابط الموقع الرسمي للبديل
              </label>
              <input
                type="url"
                value={altWebsite}
                onChange={(e) => setAltWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">أنظمة التشغيل:</span>
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
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
            >
              إضافة إلى الدليل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
