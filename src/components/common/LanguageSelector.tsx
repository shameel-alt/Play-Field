import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'header';
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  className = '',
  showLabel = true
}) => {
  const { language, setLanguage, languages, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const getButtonStyles = () => {
    if (variant === 'dark' || variant === 'header') {
      return 'bg-surface-card/10 text-surface-card hover:bg-surface-card/20 border-white/20 hover:border-white/40';
    }
    return 'bg-surface-card text-floodlight-navy hover:bg-state-hover-gray border-border-grid shadow-2xs';
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${getButtonStyles()}`}
      >
        <Globe className="w-3.5 h-3.5 shrink-0 opacity-80" />
        <span className="text-sm shrink-0">{currentLanguageInfo.flag}</span>
        {showLabel && (
          <span className="font-button tracking-tight">
            {currentLanguageInfo.nativeName}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-2 w-44 bg-surface-card rounded-2xl border border-border-grid shadow-xl z-50 p-1.5 flex flex-col gap-1 animate-fade font-body text-xs"
        >
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-text-muted font-bold tracking-wider border-b border-border-grid/50">
            Language / භාෂාව / மொழி
          </div>
          {languages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(l.code)}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-pitch-turf-surface text-primary font-bold border border-primary-container/30'
                    : 'hover:bg-state-hover-gray text-floodlight-navy'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{l.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-bold">{l.nativeName}</span>
                    <span className="text-[10px] text-text-muted font-normal">{l.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
