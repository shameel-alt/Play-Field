import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const Footer: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  return (
    <footer className="w-full bg-surface-card border-t border-border-grid py-space-xl mt-auto">
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex flex-col sm:flex-row items-center gap-space-md text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-headline text-headline-sm text-floodlight-navy font-bold uppercase tracking-tight">
              Play Field
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              {t('footer.certified')}
            </span>
          </div>
          <span className="text-text-muted font-body text-body-md hidden sm:inline">•</span>
          <span className="text-text-muted font-body text-body-md">
            {t('footer.tagline')}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-md sm:gap-space-lg text-text-muted font-body text-table-cell">
          <LanguageSelector variant="light" />

          <a
            href="#/public/tournament/colombo-premier-futsal-2026"
            onClick={(e) => handleNav('/public/tournament/colombo-premier-futsal-2026', e)}
            className="hover:text-primary transition-colors"
          >
            {t('nav.publicLive')}
          </a>
          <a
            href="#/tournaments/ongoing"
            onClick={(e) => handleNav('/tournaments/ongoing', e)}
            className="hover:text-primary transition-colors"
          >
            {t('nav.ongoing')}
          </a>
          <a
            href="#/tournaments/ended"
            onClick={(e) => handleNav('/tournaments/ended', e)}
            className="hover:text-primary transition-colors"
          >
            {t('nav.ended')}
          </a>
          <a
            href="#/dashboard"
            onClick={(e) => handleNav('/dashboard', e)}
            className="hover:text-primary transition-colors"
          >
            {t('nav.dashboard')}
          </a>
          <span className="font-mono text-xs text-text-placeholder">
            {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  );
};
