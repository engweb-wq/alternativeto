import React, { useEffect, useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUpLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { UnifiedProgramItem } from '../types/software';
import { useLanguage } from '../i18n/LanguageContext';

interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

interface FooterNewsletterProps {
  featuredAlternatives: UnifiedProgramItem[];
  onOpenProgramPage: (programId: string) => void;
}

const NEWSLETTER_STORAGE_KEY = 'badeelak_newsletter_sub_v1';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function loadSubscription(): NewsletterSubscription | null {
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<NewsletterSubscription>;
    if (parsed && typeof parsed.email === 'string' && parsed.email.trim()) {
      return {
        email: parsed.email,
        subscribedAt: parsed.subscribedAt ?? new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const FooterNewsletter: React.FC<FooterNewsletterProps> = ({
  featuredAlternatives,
  onOpenProgramPage,
}) => {
  const [subscription, setSubscription] = useState<NewsletterSubscription | null>(() =>
    loadSubscription()
  );
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDigestPreview, setShowDigestPreview] = useState(false);
  const { t, isAr, translateLicenseCategory } = useLanguage();
  const NavArrow = isAr ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    try {
      if (subscription) {
        localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(subscription));
      } else {
        localStorage.removeItem(NEWSLETTER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = emailInput.trim();
    if (!cleaned) {
      setErrorMsg(t('يرجى إدخال بريدك الإلكتروني للاشتراك.', 'Please enter your email address.'));
      return;
    }
    if (!EMAIL_REGEX.test(cleaned)) {
      setErrorMsg(t('صيغة البريد الإلكتروني غير صحيحة.', 'Please enter a valid email address.'));
      return;
    }

    setErrorMsg(null);
    setSubscription({
      email: cleaned,
      subscribedAt: new Date().toISOString(),
    });
    setEmailInput('');
    setShowDigestPreview(true);
  };

  const handleUnsubscribe = () => {
    setSubscription(null);
    setShowDigestPreview(false);
    setErrorMsg(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <Mail className="w-4 h-4" />
            <span>{t('النشرة الأسبوعية للدليل (محاكاة محلية)', 'Weekly Digest (Local Simulation)')}</span>
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t(
              'تحديثات أسبوعية بأهم البدائل المجانية الجديدة',
              'Weekly Updates on New Free & Open-Source Alternatives'
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t(
              'اشترك لتلقي ملخص أسبوعي منسّق لأحدث البدائل المجانية ومفتوحة المصدر وشروحات الهندسة والذكاء الاصطناعي المضافة إلى الدليل.',
              'Subscribe to receive a curated weekly summary of newly added free, open-source, BIM, and AI tools.'
            )}
          </p>
        </div>

        {!subscription ? (
          <form onSubmit={handleSubmit} noValidate className="w-full lg:w-auto lg:min-w-[380px] space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                {t(
                  'البريد الإلكتروني للاشتراك في التحديثات الأسبوعية',
                  'Email address for weekly updates'
                )}
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                dir="ltr"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="name@example.com"
                className="flex-1 h-10 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t('اشترك أسبوعياً', 'Subscribe Weekly')}
              </button>
            </div>
            {errorMsg && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
                {errorMsg}
              </p>
            )}
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/60 rounded-lg px-4 py-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0 text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {t('تم تفعيل الاشتراك الأسبوعي بنجاح', 'Weekly subscription active')}
                </p>
                <p className="text-slate-600 dark:text-slate-300 truncate" dir="ltr">
                  {subscription.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDigestPreview((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {showDigestPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>
                  {showDigestPreview
                    ? t('إخفاء المعاينة', 'Hide Preview')
                    : t('معاينة النشرة', 'Preview Digest')}
                </span>
              </button>
              <button
                type="button"
                onClick={handleUnsubscribe}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                {t('إلغاء', 'Unsubscribe')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Weekly Email Digest Preview */}
      {subscription && showDigestPreview && featuredAlternatives.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('محاكاة نشرة هذا الأسبوع المرسلة إلى', 'Simulated weekly digest sent to')}</span>
              <span className="font-mono text-slate-600 dark:text-slate-300" dir="ltr">
                {subscription.email}
              </span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {t(
                `أبرز ${featuredAlternatives.length} بدائل مجانية مختارة`,
                `Top ${featuredAlternatives.length} featured free alternatives`
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featuredAlternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => onOpenProgramPage(alt.id)}
                className="text-start p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-blue-400 dark:hover:border-blue-600 transition-colors flex flex-col justify-between gap-2 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
                      {alt.name}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                      {translateLicenseCategory(alt.licenseCategory)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {alt.shortSummary}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                  <span>{t('استعراض البديل', 'Explore Alternative')}</span>
                  <NavArrow className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
