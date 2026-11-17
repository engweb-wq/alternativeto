import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface StarRatingProps {
  average: number;
  count: number;
  userRating?: number;
  onRate?: (stars: number) => void;
  size?: 'sm' | 'md';
  label?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  average,
  count,
  userRating,
  onRate,
  size = 'sm',
  label,
}) => {
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const { t } = useLanguage();
  const displayStars = hoverStars ?? userRating ?? Math.round(average);
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      {label && (
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      )}

      <div
        className="inline-flex items-center gap-0.5"
        dir="ltr"
        onMouseLeave={() => setHoverStars(null)}
        role={onRate ? 'group' : undefined}
        aria-label={onRate ? t('تقييم من 1 إلى 5 نجوم', 'Rate 1 to 5 stars') : undefined}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= displayStars;
          const isUserHover = hoverStars !== null && starValue <= hoverStars;

          if (!onRate) {
            return (
              <Star
                key={starValue}
                className={`${iconSize} ${
                  starValue <= Math.round(average)
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
                aria-hidden="true"
              />
            );
          }

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onRate(starValue)}
              onMouseEnter={() => setHoverStars(starValue)}
              aria-label={t(`تقييم ${starValue} من 5 نجوم`, `Rate ${starValue} out of 5 stars`)}
              aria-pressed={userRating === starValue}
              className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={`${iconSize} transition-colors ${
                  isUserHover
                    ? 'fill-amber-400 text-amber-500'
                    : isFilled
                    ? userRating
                      ? 'fill-amber-500 text-amber-500'
                      : 'fill-amber-400 text-amber-500'
                    : 'text-slate-300 dark:text-slate-700 hover:text-amber-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      {count > 0 ? (
        <>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 tabular-nums">
            {average.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            ({count} {t('تقييم', count === 1 ? 'rating' : 'ratings')})
          </span>
        </>
      ) : (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t('لم يقيّم محلياً بعد', 'No local ratings yet')}
        </span>
      )}
      {userRating && (
        <span className="text-xs font-medium text-blue-700 dark:text-blue-400 tabular-nums">
          · {t('تقييمك', 'Yours')} {userRating}/5
        </span>
      )}
    </div>
  );
};
