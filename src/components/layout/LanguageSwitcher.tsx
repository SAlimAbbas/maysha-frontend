"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/providers/LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; short: string }[] = [
    { code: "en", label: "English", short: "EN" },
    { code: "hi", label: "हिन्दी (Hindi)", short: "HI" },
  ];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);

    if (typeof window !== "undefined") {
      const targetLang = code === "hi" ? "hi" : "en";
      const cookieVal = `/en/${targetLang}`;

      // Set cookie for current domain and root path
      document.cookie = `googtrans=${cookieVal}; path=/;`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;

      // Trigger GTranslate if available
      if (typeof (window as any).doGTranslate === "function") {
        (window as any).doGTranslate(`en|${targetLang}`);
      } else {
        // Trigger a change event or reload if needed
        window.location.reload();
      }
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change Language"
        className="flex items-center gap-1.5 py-1 px-2 text-xs font-medium text-[#4A4640] hover:text-[#1A1A1A] rounded hover:bg-[#EFECE4]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#4E5942]"
      >
        <Globe className="w-3.5 h-3.5 text-[#736E67]" />
        <span className="uppercase tracking-wider font-semibold">
          {language === "hi" ? "HI" : "EN"}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-36 bg-white border border-[#E8E3DA] rounded shadow-lg py-1 z-50 text-xs"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              role="menuitem"
              onClick={() => handleSelectLanguage(item.code)}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F6F3EC] transition-colors cursor-pointer ${
                language === item.code ? "font-bold text-[#4E5942]" : "text-[#1A1A1A]"
              }`}
            >
              <span>{item.label}</span>
              {language === item.code && <span className="text-[10px] text-[#4E5942]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
