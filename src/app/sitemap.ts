import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maysha.in";
  const now = new Date();

  // Static Core Marketing Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/journal`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/shipping-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/refund-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const res = await fetch(`${apiUrl}/sitemap/slugs`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const slugs = json.data || {};

      const productUrls: MetadataRoute.Sitemap = (slugs.products || []).map((p: any) => ({
        url: `${siteUrl}/products/${p.slug || p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      }));

      const categoryUrls: MetadataRoute.Sitemap = (slugs.categories || []).map((c: any) => ({
        url: `${siteUrl}/collections/${c.slug || c}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      }));

      const articleUrls: MetadataRoute.Sitemap = (slugs.articles || []).map((a: any) => ({
        url: `${siteUrl}/journal/${a.slug || a}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      return [...staticRoutes, ...productUrls, ...categoryUrls, ...articleUrls];
    }
  } catch {
    // If backend is unreachable during build, return clean static routes
  }

  return staticRoutes;
}
