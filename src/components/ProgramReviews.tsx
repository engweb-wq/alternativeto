import React, { useEffect, useState } from 'react';
import { MessageSquarePlus, Star, Trash2 } from 'lucide-react';
import { ProgramReview } from '../types/software';

interface ProgramReviewsProps {
  programId: string;
  programName: string;
  averageRating: number;
  ratingCount: number;
  userRating?: number;
  reviews: ProgramReview[];
  onAddReview: (
    programId: string,
    review: { authorName: string; rating: number; comment: string }
  ) => void;
  onDeleteReview: (programId: string, reviewId: string) => void;
}

const MAX_COMMENT_LENGTH = 280;

function formatReviewDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return isoDate.slice(0, 10);
  }
}

export const ProgramReviews: React.FC<ProgramReviewsProps> = ({
  programId,
  programName,
  averageRating,
  ratingCount,
  userRating,
  reviews,
  onAddReview,
  onDeleteReview,
}) => {
  const [selectedStars, setSelectedStars] = useState<number>(userRating ?? 5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Sync star selection when user clicks the top star rating bar or navigates to another program
  useEffect(() => {
    setSelectedStars(userRating ?? 5);
  }, [userRating, programId]);

  useEffect(() => {
    setErrorMessage(null);
    setSubmittedNotice(false);
    setComment('');
  }, [programId]);

  const activeStars = hoverStars ?? selectedStars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = comment.trim();

    if (trimmedComment.length < 4) {
      setErrorMessage('يرجى كتابة مراجعة قصيرة لا تقل عن 4 أحرف.');
      return;
    }

    if (selectedStars < 1 || selectedStars > 5) {
      setErrorMessage('يرجى اختيار التقييم بالنجوم من 1 إلى 5.');
      return;
    }

    onAddReview(programId, {
      authorName: authorName.trim() || 'مستخدم بديلك',
      rating: selectedStars,
      comment: trimmedComment,
    });

    setComment('');
    setAuthorName('');
    setErrorMessage(null);
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 2600);
  };

  return (
    <section
      id="program-reviews"
      aria-labelledby="program-reviews-heading"
      className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2
            id="program-reviews-heading"
            className="font-display text-xl font-bold text-slate-900 dark:text-white"
          >
            مراجعات المستخدمين لـ {programName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            اكتب انطباعك وتجربتك العملية مع التقييم بالنجوم لمساعدة الآخرين على الاختيار.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 tabular-nums">
          <span className="font-semibold text-slate-900 dark:text-white">
            ★ {averageRating.toFixed(1)}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <span>{ratingCount} تقييم</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>
          <span>{reviews.length} مراجعة مكتوبة</span>
        </div>
      </div>

      {/* Single-elevation Reviews Container: Composer + Hairline-Divided List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <MessageSquarePlus className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>أضف مراجعتك القصيرة</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                التقييم بالنجوم:
              </span>
              <div
                className="inline-flex items-center gap-0.5"
                dir="ltr"
                onMouseLeave={() => setHoverStars(null)}
                role="group"
                aria-label="اختر التقييم من 1 إلى 5 نجوم للمراجعة"
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeStars;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setSelectedStars(starValue)}
                      onMouseEnter={() => setHoverStars(starValue)}
                      aria-label={`${starValue} من 5 نجوم`}
                      aria-pressed={selectedStars === starValue}
                      className="p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 dark:text-slate-700 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                {selectedStars}/5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label
                htmlFor={`review-author-${programId}`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                الاسم أو التخصص (اختياري)
              </label>
              <input
                id={`review-author-${programId}`}
                type="text"
                maxLength={50}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثال: م. عمر — مهندس معماري"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`review-comment-${programId}`}
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  نص المراجعة القصيرة *
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {comment.length} / {MAX_COMMENT_LENGTH}
                </span>
              </div>
              <textarea
                id={`review-comment-${programId}`}
                rows={2}
                maxLength={MAX_COMMENT_LENGTH}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={`شارك تجربتك المختصرة مع ${programName} (الأداء، سهولة التعلم، دعم العربية...)`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs min-h-[1.25rem]">
              {errorMessage ? (
                <span className="text-red-700 dark:text-red-400 font-medium">
                  {errorMessage}
                </span>
              ) : submittedNotice ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  تم حفظ ونشر مراجعتك محلياً في قسم المراجعات.
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  تُحفظ المراجعات في متصفحك وتظهر مباشرة ضمن هذه الصفحة.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              نشر المراجعة
            </button>
          </div>
        </form>

        {reviews.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              لا توجد مراجعات مكتوبة لبرنامج {programName} حتى الآن.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              أضف مراجعتك القصيرة أعلاه مع تقييم النجوم لمشاركة رأيك مع الزوار.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.map((rev) => (
              <li key={rev.id} className="p-5 sm:px-6 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {rev.authorName}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <div
                      className="inline-flex items-center gap-0.5"
                      dir="ltr"
                      aria-label={`تقييم ${rev.rating} من 5 نجوم`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${
                            n <= rev.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                      {rev.rating.toFixed(1)}/5
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <time
                      dateTime={rev.createdAt}
                      className="text-slate-500 dark:text-slate-400 tabular-nums"
                    >
                      {formatReviewDate(rev.createdAt)}
                    </time>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteReview(programId, rev.id)}
                    aria-label={`حذف مراجعة ${rev.authorName}`}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
