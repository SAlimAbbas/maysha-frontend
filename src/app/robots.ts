import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maysha.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/account", "/account/*", "/checkout", "/api/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
