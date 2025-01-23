import { create } from 'zustand';

type Language = 'en' | 'es' | 'fr';

interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  language: (localStorage.getItem('language') as Language) || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
}));

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    profile: 'Profile',
    settings: 'Settings',
    // Add more translations
  },
  es: {
    welcome: 'Bienvenido',
    profile: 'Perfil',
    settings: 'Ajustes',
    // Add more translations
  },
  fr: {
    welcome: 'Bienvenue',
    profile: 'Profil',
    settings: 'Paramètres',
    // Add more translations
  },
};

export const t = (key: string): string => {
  const { language } = useI18nStore.getState();
  return translations[language]?.[key] || key;
};