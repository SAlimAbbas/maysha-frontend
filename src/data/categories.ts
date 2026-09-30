import { Category, Concern } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "cleansers",
    name: "Cleansers",
    subtitle: "Gentle, non-stripping cleansers that balance skin pH",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    itemCount: 4
  },
  {
    id: "cat-2",
    slug: "toners",
    name: "Toners",
    subtitle: "Hydrating essences to rebalance and prep your skin barrier",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    itemCount: 3
  },
  {
    id: "cat-3",
    slug: "serums",
    name: "Serums",
    subtitle: "High-concentration botanical & clinical treatment solutions",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    itemCount: 6
  },
  {
    id: "cat-4",
    slug: "moisturizers",
    name: "Moisturizers",
    subtitle: "Skin-identical barrier repair creams and gel-creams",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    itemCount: 5
  },
  {
    id: "cat-5",
    slug: "sunscreen",
    name: "Sunscreen",
    subtitle: "Broad-spectrum mineral SPF with zero white cast finish",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    itemCount: 2
  },
  {
    id: "cat-6",
    slug: "treatments",
    name: "Treatments",
    subtitle: "Targeted exfoliants, blemish treatments and restorative facial oils",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    itemCount: 4
  }
];

export const CONCERNS: Concern[] = [
  {
    id: "con-1",
    slug: "uneven-tone",
    name: "Uneven Tone",
    description: "Fade stubborn dark spots and sun pigmentation for radiant clarity",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "con-2",
    slug: "acne-control",
    name: "Acne Control",
    description: "Target active breakouts, purify congested pores, and balance excess sebum",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "con-3",
    slug: "barrier-repair",
    name: "Barrier Repair",
    description: "Rebuild compromised skin defenses with ceramides and calming peptides",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "con-4",
    slug: "dehydration-dryness",
    name: "Dehydration & Dryness",
    description: "Multi-depth cellular hydration for parched, tight, or flaking skin",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "con-5",
    slug: "fine-lines-aging",
    name: "Fine Lines & Aging",
    description: "Support collagen renewal and firmness with bakuchiol and tripeptides",
    image: "https://images.unsplash.com/photo-1508759073847-9ca702cec7d2?auto=format&fit=crop&w=600&q=80"
  }
];
