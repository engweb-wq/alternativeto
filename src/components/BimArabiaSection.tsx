import React, { useState } from 'react';
import { Youtube, ExternalLink, PlayCircle } from 'lucide-react';
import {
  BIM_ARABIA_BEST_ALTERNATIVES_URL,
  BIM_ARABIA_CHANNEL_URL,
  BIM_ARABIA_PLAYLIST_TOPICS,
} from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';

interface BimArabiaSectionProps {
  onFilterBimOnly: () => void;
}

export const BimArabiaSection: React.FC<BimArabiaSectionProps> = ({ onFilterBimOnly }) => {
  const [imgError, setImgError] = useState(false);
  const { t, isAr } = useLanguage();

  return (
    <section
      id="bim-arabia"
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-10">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
              {t(
                'شريك المعرفة الهندسية · قناة بيم أرابيا (@omar_selim1)',
                'Engineering Knowledge Partner · BIM Arabia Channel (@omar_selim1)'
              )}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance mb-4">
              {t(
                'تعلّم البرامج الهندسية وبدائلها المفتوحة باللغة العربية',
                'Learn Engineering Software & Open Alternatives in Arabic'
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {t(
                'يربط الدليل كل برنامج هندسي أو بديل مجاني بالشروحات العربية المتوفرة على قناة بيم أرابيا للمهندس عمر سليم على يوتيوب، بما في ذلك سلسلة «أفضل البدائل» المخصصة للبرمجيات المجانية ومفتوحة المصدر.',
                'This directory connects engineering software and free alternatives to video tutorials on Eng. Omar Selim’s BIM Arabia YouTube channel, including the dedicated "Best Alternatives" playlist for free and open-source tools.'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={BIM_ARABIA_BEST_ALTERNATIVES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <PlayCircle className="w-4 h-4" />
                <span>
                  {t('سلسلة «أفضل البدائل» على يوتيوب', '"Best Alternatives" Playlist on YouTube')}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={BIM_ARABIA_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-800 dark:text-red-300 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('زيارة قناة بيم أرابيا', 'Visit BIM Arabia Channel')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  onFilterBimOnly();
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>
                  {t('تصفية البرامج المشروحة في القناة', 'Filter Programs with BIM Arabia Tutorials')}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[220px] lg:min-h-[280px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              {!imgError ? (
                <img
                  src="/src/assets/images/bim_arabia_tutorials_1794894119305.jpg"
                  alt={t(
                    'استوديو الشروحات الهندسية والـ BIM لقناة بيم أرابيا',
                    'BIM Arabia Engineering & BIM Tutorials Studio'
                  )}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                  <PlayCircle className="w-12 h-12 mb-3 text-red-700 dark:text-red-400" />
                  <p className="font-display font-bold text-lg">
                    {t('مكتبة شروحات بيم أرابيا', 'BIM Arabia Tutorials Library')}
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-5">
                <p className="text-xs text-slate-200 font-medium">
                  {t(
                    'سلسلة «أفضل البدائل» · Revit · Navisworks · Civil 3D · ArchiCAD · Solibri · Speckle · FreeCAD',
                    'Best Alternatives Series · Revit · Navisworks · Civil 3D · ArchiCAD · Solibri · Speckle · FreeCAD'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Curated BIM Arabia Topic Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BIM_ARABIA_PLAYLIST_TOPICS.map((topic) => (
            <a
              key={topic.query}
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-5 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                topic.isFeaturedSeries
                  ? 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 hover:bg-red-50/80 dark:hover:bg-red-950/35'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-red-700 dark:text-red-400 font-medium">
                    @omar_selim1 · {isAr ? topic.query : topic.query}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors shrink-0" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {topic.description}
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 group-hover:underline underline-offset-4">
                {topic.isFeaturedSeries
                  ? t('مشاهدة قائمة التشغيل على يوتيوب', 'Watch Playlist on YouTube')
                  : t('فتح نتائج الشرح على يوتيوب', 'Open Tutorial Results on YouTube')}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
