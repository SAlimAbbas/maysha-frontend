import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maysha Skincare | Botanical Formulations",
    short_name: "Maysha",
    description: "Thoughtfully crafted botanical skincare backed by clinical science.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#4E5942",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
