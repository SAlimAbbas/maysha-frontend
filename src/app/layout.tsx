import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/ui/SearchModal";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";
import ToastProvider from "@/components/ui/ToastProvider";
import QueryProvider from "@/providers/QueryProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import GTranslate from "@/components/layout/GTranslate";

export const metadata: Metadata = {
  metadataBase: new URL("https://mayshaindia.com"),
  title: "Maysha India | Botanical Skincare & Haircare Products",
  description: "Discover botanical skincare and haircare by Maysha India. Shop gentle cleansers, serums, moisturizers and more for your everyday beauty and skincare routine.",
  keywords: [
    "Botanical Skincare Products",
    "Natural Skincare Products",
    "Skincare Products Online India",
    "Botanical Haircare Products",
    "Clean Beauty Products",
  ],
  openGraph: {
    type: "website",
    title: "Maysha India | Botanical Skincare & Haircare Products",
    url: "https://mayshaindia.com/",
    description: "Discover botanical skincare and haircare by Maysha India. Shop gentle cleansers, serums, moisturizers and more for your everyday beauty and skincare routine.",
    images: [
      {
        url: "https://mayshaindia.com/_next/image?url=%2Flogo.png&w=256&q=75",
        alt: "Maysha India",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Maysha India | Botanical Skincare & Haircare Products",
    site: "@https://mayshaindia.com/",
    description: "Discover botanical skincare and haircare by Maysha India. Shop gentle cleansers, serums, moisturizers and more for your everyday beauty and skincare routine.",
    images: [
      {
        url: "https://mayshaindia.com/_next/image?url=%2Flogo.png&w=256&q=75",
        alt: "Maysha India",
      },
    ],
  },
  verification: {
    google: "_fpuhW4QKQsDo4eIYUG1EYCg_6RLRl0blwuEMNuFxSc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-57MG8BMP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1853430249013566');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1853430249013566&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1A1A] selection:bg-[#E2DDD2] selection:text-[#1A1A1A]">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-57MG8BMP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryProvider>
          <LanguageProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            
            {/* Global Interactive Overlays */}
            <CartDrawer />
            <SearchModal />
            <MobileNavDrawer />
            <ToastProvider />
            <GTranslate />
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
