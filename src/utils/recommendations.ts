import { CATEGORIES } from '../data/catalog';
import { FeatureTag, UnifiedProgramItem } from '../types/software';

export interface SimilarProgramRecommendation {
  program: UnifiedProgramItem;
  score: number;
  sameCategory: boolean;
  sharedFeatures: FeatureTag[];
  sharedFormats: string[];
  reasonSummary: string;
}

export function getSimilarPrograms(
  target: UnifiedProgramItem,
  allPrograms: UnifiedProgramItem[],
  limit = 6
): SimilarProgramRecommendation[] {
  const targetFeatureSet = new Set(target.features);
  const targetFormatSet = new Set(target.fileFormats.map((f) => f.toUpperCase()));
  const directAltIds = new Set(
    target.commercialEntry?.alternatives.map((alt) => alt.id) ?? []
  );

  const scored: SimilarProgramRecommendation[] = [];

  for (const candidate of allPrograms) {
    if (candidate.id === target.id) continue;
    // Skip items already displayed as direct alternatives or parent commercial link
    if (directAltIds.has(candidate.id)) continue;
    if (target.parentCommercial && candidate.id === target.parentCommercial.id) continue;

    const sameCategory = candidate.category === target.category;
    const sharedFeatures = candidate.features.filter((f) => targetFeatureSet.has(f));
    const sharedFormats = candidate.fileFormats.filter((fmt) =>
      targetFormatSet.has(fmt.toUpperCase())
    );

    const score =
      (sameCategory ? 4 : 0) +
      sharedFeatures.length * 3 +
      sharedFormats.length * 1 +
      (candidate.licenseCategory !== 'مدفوع' ? 1 : 0);

    // Must share either the same category or at least one feature
    if (!sameCategory && sharedFeatures.length === 0) {
      continue;
    }

    const catLabel =
      CATEGORIES.find((c) => c.id === candidate.category)?.label ?? candidate.category;

    const reasonParts: string[] = [];
    if (sameCategory) {
      reasonParts.push(`نفس الفئة (${catLabel})`);
    }
    if (sharedFeatures.length > 0) {
      reasonParts.push(`ميزات مشتركة: ${sharedFeatures.join('، ')}`);
    }
    if (sharedFormats.length > 0 && sharedFeatures.length === 0) {
      reasonParts.push(`صيغ مشتركة: ${sharedFormats.join('، ')}`);
    }

    scored.push({
      program: candidate,
      score,
      sameCategory,
      sharedFeatures,
      sharedFormats,
      reasonSummary: reasonParts.join(' · '),
    });
  }

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.program.rating !== a.program.rating) return b.program.rating - a.program.rating;
      return b.program.likes - a.program.likes;
    })
    .slice(0, limit);
}
