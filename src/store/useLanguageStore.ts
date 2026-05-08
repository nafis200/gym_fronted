import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "bn", name: "Bangla", nativeName: "বাংলা" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "zh-TW", name: "Taiwanese", nativeName: "繁體中文" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "id", name: "Indonesia", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Melayu", nativeName: "Bahasa Melayu" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: languages[0], // default English

      setLanguage: (code) => {
        const lang = languages.find((l) => l.code === code);

        set({
          currentLanguage: lang || languages[0],
        });
      },
    }),
    {
      name: "language-storage",
    }
  )
);