import React from 'react';
import { ArrowUpLeft, Youtube, ExternalLink, ArrowLeftRight, Github } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { UnifiedProgramItem } from '../types/software';
import { StarRating } from './StarRating';

interface UnifiedProgramCardProps {
  item: UnifiedProgramItem;
  isCompared: boolean;
  onToggleCompare: (programId: string) => void;
  onOpenProgramPage: (programId: string) => void;
  onRateProgram: (programId: string, stars: number) => void;
}

export const UnifiedProgramCard: React.FC<UnifiedProgramCardProps> = ({
  item,
  isCompared,
  onToggleCompare,
  onOpenProgramPage,
  onRateProgram,
}) => {
  const categoryLabel = CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-mono text-sm font-semibold shrink-0"
              style={{ backgroundColor: item.accentColor }}
              aria-hidden="true"
            >
              {item.monogram}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white truncate">
                <a
                  href={`#program/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenProgramPage(item.id);
                  }}
                  className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </a>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {item.arabicName} · {item.vendorOrBadge}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold whitespace-nowrap shrink-0 ${
              item.licenseCategory === 'مفتوح المصدر'
                ? 'text-emerald-700 dark:text-emerald-400'
                : item.licenseCategory === 'مجاني'
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {item.licenseCategory}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span>{categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{item.platforms.join(' / ')}</span>
          <span aria-hidden="true">·</span>
          <span>{item.licenseLabel}</span>
          {item.isArabicOrigin && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {item.originLabel ?? 'بديل عربي'}
              </span>
            </>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          {item.shortSummary}
        </p>

        <div className="mb-3">
          <StarRating
            average={item.rating}
            count={item.ratingCount}
            userRating={item.userRating}
            onRate={(stars) => onRateProgram(item.id, stars)}
            label="التقييم:"
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          الميزات: {item.features.join(' · ')}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {item.bimArabiaTutorial?.hasTutorial && (
          <a
            href={item.bimArabiaTutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50/70 hover:bg-red-50 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Youtube className="w-4 h-4 shrink-0" />
              <span className="truncate">شاهد فيديو الشرح في قناة بيم أرابيا</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleCompare(item.id)}
              aria-pressed={isCompared}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCompared
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isCompared ? 'في المقارنة' : 'قارن'}</span>
            </button>

            <a
              href={item.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <span>الموقع</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`مستودع GitHub لـ ${item.name}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>

          <a
            href={`#program/${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onOpenProgramPage(item.id);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>صفحة البرنامج</span>
            <ArrowUpLeft className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
