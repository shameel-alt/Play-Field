import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LANGUAGES, LanguageInfo, TRANSLATIONS, TranslationSchema } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  t: (path: string, fallback?: string) => string;
  translations: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('playfield_language');
    if (saved === 'en' || saved === 'si' || saved === 'ta') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('playfield_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Nested key resolver, e.g. "nav.dashboard" -> TRANSLATIONS[language].nav.dashboard
  const t = (path: string, fallback?: string): string => {
    try {
      const keys = path.split('.');
      let current: any = TRANSLATIONS[language];
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          // Fallback to English translation first if key missing in selected language
          let enFallback: any = TRANSLATIONS['en'];
          for (const ek of keys) {
            if (enFallback && typeof enFallback === 'object' && ek in enFallback) {
              enFallback = enFallback[ek];
            } else {
              enFallback = undefined;
              break;
            }
          }
          return typeof enFallback === 'string' ? enFallback : (fallback || path);
        }
      }
      return typeof current === 'string' ? current : (fallback || path);
    } catch {
      return fallback || path;
    }
  };

  const currentLanguageInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: LANGUAGES,
        currentLanguageInfo,
        t,
        translations: TRANSLATIONS[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
