"use client";

import React, { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    gtranslateSettings?: any;
  }
}

export default function GTranslate() {
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: "en",
      languages: ["en", "hi"],
      wrapper_selector: ".gtranslate_wrapper",
      switcher_horizontal_position: "right",
      flag_style: "3d",
    };
  }, []);

  return (
    <>
      <div className="gtranslate_wrapper" />
      <Script
        id="gtranslate-settings"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtranslateSettings = {"default_language":"en","languages":["en","hi"],"wrapper_selector":".gtranslate_wrapper","switcher_horizontal_position":"right","flag_style":"3d","alt_flags":{"en":"usa"}}`,
        }}
      />
      <Script
        src="https://cdn.gtranslate.net/widgets/latest/float.js"
        strategy="afterInteractive"
        defer
      />
    </>
  );
}
