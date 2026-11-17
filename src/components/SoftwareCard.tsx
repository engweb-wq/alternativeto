import React from 'react';
import { ThumbsUp, Youtube, Bookmark, ArrowUpLeft, Check, Star, ArrowLeftRight, Github } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { SoftwareEntry } from '../types/software';
import { useLongPress } from '../hooks/useLongPress';
import { StarRating } from './StarRating';

interface SoftwareCardProps {
  entry: SoftwareEntry;
  likedAltIds: Set<string>;
  savedAltIds: Set<string>;
  compareIds: Set<string>;
  onToggleLike: (softwareId: string, altId: string) => void;
  onToggleSave: (altId: string) => void;
  onToggleCompare: (programId: string) => void;
  onRateProgram: (programId: string, stars: number) => void;
  onSelectSoftware: (programId: string) => void;
  onQuickCompare: (programId: string) => void;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  entry,
  likedAltIds,
  savedAltIds,
  compareIds,
  onToggleLike,
  onToggleSave,
  onToggleCompare,
  onRateProgram,
  onSelectSoftware,
  onQuickCompare,
}) => {
  const categoryLabel = CATEGORIES.find((c) => c.id === entry.category)?.label ?? entry.category;
  const sortedAlternatives = [...entry.alternatives].sort((a, b) => {
    if (a.isBestFree !== b.isBestFree) return a.isBestFree ? -1 : 1;
    return b.likes - a.likes;
  });
  const bestAlt = sortedAlternatives[0];
  const otherAltCount = sortedAlternatives.length - 1;

  const cardTutorial = entry.bimArabiaTutorial ?? bestAlt?.bimArabiaTutorial;
  const isLiked = bestAlt ? likedAltIds.has(bestAlt.id) : false;
  const isSaved = bestAlt ? savedAltIds.has(bestAlt.id) : false;

  const { isPressing, longPressProps } = useLongPress({
    onLongPress: () => onQuickCompare(entry.id),
  });

  return (
    <article
      {...longPressProps}
      title="اضغط مطولاً للمقارنة السريعة مع أفضل بديل مجاني"
      className={`bg-white dark:bg-slate-900 border rounded-xl p-6 flex flex-col justify-between transition-all ${
        isPressing
          ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-600/40 scale-[0.99]'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Commercial Software Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-mono text-sm font-semibold shrink-0"
              style={{ backgroundColor: entry.accentColor }}
              aria-hidden="true"
            >
              {entry.monogram}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white truncate">
                <a
                  href={`#program/${entry.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSoftware(entry.id);
                  }}
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {entry.name}
                </a>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {entry.arabicName} · {entry.vendor}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
              {entry.licenseCategory}
            </span>
            {entry.rating !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
                <span>{entry.rating.toFixed(1)}</span>
                <span className="text-slate-400 dark:text-slate-500">({entry.ratingCount})</span>
              </span>
            )}
          </div>
        </div>

        {/* Clean Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span>{categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.platforms.join(' / ')}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{entry.fileFormats.slice(0, 3).join(', ')}</span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {entry.shortSummary}
        </p>

        {/* Hairline Divider separating Commercial Software from #1 Best Free Alternative */}
        {bestAlt && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                أفضل بديل مجاني مقترح
                {bestAlt.isArabicOrigin ? ` · ${bestAlt.originLabel ?? 'بديل عربي'}` : ''}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {bestAlt.license} · <span className="font-mono">{bestAlt.licenseCode}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                <a
                  href={`#program/${bestAlt.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSoftware(bestAlt.id);
                  }}
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {bestAlt.name}
                </a>
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleCompare(bestAlt.id)}
                  aria-pressed={compareIds.has(bestAlt.id)}
                  className={`text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    compareIds.has(bestAlt.id)
                      ? 'text-blue-700 dark:text-blue-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {compareIds.has(bestAlt.id) ? '✓ في المقارنة' : '+ قارن البديل'}
                </button>
                {otherAltCount > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                    · +{otherAltCount}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {bestAlt.tagline}
            </p>

            {/* Interactive 1-5 Star Rating & Live Average for Suggested Alternative */}
            <div className="mb-3">
              <StarRating
                average={bestAlt.rating ?? 4.7}
                count={bestAlt.ratingCount ?? 40}
                userRating={bestAlt.userRating}
                onRate={(stars) => onRateProgram(bestAlt.id, stars)}
                label="تقييم البديل:"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>يعمل على: {bestAlt.platforms.join(' · ')}</span>
              {bestAlt.githubUrl && (
                <a
                  href={bestAlt.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {cardTutorial?.hasTutorial && (
          <a
            href={cardTutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-red-50/70 hover:bg-red-50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Youtube className="w-4 h-4 shrink-0" />
              <span className="truncate">{cardTutorial.title}</span>
            </span>
            <ArrowUpLeft className="w-3.5 h-3.5 shrink-0" />
          </a>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {bestAlt && (
              <>
                <button
                  type="button"
                  onClick={() => onToggleLike(entry.id, bestAlt.id)}
                  aria-pressed={isLiked}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                    isLiked
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{bestAlt.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSave(bestAlt.id)}
                  aria-pressed={isSaved}
                  aria-label={isSaved ? 'إزالة من حقيبة أدواتي' : 'حفظ في حقيبة أدواتي'}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'محفوظ' : 'حفظ'}</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => onToggleCompare(entry.id)}
              aria-pressed={compareIds.has(entry.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                compareIds.has(entry.id)
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{compareIds.has(entry.id) ? 'مضاف' : 'قارن'}</span>
            </button>
          </div>

          <a
            href={`#program/${entry.id}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectSoftware(entry.id);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>صفحة البرنامج والبدائل</span>
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          اضغط مطولاً على البطاقة للمقارنة السريعة مع أفضل بديل مجاني
        </p>
      </div>
    </article>
  );
};
