import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  BIM_ARABIA_CHANNEL_URL,
  INITIAL_SOFTWARE_CATALOG,
  buildUnifiedProgramIndex,
} from './data/catalog';
import {
  BimArabiaTutorial,
  FeatureTag,
  FreeAlternative,
  LicenseCategory,
  OperatingSystem,
  SoftwareCategory,
  SoftwareEntry,
} from './types/software';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DirectoryViewMode, FilterToolbar, SortOption } from './components/FilterToolbar';
import { SoftwareCard } from './components/SoftwareCard';
import { UnifiedProgramCard } from './components/UnifiedProgramCard';
import { CategoryDirectorySection } from './components/CategoryDirectorySection';
import { BimArabiaSection } from './components/BimArabiaSection';
import { ProgramPage } from './components/ProgramPage';
import { AddEntryModal } from './components/AddEntryModal';
import { ToolkitDrawer } from './components/ToolkitDrawer';

const STORAGE_KEYS = {
  LIKES: 'badeelak_liked_alts_v1',
  SAVED: 'badeelak_saved_alts_v1',
  CUSTOM_ENTRIES: 'badeelak_custom_entries_v2',
  CUSTOM_ALTS: 'badeelak_custom_alts_v2',
  CUSTOM_BIM_LINKS: 'badeelak_custom_bim_v1',
  THEME: 'badeelak_theme_v1',
};

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

export default function App() {
  const [customEntries, setCustomEntries] = useState<SoftwareEntry[]>(() =>
    loadJson<SoftwareEntry[]>(STORAGE_KEYS.CUSTOM_ENTRIES, [])
  );
  const [customAltsBySoftware, setCustomAltsBySoftware] = useState<
    Record<string, FreeAlternative[]>
  >(() => loadJson<Record<string, FreeAlternative[]>>(STORAGE_KEYS.CUSTOM_ALTS, {}));
  const [customBimByProgram, setCustomBimByProgram] = useState<
    Record<string, BimArabiaTutorial>
  >(() => loadJson<Record<string, BimArabiaTutorial>>(STORAGE_KEYS.CUSTOM_BIM_LINKS, {}));

  const [likedIds, setLikedIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.LIKES, [])
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.SAVED, [])
  );

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = loadJson<string | null>(STORAGE_KEYS.THEME, null);
    if (saved) return saved === 'dark';
    return false;
  });

  // Advanced Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');
  const [selectedLicense, setSelectedLicense] = useState<LicenseCategory | 'all'>('all');
  const [selectedOSList, setSelectedOSList] = useState<OperatingSystem[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureTag[]>([]);
  const [onlyBimTutorials, setOnlyBimTutorials] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<DirectoryViewMode>('alternatives');

  // Dedicated Program Page Route & Modals
  const [activeProgramId, setActiveProgramId] = useState<string | null>(() =>
    getProgramIdFromHash()
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);

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
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ENTRIES, JSON.stringify(customEntries));
  }, [customEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ALTS, JSON.stringify(customAltsBySoftware));
  }, [customAltsBySoftware]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BIM_LINKS, JSON.stringify(customBimByProgram));
  }, [customBimByProgram]);

  const likedAltSet = useMemo(() => new Set(likedIds), [likedIds]);
  const savedAltSet = useMemo(() => new Set(savedIds), [savedIds]);

  // Merge base catalog + user entries + user alternatives + live like increments + user BIM Arabia links
  const catalog: SoftwareEntry[] = useMemo(() => {
    const mergedBase = [...customEntries, ...INITIAL_SOFTWARE_CATALOG];
    return mergedBase.map((entry) => {
      const extraAlts = customAltsBySoftware[entry.id] ?? [];
      const allAlts = [...entry.alternatives, ...extraAlts].map((alt) => ({
        ...alt,
        likes: alt.likes + (likedAltSet.has(alt.id) ? 1 : 0),
        bimArabiaTutorial: customBimByProgram[alt.id] ?? alt.bimArabiaTutorial,
      }));
      return {
        ...entry,
        bimArabiaTutorial: customBimByProgram[entry.id] ?? entry.bimArabiaTutorial,
        alternatives: allAlts,
      };
    });
  }, [customEntries, customAltsBySoftware, customBimByProgram, likedAltSet]);

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
    sortBy,
  ]);

  const activeProgram = useMemo(
    () => (activeProgramId ? unifiedPrograms.find((p) => p.id === activeProgramId) ?? null : null),
    [unifiedPrograms, activeProgramId]
  );

  const relatedPrograms = useMemo(() => {
    if (!activeProgram) return [];
    return unifiedPrograms
      .filter((p) => p.category === activeProgram.category && p.id !== activeProgram.id)
      .slice(0, 6);
  }, [unifiedPrograms, activeProgram]);

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
    onlyBimTutorials;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLicense('all');
    setSelectedOSList([]);
    setSelectedFeatures([]);
    setOnlyBimTutorials(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      <main className="flex-1">
        {activeProgram ? (
          <ProgramPage
            program={activeProgram}
            relatedPrograms={relatedPrograms}
            likedAltIds={likedAltSet}
            savedAltIds={savedAltSet}
            onBack={closeProgramPage}
            onOpenProgramPage={openProgramPage}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onAddAlternativeToSoftware={handleAddAlternativeToSoftware}
            onAttachBimTutorial={handleAttachBimTutorial}
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
              onQuickSearch={(term) => {
                setSearchQuery(term);
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
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
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isDark={isDark}
              onToggleDark={() => setIsDark((v) => !v)}
              resultCount={displayedCount}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
            />

            {/* Directory Grid */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
              {displayedCount === 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    لم يتم العثور على برامج مطابقة لمعايير البحث المتقدم
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    جرب تعديل نظام التشغيل أو نوع الترخيص أو الميزات المختارة، أو أضف البرنامج مباشرة إلى الدليل.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>عرض كل البرامج</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                    >
                      أضف برنامجاً جديداً
                    </button>
                  </div>
                </div>
              ) : viewMode === 'unified' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredUnifiedPrograms.map((item) => (
                    <UnifiedProgramCard
                      key={item.id}
                      item={item}
                      onOpenProgramPage={openProgramPage}
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
                      onToggleLike={(_swId, altId) => handleToggleLike(altId)}
                      onToggleSave={handleToggleSave}
                      onSelectSoftware={openProgramPage}
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p>
            بديلك — دليل عربي مفتوح للبدائل المجانية للبرامج الهندسية والتصميمية
          </p>
          <div className="flex items-center gap-6">
            <a
              href={BIM_ARABIA_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              قناة بيم أرابيا على يوتيوب
            </a>
            <button
              type="button"
              onClick={() => setIsToolkitOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              حقيبة أدواتي ({savedItems.length})
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              أضف برنامج أو شرح
            </button>
          </div>
        </div>
      </footer>

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
      />
    </div>
  );
}
