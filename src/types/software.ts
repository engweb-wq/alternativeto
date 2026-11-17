export type SoftwareCategory =
  | 'bim-engineering'
  | 'design'
  | 'productivity'
  | 'development'
  | 'games'
  | 'video-audio';

export type OperatingSystem = 'Windows' | 'macOS' | 'Linux' | 'Web';

export type LicenseCategory = 'مدفوع' | 'مجاني' | 'مفتوح المصدر';

export type LicenseType =
  | 'مفتوح المصدر'
  | 'مجاني بالكامل'
  | 'مجاني للاستخدام الشخصي';

export type FeatureTag =
  | 'OpenBIM / IFC'
  | 'رسم 2D / DWG'
  | 'نمذجة 3D'
  | 'إظهار معماري'
  | 'دعم العربية'
  | 'إدارة مشاريع'
  | 'أتمتة وبرمجة'
  | 'محركات ألعاب'
  | 'تعديل PDF'
  | 'تحرير صور وفيكتور'
  | 'مونتاج فيديو'
  | 'يعمل على الويب';

export interface BimArabiaTutorial {
  hasTutorial: boolean;
  title: string;
  url: string;
  topics: string[];
  target: 'commercial' | 'alternative' | 'both';
}

export interface FreeAlternative {
  id: string;
  name: string;
  arabicName?: string;
  tagline: string;
  description: string;
  license: LicenseType;
  licenseCategory: 'مجاني' | 'مفتوح المصدر';
  licenseCode: string;
  platforms: OperatingSystem[];
  features: FeatureTag[];
  websiteUrl: string;
  isBestFree: boolean;
  likes: number;
  keyAdvantages: string[];
  fileFormats: string[];
  arabicSupport: 'ممتاز' | 'جيد' | 'محدود';
  bimArabiaTutorial?: BimArabiaTutorial;
}

export interface SoftwareEntry {
  id: string;
  name: string;
  arabicName: string;
  vendor: string;
  category: SoftwareCategory;
  licenseCategory: 'مدفوع';
  pricingNote: string;
  platforms: OperatingSystem[];
  features: FeatureTag[];
  shortSummary: string;
  description: string;
  fileFormats: string[];
  arabicSupport: 'ممتاز' | 'جيد' | 'محدود';
  websiteUrl: string;
  accentColor: string;
  monogram: string;
  bimArabiaTutorial?: BimArabiaTutorial;
  alternatives: FreeAlternative[];
  isUserSubmitted?: boolean;
}

export interface UnifiedProgramItem {
  id: string;
  kind: 'commercial' | 'alternative';
  name: string;
  arabicName: string;
  vendorOrBadge: string;
  category: SoftwareCategory;
  licenseCategory: LicenseCategory;
  licenseLabel: string;
  platforms: OperatingSystem[];
  features: FeatureTag[];
  shortSummary: string;
  description: string;
  fileFormats: string[];
  arabicSupport: 'ممتاز' | 'جيد' | 'محدود';
  websiteUrl: string;
  accentColor: string;
  monogram: string;
  likes: number;
  bimArabiaTutorial?: BimArabiaTutorial;
  parentCommercial?: SoftwareEntry;
  commercialEntry?: SoftwareEntry;
  alternativeEntry?: FreeAlternative;
}

export interface CategoryMeta {
  id: SoftwareCategory;
  label: string;
  description: string;
}
