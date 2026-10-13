export const SITE_CONFIG = {
  name: "Maysha",
  tagline: "Pure Ingredients, Proven Radiance",
  description:
    "Maysha crafts elevated, botanical-powered clean skincare formulations designed to balance, protect, and illuminate every skin tone.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  supportEmail: "care@mayshacare.com",
  supportPhone: "+91 98765 43210",
  hours: "Mon – Sat: 10:00 AM – 7:00 PM IST",
  address: "Maysha Botanicals Lab, Sector 62, Gurugram, Haryana 122002, India",
  announcements: [
    "FREE Express Shipping on orders over ₹999",
    "Clean, Dermatologically Tested Botanical Formulations",
    "Hand-Harvested Damask Rose & Ayurvedic Cold-Pressed Oils",
  ],
  navLinks: [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Track Order", href: "/orders/track" },
  ],
  socialLinks: {
    instagram: "https://instagram.com/maysha_official",
    facebook: "https://facebook.com/mayshabotanicals",
    pinterest: "https://pinterest.com/mayshabeauty",
  },
  defaultFreeShippingThreshold: 999,
  defaultShippingFee: 99,
};
