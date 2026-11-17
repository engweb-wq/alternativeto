import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Compass,
  Cpu,
  Layers,
  Milestone,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  BIM_ARABIA_CHANNEL_URL,
  INITIAL_SOFTWARE_CATALOG,
  applyUserRating,
  buildUnifiedProgramIndex,
  getBaseRating,
} from './data/catalog';
import { resolveProgramDownloadUrl } from './data/downloadLinks';
import { resolveProgramGithubUrl } from './data/githubRepos';
import { resolveBimArabiaTutorial } from './data/bimArabiaLinks';
import { resolveHardwareProfile } from './data/intelligenceData';
import { getSimilarPrograms } from './utils/recommendations';
import {
  BimArabiaTutorial,
  FeatureTag,
  FreeAlternative,
  LicenseCategory,
  OperatingSystem,
  ProgramReview,
  SoftwareCategory,
  SoftwareEntry,
  WorkspaceProductTab,
} from './types/software';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TaskFinderSection } from './components/TaskFinderSection';
import { WorkflowStacksView } from './components/WorkflowStacksView';
import { CompatibilityLabView } from './components/CompatibilityLabView';
import { MigrationPathsView } from './components/MigrationPathsView';
import { HardwareAndGithubView } from './components/HardwareAndGithubView';
import { AcademyView } from './components/AcademyView';
import { DirectoryViewMode, FilterToolbar, SortOption } from './components/FilterToolbar';
import { SoftwareCard } from './components/SoftwareCard';
import { UnifiedProgramCard } from './components/UnifiedProgramCard';
import { CategoryDirectorySection } from './components/CategoryDirectorySection';
import { BimArabiaSection } from './components/BimArabiaSection';
import { ProgramPage } from './components/ProgramPage';
import { AddEntryModal } from './components/AddEntryModal';
import { ToolkitDrawer } from './components/ToolkitDrawer';
import { CompareModal } from './components/CompareModal';
import { QuickCompareModal } from './components/QuickCompareModal';
import { FooterNewsletter } from './components/FooterNewsletter';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const STORAGE_KEYS = {
  LIKES: 'badeelak_liked_alts_v1',
  SAVED: 'badeelak_saved_alts_v1',
  COMPARE: 'badeelak_compare_ids_v1',
  RATINGS: 'badeelak_user_ratings_v1',
  REVIEWS: 'badeelak_program_reviews_v1',
  CUSTOM_ENTRIES: 'badeelak_custom_entries_v2',
  CUSTOM_ALTS: 'badeelak_custom_alts_v2',
  CUSTOM_BIM_LINKS: 'badeelak_custom_bim_v1',
  DOWNLOAD_URLS: 'badeelak_program_downloads_v1',
  MIGRATION_PROGRESS: 'badeelak_migration_progress_v1',
  THEME: 'badeelak_theme_v1',
};

