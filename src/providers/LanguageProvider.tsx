"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    shop: "Shop",
    about: "About",
    journal: "Journal",
    trackOrder: "Track Order",
    cart: "Cart",
    account: "Account",
    searchPlaceholder: "Search cleansers, serums, oils...",
    addToCart: "Add to Cart",
    adding: "Adding...",
    added: "Added to Cart",
    outOfStock: "Out of Stock",
    viewDetails: "View Details",
    bestseller: "Bestseller",
    newLaunch: "New Launch",
    freeShippingNotice: "FREE Express Shipping on orders over ₹999",
    cleanBeautyNotice: "Clean, Dermatologically Tested Botanical Formulations",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    emptyCartTitle: "Your Cart is Empty",
    emptyCartDesc: "Explore our botanical formulations to discover your daily glow ritual.",
    whatMakesUsSpecial: "What Makes Us Special",
    ourPillars: "Our Formulation Pillars",
    readArticle: "Read Article",
    dropCapIntro: "The botanical journey begins with nature's purest harvest.",
  },
  hi: {
    shop: "दुकान",
    about: "हमारे बारे में",
    journal: "जर्नल",
    trackOrder: "ऑर्डर ट्रैक करें",
    cart: "थैला",
    account: "खाता",
    searchPlaceholder: "क्लीनर, सीरम, तेल खोजें...",
    addToCart: "बैग में जोड़ें",
    adding: "जोड़ रहे हैं...",
    added: "बैग में जोड़ा गया",
    outOfStock: "स्टॉक में नहीं",
    viewDetails: "विवरण देखें",
    bestseller: "बेस्टसेलर",
    newLaunch: "नया उत्पाद",
    freeShippingNotice: "₹999 से अधिक के ऑर्डर पर मुफ़्त एक्सप्रेस डिलीवरी",
    cleanBeautyNotice: "शुद्ध, त्वचा विशेषज्ञ द्वारा परीक्षित हर्बल उत्पाद",
    checkout: "चेकआउट करें",
    continueShopping: "खरीदारी जारी रखें",
    emptyCartTitle: "आपकी कार्ट खाली है",
    emptyCartDesc: "अपनी त्वचा की प्राकृतिक चमक के लिए हमारे हर्बल उत्पादों को देखें।",
    whatMakesUsSpecial: "हमें क्या खास बनाता है",
    ourPillars: "हमारे निर्माण के स्तंभ",
    readArticle: "लेख पढ़ें",
    dropCapIntro: "प्राकृतिक जड़ी-बूटियों की शुद्धता से शुरुआत।",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("maysha_lang") as Language;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("maysha_lang", lang);
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || fallback || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
