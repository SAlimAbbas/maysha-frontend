export interface Banner {
  id: number | string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  linkUrl: string;
  badgeText?: string;
  isActive: boolean;
  sortOrder: number;
}

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Buy 1 Get 1 Free - Vitamin C Face Wash",
    subtitle: "Brighten & cleanse with potent Vitamin C + Niacinamide",
    desktopImage: "/banners/bogo-hero-banner.jpg",
    mobileImage: "/banners/bogo-hero-banner.jpg",
    linkUrl: "/collections/face-cleansers",
    badgeText: "SPECIAL OFFER • BUY 1 GET 1 FREE",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 2,
    title: "Multi-Peptide Hydration Serum",
    subtitle: "Dewy Skin Elevated • Deep cellular hydration & barrier repair",
    desktopImage: "/banners/serum-hero-banner.jpg",
    mobileImage: "/banners/serum-hero-banner.jpg",
    linkUrl: "/collections/face-serums",
    badgeText: "NEW CLINICAL LAUNCH",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 3,
    title: "Mineral Invisible Sunscreen SPF 50+ PA++++",
    subtitle: "Ultra-lightweight invisible shield with zinc oxide & green tea",
    desktopImage: "/banners/sunscreen-hero-banner.jpg",
    mobileImage: "/banners/sunscreen-hero-banner.jpg",
    linkUrl: "/collections/sunscreens",
    badgeText: "DAILY DEFENSE • ZERO WHITE CAST",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 4,
    title: "Ceramide Barrier Moisture Cream",
    subtitle: "Nourish. Protect. Glow. • Restorative ceramide lipids for deep nourishment",
    desktopImage: "/banners/ceramide-hero-banner.jpg",
    mobileImage: "/banners/ceramide-hero-banner.jpg",
    linkUrl: "/collections/moisturizers",
    badgeText: "DERMATOLOGIST LOVED",
    isActive: true,
    sortOrder: 4,
  },
];

/**
 * Fetch active banners from backend with fallback to DEFAULT_BANNERS.
 * Enforces maximum of 7 banners.
 */
export async function fetchActiveBanners(): Promise<Banner[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${apiUrl}/banners`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.slice(0, 7).map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          desktopImage: item.desktop_image || item.desktopImage,
          mobileImage: item.mobile_image || item.mobileImage || item.desktop_image,
          linkUrl: item.link_url || item.linkUrl || "/shop",
          badgeText: item.badge_text || item.badgeText,
          isActive: item.is_active ?? true,
          sortOrder: item.sort_order ?? 0,
        }));
      }
    }
  } catch {
    // Offline / fallback to static defaults
  }

  return DEFAULT_BANNERS.slice(0, 7);
}
