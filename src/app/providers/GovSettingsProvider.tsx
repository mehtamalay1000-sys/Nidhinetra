// Nidhiनेत्र: Government Services Settings & Accessibility Provider
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW 3.0 Compliance

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n/translations';

export type FontSizeOption = 'sm' | 'md' | 'lg';

interface GovSettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  selectedConstituency: string;
  setSelectedConstituency: (constituency: string) => void;
}

const GovSettingsContext = createContext<GovSettingsContextType | null>(null);

const STORAGE_LANG = 'nidhinetra_lang';
const STORAGE_FONT = 'nidhinetra_font_size';
const STORAGE_CONTRAST = 'nidhinetra_contrast';
const STORAGE_LOCATION = 'nidhinetra_location';

export const GovSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_LANG) as Language) || 'en';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    return (localStorage.getItem(STORAGE_FONT) as FontSizeOption) || 'md';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_CONTRAST) === 'true';
  });

  const [selectedConstituency, setSelectedConstituencyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_LOCATION) || 'Nashik Central';
  });

  // Apply to documentElement for global CSS targeting
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_LANG, language);
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem(STORAGE_FONT, fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }
    localStorage.setItem(STORAGE_CONTRAST, String(highContrast));
  }, [highContrast]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => !prev);
  };

  const setSelectedConstituency = (c: string) => {
    setSelectedConstituencyState(c);
    localStorage.setItem(STORAGE_LOCATION, c);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict[key]) {
      return langDict[key];
    }
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <GovSettingsContext.Provider
      value={{
        language,
        setLanguage,
        t,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        selectedConstituency,
        setSelectedConstituency,
      }}
    >
      {children}
    </GovSettingsContext.Provider>
  );
};

export const useGovSettings = () => {
  const context = useContext(GovSettingsContext);
  if (!context) {
    throw new Error('useGovSettings must be used within a GovSettingsProvider');
  }
  return context;
};
