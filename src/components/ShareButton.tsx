import React, { useEffect, useRef, useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';

interface ShareButtonProps {
  programId: string;
  programName: string;
  programSummary: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  programId,
  programName,
  programSummary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webShareNotice, setWebShareNotice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#program/${encodeURIComponent(programId)}`
      : `#program/${encodeURIComponent(programId)}`;

  const shareTitle = `${programName} — دليل بديلك`;
  const shareText = `${programName}: ${programSummary}`;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setWebShareNotice('تعذر النسخ التلقائي، يمكنك نسخ الرابط يدوياً من الحقل أعلاه.');
    }
  };

  const handleNativeWebShare = async () => {
    setWebShareNotice(null);

    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      setWebShareNotice(
        'واجهة المشاركة المباشرة (Web Share API) غير مدعومة في هذا المتصفح، استخدم نسخ الرابط أو المنصات أدناه.'
      );
      return;
    }

    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setWebShareNotice(
        'تعذر فتح نافذة مشاركة النظام داخل هذا الإطار، يمكنك نسخ الرابط أو المشاركة عبر المنصات أدناه.'
      );
    }
  };

  const socialLinks = [
    {
      label: 'واتساب',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      label: 'منصة X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'تيليجرام',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'لينكدإن',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setWebShareNotice(null);
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>مشاركة</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={`مشاركة صفحة ${programName}`}
          className="absolute left-0 mt-2 w-80 max-w-[90vw] z-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-4"
        >
          <div>
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white mb-0.5">
              مشاركة {programName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              انسخ الرابط المباشر أو شارك الصفحة عبر نظام جهازك ومنصات التواصل.
            </p>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-2">
            <label htmlFor="share-direct-url" className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              الرابط المباشر للبرنامج
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-direct-url"
                type="text"
                readOnly
                dir="ltr"
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Web Share API Trigger */}
          <button
            type="button"
            onClick={handleNativeWebShare}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>مشاركة عبر تطبيقات الجهاز (Web Share)</span>
          </button>

          {webShareNotice && (
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              {webShareNotice}
            </p>
          )}

          {/* Social Platforms */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              أو شارك مباشرة عبر:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span>{social.label}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
