import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-client-face-wash",
    slug: "vitamin-c-niacinamide-face-wash",
    name: "Vitamin C & Niacinamide Face Wash",
    subtitle: "Brightens & Soothes | Mild everyday herbal cleanser designed for regular use with Aloe Vera & Glycerin.",
    category: "Cleansers",
    categorySlug: "cleansers",
    concern: "Uneven Tone",
    concernSlug: "uneven-tone",
    price: 399,
    mrp: 499,
    discountPercentage: 20,
    size: "100 ml",
    rating: 4.9,
    reviewCount: 186,
    badge: "Bestseller",
    inStock: true,
    isFeatured: true,
    images: [
      "/images/products/face-wash/face-wash-1.png",
      "/images/products/face-wash/face-wash-2.png",
      "/images/products/face-wash/face-wash-3.png",
      "/images/products/face-wash/face-wash-4.png",
    ],
    hoverImage: "/images/products/face-wash/face-wash-2.png",
    variants: [
      { id: "var-fw-100", size: "100 ml", price: 399, mrp: 499, inStock: true },
      { id: "var-fw-bogo", size: "Pack of 2 (Buy 1 Get 1 Free)", price: 499, mrp: 998, inStock: true },
    ],
    keyBenefits: [
      "Mild everyday cleanser designed for gentle, regular daily use",
      "Sulfate-free & paraben-free: Cleanses without stripping essential moisture",
      "Vitamin C & Niacinamide help improve dullness, uneven tone, and dark spots",
      "Aloe Vera extract and Glycerin support barrier repair and deep hydration",
      "Regulates excess sebum and refines pores for a soft, balanced complexion"
    ],
    skinTypes: ["All Skin Types", "Sensitive Skin", "Dull & Uneven Skin", "Normal to Oily"],
    ingredients: "Aqua, Sodium Cocoyl Isethionate, Glycerin, Niacinamide (Vitamin B3), Ethyl Ascorbic Acid (Vitamin C), Aloe Barbadensis (Aloe Vera) Leaf Extract, Cocamidopropyl Betaine, Allantoin, Panthenol (Pro-Vitamin B5), Citric Acid, Phenoxyethanol, Ethylhexylglycerin.",
    usageInstructions: "1. Take a coin-sized amount of face wash on your wet hands.\n2. Lather gently: Massage onto your face in circular motions for 30–60 seconds.\n3. Rinse thoroughly with water and pat dry with a clean towel.\n4. Use twice daily, morning and night.",
    description: "Maysha Vitamin C & Niacinamide Face Wash is a gentle everyday herbal cleanser designed to brighten, soothe, and protect your skin. Infused with antioxidant-rich Vitamin C, barrier-strengthening Niacinamide, and soothing Aloe Vera, it cleanses away daily impurities, pollution, and excess sebum without disturbing your skin's natural moisture barrier. Skin feels refreshed, soft, and visibly radiant."
  },
  {
    id: "prod-client-rosemary-oil",
    slug: "rosemary-hair-oil",
    name: "Rosemary Hair Oil with Blend of 8 Oils",
    subtitle: "Nourishes Roots & Natural Shine | Promotes Healthier, Stronger Hair & Controls Frizz.",
    category: "Treatments",
    categorySlug: "treatments",
    concern: "Barrier Repair",
    concernSlug: "barrier-repair",
    price: 499,
    mrp: 699,
    discountPercentage: 28,
    size: "100 ml",
    rating: 4.9,
    reviewCount: 142,
    badge: "Trending",
    inStock: true,
    isFeatured: true,
    images: [
      "/images/products/rosemary-hair-oil/hair-oil-1.png",
      "/images/products/rosemary-hair-oil/hair-oil-2.png",
      "/images/products/rosemary-hair-oil/hair-oil-4.png",
      "/images/products/rosemary-hair-oil/hair-oil-3.png",
    ],
    hoverImage: "/images/products/rosemary-hair-oil/hair-oil-2.png",
    variants: [
      { id: "var-ho-100", size: "100 ml", price: 499, mrp: 699, inStock: true },
      { id: "var-ho-200", size: "200 ml (Value Pack)", price: 899, mrp: 1398, inStock: true },
    ],
    keyBenefits: [
      "Strengthens hair roots and minimizes hair fall due to breakage",
      "Potent blend of 8 pure botanical oils for natural shine and softness",
      "Controls frizz and significantly improves hair manageability",
      "Rosemary and castor oil help promote fuller, healthier-looking hair growth",
      "Nourishes dry scalp and helps repair environmental hair damage"
    ],
    skinTypes: ["All Hair Types", "Dry Scalp", "Damaged Hair", "Frizzy Hair"],
    ingredients: "Rosemary (Rosmarinus Officinalis) Leaf Oil, Pure Moroccan Argan Oil, Sweet Almond Oil, Golden Jojoba Oil, Extra Virgin Olive Oil, Pure Castor Seed Oil, Virgin Coconut Oil, Watermelon Seed Oil, Tocopherol (Vitamin E).",
    usageInstructions: "1. Take a small amount of oil on your palm.\n2. Massage gently into scalp and hair, focusing on roots and dry strands.\n3. Leave it on for a few hours or overnight for deep nourishment.\n4. Wash off with a mild shampoo for best results. Use 2–3 times a week.",
    description: "Maysha Rosemary Hair Oil is a revitalizing Ayurvedic botanical elixir powered by pure rosemary extract and a synergistic blend of 8 nutrient-dense natural oils (including Moroccan Argan, Sweet Almond, Olive, and Castor oil). Designed to penetrate deep into hair follicles, it invigorates scalp circulation, fortifies hair roots, tames unruly frizz, and restores silky radiance without greasy heaviness."
  },
  {
    id: "prod-client-rose-freshener",
    slug: "rose-air-freshener",
    name: "Maysha Rose Air Freshener",
    subtitle: "The Next Level Of Fragrance | Fine Mist Spray for Bedroom, Living Room & Everyday Spaces.",
    category: "Treatments",
    categorySlug: "treatments",
    concern: "Dehydration & Dryness",
    concernSlug: "dehydration-dryness",
    price: 349,
    mrp: 499,
    discountPercentage: 30,
    size: "300 ml",
    rating: 4.8,
    reviewCount: 96,
    badge: "New Launch",
    inStock: true,
    isFeatured: true,
    images: [
      "/images/products/rose-air-freshener/air-freshener-1.png",
      "/images/products/rose-air-freshener/air-freshener-4.png",
      "/images/products/rose-air-freshener/air-freshener-2.png",
      "/images/products/rose-air-freshener/air-freshener-3.png",
    ],
    hoverImage: "/images/products/rose-air-freshener/air-freshener-4.png",
    variants: [
      { id: "var-raf-300", size: "300 ml", price: 349, mrp: 499, inStock: true },
      { id: "var-raf-twin", size: "Twin Pack (300 ml x 2)", price: 599, mrp: 998, inStock: true },
    ],
    keyBenefits: [
      "Fresh, authentic Damask rose fragrance that uplifts any room",
      "Instant odor-neutralizing action to eliminate stale odors quickly",
      "Ergonomic fine-mist trigger spray for wide, even coverage",
      "Perfect for bedroom, living room, office, kitchen, and car",
      "Long-lasting botanical aroma without harsh chemical aerosols"
    ],
    skinTypes: ["Home Ambiance", "Office Friendly", "Automobile", "Living Spaces"],
    ingredients: "Purified Water, Rosa Damascena (Rose) Flower Distillate, Natural Botanical Fragrance Essential Oils, Odor Neutralizing Bio-Enzymes, PEG-40 Hydrogenated Castor Oil, Preservative Complex.",
    usageInstructions: "1. Turn the nozzle to the spray position.\n2. Hold bottle upright and aim toward the center of the room.\n3. Spray 4–5 bursts evenly in the desired area.\n4. Reapply whenever you want a fresh, revitalizing rose ambiance.",
    description: "Transform your daily surroundings into a serene floral sanctuary with Maysha Rose Air Freshener. Formulated with authentic rose flower distillate and odor-capturing natural bio-enzymes, this fine-mist spray eliminates unwanted odors immediately while diffusing a luxurious, fresh rose fragrance that lingers gently for hours."
  },
  {
    id: "prod-1",
    slug: "gentle-face-cleanser",
    name: "Gentle Face Cleanser",
    subtitle: "A mild, non-drying cleanser that removes impurities while keeping your skin balanced and hydrated.",
    category: "Cleansers",
    categorySlug: "cleansers",
    concern: "Barrier Repair",
    concernSlug: "barrier-repair",
    price: 399,
    mrp: 750,
    discountPercentage: 47,
    size: "100 ml",
    rating: 4.9,
    reviewCount: 124,
    badge: "Bestseller",
    inStock: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-1-50", size: "50 ml", price: 249, mrp: 450, inStock: true },
      { id: "var-1-100", size: "100 ml", price: 399, mrp: 750, inStock: true },
      { id: "var-1-200", size: "200 ml", price: 699, mrp: 1299, inStock: true }
    ],
    keyBenefits: [
      "Deeply cleanses without stripping natural moisture",
      "Formulated with soothing oat extract and provitamin B5",
      "Sulfate-free, gentle foam with skin-neutral pH 5.5",
      "Leaves skin feeling calm, soft and supple"
    ],
    skinTypes: ["All Skin Types", "Sensitive", "Dry to Normal"],
    ingredients: "Aqua, Sodium Cocoyl Glycinate, Glycerin, Avena Sativa (Oat) Kernel Extract, Panthenol (Provitamin B5), Allantoin, Chamomilla Recutita Flower Extract, Ethylhexylglycerin, Phenoxyethanol.",
    usageInstructions: "Dispense a small coin-sized amount onto wet palms. Gently massage onto damp face in circular motions for 60 seconds. Rinse thoroughly with lukewarm water. Use morning and night.",
    description: "This gentle face cleanser is enriched with natural botanical ingredients that help remove dirt, oil, sunscreen, and daily pollutants without stripping your skin. Formulated at a biocompatible pH of 5.5, it preserves your vital skin barrier while leaving skin feeling refreshingly clean and silky soft."
  },
  {
    id: "prod-2",
    slug: "hydrating-toner",
    name: "Hydrating Toner",
    subtitle: "Replenishing multi-depth moisture essence that preps and rebalances the skin barrier.",
    category: "Toners",
    categorySlug: "toners",
    concern: "Dehydration & Dryness",
    concernSlug: "dehydration-dryness",
    price: 449,
    mrp: 899,
    discountPercentage: 50,
    size: "100 ml",
    rating: 4.8,
    reviewCount: 98,
    badge: "Bestseller",
    inStock: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-2-100", size: "100 ml", price: 449, mrp: 899, inStock: true },
      { id: "var-2-200", size: "200 ml", price: 749, mrp: 1499, inStock: true }
    ],
    keyBenefits: [
      "Triple molecular weight hyaluronic acid penetrates multiple skin layers",
      "Calming green tea and centella asiatica soothe redness",
      "Instantly restores moisture post-cleansing",
      "Alcohol-free and non-sticky finish"
    ],
    skinTypes: ["All Skin Types", "Dry", "Dehydrated", "Combination"],
    ingredients: "Aqua, Camellia Sinensis (Green Tea) Leaf Water, Butylene Glycol, Sodium Hyaluronate (Multi-molecular), Centella Asiatica Extract, Niacinamide (2%), Betaine, Sodium PCA, 1,2-Hexanediol.",
    usageInstructions: "After cleansing, pour 3-4 drops into palms or onto a reusable cotton pad. Gently pat across face and neck until fully absorbed. Follow with serum and moisturizer.",
    description: "Our Hydrating Toner is formulated with pure botanical extracts and multi-weight hyaluronic acid to flood dehydrated cells with immediate and long-lasting moisture. It preps your skin to maximize the absorption of subsequent serums and treatments."
  },
  {
    id: "prod-3",
    slug: "vitamin-c-serum",
    name: "Vitamin C Serum",
    subtitle: "High-potency 10% ethyl ascorbic acid with ferulic acid for radiant, illuminated skin tone.",
    category: "Serums",
    categorySlug: "serums",
    concern: "Uneven Tone",
    concernSlug: "uneven-tone",
    price: 699,
    mrp: 1299,
    discountPercentage: 46,
    size: "30 ml",
    rating: 4.9,
    reviewCount: 215,
    badge: "Bestseller",
    inStock: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-3-30", size: "30 ml", price: 699, mrp: 1299, inStock: true },
      { id: "var-3-50", size: "50 ml", price: 1049, mrp: 1899, inStock: true }
    ],
    keyBenefits: [
      "Fades dark spots, post-acne marks and sun pigmentation",
      "Defends against environmental free radicals and UV damage",
      "Ultra-stable Ethyl Ascorbic Acid does not oxidize quickly",
      "Imparts an instant healthy dewy luminosity"
    ],
    skinTypes: ["Normal", "Combination", "Oily", "Dull Skin"],
    ingredients: "Aqua, 3-O-Ethyl Ascorbic Acid (10%), Propanediol, Ferulic Acid (0.5%), Citrus Aurantium Dulcis (Orange) Peel Extract, Tocopherol (Vitamin E), Sodium Hyaluronate, Hydroxyethylcellulose, Citric Acid.",
    usageInstructions: "Apply 3-4 drops to cleansed and toned face every morning. Pat gently until absorbed. Always follow with SPF 50 sunscreen during daytime.",
    description: "A clinically stabilized 10% Vitamin C serum supercharged with ferulic acid and pure botanicals. Designed to dramatically illuminate complexion, fade hyperpigmentation, and stimulate collagen synthesis without the irritation typical of traditional L-ascorbic acid."
  },
  {
    id: "prod-4",
    slug: "lightweight-moisturizer",
    name: "Lightweight Moisturizer",
    subtitle: "Weightless ceramide gel-cream that locks in deep hydration without clogging pores.",
    category: "Moisturizers",
    categorySlug: "moisturizers",
    concern: "Barrier Repair",
    concernSlug: "barrier-repair",
    price: 549,
    mrp: 1099,
    discountPercentage: 50,
    size: "50 ml",
    rating: 4.8,
    reviewCount: 167,
    badge: "Bestseller",
    inStock: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-4-50", size: "50 ml", price: 549, mrp: 1099, inStock: true },
      { id: "var-4-100", size: "100 ml", price: 899, mrp: 1799, inStock: true }
    ],
    keyBenefits: [
      "Infused with 3 essential skin-identical ceramides (NP, AP, EOP)",
      "Non-comedogenic gel-cream texture absorbs instantly",
      "Locks in hydration for up to 48 hours without shine",
      "Soothes compromised, flaky, or irritated skin"
    ],
    skinTypes: ["All Skin Types", "Combination", "Oily", "Acne-Prone"],
    ingredients: "Aqua, Glycerin, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Squalane, Carbomer, Sodium Lauroyl Lactylate, Xanthan Gum.",
    usageInstructions: "Smooth a blueberry-sized amount over face and neck as the final hydration step in your skincare routine. Use morning and night.",
    description: "An elegant, fast-absorbing moisturizer that delivers continuous barrier replenishment. Formulated with pure ceramides, phytosphingosine, and botanical squalane to seal in moisture and protect against urban stressors."
  },
  {
    id: "prod-5",
    slug: "dewy-mineral-sunscreen-spf-50",
    name: "Dewy Mineral Sunscreen SPF 50",
    subtitle: "Broad-spectrum PA++++ sheer zinc protection with zero white cast and a natural dewy finish.",
    category: "Sunscreen",
    categorySlug: "sunscreen",
    concern: "Uneven Tone",
    concernSlug: "uneven-tone",
    price: 499,
    mrp: 899,
    discountPercentage: 44,
    size: "50 g",
    rating: 4.9,
    reviewCount: 182,
    badge: "New Launch",
    inStock: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-5-50", size: "50 g", price: 499, mrp: 899, inStock: true },
      { id: "var-5-100", size: "100 g", price: 799, mrp: 1499, inStock: true }
    ],
    keyBenefits: [
      "High UVA/UVB PA++++ broad-spectrum mineral protection",
      "Featherlight texture with undetectable zero white cast",
      "Infused with soothing niacinamide and antioxidant vitamin E",
      "Reef-safe and water-resistant for 80 minutes"
    ],
    skinTypes: ["All Skin Types", "Sensitive", "Acne-Prone"],
    ingredients: "Aqua, Zinc Oxide (Non-nano 18%), Coco-Caprylate/Caprate, Niacinamide (3%), Polyglyceryl-3 Polyricinoleate, Isostearic Acid, Tocopheryl Acetate, Silica, Phenoxyethanol.",
    usageInstructions: "Apply generously using the two-finger rule 15 minutes before sun exposure. Reapply every 2 hours or after 80 minutes of swimming or sweating.",
    description: "A breakthrough 100% mineral daily sunscreen that provides invisible, weightless defense against harmful UVA and UVB rays. Infused with skin-brightening niacinamide to protect and enhance skin radiance simultaneously."
  },
  {
    id: "prod-6",
    slug: "clarifying-bha-2-exfoliant",
    name: "Clarifying BHA 2% Exfoliant",
    subtitle: "Pore-clearing salicylic acid liquid with soothing green tea for smooth, congestion-free skin.",
    category: "Treatments",
    categorySlug: "treatments",
    concern: "Acne Control",
    concernSlug: "acne-control",
    price: 599,
    mrp: 1199,
    discountPercentage: 50,
    size: "100 ml",
    rating: 4.7,
    reviewCount: 88,
    badge: "Trending",
    inStock: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-6-100", size: "100 ml", price: 599, mrp: 1199, inStock: true }
    ],
    keyBenefits: [
      "Dissolves sebum and unclogs enlarged pores",
      "Diminishes blackheads and stubborn blemishes",
      "Smoothes rough, uneven skin texture",
      "Formulated at optimal pH 3.6 for maximum gentle efficacy"
    ],
    skinTypes: ["Oily", "Combination", "Acne-Prone"],
    ingredients: "Aqua, Methylpropanediol, Salicylic Acid (2%), Camellia Sinensis (Green Tea) Leaf Extract, Epilobium Angustifolium Extract, Sodium Hydroxide, Tetrasodium EDTA.",
    usageInstructions: "Soak a cotton pad and sweep across cleansed face 2-3 nights per week. Do not rinse off. Follow with moisturizer.",
    description: "Targeted leave-on exfoliant that penetrates deep into pore linings to dissolve trapped debris and dead skin cells. Reveals smooth, clear, unclogged skin without causing irritation or dryness."
  },
  {
    id: "prod-7",
    slug: "multi-peptide-repair-night-cream",
    name: "Multi-Peptide Repair Night Cream",
    subtitle: "Overnight firming treatment enriched with copper tripeptides and bakuchiol.",
    category: "Moisturizers",
    categorySlug: "moisturizers",
    concern: "Fine Lines & Aging",
    concernSlug: "fine-lines-aging",
    price: 799,
    mrp: 1499,
    discountPercentage: 47,
    size: "50 g",
    rating: 4.9,
    reviewCount: 142,
    badge: "Award Winner",
    inStock: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-7-50", size: "50 g", price: 799, mrp: 1499, inStock: true }
    ],
    keyBenefits: [
      "Stimulates collagen renewal during night restorative cycles",
      "Smoothes appearance of fine expression lines",
      "Plant-derived bakuchiol delivers retinol-like results gently",
      "Rich velvety cushion texture"
    ],
    skinTypes: ["Normal", "Dry", "Mature"],
    ingredients: "Aqua, Butyrospermum Parkii (Shea) Butter, Caprylic/Capric Triglyceride, Bakuchiol (1%), Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Copper Tripeptide-1, Glycerin, Cetearyl Olivate, Sorbitan Olivate.",
    usageInstructions: "Warm a dime-sized amount between fingertips and press gently into face, neck, and décolletage every evening after serums.",
    description: "A nourishing nocturnal repair cream featuring a powerhouse matrix of biomimetic copper peptides and botanical bakuchiol. Renews skin density, elasticity, and firmness while you sleep."
  },
  {
    id: "prod-8",
    slug: "balancing-botanical-facial-oil",
    name: "Balancing Botanical Facial Oil",
    subtitle: "Cold-pressed golden jojoba, rosehip, and squalane elixir for luminous cellular nutrition.",
    category: "Treatments",
    categorySlug: "treatments",
    concern: "Dehydration & Dryness",
    concernSlug: "dehydration-dryness",
    price: 649,
    mrp: 1199,
    discountPercentage: 46,
    size: "30 ml",
    rating: 4.8,
    reviewCount: 79,
    badge: "Trending",
    inStock: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    ],
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
    variants: [
      { id: "var-8-30", size: "30 ml", price: 649, mrp: 1199, inStock: true }
    ],
    keyBenefits: [
      "100% pure cold-pressed organic botanical oils",
      "Balances sebum production and prevents moisture loss",
      "High in essential fatty acids (Omega 3, 6, 9)",
      "Instant glass-skin sheen without greasy residue"
    ],
    skinTypes: ["All Skin Types", "Dry", "Combination"],
    ingredients: "Simmondsia Chinensis (Jojoba) Seed Oil, Rosa Canina (Rosehip) Seed Oil, Plant-derived Squalane, Helianthus Annuus Seed Oil, Tocopherol (Vitamin E), Pelargonium Graveolens (Geranium) Oil.",
    usageInstructions: "Warm 2-3 drops between palms and gently press onto face as the final sealant in your routine, or mix a drop into your foundation.",
    description: "An artisanal blend of golden cold-pressed oils chosen for their compatibility with natural human sebum. Nourishes, heals, and locks in active skincare ingredients for a velvet-soft, radiant finish."
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "Bestseller" || p.isFeatured);
}
