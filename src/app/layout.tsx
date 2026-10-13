import type { Metadata } from "next";
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
  title: "Maysha | Clean Skincare for Real Skin",
  description: "Thoughtfully crafted luxury skincare that works with your skin, not against it. Clinically proven, botanical-infused formulations.",
  keywords: ["skincare", "clean beauty", "face cleanser", "serum", "hydrating toner", "sunscreen", "natural skincare"],
  openGraph: {
    title: "Maysha — Clean Beauty for Real Skin",
    description: "Thoughtfully crafted luxury skincare formulations for healthy, radiant skin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1A1A] selection:bg-[#E2DDD2] selection:text-[#1A1A1A]">
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
