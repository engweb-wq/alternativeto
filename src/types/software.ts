export type SoftwareCategory =
  | 'bim-engineering'
  | 'ai-tools'
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
  | 'ذكاء اصطناعي'
  | 'دعم العربية'
  | 'إدارة مشاريع'
  | 'أتمتة وبرمجة'
  | 'محركات ألعاب'
  | 'تعديل PDF'
  | 'تحرير صور وفيكتور'
  | 'مونتاج فيديو'
  | 'يعمل على الويب';

export type ReplacementTier =
  | 'near-equivalent'
  | 'most-tasks'
  | 'single-task'
  | 'complementary'
  | 'no-practical';

export type FunctionSupportLevel =
  | 'ممتاز'
  | 'جيد'
  | 'محدود'
  | 'مختلف'
  | 'غير متوفر'
  | 'يحتاج تقييم';

export interface ReplacementFunctionRow {
  fnAr: string;
  fnEn: string;
  status: FunctionSupportLevel;
  noteAr?: string;
  noteEn?: string;
}

export interface ReplacementAssessment {
  targetCommercialId: string;
  targetCommercialName: string;
  tier: ReplacementTier;
  illustrativePercent: number;
  basisNoteAr: string;
  basisNoteEn: string;
  functionRows: ReplacementFunctionRow[];
}

export type GpuRequirementTier = 'integrated' | 'mid' | 'dedicated';

export interface HardwareProfile {
  minRamGb: number;
  recRamGb: number;
  actualRamUsage: string;
  gpuTier: GpuRequirementTier;
  gpuNoteAr: string;
  gpuNoteEn: string;
  cpuAr: string;
  cpuEn: string;
  lowSpecFriendly: boolean;
  runsInBrowser: boolean;
  offlineCapable: boolean;
  portableAvailable: boolean;
}

export type MaintenanceStatus = 'active' | 'caution' | 'abandoned';

export type WorkspaceProductTab =
  | 'directory'
  | 'stacks'
  | 'compatibility'
  | 'migration'
  | 'hardware-github'
  | 'academy';

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
  downloadUrl?: string;
  githubUrl?: string;
  isBestFree: boolean;
  likes: number;
  rating?: number;
  ratingCount?: number;
  userRating?: number;
  keyAdvantages: string[];
  fileFormats: string[];
  arabicSupport: 'ممتاز' | 'جيد' | 'محدود';
  isArabicOrigin?: boolean;
  originLabel?: string;
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
  downloadUrl?: string;
  githubUrl?: string;
  accentColor: string;
  monogram: string;
  rating?: number;
  ratingCount?: number;
  userRating?: number;
  isArabicOrigin?: boolean;
  originLabel?: string;
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
  downloadUrl?: string;
  githubUrl?: string;
  accentColor: string;
  monogram: string;
  likes: number;
  rating: number;
  ratingCount: number;
  userRating?: number;
  isArabicOrigin?: boolean;
  originLabel?: string;
  bimArabiaTutorial?: BimArabiaTutorial;
  parentCommercial?: SoftwareEntry;
  commercialEntry?: SoftwareEntry;
  alternativeEntry?: FreeAlternative;
  replacementAssessment?: ReplacementAssessment;
  hardwareProfile: HardwareProfile;
  offlineCapable: boolean;
  portableAvailable: boolean;
  lowSpecFriendly: boolean;
  maintenanceStatus: MaintenanceStatus;
}

export interface CategoryMeta {
  id: SoftwareCategory;
  label: string;
  description: string;
}

export interface ProgramReview {
  id: string;
  programId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