const WORKSPACE_PRODUCTS: Array<{
  id: WorkspaceProductTab;
  ar: string;
  en: string;
  icon: typeof Compass;
}> = [
  { id: 'directory', ar: '1. دليل المهام والبرامج', en: '1. Tasks & Directory', icon: Compass },
  { id: 'stacks', ar: '2. منظومات العمل (7)', en: '2. Workflow Stacks (7)', icon: Layers },
  { id: 'compatibility', ar: '3. مختبر التوافق والمقارنة', en: '3. Compatibility Lab', icon: ArrowLeftRight },
  { id: 'migration', ar: '4. مسارات الانتقال', en: '4. Migration Plans', icon: Milestone },
  { id: 'hardware-github', ar: '5. العتاد و GitHub', en: '5. Hardware & GitHub', icon: Cpu },
  { id: 'academy', ar: '6. أكاديمية التعلم', en: '6. Learning Academy', icon: BookOpen },
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getProgramIdFromHash(): string | null {
  const hash = window.location.hash;
  if (hash.startsWith('#program/')) {
    return decodeURIComponent(hash.replace('#program/', '')) || null;
  }
  return null;
}

function AppContent() {
  const { t } = useLanguage();
  const [customEntries, setCustomEntries] = useState<SoftwareEntry[]>(() =>
    loadJson<SoftwareEntry[]>(STORAGE_KEYS.CUSTOM_ENTRIES, [])
  );
  const [customAltsBySoftware, setCustomAltsBySoftware] = useState<
    Record<string, FreeAlternative[]>
  >(() => loadJson<Record<string, FreeAlternative[]>>(STORAGE_KEYS.CUSTOM_ALTS, {}));
  const [customBimByProgram, setCustomBimByProgram] = useState<
    Record<string, BimArabiaTutorial>
  >(() => loadJson<Record<string, BimArabiaTutorial>>(STORAGE_KEYS.CUSTOM_BIM_LINKS, {}));
  const [customDownloadsByProgram, setCustomDownloadsByProgram] = useState<
    Record<string, string>
  >(() => loadJson<Record<string, string>>(STORAGE_KEYS.DOWNLOAD_URLS, {}));

  const [likedIds, setLikedIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.LIKES, [])
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.SAVED, [])
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.COMPARE, [])
  );
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() =>
    loadJson<Record<string, number>>(STORAGE_KEYS.RATINGS, {})
  );
  const [reviewsByProgram, setReviewsByProgram] = useState<Record<string, ProgramReview[]>>(() =>
    loadJson<Record<string, ProgramReview[]>>(STORAGE_KEYS.REVIEWS, {})
  );

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = loadJson<string | null>(STORAGE_KEYS.THEME, null);
    if (saved) return saved === 'dark';
    return false;
  });

  // Active Workspace Product Tab + Practical Filters
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceProductTab>('directory');
  const [compatibilityFlowId, setCompatibilityFlowId] = useState<string | null>(null);
  const [migrationCompletedSteps, setMigrationCompletedSteps] = useState<Record<string, boolean>>(
    () => loadJson<Record<string, boolean>>(STORAGE_KEYS.MIGRATION_PROGRESS, {})
  );

  // Advanced Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');
  const [selectedLicense, setSelectedLicense] = useState<LicenseCategory | 'all'>('all');
  const [selectedOSList, setSelectedOSList] = useState<OperatingSystem[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureTag[]>([]);
  const [onlyBimTutorials, setOnlyBimTutorials] = useState(false);
  const [onlyArabicOrigin, setOnlyArabicOrigin] = useState(false);
  const [onlyGithub, setOnlyGithub] = useState(false);
  const [onlyOffline, setOnlyOffline] = useState(false);
  const [onlyPortable, setOnlyPortable] = useState(false);
  const [onlyLowSpec, setOnlyLowSpec] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<DirectoryViewMode>('alternatives');

  // Dedicated Program Page Route & Modals
  const [activeProgramId, setActiveProgramId] = useState<string | null>(() =>
    getProgramIdFromHash()
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickCompareProgramId, setQuickCompareProgramId] = useState<string | null>(null);

  // Sync URL hash for program pages
  useEffect(() => {
    const handleHashChange = () => {
      setActiveProgramId(getProgramIdFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openProgramPage = (programId: string) => {
    window.location.hash = `program/${encodeURIComponent(programId)}`;
    setActiveProgramId(programId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProgramPage = () => {
    if (window.location.hash.startsWith('#program/')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setActiveProgramId(null);
  };

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark ? 'dark' : 'light'));
  }, [isDark]);

  // Persist user data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewsByProgram));
  }, [reviewsByProgram]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENTRIES, JSON.stringify(customEntries));
  }, [customEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ALTS, JSON.stringify(customAltsBySoftware));
  }, [customAltsBySoftware]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BIM_LINKS, JSON.stringify(customBimByProgram));
  }, [customBimByProgram]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOWNLOAD_URLS, JSON.stringify(customDownloadsByProgram));
  }, [customDownloadsByProgram]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MIGRATION_PROGRESS, JSON.stringify(migrationCompletedSteps));
  }, [migrationCompletedSteps]);

  const likedAltSet = useMemo(() => new Set(likedIds), [likedIds]);
  const savedAltSet = useMemo(() => new Set(savedIds), [savedIds]);
  const compareIdSet = useMemo(() => new Set(compareIds), [compareIds]);

  // Merge base catalog + user entries + user alternatives + live like increments + live star ratings + user BIM Arabia links
  const catalog: SoftwareEntry[] = useMemo(() => {
    const mergedBase = [...customEntries, ...INITIAL_SOFTWARE_CATALOG];
    return mergedBase.map((entry) => {
      const extraAlts = customAltsBySoftware[entry.id] ?? [];
      const allAlts = [...entry.alternatives, ...extraAlts].map((alt) => {
        const likes = alt.likes + (likedAltSet.has(alt.id) ? 1 : 0);
        const baseAlt = getBaseRating(alt.id, alt.likes, 'alternative', alt.isBestFree);
        const altUserRating = userRatings[alt.id];
        const altRated = applyUserRating(
          alt.rating ?? baseAlt.rating,
          alt.ratingCount ?? baseAlt.ratingCount,
          altUserRating
        );

        return {
          ...alt,
          likes,
          downloadUrl: resolveProgramDownloadUrl(
            alt.id,
            alt.websiteUrl,
            customDownloadsByProgram[alt.id] ?? alt.downloadUrl
          ),
          githubUrl: resolveProgramGithubUrl(alt.id, alt.githubUrl),
          rating: altRated.average,
          ratingCount: altRated.count,
          userRating: altUserRating,
          bimArabiaTutorial:
            customBimByProgram[alt.id] ?? resolveBimArabiaTutorial(alt.id, alt.bimArabiaTutorial),
        };
      });

      const topBaseLikes = Math.max(...entry.alternatives.map((a) => a.likes), 0);
      const baseCom = getBaseRating(entry.id, topBaseLikes, 'commercial');
      const comUserRating = userRatings[entry.id];
      const comRated = applyUserRating(
        entry.rating ?? baseCom.rating,
        entry.ratingCount ?? baseCom.ratingCount,
        comUserRating
      );

      return {
        ...entry,
        downloadUrl: resolveProgramDownloadUrl(
          entry.id,
          entry.websiteUrl,
          customDownloadsByProgram[entry.id] ?? entry.downloadUrl
        ),
        githubUrl: resolveProgramGithubUrl(entry.id, entry.githubUrl),
        rating: comRated.average,
        ratingCount: comRated.count,
        userRating: comUserRating,
        bimArabiaTutorial:
          customBimByProgram[entry.id] ?? resolveBimArabiaTutorial(entry.id, entry.bimArabiaTutorial),
        alternatives: allAlts,
      };
    });
  }, [
    customEntries,
    customAltsBySoftware,
    customBimByProgram,
    customDownloadsByProgram,
    likedAltSet,
    userRatings,
  ]);

  const unifiedPrograms = useMemo(() => buildUnifiedProgramIndex(catalog), [catalog]);

  // KPI metrics
  const stats = useMemo(() => {
    const totalCommercial = catalog.length;
    const totalFreeAlternatives = catalog.reduce((acc, s) => acc + s.alternatives.length, 0);
    const totalBimTutorials = unifiedPrograms.filter((p) => p.bimArabiaTutorial?.hasTutorial).length;
    return {
      totalCommercial,
      totalFreeAlternatives,
      totalBimTutorials,
    };
  }, [catalog, unifiedPrograms]);

  // Filtered commercial + best-free-alternative pairs
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = catalog.filter((entry) => {
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }

      if (selectedLicense === 'مدفوع') {
        // Commercial entries are paid
      } else if (selectedLicense !== 'all') {
        if (!entry.alternatives.some((alt) => alt.licenseCategory === selectedLicense)) {
          return false;
        }
      }

      const hasBimTutorial =
        Boolean(entry.bimArabiaTutorial?.hasTutorial) ||
        entry.alternatives.some((alt) => Boolean(alt.bimArabiaTutorial?.hasTutorial));
      if (onlyBimTutorials && !hasBimTutorial) {
        return false;
      }

      const hasArabicOrigin =
        Boolean(entry.isArabicOrigin) ||
        entry.alternatives.some((alt) => Boolean(alt.isArabicOrigin));
      if (onlyArabicOrigin && !hasArabicOrigin) {
        return false;
      }

      const hasGithubRepo =
        Boolean(resolveProgramGithubUrl(entry.id, entry.githubUrl)) ||
        entry.alternatives.some((alt) => Boolean(resolveProgramGithubUrl(alt.id, alt.githubUrl)));
      if (onlyGithub && !hasGithubRepo) {
        return false;
      }

      if (onlyOffline) {
        const entryHw = resolveHardwareProfile(entry);
        const anyAltOffline = entry.alternatives.some(
          (a) => resolveHardwareProfile({ ...a, category: entry.category }).offlineCapable
        );
        if (!entryHw.offlineCapable && !anyAltOffline) return false;
      }

      if (onlyPortable) {
        const entryHw = resolveHardwareProfile(entry);
        const anyAltPortable = entry.alternatives.some(
          (a) => resolveHardwareProfile({ ...a, category: entry.category }).portableAvailable
        );
        if (!entryHw.portableAvailable && !anyAltPortable) return false;
      }

      if (onlyLowSpec) {
        const entryHw = resolveHardwareProfile(entry);
        const anyAltLowSpec = entry.alternatives.some(
          (a) => resolveHardwareProfile({ ...a, category: entry.category }).lowSpecFriendly
        );
        if (!entryHw.lowSpecFriendly && !anyAltLowSpec) return false;
      }

      if (selectedOSList.length > 0) {
        const matchesOS = selectedOSList.every(
          (os) =>
            entry.platforms.includes(os) ||
            entry.alternatives.some((alt) => alt.platforms.includes(os))
        );
        if (!matchesOS) return false;
      }

      if (selectedFeatures.length > 0) {
        const entryAndAltFeatures = new Set<FeatureTag>([
          ...entry.features,
          ...entry.alternatives.flatMap((a) => a.features),
        ]);
        if (!selectedFeatures.every((f) => entryAndAltFeatures.has(f))) {
          return false;
        }
      }

      if (q) {
        const matchesCommercial =
          entry.name.toLowerCase().includes(q) ||
          entry.arabicName.toLowerCase().includes(q) ||
          entry.vendor.toLowerCase().includes(q) ||
          entry.shortSummary.toLowerCase().includes(q) ||
          entry.fileFormats.some((f) => f.toLowerCase().includes(q));

        const matchesAlternative = entry.alternatives.some(
          (alt) =>
            alt.name.toLowerCase().includes(q) ||
            (alt.arabicName && alt.arabicName.toLowerCase().includes(q)) ||
            alt.tagline.toLowerCase().includes(q)
        );

        if (!matchesCommercial && !matchesAlternative) {
          return false;
        }
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'highest-rated') {
        const aTopRating = Math.max(...a.alternatives.map((x) => x.rating ?? 0), 0);
        const bTopRating = Math.max(...b.alternatives.map((x) => x.rating ?? 0), 0);
        if (bTopRating !== aTopRating) return bTopRating - aTopRating;
      }
      if (sortBy === 'lightest-ram') {
        const aMinRam = Math.min(
          ...a.alternatives.map((x) => resolveHardwareProfile({ ...x, category: a.category }).minRamGb),
          16
        );
        const bMinRam = Math.min(
          ...b.alternatives.map((x) => resolveHardwareProfile({ ...x, category: b.category }).minRamGb),
          16
        );
        if (aMinRam !== bMinRam) return aMinRam - bMinRam;
      }
      if (sortBy === 'bim-first') {
        const aHas =
          Boolean(a.bimArabiaTutorial?.hasTutorial) ||
          a.alternatives.some((alt) => Boolean(alt.bimArabiaTutorial?.hasTutorial));
        const bHas =
          Boolean(b.bimArabiaTutorial?.hasTutorial) ||
          b.alternatives.some((alt) => Boolean(alt.bimArabiaTutorial?.hasTutorial));
        if (aHas !== bHas) return aHas ? -1 : 1;
      }
      if (sortBy === 'most-alternatives') {
        if (b.alternatives.length !== a.alternatives.length) {
          return b.alternatives.length - a.alternatives.length;
        }
      }
      const aTopLikes = Math.max(...a.alternatives.map((x) => x.likes), 0);
      const bTopLikes = Math.max(...b.alternatives.map((x) => x.likes), 0);
      return bTopLikes - aTopLikes;
    });
  }, [
    catalog,
    searchQuery,
    selectedCategory,
    selectedLicense,
    selectedOSList,
    selectedFeatures,
    onlyBimTutorials,
    onlyArabicOrigin,
    onlyGithub,
    onlyOffline,
    onlyPortable,
    onlyLowSpec,
    sortBy,
  ]);

  // Filtered unified individual programs (for Advanced Search across Paid, Free, Open-Source)
  const filteredUnifiedPrograms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = unifiedPrograms.filter((prog) => {
      if (selectedCategory !== 'all' && prog.category !== selectedCategory) {
        return false;
      }

      if (selectedLicense !== 'all' && prog.licenseCategory !== selectedLicense) {
        return false;
      }

      if (onlyBimTutorials && !prog.bimArabiaTutorial?.hasTutorial) {
        return false;
      }

      if (onlyArabicOrigin && !prog.isArabicOrigin) {
        return false;
      }

      if (onlyGithub && !prog.githubUrl) {
        return false;
      }

      if (onlyOffline && !prog.offlineCapable) {
        return false;
      }

      if (onlyPortable && !prog.portableAvailable) {
        return false;
      }

      if (onlyLowSpec && !prog.lowSpecFriendly) {
        return false;
      }

      if (selectedOSList.length > 0 && !selectedOSList.every((os) => prog.platforms.includes(os))) {
        return false;
      }

      if (selectedFeatures.length > 0 && !selectedFeatures.every((f) => prog.features.includes(f))) {
        return false;
      }

      if (q) {
        const matches =
          prog.name.toLowerCase().includes(q) ||
          prog.arabicName.toLowerCase().includes(q) ||
          prog.vendorOrBadge.toLowerCase().includes(q) ||
          prog.shortSummary.toLowerCase().includes(q) ||
          prog.fileFormats.some((f) => f.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'highest-rated') {
        if (b.rating !== a.rating) return b.rating - a.rating;
      }
      if (sortBy === 'lightest-ram') {
        if (a.hardwareProfile.minRamGb !== b.hardwareProfile.minRamGb) {
          return a.hardwareProfile.minRamGb - b.hardwareProfile.minRamGb;
        }
      }
      if (sortBy === 'bim-first') {
        const aHas = Boolean(a.bimArabiaTutorial?.hasTutorial);
        const bHas = Boolean(b.bimArabiaTutorial?.hasTutorial);
        if (aHas !== bHas) return aHas ? -1 : 1;
      }
      return b.likes - a.likes;
    });
  }, [
    unifiedPrograms,
    searchQuery,
    selectedCategory,
    selectedLicense,
    selectedOSList,
    selectedFeatures,
    onlyBimTutorials,
    onlyArabicOrigin,
    onlyGithub,
    onlyOffline,
    onlyPortable,
    onlyLowSpec,
    sortBy,
  ]);

  const activeProgram = useMemo(
    () => (activeProgramId ? unifiedPrograms.find((p) => p.id === activeProgramId) ?? null : null),
    [unifiedPrograms, activeProgramId]
  );

  const similarPrograms = useMemo(() => {
    if (!activeProgram) return [];
    return getSimilarPrograms(activeProgram, unifiedPrograms, 6);
  }, [unifiedPrograms, activeProgram]);

  const quickComparePair = useMemo(() => {
    if (!quickCompareProgramId) return null;
    const selected = unifiedPrograms.find((p) => p.id === quickCompareProgramId);
    if (!selected) return null;

    if (selected.kind === 'commercial' && selected.commercialEntry) {
      const sortedAlts = [...selected.commercialEntry.alternatives].sort((a, b) => {
        if (a.isBestFree !== b.isBestFree) return a.isBestFree ? -1 : 1;
        return b.likes - a.likes;
      });
      const bestAlt = sortedAlts[0];
      const counterpart = bestAlt
        ? unifiedPrograms.find((p) => p.id === bestAlt.id) ?? null
        : null;
      return counterpart
        ? {
            selectedProgram: selected,
            counterpartProgram: counterpart,
            counterpartRoleLabel: t('أفضل بديل مجاني', 'Best Free Alternative'),
          }
        : null;
    }

    if (selected.kind === 'alternative' && selected.parentCommercial) {
      const sortedAlts = [...selected.parentCommercial.alternatives].sort((a, b) => {
        if (a.isBestFree !== b.isBestFree) return a.isBestFree ? -1 : 1;
        return b.likes - a.likes;
      });
      const bestAlt = sortedAlts[0];

      if (bestAlt && bestAlt.id !== selected.id) {
        const counterpart = unifiedPrograms.find((p) => p.id === bestAlt.id) ?? null;
        if (counterpart) {
          return {
            selectedProgram: selected,
            counterpartProgram: counterpart,
            counterpartRoleLabel: t('أفضل بديل مجاني', 'Best Free Alternative'),
          };
        }
      }

      const parentProgram =
        unifiedPrograms.find((p) => p.id === selected.parentCommercial?.id) ?? null;
      return parentProgram
        ? {
            selectedProgram: selected,
            counterpartProgram: parentProgram,
            counterpartRoleLabel: t('البرنامج التجاري المقابل', 'Commercial Counterpart'),
          }
        : null;
    }

    return null;
  }, [quickCompareProgramId, unifiedPrograms, t]);

  const weeklyFeaturedAlternatives = useMemo(() => {
    const preferredIds = ['ollama', 'bonsai-blenderbim', 'comfyui'];
    const preferred = preferredIds
      .map((id) => unifiedPrograms.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    if (preferred.length >= 3) return preferred.slice(0, 3);

    return unifiedPrograms
      .filter((p) => p.kind === 'alternative')
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  }, [unifiedPrograms]);

  const savedItems = useMemo(() => {
    const items: Array<{ software: SoftwareEntry; alternative: FreeAlternative }> = [];
    for (const sw of catalog) {
      for (const alt of sw.alternatives) {
        if (savedAltSet.has(alt.id)) {
          items.push({ software: sw, alternative: alt });
        }
      }
    }
    return items;
  }, [catalog, savedAltSet]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'all' ||
    selectedLicense !== 'all' ||
    selectedOSList.length > 0 ||
    selectedFeatures.length > 0 ||
    onlyBimTutorials ||
    onlyArabicOrigin ||
    onlyGithub ||
    onlyOffline ||
    onlyPortable ||
    onlyLowSpec;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLicense('all');
    setSelectedOSList([]);
    setSelectedFeatures([]);
    setOnlyBimTutorials(false);
    setOnlyArabicOrigin(false);
    setOnlyGithub(false);
    setOnlyOffline(false);
    setOnlyPortable(false);
    setOnlyLowSpec(false);
    setSortBy('popular');
  };

  const handleToggleOS = (os: OperatingSystem) => {
    setSelectedOSList((prev) =>
      prev.includes(os) ? prev.filter((item) => item !== os) : [...prev, os]
    );
  };

  const handleToggleFeature = (feat: FeatureTag) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((item) => item !== feat) : [...prev, feat]
    );
  };

  const handleLicenseChange = (lic: LicenseCategory | 'all') => {
    setSelectedLicense(lic);
    if (lic !== 'all') {
      setViewMode('unified');
    }
  };

  const handleToggleLike = (altId: string) => {
    setLikedIds((prev) =>
      prev.includes(altId) ? prev.filter((id) => id !== altId) : [...prev, altId]
    );
  };

  const handleToggleSave = (altId: string) => {
    setSavedIds((prev) =>
      prev.includes(altId) ? prev.filter((id) => id !== altId) : [...prev, altId]
    );
  };

  const handleSaveMultiple = (programIds: string[]) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      for (const id of programIds) {
        next.add(id);
      }
      return Array.from(next);
    });
  };

  const handleToggleMigrationStep = (stepKey: string) => {
    setMigrationCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleResetMigrationPath = (pathId: string) => {
    setMigrationCompletedSteps((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${pathId}-`)) {
          delete next[key];
        }
      }
      return next;
    });
  };

  const handleToggleCompare = (programId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId);
      }
      if (prev.length >= 5) {
        return [...prev.slice(1), programId];
      }
      return [...prev, programId];
    });
  };

  const handleLaunchPresetCompare = (programIds: string[]) => {
    setCompareIds(programIds.slice(0, 5));
    setIsCompareOpen(true);
  };

  const handleRateProgram = (programId: string, stars: number) => {
    setUserRatings((prev) => ({
      ...prev,
      [programId]: stars,
    }));
  };

  const handleAddReview = (
    programId: string,
    review: { authorName: string; rating: number; comment: string }
  ) => {
    const newReview: ProgramReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      programId,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toISOString(),
    };

    setReviewsByProgram((prev) => ({
      ...prev,
      [programId]: [newReview, ...(prev[programId] ?? [])],
    }));

    setUserRatings((prev) => ({
      ...prev,
      [programId]: review.rating,
    }));
  };

  const handleDeleteReview = (programId: string, reviewId: string) => {
    setReviewsByProgram((prev) => {
      const existing = prev[programId] ?? [];
      return {
        ...prev,
        [programId]: existing.filter((r) => r.id !== reviewId),
      };
    });
  };

  const handleAddSoftware = (entry: SoftwareEntry) => {
    setCustomEntries((prev) => [entry, ...prev]);
    handleResetFilters();
    openProgramPage(entry.id);
  };

  const handleAddAlternativeToSoftware = (
    softwareId: string,
    newAlt: Omit<FreeAlternative, 'id' | 'likes' | 'isBestFree'>
  ) => {
    const altObj: FreeAlternative = {
      ...newAlt,
      id: `user-alt-${Date.now()}`,
      likes: 1,
      isBestFree: false,
    };

    setCustomAltsBySoftware((prev) => ({
      ...prev,
      [softwareId]: [...(prev[softwareId] ?? []), altObj],
    }));
  };

  const handleAttachBimTutorial = (programId: string, tutorial: BimArabiaTutorial) => {
    setCustomBimByProgram((prev) => ({
      ...prev,
      [programId]: tutorial,
    }));
  };

  const handleUpdateDownloadUrl = (programId: string, downloadUrl: string) => {
    const cleanUrl = downloadUrl.trim();
    if (!cleanUrl) return;
    setCustomDownloadsByProgram((prev) => ({
      ...prev,
      [programId]: cleanUrl,
    }));
  };

  const handleNavigateHome = (sectionId?: string) => {
    closeProgramPage();
    if (sectionId) {
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 40);
    }
  };

  const displayedCount =
    viewMode === 'unified' ? filteredUnifiedPrograms.length : filteredCatalog.length;

  const migrationCompletedCount = useMemo(
    () => Object.values(migrationCompletedSteps).filter(Boolean).length,
    [migrationCompletedSteps]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header
        activeTab={activeWorkspaceTab}
        onSelectTab={(tab) => {
          closeProgramPage();
          setActiveWorkspaceTab(tab);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      {/* Unified 6-Product Workspace Bar (Accessible across Desktop & Mobile) */}
      {!activeProgram && (
        <nav
          aria-label={t('منتجات منصة بديلك', 'Badeelak Workspace Products')}
          className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex items-center gap-2 overflow-x-auto">
            {WORKSPACE_PRODUCTS.map((prod) => {
              const Icon = prod.icon;
              const active = activeWorkspaceTab === prod.id;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveWorkspaceTab(prod.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(prod.ar, prod.en)}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <main className="flex-1">
        {activeProgram ? (
          <ProgramPage
            program={activeProgram}
            similarPrograms={similarPrograms}
            reviews={reviewsByProgram[activeProgram.id] ?? []}
            likedAltIds={likedAltSet}
            savedAltIds={savedAltSet}
            compareIds={compareIdSet}
            onBack={closeProgramPage}
            onOpenProgramPage={openProgramPage}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onRateProgram={handleRateProgram}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            onAddAlternativeToSoftware={handleAddAlternativeToSoftware}
            onAttachBimTutorial={handleAttachBimTutorial}
            onUpdateDownloadUrl={handleUpdateDownloadUrl}
            onOpenMigrationPaths={() => {
              closeProgramPage();
              setActiveWorkspaceTab('migration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeWorkspaceTab === 'stacks' ? (
          <WorkflowStacksView
            programs={unifiedPrograms}
            savedIds={savedAltSet}
            onOpenProgramPage={openProgramPage}
            onSaveMultiple={handleSaveMultiple}
            onOpenCompatibilityLab={() => {
              setActiveWorkspaceTab('compatibility');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeWorkspaceTab === 'compatibility' ? (
          <CompatibilityLabView
            programs={unifiedPrograms}
            initialFlowId={compatibilityFlowId}
            onOpenProgramPage={openProgramPage}
            onLaunchPresetCompare={handleLaunchPresetCompare}
          />
        ) : activeWorkspaceTab === 'migration' ? (
          <MigrationPathsView
            completedSteps={migrationCompletedSteps}
            onToggleStep={handleToggleMigrationStep}
            onResetPathSteps={handleResetMigrationPath}
            onOpenProgramPage={openProgramPage}
          />
        ) : activeWorkspaceTab === 'hardware-github' ? (
          <HardwareAndGithubView
            programs={unifiedPrograms}
            onOpenProgramPage={openProgramPage}
          />
        ) : activeWorkspaceTab === 'academy' ? (
          <AcademyView
            onOpenProgramPage={openProgramPage}
            onOpenBimFilteredDirectory={() => {
              setActiveWorkspaceTab('directory');
              setOnlyBimTutorials(true);
              setSelectedCategory('all');
              setTimeout(() => {
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            onOpenMigrationPaths={() => {
              setActiveWorkspaceTab('migration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCommercial={stats.totalCommercial}
              totalFreeAlternatives={stats.totalFreeAlternatives}
              totalBimTutorials={stats.totalBimTutorials}
              savedCount={savedItems.length}
              programs={unifiedPrograms}
              onSelectProgram={openProgramPage}
              onQuickSearch={(term) => {
                setSearchQuery(term);
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <TaskFinderSection
              programs={unifiedPrograms}
              savedIds={savedAltSet}
              onOpenProgramPage={openProgramPage}
              onFilterByTask={({ searchKeyword, category }) => {
                setSearchQuery(searchKeyword);
                setSelectedCategory(category);
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenInCompatibilityLab={(flowId) => {
                setCompatibilityFlowId(flowId);
                setActiveWorkspaceTab('compatibility');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToggleSave={handleToggleSave}
            />

            <FilterToolbar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLicense={selectedLicense}
              onLicenseChange={handleLicenseChange}
              selectedOSList={selectedOSList}
              onToggleOS={handleToggleOS}
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
              onlyBimTutorials={onlyBimTutorials}
              onToggleBimTutorials={() => setOnlyBimTutorials((v) => !v)}
              onlyArabicOrigin={onlyArabicOrigin}
              onToggleArabicOrigin={() => setOnlyArabicOrigin((v) => !v)}
              onlyGithub={onlyGithub}
              onToggleGithub={() => setOnlyGithub((v) => !v)}
              onlyOffline={onlyOffline}
              onToggleOffline={() => setOnlyOffline((v) => !v)}
              onlyPortable={onlyPortable}
              onTogglePortable={() => setOnlyPortable((v) => !v)}
              onlyLowSpec={onlyLowSpec}
              onToggleLowSpec={() => setOnlyLowSpec((v) => !v)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isDark={isDark}
              onToggleDark={() => setIsDark((v) => !v)}
              compareCount={compareIds.length}
              onOpenCompare={() => setIsCompareOpen(true)}
              resultCount={displayedCount}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
            />

            {/* Directory Grid */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
              {displayedCount === 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {t(
                      'لم يتم العثور على برامج مطابقة لمعايير البحث المتقدم',
                      'No programs found matching your filter criteria'
                    )}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    {t(
                      'جرب تعديل نظام التشغيل أو نوع الترخيص أو الميزات المختارة، أو أضف البرنامج مباشرة إلى الدليل.',
                      'Try adjusting the selected operating system, license type, or features, or add the software directly to the directory.'
                    )}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t('عرض كل البرامج', 'Show All Programs')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                    >
                      {t('أضف برنامجاً جديداً', 'Add New Program')}
                    </button>
                  </div>
                </div>
              ) : viewMode === 'unified' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredUnifiedPrograms.map((item) => (
                    <UnifiedProgramCard
                      key={item.id}
                      item={item}
                      isCompared={compareIdSet.has(item.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenProgramPage={openProgramPage}
                      onRateProgram={handleRateProgram}
                      onQuickCompare={(id) => setQuickCompareProgramId(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCatalog.map((entry) => (
                    <SoftwareCard
                      key={entry.id}
                      entry={entry}
                      likedAltIds={likedAltSet}
                      savedAltIds={savedAltSet}
                      compareIds={compareIdSet}
                      onToggleLike={(_swId, altId) => handleToggleLike(altId)}
                      onToggleSave={handleToggleSave}
                      onToggleCompare={handleToggleCompare}
                      onRateProgram={handleRateProgram}
                      onSelectSoftware={openProgramPage}
                      onQuickCompare={(id) => setQuickCompareProgramId(id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <CategoryDirectorySection
              unifiedPrograms={unifiedPrograms}
              onOpenProgramPage={openProgramPage}
              onSelectCategoryFilter={(cat) => setSelectedCategory(cat)}
            />

            <BimArabiaSection
              onFilterBimOnly={() => {
                setOnlyBimTutorials(true);
                setSelectedCategory('all');
              }}
            />
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
          <FooterNewsletter
            featuredAlternatives={weeklyFeaturedAlternatives}
            onOpenProgramPage={openProgramPage}
          />

          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <p>
              {t(
                'بديلك — دليل عربي مفتوح للبدائل المجانية للبرامج الهندسية والتصميمية',
                'Badeelak — Open Directory of Free & Open-Source Software Alternatives'
              )}
            </p>
            <div className="flex items-center gap-6">
              <a
                href={BIM_ARABIA_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {t('قناة بيم أرابيا على يوتيوب', 'BIM Arabia on YouTube')}
              </a>
              <button
                type="button"
                onClick={() => setIsToolkitOpen(true)}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {t('حقيبة أدواتي', 'My Toolkit')} ({savedItems.length})
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {t('أضف برنامج أو شرح', 'Add Program or Tutorial')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Compact Single-Row Comparison Tray (visible only when >= 1 program selected) */}
      {compareIds.length > 0 && !isCompareOpen && (
        <div className="sticky bottom-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 text-xs sm:text-sm">
              <ArrowLeftRight className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                {t('محدد للمقارنة', 'Selected to compare')} ({compareIds.length}):
              </span>
              <span className="text-slate-600 dark:text-slate-300 truncate">
                {compareIds
                  .map((id) => unifiedPrograms.find((p) => p.id === id)?.name)
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCompareOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                {compareIds.length >= 2
                  ? t('عرض جدول المقارنة', 'View Comparison Table')
                  : t('أضف برنامجاً ثانياً', 'Add 2nd Program')}
              </button>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                aria-label={t('مسح قائمة المقارنة', 'Clear comparison list')}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSoftware={handleAddSoftware}
      />

      <ToolkitDrawer
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
        savedItems={savedItems}
        onRemoveSaved={(altId) => handleToggleSave(altId)}
        onOpenSoftware={(softwareId) => openProgramPage(softwareId)}
        migrationCompletedCount={migrationCompletedCount}
        onOpenMigrationPaths={() => {
          closeProgramPage();
          setActiveWorkspaceTab('migration');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedPrograms={compareIds
          .map((id) => unifiedPrograms.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))}
        allPrograms={unifiedPrograms}
        onAddProgram={(programId) => handleToggleCompare(programId)}
        onRemoveProgram={(programId) => handleToggleCompare(programId)}
        onSetPreset={(programIds) => setCompareIds(programIds.slice(0, 5))}
        onClearAll={() => setCompareIds([])}
        onOpenProgramPage={openProgramPage}
      />

      <QuickCompareModal
        isOpen={Boolean(quickComparePair)}
        selectedProgram={quickComparePair?.selectedProgram ?? null}
        counterpartProgram={quickComparePair?.counterpartProgram ?? null}
        counterpartRoleLabel={
          quickComparePair?.counterpartRoleLabel ?? t('أفضل بديل مجاني', 'Best Free Alternative')
        }
        onClose={() => setQuickCompareProgramId(null)}
        onOpenProgramPage={openProgramPage}
        onOpenFullCompare={(leftId, rightId) => {
          setCompareIds((prev) => {
            const merged = [leftId, rightId, ...prev.filter((id) => id !== leftId && id !== rightId)];
            return merged.slice(0, 5);
          });
          setIsCompareOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
