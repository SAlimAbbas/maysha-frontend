"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  Lock,
  Mail,
  User,
  ArrowUp,
  ArrowDown,
  Settings,
  Send,
  Users,
  Save,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Eye,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe2,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiBffFetch, formatINR } from "@/lib/api";
import { useUIStore } from "@/stores/uiStore";
import CloudinaryGalleryUploader from "@/components/admin/CloudinaryGalleryUploader";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";

type AdminTab =
  | "overview"
  | "products"
  | "orders"
  | "categories"
  | "banners"
  | "articles"
  | "reviews"
  | "coupons"
  | "subscribers"
  | "settings";

export default function AdminPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refetchUser,
  } = useAuth();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const tabNavRef = React.useRef<HTMLDivElement>(null);
  const scrollTabs = (dir: "left" | "right") => {
    if (tabNavRef.current) {
      tabNavRef.current.scrollBy({
        left: dir === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  // Admin login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [login2FaPin, setLogin2FaPin] = useState("");
  const [is2FaActive, setIs2FaActive] = useState<boolean | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [isSavingCoupon, setIsSavingCoupon] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: 10,
    min_subtotal: 0,
    max_discount: 0,
    usage_limit: "",
    per_user_limit: 1,
    first_order_only: false,
    is_active: true,
  });

  // Category CRUD state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    sort_order: 0,
    is_active: true,
    seo_title: "",
    seo_description: "",
  });

  const [subscribersData, setSubscribersData] = useState<{
    subscribers: any[];
    totalSubscribers: number;
    totalRegisteredCustomers: number;
  }>({ subscribers: [], totalSubscribers: 0, totalRegisteredCustomers: 0 });
  const [siteSettings, setSiteSettings] = useState<any>({
    store_name: "Maysha Skincare",
    tagline: "Clean Beauty for Real Skin",
    support_email: "care@mayshaskincare.com",
    support_phone: "+91 98765 43210",
    support_whatsapp: "+91 98765 43210",
    support_hours: "Mon - Sat: 9:30 AM to 6:30 PM IST",
    store_address: "Maysha Organics Lab, Mumbai, MH, India",
    free_shipping_threshold: 999,
    shipping_fee: 99,
    social_instagram: "https://instagram.com/mayshaskincare",
    social_facebook: "https://facebook.com/mayshaskincare",
    about_hero_title: "Clean Botanical Science for Resilient, Real Skin",
    about_hero_subtitle:
      "Maysha was founded on an unwavering truth: skincare should support your skin's natural biology, never wage war against it. We formulate restorative, biocompatible skincare using pure botanical extracts balanced with clinically proven actives.",
    about_hero_image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
    about_philosophy_image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85",
    about_story_title: "Born from a need for honest, barrier-conscious skincare.",
    about_story_content: "",
    admin_2fa_enabled: false,
    admin_2fa_pin: "9281",
    seo_home_title: "Maysha | Clean Botanical Science for Real Skin",
    seo_home_description:
      "Discover clean, bio-compatible skincare rituals formulated with pure botanical extracts and clinical actives for resilient, radiant skin.",
    seo_about_title: "About Our Botanical Philosophy | Maysha Skincare",
    seo_about_description:
      "Learn about Maysha's formulation ethos, ethical sourcing of Damask rose, and biocompatible skincare science.",
    seo_journal_title: "The Skincare Journal | Maysha Skincare Science",
    seo_journal_description:
      "Expert skincare guides, ingredient deep-dives, barrier repair science, and holistic rituals.",
    seo_shop_title: "Shop All Botanical Formulations | Maysha",
    seo_shop_description:
      "Explore all cleansers, serums, toners, moisturizers, and room mists thoughtfully engineered for real skin.",
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Newsletter broadcast form state
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [campaignRecipientType, setCampaignRecipientType] = useState("all");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // -------------------------------------------------------------
  // Modals & Edit States
  // -------------------------------------------------------------
  interface ProductVariantRow {
    id?: string;
    size: string;
    price: number;
    mrp: number;
    stock: number;
    sku?: string;
  }

  const AVAILABLE_BADGES = [
    "Bestseller",
    "New Launch",
    "20% OFF",
    "25% OFF",
    "Editor's Choice",
    "Clean Botanical",
    "Award Winner",
    "Limited Edition",
    "Barrier Safe",
    "Top Rated",
  ];

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [descViewMode, setDescViewMode] = useState<"write" | "preview">(
    "write",
  );
  const [howToUseViewMode, setHowToUseViewMode] = useState<"write" | "preview">(
    "write",
  );
  const [productFormData, setProductFormData] = useState({
    name: "",
    slug: "",
    category_id: "",
    subtitle: "",
    short_description: "",
    description: "",
    selectedBadges: ["Bestseller"] as string[],
    customBadgeInput: "",
    ingredients: "",
    usage_instructions: "",
    key_benefits: "Barrier support, Deep hydration, Antioxidant rich",
    skin_types: "All Skin Types, Sensitive, Dry",
    seo_title: "",
    seo_description: "",
    images: [] as string[],
    variants: [
      { id: "", size: "50ml", price: 699, mrp: 899, stock: 50, sku: "" },
    ] as ProductVariantRow[],
  });

  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    subtitle: "",
    cta_text: "Shop Now",
    cta_link: "/shop",
    desktop_image: "",
    mobile_image: "",
    badge_text: "Botanical Formulation",
    sort_order: 1,
    is_active: true,
  });

  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [articleContentViewMode, setArticleContentViewMode] = useState<
    "write" | "preview"
  >("write");
  const [isCustomArticleCategory, setIsCustomArticleCategory] = useState(false);
  const [customArticleCategoryInput, setCustomArticleCategoryInput] =
    useState("");
  const [articleFormData, setArticleFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    category: "Skincare Science",
    author: "Maysha Formulation Team",
    reading_time: "5 min read",
    excerpt: "",
    content: "",
    hero_image: "",
    is_featured: false,
  });

  // Dynamic Journal Article Categories (derived from existing stories + defaults)
  const defaultArticleCategories = [
    "Skincare Science",
    "Ingredient Focus",
    "Rituals & Guides",
    "Ingredient Deep Dives",
    "Daily Rituals",
    "Sustainability",
  ];
  const dynamicArticleCategories = Array.from(
    new Set([
      ...defaultArticleCategories,
      ...articles.map((a: any) => a.category).filter(Boolean),
    ]),
  );

  const isAdmin = user && user.role === "admin";

  // Fetch admin data on load
  const loadAdminData = async () => {
    if (!isAdmin) return;
    setIsLoadingData(true);

    try {
      const [
        statsRes,
        prodsRes,
        ordersRes,
        catsRes,
        bansRes,
        artsRes,
        revsRes,
        settingsRes,
        subsRes,
        couponsRes,
      ] = await Promise.all([
        apiBffFetch<any>("admin/dashboard/stats").catch(() => null),
        apiBffFetch<any>("admin/products").catch(() => null),
        apiBffFetch<any>("admin/orders").catch(() => null),
        apiBffFetch<any>("admin/categories")
          .catch(() => apiBffFetch<any>("categories"))
          .catch(() => null),
        apiBffFetch<any>("banners").catch(() => null),
        apiBffFetch<any>("admin/articles").catch(() => null),
        apiBffFetch<any>("admin/reviews").catch(() => null),
        apiBffFetch<any>("admin/settings").catch(() => null),
        apiBffFetch<any>("admin/subscribers").catch(() => null),
        apiBffFetch<any>("admin/coupons").catch(() => null),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (prodsRes?.data) setProducts(prodsRes.data);
      if (ordersRes?.data) setOrders(ordersRes.data);
      if (catsRes?.data) setCategories(catsRes.data);
      if (bansRes?.data) setBanners(bansRes.data);
      if (artsRes?.data) setArticles(artsRes.data);
      if (revsRes?.data) setReviews(revsRes.data);
      if (settingsRes?.data)
        setSiteSettings((prev: any) => ({ ...prev, ...settingsRes.data }));
      if (subsRes?.data) setSubscribersData(subsRes.data);
      if (couponsRes?.data) setCoupons(couponsRes.data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    // Check if 2FA is active on the backend
    apiBffFetch<any>("store-info")
      .then((res: any) => {
        if (res?.data?.admin2faEnabled !== undefined) {
          setIs2FaActive(Boolean(res.data.admin2faEnabled));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Admin login handler with strict 2FA protection check
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    // If 2FA is active, prevent submission without entering the PIN
    if (is2FaActive && !login2FaPin.trim()) {
      setIsLoggingIn(false);
      setLoginError(
        "2FA Protection is enabled. Please enter your 4-6 digit security PIN.",
      );
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          two_factor_pin: login2FaPin.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Invalid administrative credentials.");
      }

      if (json.user?.role !== "admin") {
        throw new Error("This account does not have administrator privileges.");
      }

      await refetchUser();
      addToast(
        "Administrator Access",
        "Welcome to Maysha Management Console.",
        "success",
      );
    } catch (err: any) {
      setLoginError(err.message || "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Status changer for orders
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      await apiBffFetch(`admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      addToast("Order Updated", `Order marked as ${newStatus}`, "success");
      loadAdminData();
    } catch (err: any) {
      addToast(
        "Error",
        err.message || "Failed to update order status",
        "error",
      );
    }
  };

  // Review approver
  const handleApproveReview = async (reviewId: string) => {
    try {
      await apiBffFetch(`admin/reviews/${reviewId}/approve`, {
        method: "PUT",
      });
      addToast(
        "Review Approved",
        "Review is now published on the storefront.",
        "success",
      );
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to approve review", "error");
    }
  };

  // Review rejecter
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to reject and delete this review?"))
      return;
    try {
      await apiBffFetch(`admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
      addToast("Review Removed", "Review deleted successfully.", "info");
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to delete review", "error");
    }
  };

  // -------------------------------------------------------------
  // Product Operations & Helpers
  // -------------------------------------------------------------
  const handleToggleBadge = (badgeName: string) => {
    const current = productFormData.selectedBadges;
    if (current.includes(badgeName)) {
      setProductFormData({
        ...productFormData,
        selectedBadges: current.filter((b) => b !== badgeName),
      });
    } else {
      setProductFormData({
        ...productFormData,
        selectedBadges: [...current, badgeName],
      });
    }
  };

  const handleAddCustomBadge = () => {
    const trimmed = productFormData.customBadgeInput.trim();
    if (!trimmed) return;
    if (!productFormData.selectedBadges.includes(trimmed)) {
      setProductFormData({
        ...productFormData,
        selectedBadges: [...productFormData.selectedBadges, trimmed],
        customBadgeInput: "",
      });
    } else {
      setProductFormData({
        ...productFormData,
        customBadgeInput: "",
      });
    }
  };

  const handleAddVariantRow = () => {
    const last = productFormData.variants[productFormData.variants.length - 1];
    const newVariant: ProductVariantRow = {
      id: "",
      size:
        last?.size === "50ml"
          ? "100ml"
          : last?.size === "100ml"
            ? "200ml Refill"
            : "30ml",
      price: last?.price ? Math.round(last.price * 1.5) : 899,
      mrp: last?.mrp ? Math.round(last.mrp * 1.5) : 1199,
      stock: 40,
      sku: "",
    };
    setProductFormData({
      ...productFormData,
      variants: [...productFormData.variants, newVariant],
    });
  };

  const handleRemoveVariantRow = (index: number) => {
    if (productFormData.variants.length <= 1) {
      addToast(
        "At least 1 variant required",
        "A product must have at least one size variant and price.",
        "info",
      );
      return;
    }
    const updated = productFormData.variants.filter((_, i) => i !== index);
    setProductFormData({
      ...productFormData,
      variants: updated,
    });
  };

  const handleUpdateVariantRow = (
    index: number,
    field: keyof ProductVariantRow,
    value: any,
  ) => {
    const updated = [...productFormData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setProductFormData({
      ...productFormData,
      variants: updated,
    });
  };

  const handleInsertFormatting = (
    type:
      | "bold"
      | "italic"
      | "h2"
      | "h3"
      | "bullet"
      | "number"
      | "quote"
      | "hr",
  ) => {
    const textarea = document.getElementById(
      "detailed-desc-textarea",
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = productFormData.description;
    const selected = text.substring(start, end);

    let snippet = "";
    switch (type) {
      case "bold":
        snippet = selected ? `**${selected}**` : "**Key Botanical Active**";
        break;
      case "italic":
        snippet = selected ? `*${selected}*` : "*Gentle natural aroma*";
        break;
      case "h2":
        snippet = `\n## ${selected || "Formulation Highlights & Efficacy"}\n`;
        break;
      case "h3":
        snippet = `\n### ${selected || "Why Your Skin Barrier Loves This"}\n`;
        break;
      case "bullet":
        snippet = selected
          ? selected
              .split("\n")
              .map((l) => `• ${l.replace(/^[•\-\*]\s*/, "")}`)
              .join("\n")
          : "\n• 72-hour cellular moisture lock\n• Reinforces intercellular lipid matrix\n• Clinically vetted biocompatibility\n";
        break;
      case "number":
        snippet = selected
          ? selected
              .split("\n")
              .map((l, i) => `${i + 1}. ${l.replace(/^\d+[\.\)]\s*/, "")}`)
              .join("\n")
          : "\n1. Cleanse thoroughly with warm water\n2. Warm 2-3 drops between clean palms\n3. Press into face and neck morning and night\n";
        break;
      case "quote":
        snippet = `\n> ${selected || "Engineered at skin-optimal pH 5.5 to respect natural micro-flora."}\n`;
        break;
      case "hr":
        snippet = "\n---\n";
        break;
    }

    const nextText = text.substring(0, start) + snippet + text.substring(end);
    setProductFormData({ ...productFormData, description: nextText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + snippet.length,
        start + snippet.length,
      );
    }, 50);
  };

  const handleInsertHowToUseFormatting = (
    type: "bold" | "italic" | "step" | "bullet" | "tip" | "divider",
  ) => {
    const textarea = document.getElementById(
      "how-to-use-textarea",
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = productFormData.usage_instructions || "";
    const selected = text.substring(start, end);

    let snippet = "";
    switch (type) {
      case "bold":
        snippet = selected ? `**${selected}**` : "**Morning & Night**";
        break;
      case "italic":
        snippet = selected ? `*${selected}*` : "*Gentle circular motions*";
        break;
      case "step":
        snippet = selected
          ? selected
              .split("\n")
              .map((l, i) => `${i + 1}. ${l.replace(/^\d+[\.\)]\s*/, "")}`)
              .join("\n")
          : "\n1. Dispense a coin-sized amount onto damp palms\n2. Gently massage across face and neck in upward circular motions\n3. Rinse thoroughly with lukewarm water and pat dry\n";
        break;
      case "bullet":
        snippet = selected
          ? selected
              .split("\n")
              .map((l) => `• ${l.replace(/^[•\-\*]\s*/, "")}`)
              .join("\n")
          : "\n• AM Ritual: Apply after toning before sunscreen\n• PM Ritual: Use as the restorative final layer before sleep\n";
        break;
      case "tip":
        snippet = `\n> Pro Tip: ${selected || "For enhanced absorption, apply onto slightly damp skin immediately after misting."}\n`;
        break;
      case "divider":
        snippet = "\n---\n";
        break;
    }

    const nextText = text.substring(0, start) + snippet + text.substring(end);
    setProductFormData({ ...productFormData, usage_instructions: nextText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + snippet.length,
        start + snippet.length,
      );
    }, 50);
  };

  const handleOpenAddProduct = () => {
    setProductFormData({
      name: "",
      slug: "",
      category_id: categories[0]?.id || "1",
      subtitle: "",
      short_description: "",
      description: "",
      selectedBadges: ["Bestseller"],
      customBadgeInput: "",
      ingredients: "",
      usage_instructions: "",
      key_benefits: "Barrier support, Deep hydration, Antioxidant rich",
      skin_types: "All Skin Types, Sensitive, Dry",
      seo_title: "",
      seo_description: "",
      images: [],
      variants: [
        { id: "", size: "50ml", price: 699, mrp: 899, stock: 50, sku: "" },
      ],
    });
    setDescViewMode("write");
    setHowToUseViewMode("write");
    setEditingProduct(null);
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);

    // Parse badges (supports comma-separated string or array)
    const badgesArray = prod.badge
      ? String(prod.badge)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

    // Parse variants
    let variantsList: ProductVariantRow[] = [];
    if (Array.isArray(prod.variants) && prod.variants.length > 0) {
      variantsList = prod.variants.map((v: any) => ({
        id: String(v.id || ""),
        size: v.size || v.size_label || "50ml",
        price: Number(v.price || 699),
        mrp: Number(v.mrp || 899),
        stock: Number(v.stock ?? 50),
        sku: v.sku || "",
      }));
    } else {
      variantsList = [
        {
          id: "",
          size: prod.size || "50ml",
          price: Number(prod.price || 699),
          mrp: Number(prod.mrp || 899),
          stock: Number(prod.stock ?? 50),
          sku: "",
        },
      ];
    }

    setProductFormData({
      name: prod.name || "",
      slug: prod.slug || "",
      category_id:
        prod.categoryId || prod.category_id || categories[0]?.id || "1",
      subtitle: prod.subtitle || "",
      short_description: prod.shortDescription || prod.subtitle || "",
      description: prod.description || "",
      selectedBadges: badgesArray,
      customBadgeInput: "",
      ingredients: prod.ingredients || "",
      usage_instructions:
        prod.usageInstructions || prod.usage_instructions || "",
      key_benefits: Array.isArray(prod.keyBenefits)
        ? prod.keyBenefits.join(", ")
        : prod.key_benefits
          ? Array.isArray(prod.key_benefits)
            ? prod.key_benefits.join(", ")
            : String(prod.key_benefits)
          : "",
      skin_types: Array.isArray(prod.skinTypes)
        ? prod.skinTypes.join(", ")
        : prod.skin_types
          ? Array.isArray(prod.skin_types)
            ? prod.skin_types.join(", ")
            : String(prod.skin_types)
          : "All Skin Types",
      seo_title: prod.seoTitle || prod.seo_title || "",
      seo_description: prod.seoDescription || prod.seo_description || "",
      images:
        prod.images && prod.images.length > 0
          ? prod.images
          : [prod.image].filter(Boolean),
      variants: variantsList,
    });
    setDescViewMode("write");
    setHowToUseViewMode("write");
    setShowAddProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productFormData.variants.length === 0) {
      addToast(
        "Variant Required",
        "Please configure at least one product variant (size, price & stock).",
        "error",
      );
      return;
    }

    const primaryVariant = productFormData.variants[0];

    const payload = {
      name: productFormData.name,
      slug:
        productFormData.slug ||
        productFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category_id: productFormData.category_id || categories[0]?.id || 1,
      subtitle: productFormData.subtitle,
      short_description: productFormData.short_description,
      description: productFormData.description,
      badge: productFormData.selectedBadges.join(", ") || null,
      ingredients: productFormData.ingredients,
      usage_instructions: productFormData.usage_instructions,
      key_benefits: productFormData.key_benefits
        ? productFormData.key_benefits
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      skin_types: productFormData.skin_types
        ? productFormData.skin_types
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      seo_title: productFormData.seo_title.trim() || null,
      seo_description: productFormData.seo_description.trim() || null,
      images: productFormData.images,
      price: Number(primaryVariant.price),
      mrp: Number(primaryVariant.mrp),
      stock: Number(primaryVariant.stock),
      size: primaryVariant.size,
      variants: productFormData.variants.map((v) => ({
        id: v.id || undefined,
        size_label: v.size,
        size: v.size,
        price: Number(v.price),
        mrp: Number(v.mrp),
        stock: Number(v.stock),
        sku: v.sku || undefined,
        is_active: true,
      })),
    };

    try {
      if (editingProduct) {
        await apiBffFetch(`admin/products/${editingProduct.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast(
          "Product Updated",
          `${payload.name} was successfully updated with ${payload.variants.length} variant(s).`,
          "success",
        );
      } else {
        await apiBffFetch("admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast(
          "Product Created",
          "New formulation added to catalog with variants.",
          "success",
        );
      }
      setShowAddProductModal(false);
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to save product.", "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product from the database?",
      )
    )
      return;
    try {
      await apiBffFetch(`admin/products/${productId}`, { method: "DELETE" });
      addToast(
        "Product Removed",
        "Product removed from store catalog.",
        "info",
      );
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to delete product.", "error");
    }
  };

  // -------------------------------------------------------------
  // Banner Operations & Rearranging
  // -------------------------------------------------------------
  const handleOpenAddBanner = () => {
    setBannerFormData({
      title: "",
      subtitle: "",
      cta_text: "Shop Now",
      cta_link: "/shop",
      desktop_image: "",
      mobile_image: "",
      badge_text: "Clean Beauty",
      sort_order: banners.length + 1,
      is_active: true,
    });
    setEditingBanner(null);
    setShowAddBannerModal(true);
  };

  const handleOpenEditBanner = (ban: any) => {
    setEditingBanner(ban);
    setBannerFormData({
      title: ban.title || "",
      subtitle: ban.subtitle || "",
      cta_text: ban.ctaText || ban.cta_text || "Shop Now",
      cta_link: ban.ctaLink || ban.cta_link || "/shop",
      desktop_image: ban.desktopImage || ban.desktop_image || "",
      mobile_image: ban.mobileImage || ban.mobile_image || "",
      badge_text: ban.badgeText || ban.badge_text || "",
      sort_order: ban.sortOrder || ban.sort_order || 1,
      is_active: ban.isActive ?? ban.is_active ?? true,
    });
    setShowAddBannerModal(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFormData.desktop_image) {
      addToast(
        "Image Required",
        "Please upload a desktop banner image to Cloudinary.",
        "error",
      );
      return;
    }

    const payload = {
      title: bannerFormData.title,
      subtitle: bannerFormData.subtitle,
      cta_text: bannerFormData.cta_text,
      link_url: bannerFormData.cta_link,
      desktop_image: bannerFormData.desktop_image,
      mobile_image: bannerFormData.mobile_image || bannerFormData.desktop_image,
      badge_text: bannerFormData.badge_text,
      sort_order: bannerFormData.sort_order,
      is_active: bannerFormData.is_active,
    };

    try {
      if (editingBanner) {
        await apiBffFetch(`admin/banners/${editingBanner.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast(
          "Banner Updated",
          "Carousel banner successfully updated.",
          "success",
        );
      } else {
        await apiBffFetch("admin/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast("Banner Created", "New carousel slide added.", "success");
      }
      setShowAddBannerModal(false);
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to save banner.", "error");
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this carousel banner?"))
      return;
    try {
      await apiBffFetch(`admin/banners/${bannerId}`, { method: "DELETE" });
      addToast("Banner Removed", "Banner removed.", "info");
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to delete banner.", "error");
    }
  };

  const handleMoveBanner = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;
    setBanners(newBanners);

    const bannerIds = newBanners.map((b) => Number(b.id));

    try {
      await apiBffFetch("admin/banners/reorder", {
        method: "POST",
        body: JSON.stringify({ banner_ids: bannerIds }),
      });
      addToast(
        "Order Updated",
        "Banner sequence saved to storefront.",
        "success",
      );
    } catch (err: any) {
      addToast("Error", err.message || "Failed to reorder banners", "error");
      loadAdminData();
    }
  };

  // -------------------------------------------------------------
  // Journal / Article Operations
  // -------------------------------------------------------------
  const handleInsertArticleFormatting = (
    type:
      | "bold"
      | "italic"
      | "h2"
      | "h3"
      | "bullet"
      | "number"
      | "quote"
      | "hr",
  ) => {
    const textarea = document.getElementById(
      "article-content-textarea",
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = articleFormData.content || "";
    const selected = text.substring(start, end);

    let snippet = "";
    switch (type) {
      case "bold":
        snippet = selected ? `**${selected}**` : "**Key Botanical Principle**";
        break;
      case "italic":
        snippet = selected ? `*${selected}*` : "*Cellular renewal*";
        break;
      case "h2":
        snippet = `\n## ${selected || "Scientific Methodology & Findings"}\n`;
        break;
      case "h3":
        snippet = `\n### ${selected || "Clinical Evidence & Observations"}\n`;
        break;
      case "bullet":
        snippet = selected
          ? selected
              .split("\n")
              .map((l) => `• ${l.replace(/^[•\-\*]\s*/, "")}`)
              .join("\n")
          : "\n• Bioactive flavonoid concentration\n• Synergistic antioxidant protection\n• Non-comedogenic barrier restoration\n";
        break;
      case "number":
        snippet = selected
          ? selected
              .split("\n")
              .map((l, i) => `${i + 1}. ${l.replace(/^\d+[\.\)]\s*/, "")}`)
              .join("\n")
          : "\n1. Morning topical application following essence\n2. Gentle press-in motion to encourage lymph circulation\n3. Consistent ritual adherence over 28-day skin cycle\n";
        break;
      case "quote":
        snippet = `\n> ${selected || "Botanical synergy elevates molecular efficacy beyond isolated synthetic compounds."}\n`;
        break;
      case "hr":
        snippet = "\n---\n";
        break;
    }

    const nextText = text.substring(0, start) + snippet + text.substring(end);
    setArticleFormData({ ...articleFormData, content: nextText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + snippet.length,
        start + snippet.length,
      );
    }, 50);
  };

  const handleOpenAddArticle = () => {
    setArticleFormData({
      title: "",
      slug: "",
      subtitle: "",
      category: "Skincare Science",
      author: "Maysha Formulation Team",
      reading_time: "5 min read",
      excerpt: "",
      content: "",
      hero_image: "",
      is_featured: false,
    });
    setEditingArticle(null);
    setIsCustomArticleCategory(false);
    setCustomArticleCategoryInput("");
    setArticleContentViewMode("write");
    setShowAddArticleModal(true);
  };

  const handleOpenEditArticle = (art: any) => {
    setEditingArticle(art);
    const cat = art.category || "Skincare Science";
    const isCustom = !defaultArticleCategories.includes(cat) && !dynamicArticleCategories.includes(cat);
    setIsCustomArticleCategory(isCustom);
    setCustomArticleCategoryInput(isCustom ? cat : "");
    setArticleContentViewMode("write");
    setArticleFormData({
      title: art.title || "",
      slug: art.slug || "",
      subtitle: art.subtitle || "",
      category: cat,
      author: art.author || "Maysha Formulation Team",
      reading_time: art.readingTime || art.reading_time || "5 min read",
      excerpt: art.excerpt || "",
      content: art.content || "",
      hero_image: art.heroImage || art.hero_image || "",
      is_featured: art.isFeatured ?? art.is_featured ?? false,
    });
    setShowAddArticleModal(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.hero_image) {
      addToast(
        "Image Required",
        "Please upload a hero image for the journal story.",
        "error",
      );
      return;
    }

    const payload = {
      title: articleFormData.title,
      slug:
        articleFormData.slug ||
        articleFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subtitle: articleFormData.subtitle,
      category: articleFormData.category,
      author: articleFormData.author,
      reading_time: articleFormData.reading_time,
      excerpt: articleFormData.excerpt,
      content: articleFormData.content,
      hero_image: articleFormData.hero_image,
      is_featured: articleFormData.is_featured,
    };

    try {
      if (editingArticle) {
        await apiBffFetch(`admin/articles/${editingArticle.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast("Article Updated", "Journal story saved.", "success");
      } else {
        await apiBffFetch("admin/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast("Article Published", "New journal story created.", "success");
      }
      setShowAddArticleModal(false);
      loadAdminData();
    } catch (err: any) {
      addToast(
        "Error",
        err.message || "Failed to save journal article.",
        "error",
      );
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await apiBffFetch(`admin/articles/${articleId}`, { method: "DELETE" });
      addToast("Article Removed", "Journal story deleted.", "info");
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to delete article.", "error");
    }
  };

  // -------------------------------------------------------------
  // Coupon Operations
  // -------------------------------------------------------------
  const handleOpenAddCouponModal = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: "",
      type: "percent",
      value: 10,
      min_subtotal: 0,
      max_discount: 0,
      usage_limit: "",
      per_user_limit: 1,
      first_order_only: false,
      is_active: true,
    });
    setShowAddCouponModal(true);
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code || "",
      type: coupon.type || "percent",
      value: Number(coupon.value ?? 10),
      min_subtotal: Number(coupon.minSubtotalRupees ?? 0),
      max_discount: Number(coupon.maxDiscountRupees ?? 0),
      usage_limit:
        coupon.usageLimit !== null && coupon.usageLimit !== undefined
          ? String(coupon.usageLimit)
          : "",
      per_user_limit: Number(coupon.perUserLimit ?? 1),
      first_order_only: Boolean(coupon.firstOrderOnly),
      is_active: Boolean(coupon.isActive),
    });
    setShowAddCouponModal(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponFormData.code) {
      addToast(
        "Code Required",
        "Please enter a valid coupon voucher code.",
        "error",
      );
      return;
    }

    setIsSavingCoupon(true);
    try {
      const payload: any = {
        code: couponFormData.code.toUpperCase().trim(),
        type: couponFormData.type,
        value: Number(couponFormData.value),
        min_subtotal: Number(couponFormData.min_subtotal || 0),
        max_discount: couponFormData.max_discount
          ? Number(couponFormData.max_discount)
          : null,
        usage_limit: couponFormData.usage_limit
          ? parseInt(couponFormData.usage_limit)
          : null,
        per_user_limit: Number(couponFormData.per_user_limit || 1),
        first_order_only: Boolean(couponFormData.first_order_only),
        is_active: Boolean(couponFormData.is_active),
      };

      if (editingCoupon) {
        await apiBffFetch(`admin/coupons/${editingCoupon.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast(
          "Coupon Updated",
          `Voucher ${payload.code} updated successfully.`,
          "success",
        );
      } else {
        await apiBffFetch("admin/coupons", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast(
          "Coupon Created",
          `Voucher ${payload.code} active for shoppers.`,
          "success",
        );
      }

      setShowAddCouponModal(false);
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to save coupon.", "error");
    } finally {
      setIsSavingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      await apiBffFetch(`admin/coupons/${couponId}`, { method: "DELETE" });
      addToast("Coupon Deleted", `Voucher ${code} removed.`, "info");
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to delete coupon.", "error");
    }
  };

  const handleToggleCouponStatus = async (coupon: any) => {
    try {
      await apiBffFetch(`admin/coupons/${coupon.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !coupon.isActive }),
      });
      addToast(
        "Status Updated",
        `Coupon ${coupon.code} is now ${!coupon.isActive ? "active" : "inactive"}.`,
        "success",
      );
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to toggle status.", "error");
    }
  };

  // -------------------------------------------------------------
  // Category Operations
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      sort_order: categories.length + 1,
      is_active: true,
      seo_title: "",
      seo_description: "",
    });
    setShowAddCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.subtitle || cat.description || "",
      image: cat.image || "",
      sort_order: cat.sortOrder ?? cat.sort_order ?? 0,
      is_active:
        cat.isActive !== undefined
          ? Boolean(cat.isActive)
          : cat.is_active !== undefined
            ? Boolean(cat.is_active)
            : true,
      seo_title: cat.seoTitle || cat.seo_title || "",
      seo_description: cat.seoDescription || cat.seo_description || "",
    });
    setShowAddCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) {
      addToast("Name Required", "Please enter category name.", "error");
      return;
    }

    setIsSavingCategory(true);
    try {
      const payload: any = {
        name: categoryFormData.name.trim(),
        slug: categoryFormData.slug
          ? categoryFormData.slug
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
          : categoryFormData.name
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
        subtitle: categoryFormData.description.trim(),
        description: categoryFormData.description.trim(),
        image: categoryFormData.image || null,
        sort_order: Number(categoryFormData.sort_order || 0),
        is_active: Boolean(categoryFormData.is_active),
        seo_title: categoryFormData.seo_title.trim() || null,
        seo_description: categoryFormData.seo_description.trim() || null,
      };

      if (editingCategory) {
        await apiBffFetch(`admin/categories/${editingCategory.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        addToast(
          "Category Updated",
          `Category "${payload.name}" updated successfully.`,
          "success",
        );
      } else {
        await apiBffFetch("admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        addToast(
          "Category Created",
          `Category "${payload.name}" added to catalog.`,
          "success",
        );
      }

      setShowAddCategoryModal(false);
      loadAdminData();
    } catch (err: any) {
      addToast("Error", err.message || "Failed to save category.", "error");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await apiBffFetch(`admin/categories/${catId}`, { method: "DELETE" });
      addToast("Category Deleted", `Category "${name}" removed.`, "info");
      loadAdminData();
    } catch (err: any) {
      addToast(
        "Cannot Delete",
        err.message || "Failed to delete category.",
        "error",
      );
    }
  };

  const handleToggleCategoryStatus = async (cat: any) => {
    try {
      const currentActive =
        cat.isActive !== undefined
          ? Boolean(cat.isActive)
          : cat.is_active !== undefined
            ? Boolean(cat.is_active)
            : true;
      const newStatus = !currentActive;
      await apiBffFetch(`admin/categories/${cat.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: newStatus }),
      });
      addToast(
        "Status Updated",
        `Category "${cat.name}" is now ${newStatus ? "active" : "inactive"}.`,
        "success",
      );
      loadAdminData();
    } catch (err: any) {
      addToast(
        "Error",
        err.message || "Failed to update category status.",
        "error",
      );
    }
  };

  // -------------------------------------------------------------
  // Site Settings Operations
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await apiBffFetch("admin/settings", {
        method: "POST",
        body: JSON.stringify({ settings: siteSettings }),
      });
      setIs2FaActive(Boolean(siteSettings.admin_2fa_enabled));
      addToast(
        "Settings Saved",
        "Website configurations, contact info, and 2FA updated.",
        "success",
      );
    } catch (err: any) {
      addToast(
        "Error",
        err.message || "Failed to save website settings.",
        "error",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  // -------------------------------------------------------------
  // Newsletter Broadcast
  // -------------------------------------------------------------
  const handleBroadcastCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject || !campaignMessage) {
      addToast(
        "Input Required",
        "Please fill in subject and campaign body.",
        "error",
      );
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await apiBffFetch<any>("admin/newsletter/broadcast", {
        method: "POST",
        body: JSON.stringify({
          subject: campaignSubject,
          message: campaignMessage,
          recipient_type: campaignRecipientType,
        }),
      });

      addToast(
        "Campaign Dispatched",
        res.message || "Emails queued for distribution.",
        "success",
      );
      setCampaignSubject("");
      setCampaignMessage("");
    } catch (err: any) {
      addToast("Error", err.message || "Failed to dispatch campaign.", "error");
    } finally {
      setIsBroadcasting(false);
    }
  };

  // -------------------------------------------------------------
  // Login Gate
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="bg-[#FBF9F5] min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4E5942] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#FBF9F5] min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-10 rounded-xs shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#EDF3E8] text-[#4E5942] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block mb-1">
              Restricted Area
            </span>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">
              Maysha Admin Console
            </h1>
            <p className="text-[14px] text-[#736E67] mt-1">
              Sign in with your administrator account with optional 2-Step
              verification.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xs text-[13px] text-[#9B1C1C]">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Type your email address"
                  required
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                />
                <Mail className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Type your password"
                  required
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 pl-10 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                />
                <Lock className="w-4 h-4 text-[#736E67] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* 2-Step PIN code field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[14px] font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <span>2FA Security PIN</span>
                  {is2FaActive ? (
                    <span className="text-[#9B1C1C] text-[12px] font-bold">
                      (Required)
                    </span>
                  ) : (
                    <span className="text-[#736E67] text-[12px] font-normal">
                      (If enabled)
                    </span>
                  )}
                </label>
                {is2FaActive && (
                  <span className="text-[11px] font-medium bg-[#DEF7EC] text-[#03543F] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0E9F6E]" />
                    2FA Active
                  </span>
                )}
              </div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={login2FaPin}
                onChange={(e) => setLogin2FaPin(e.target.value)}
                placeholder={
                  is2FaActive
                    ? "Enter required 4-6 digit security PIN"
                    : "Enter 4-6 digit security PIN"
                }
                className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] px-3.5 py-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A] font-mono tracking-wider"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white py-3.5 px-6 text-[15px] uppercase tracking-wider font-semibold rounded-2xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Privileges...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8E3DA] text-center">
            <Link
              href="/"
              className="text-[14px] text-[#736E67] hover:text-[#1A1A1A] inline-flex items-center gap-1.5"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Full Admin Console Dashboard
  // -------------------------------------------------------------
  return (
    <div className="bg-[#FBF9F5] min-h-screen border-b border-[#E8E3DA]">
      {/* Top Admin Header Bar */}
      <div className="bg-[#1A1A1A] text-white px-3 sm:px-8 py-3 sm:py-4 border-b border-black flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#4E5942] flex items-center justify-center font-bold text-xs uppercase text-white shrink-0">
            MA
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold leading-tight truncate">
              Maysha Control Panel
            </h1>
            <span className="text-[10px] sm:text-[11px] text-[#A6A095] block truncate">
              Admin: {user.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 bg-[#2B2B2B] hover:bg-[#383838] px-2.5 sm:px-3 py-1.5 rounded-2xs text-[12px] sm:text-[13px] text-white transition-colors"
            title="Open Live Store"
          >
            <span className="hidden sm:inline">Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => loadAdminData()}
            disabled={isLoadingData}
            className="inline-flex items-center gap-1 bg-[#2B2B2B] hover:bg-[#383838] px-2.5 sm:px-3 py-1.5 rounded-2xs text-[12px] sm:text-[13px] text-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Sync Database"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1 bg-[#A94438] hover:bg-[#8B342B] px-2.5 sm:px-3 py-1.5 rounded-2xs text-[12px] sm:text-[13px] text-white transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Mobile Tab Quick Dropdown (Instant Selection on Phones) */}
        <div className="block sm:hidden mb-4">
          <label className="text-[11px] uppercase tracking-wider font-bold text-[#736E67] block mb-1">
            Jump to Section
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as AdminTab)}
              className="w-full bg-white border border-[#E8E3DA] text-[14px] font-semibold text-[#1A1A1A] py-2.5 px-3 rounded-2xs appearance-none focus:outline-none focus:border-[#1A1A1A] shadow-2xs"
            >
              <option value="overview">📊 Overview Dashboard</option>
              <option value="products">
                📦 Products Catalog ({products.length})
              </option>
              <option value="orders">
                🛍️ Orders Fulfillment ({orders.length})
              </option>
              <option value="categories">
                🗂️ Categories ({categories.length})
              </option>
              <option value="banners">🖼️ Banners ({banners.length}/7)</option>
              <option value="articles">
                📖 Journal Articles ({articles.length})
              </option>
              <option value="reviews">
                💬 Reviews Moderation ({reviews.length})
              </option>
              <option value="coupons">
                🏷️ Coupons & Vouchers ({coupons.length})
              </option>
              <option value="subscribers">
                👥 Subscribers ({subscribersData.totalSubscribers})
              </option>
              <option value="settings">⚙️ Site Settings & SEO</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#736E67] absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Tabs with Left/Right Scroll Controls */}
        <div className="relative mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] items-center justify-center text-[#1A1A1A] shadow-xs cursor-pointer z-10 transition-colors"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={tabNavRef}
              className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-3 scroll-smooth scrollbar-thin scrollbar-thumb-stone-300"
            >
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                {
                  id: "products",
                  label: `Products (${products.length})`,
                  icon: Package,
                },
                {
                  id: "orders",
                  label: `Orders (${orders.length})`,
                  icon: ShoppingBag,
                },
                {
                  id: "categories",
                  label: `Categories (${categories.length})`,
                  icon: Layers,
                },
                {
                  id: "banners",
                  label: `Banners (${banners.length}/7)`,
                  icon: ImageIcon,
                },
                {
                  id: "articles",
                  label: `Journal Articles (${articles.length})`,
                  icon: BookOpen,
                },
                {
                  id: "reviews",
                  label: `Reviews (${reviews.length})`,
                  icon: MessageSquare,
                },
                {
                  id: "coupons",
                  label: `Coupons (${coupons.length})`,
                  icon: Tag,
                },
                {
                  id: "subscribers",
                  label: `Subscribers (${subscribersData.totalSubscribers})`,
                  icon: Users,
                },
                {
                  id: "settings",
                  label: "Site Settings & SEO",
                  icon: Settings,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xs text-[12px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      isCurrent
                        ? "bg-[#1A1A1A] text-white shadow-xs"
                        : "bg-[#FFFFFF] text-[#4A4640] border border-[#E8E3DA] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] items-center justify-center text-[#1A1A1A] shadow-xs cursor-pointer z-10 transition-colors"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[1px] bg-[#E8E3DA] w-full mt-2" />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Quick Metrics: 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1 sm:space-y-2">
                <span className="text-[11px] sm:text-[13px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Gross Revenue
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#1A1A1A] truncate">
                  {formatINR(stats?.totalRevenueRupees ?? 0)}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#4E5942] font-semibold truncate">
                  Real settlements
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1 sm:space-y-2">
                <span className="text-[11px] sm:text-[13px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Total Orders
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#1A1A1A]">
                  {stats?.totalOrders ?? orders.length}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#736E67] truncate">
                  {stats?.pendingOrders ?? 0} awaiting fulfillment
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1 sm:space-y-2">
                <span className="text-[11px] sm:text-[13px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Catalog Products
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#1A1A1A]">
                  {products.length}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#736E67] truncate">
                  Across {categories.length} categories
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1 sm:space-y-2">
                <span className="text-[11px] sm:text-[13px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Newsletter
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#4E5942]">
                  {subscribersData.totalSubscribers}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#736E67] truncate">
                  {subscribersData.totalRegisteredCustomers} registered buyers
                </p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E5942]" />{" "}
                  Recent Storefront Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-[12px] sm:text-[13px] font-semibold text-[#4E5942] hover:text-[#1A1A1A] underline"
                >
                  View All ({orders.length})
                </button>
              </div>

              {/* Mobile Card List (< 768px) */}
              <div className="md:hidden divide-y divide-[#F0ECE4]">
                {orders.slice(0, 5).map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3.5 first:pt-0 last:pb-0 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[13px] text-[#1A1A1A]">
                        {ord.reference}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                          ord.status === "delivered"
                            ? "bg-[#EDF3E8] text-[#3E4534]"
                            : ord.status === "shipped"
                              ? "bg-[#E8F0FE] text-[#1967D2]"
                              : ord.status === "cancelled"
                                ? "bg-[#FDF2F2] text-[#9B1C1C]"
                                : "bg-[#FFF8EB] text-[#8C6D1F]"
                        }`}
                      >
                        {ord.status?.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#4A4640] font-medium truncate">
                        {ord.shippingAddress?.name || "Customer"}
                      </span>
                      <span className="font-bold text-[#1A1A1A]">
                        {formatINR(ord.total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#736E67]">
                      <span>
                        {ord.items?.length || 1} item(s) •{" "}
                        <span className="uppercase">{ord.paymentMethod}</span>
                      </span>
                      <Link
                        href={`/orders/${ord.reference}`}
                        target="_blank"
                        className="text-[#4E5942] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#FBF9F5] transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1A1A1A]">
                          {ord.reference}
                        </td>
                        <td className="py-3.5 px-4 text-[#4A4640]">
                          {ord.shippingAddress?.name || "Customer"}
                        </td>
                        <td className="py-3.5 px-4 text-[#736E67]">
                          {ord.items?.length || 1} item(s)
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                          {formatINR(ord.total)}
                        </td>
                        <td className="py-3.5 px-4 text-[#736E67] uppercase text-[12px]">
                          {ord.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold uppercase bg-[#EDF3E8] text-[#3E4534]">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PRODUCTS & CATALOG CRUD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "products" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                  Products Catalog Management
                </h2>
                <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                  View, add, edit all rich attributes, and upload photos
                  directly to Cloudinary.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-2xs text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs">
              {/* Mobile Product Cards (< 768px) */}
              <div className="md:hidden divide-y divide-[#F0ECE4]">
                {products.map((prod) => (
                  <div key={prod.id} className="p-3.5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0 border border-[#E8E3DA]">
                        <Image
                          src={prod.images?.[0] || prod.image || "/logo.png"}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-[#4E5942] bg-[#F5F2EB] px-2 py-0.5 rounded-full border border-[#E8E3DA] truncate">
                            {prod.category || "Unassigned"}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${prod.inStock ? "text-[#4E5942]" : "text-[#A94438]"}`}
                          >
                            {prod.inStock ? "● In Stock" : "● Out of Stock"}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[14px] text-[#1A1A1A] mt-1 leading-snug line-clamp-1">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-[14px] text-[#1A1A1A]">
                            ₹{prod.price}
                          </span>
                          {prod.mrp && prod.mrp > prod.price && (
                            <span className="text-[12px] text-[#736E67] line-through">
                              ₹{prod.mrp}
                            </span>
                          )}
                          {prod.badge && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Variant badge if multiple */}
                    {prod.variants && prod.variants.length > 1 && (
                      <div className="text-[11px] font-medium text-[#5A5650] bg-[#FBF9F5] p-1.5 rounded-2xs border border-[#F0ECE4] flex items-center justify-between">
                        <span>{prod.variants.length} Sizes:</span>
                        <span className="font-mono text-[#1A1A1A]">
                          {prod.variants
                            .map((v: any) => v.size || v.size_label)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Touch Action Buttons Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E8E3DA] text-[#1A1A1A] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#4E5942]" />
                        <span>Edit</span>
                      </button>
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="flex-1 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E8E3DA] text-[#1A1A1A] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#736E67]" />
                        <span>Live PDP</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="bg-[#FDF2F2] hover:bg-[#FDE8E8] border border-[#F8B4B4] text-[#A94438] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Catalog Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / MRP</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    {products.map((prod) => (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#FBF9F5] transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0">
                              <Image
                                src={
                                  prod.images?.[0] || prod.image || "/logo.png"
                                }
                                alt={prod.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1A1A1A]">
                                {prod.name}
                              </p>
                              {prod.variants && prod.variants.length > 1 ? (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFECE4] text-[#1A1A1A] border border-[#DCD7CD]">
                                    {prod.variants.length} Variants (
                                    {prod.variants
                                      .map((v: any) => v.size || v.size_label)
                                      .join(", ")}
                                    )
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[12px] text-[#736E67]">
                                  {prod.size ||
                                    prod.variants?.[0]?.size ||
                                    "50ml"}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F5F2EB] text-[#4E5942] border border-[#E8E3DA]">
                            {prod.category || "Unassigned"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#1A1A1A]">
                            ₹{prod.price}
                          </span>{" "}
                          <span className="text-[12px] text-[#736E67] line-through">
                            ₹{prod.mrp}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {prod.badge ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                              {prod.badge}
                            </span>
                          ) : (
                            <span className="text-[#A6A095] text-[12px]">
                              —
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              prod.inStock ? "text-[#4E5942]" : "text-[#A94438]"
                            }`}
                          >
                            {prod.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="text-[#736E67] hover:text-[#4E5942] p-1.5 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/products/${prod.slug}`}
                              target="_blank"
                              className="text-[#736E67] hover:text-[#1A1A1A] p-1.5"
                              title="View Live Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="text-[#736E67] hover:text-[#A94438] p-1.5 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "orders" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                Customer Orders Fulfillment
              </h2>
              <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                Track incoming purchases, update shipping dispatch status, and
                manage receipts.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs">
              {/* Mobile Orders Cards (< 768px) */}
              <div className="md:hidden divide-y divide-[#F0ECE4]">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 space-y-3">
                    {/* Header: Ref & Status */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/orders/${ord.reference}`}
                        target="_blank"
                        className="font-mono font-bold text-[14px] text-[#1A1A1A] hover:underline flex items-center gap-1"
                      >
                        {ord.reference}
                        <ExternalLink className="w-3 h-3 text-[#736E67]" />
                      </Link>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                          ord.status === "delivered"
                            ? "bg-[#EDF3E8] text-[#3E4534]"
                            : ord.status === "shipped"
                              ? "bg-[#E8F0FE] text-[#1967D2]"
                              : ord.status === "cancelled"
                                ? "bg-[#FDF2F2] text-[#9B1C1C]"
                                : "bg-[#FFF8EB] text-[#8C6D1F]"
                        }`}
                      >
                        {ord.status?.replace("_", " ")}
                      </span>
                    </div>

                    {/* Customer & City */}
                    <div className="text-[13px] bg-[#FBF9F5] p-2.5 rounded-2xs border border-[#F0ECE4] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A1A]">
                          {ord.shippingAddress?.name || "Customer"}
                        </span>
                        <span className="text-[#736E67] text-[12px]">
                          {ord.shippingAddress?.city || "India"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-[#736E67] pt-1 border-t border-[#E8E3DA]/60">
                        <span>
                          {ord.items?.length || 1} product(s) •{" "}
                          <span className="uppercase">{ord.paymentMethod}</span>
                        </span>
                        <span className="font-bold text-[#1A1A1A] text-[13px]">
                          {formatINR(ord.total)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Status Select on Mobile */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#736E67] shrink-0">
                        Status:
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value)
                        }
                        className="flex-1 bg-[#FBF9F5] border border-[#E8E3DA] text-[13px] font-medium py-2 px-3 rounded-2xs focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Dispatched / Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Orders Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                    <tr>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Items / Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    {orders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#FBF9F5] transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/orders/${ord.reference}`}
                            target="_blank"
                            className="font-mono font-bold text-[#1A1A1A] hover:underline"
                          >
                            {ord.reference}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#1A1A1A]">
                            {ord.shippingAddress?.name}
                          </p>
                          <p className="text-[12px] text-[#736E67]">
                            {ord.shippingAddress?.city}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#1A1A1A]">
                            {formatINR(ord.total)}
                          </p>
                          <span className="text-[12px] text-[#736E67]">
                            {ord.items?.length || 1} product(s)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 uppercase text-[12px] font-semibold text-[#4A4640]">
                          {ord.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold uppercase ${
                              ord.status === "delivered"
                                ? "bg-[#EDF3E8] text-[#3E4534]"
                                : ord.status === "shipped"
                                  ? "bg-[#E8F0FE] text-[#1967D2]"
                                  : ord.status === "cancelled"
                                    ? "bg-[#FDF2F2] text-[#9B1C1C]"
                                    : "bg-[#FFF8EB] text-[#8C6D1F]"
                            }`}
                          >
                            {ord.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value)
                            }
                            className="bg-[#FBF9F5] border border-[#E8E3DA] text-[13px] px-2.5 py-1.5 rounded-2xs focus:outline-hidden cursor-pointer"
                          >
                            <option value="pending_payment">
                              Pending Payment
                            </option>
                            <option value="processing">Processing</option>
                            <option value="shipped">
                              Dispatched / Shipped
                            </option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: CATEGORIES CRUD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "categories" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                  Store Categories Architecture
                </h2>
                <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                  Manage product collections, descriptions, banner visuals, and
                  catalog indexing.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-2xs text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-6 rounded-xs space-y-4 shadow-2xs flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleCategoryStatus(cat)}
                        className={`text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                          (cat.isActive ?? cat.is_active ?? true)
                            ? "bg-[#EDF3E8] text-[#4E5942] hover:bg-[#DEEACF]"
                            : "bg-[#F5F5F5] text-[#888888] hover:bg-[#EAEAEA]"
                        }`}
                        title="Click to toggle active status"
                      >
                        {(cat.isActive ?? cat.is_active ?? true)
                          ? "Active Collection"
                          : "Inactive"}
                      </button>
                      <span className="text-[11px] sm:text-[12px] font-semibold text-[#736E67] bg-[#F5F2EB] px-2.5 py-0.5 rounded-full border border-[#E8E3DA]">
                        {cat.itemCount ??
                          cat.productsCount ??
                          cat.products_count ??
                          0}{" "}
                        Products
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {cat.image && (
                        <div className="w-12 h-12 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0 border border-[#E8E3DA]">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] truncate">
                          {cat.name}
                        </h3>
                        <p className="text-[13px] sm:text-[14px] text-[#5A5650] leading-relaxed mt-1 line-clamp-2">
                          {cat.subtitle ||
                            cat.description ||
                            "No description configured."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                    <span className="text-[11px] sm:text-[12px] font-mono text-[#736E67] truncate mr-2">
                      /collections/{cat.slug}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-2 text-[#736E67] hover:text-[#4E5942] hover:bg-[#F5F2EB] rounded-2xs transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 text-[#A94438] hover:text-[#8B342B] hover:bg-[#FDF2F2] rounded-2xs transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: BANNERS & REARRANGE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "banners" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                  Homepage Carousel Banners
                </h2>
                <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                  Manage dynamic slider hero banners (up to 7 maximum). Reorder
                  slides with single clicks.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                disabled={banners.length >= 7}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-2xs text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner ({banners.length}/7)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {banners.map((ban, idx) => (
                <div
                  key={ban.id || idx}
                  className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs flex flex-col"
                >
                  <div className="aspect-[16/9] relative bg-[#EFECE4]">
                    <Image
                      src={ban.desktopImage || ban.desktop_image}
                      alt={ban.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] sm:text-[12px] font-semibold text-[#1A1A1A]">
                      Slide #{idx + 1}
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
                        {ban.title}
                      </h3>
                      <p className="text-[13px] sm:text-[14px] text-[#5A5650] mt-1">
                        {ban.subtitle}
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-[#4E5942] font-semibold mt-2 truncate">
                        CTA: &ldquo;{ban.ctaText || ban.cta_text || "Shop"}
                        &rdquo; → {ban.ctaLink || ban.linkUrl || ban.link_url}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                      {/* Rearrange order buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveBanner(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-2xs bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1A1A1A] text-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                          title="Move Earlier in Slider"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBanner(idx, "down")}
                          disabled={idx === banners.length - 1}
                          className="p-1.5 rounded-2xs bg-[#FBF9F5] border border-[#E8E3DA] hover:border-[#1A1A1A] text-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                          title="Move Later in Slider"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-mono text-[#736E67] ml-1">
                          Pos {idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditBanner(ban)}
                          className="text-[#736E67] hover:text-[#4E5942] p-2 transition-colors cursor-pointer"
                          title="Edit Banner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(ban.id)}
                          className="text-[#736E67] hover:text-[#A94438] p-2 transition-colors cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: JOURNAL & EDITORIAL ARTICLES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "articles" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                  Journal Stories & Editorial Articles
                </h2>
                <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                  Publish botanical science blogs, ingredient spotlights, and
                  rituals.
                </p>
              </div>

              <button
                onClick={handleOpenAddArticle}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-2xs text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs">
              {/* Mobile Articles Card List (< 768px) */}
              <div className="md:hidden divide-y divide-[#F0ECE4]">
                {articles.map((art) => (
                  <div key={art.id} className="p-3.5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0 border border-[#E8E3DA]">
                        <Image
                          src={art.heroImage || art.hero_image || "/logo.png"}
                          alt={art.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold text-[#4E5942] bg-[#EDF3E8] px-2 py-0.5 rounded-full">
                          {art.category}
                        </span>
                        <h3 className="font-semibold text-[14px] text-[#1A1A1A] mt-1 leading-snug line-clamp-1">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-[#736E67] mt-0.5">
                          {art.author} •{" "}
                          {art.readingTime || art.reading_time || "4 min"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenEditArticle(art)}
                        className="flex-1 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E8E3DA] text-[#1A1A1A] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#4E5942]" />
                        <span>Edit</span>
                      </button>
                      <Link
                        href={`/journal/${art.slug}`}
                        target="_blank"
                        className="flex-1 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E8E3DA] text-[#1A1A1A] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#736E67]" />
                        <span>Read</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="bg-[#FDF2F2] hover:bg-[#FDE8E8] border border-[#F8B4B4] text-[#A94438] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Articles Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                    <tr>
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Reading Time</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    {articles.map((art) => (
                      <tr
                        key={art.id}
                        className="hover:bg-[#FBF9F5] transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative bg-[#EFECE4] rounded-2xs overflow-hidden shrink-0">
                              <Image
                                src={
                                  art.heroImage || art.hero_image || "/logo.png"
                                }
                                alt={art.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/journal/${art.slug}`}
                                target="_blank"
                                className="font-semibold text-[#1A1A1A] hover:text-[#4E5942] line-clamp-1"
                              >
                                {art.title}
                              </Link>
                              <span className="text-[12px] font-mono text-[#736E67]">
                                /journal/{art.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#4E5942] font-semibold text-[13px]">
                          {art.category}
                        </td>
                        <td className="py-3.5 px-4 text-[#4A4640]">
                          {art.author}
                        </td>
                        <td className="py-3.5 px-4 text-[#736E67]">
                          {art.readingTime || art.reading_time}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="text-[#736E67] hover:text-[#4E5942] p-1.5 transition-colors cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/journal/${art.slug}`}
                              target="_blank"
                              className="text-[#736E67] hover:text-[#1A1A1A] p-1.5"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="text-[#736E67] hover:text-[#A94438] p-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: REVIEWS MODERATION & CLIENT PHOTOS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "reviews" && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                Customer Reviews Moderation Queue
              </h2>
              <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                Review customer submissions, verify order delivery status, and
                inspect Cloudinary-hosted photos.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-8 sm:p-12 text-center rounded-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#4E5942] mx-auto" />
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  No pending reviews
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#736E67]">
                  All submitted customer ratings have been reviewed and
                  approved.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-6 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#1A1A1A] text-[14px]">
                          {rev.author || rev.userName || rev.user_name}
                        </span>
                        <span className="text-[#736E67] text-[12px]">
                          • {rev.rating} ★★★★★
                        </span>
                        {rev.isVerified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                            ✓ Verified Order
                          </span>
                        )}
                        {rev.isApproved || rev.is_approved ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#FFF8EB] text-[#8C6D1F]">
                            Queued
                          </span>
                        )}
                      </div>

                      <p className="text-[12px] sm:text-[13px] text-[#736E67]">
                        Product:{" "}
                        <span className="font-semibold text-[#1A1A1A]">
                          {rev.productName || "Product"}
                        </span>
                      </p>
                      <p className="text-[14px] sm:text-[15px] font-semibold text-[#1A1A1A]">
                        {rev.title}
                      </p>
                      <p className="text-[13px] sm:text-[14px] text-[#5A5650] leading-relaxed">
                        {rev.comment}
                      </p>

                      {/* Attached customer photos */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1">
                          {rev.images.map((imgUrl: string, idx: number) => (
                            <a
                              key={idx}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xs overflow-hidden border border-[#E8E3DA] bg-[#EFECE4] group shrink-0"
                            >
                              <Image
                                src={imgUrl}
                                alt={`Customer upload ${idx + 1}`}
                                fill
                                sizes="64px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
                      {!(rev.isApproved || rev.is_approved) && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex-1 sm:flex-none bg-[#4E5942] hover:bg-[#3E4534] text-white px-4 py-2 rounded-2xs text-[13px] font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="flex-1 sm:flex-none bg-[#FFFFFF] hover:bg-[#FDF2F2] text-[#A94438] border border-[#E8E3DA] hover:border-[#A94438] px-3.5 py-2 rounded-2xs text-[13px] font-semibold tracking-wide transition-colors cursor-pointer text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: COUPONS & PROMOTIONAL OFFERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "coupons" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                  Promotional Coupons & Vouchers
                </h2>
                <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                  Manage active checkout discount codes, cart minimum order
                  thresholds, and voucher caps.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddCouponModal}
                className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1">
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Total Codes
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#1A1A1A]">
                  {coupons.length}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#736E67] truncate">
                  Configured in system
                </p>
              </div>
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1">
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Active Vouchers
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#4E5942]">
                  {coupons.filter((c) => c.isActive).length}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#4E5942] font-semibold truncate">
                  Available at checkout
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-[#FFFFFF] border border-[#E8E3DA] p-3.5 sm:p-6 rounded-xs shadow-2xs space-y-1">
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#736E67] block">
                  Redemptions
                </span>
                <p className="text-xl sm:text-3xl font-bold font-mono text-[#1A1A1A]">
                  {coupons.reduce(
                    (sum, c) => sum + (c.redemptionsCount || 0),
                    0,
                  )}
                </p>
                <p className="text-[10px] sm:text-[12px] text-[#736E67] truncate">
                  Redeemed by shoppers
                </p>
              </div>
            </div>

            {/* Coupons Container */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs">
              <div className="p-3.5 sm:p-4 border-b border-[#F0ECE4] flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#4E5942]" /> All Coupon Codes
                </h3>
                <span className="text-[12px] sm:text-[13px] text-[#736E67] font-medium">
                  {coupons.length} vouchers
                </span>
              </div>

              {coupons.length === 0 ? (
                <div className="p-8 sm:p-12 text-center text-[#736E67]">
                  <Tag className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[#B3AEA3]" />
                  <p className="text-base font-semibold text-[#1A1A1A]">
                    No coupon codes yet
                  </p>
                  <p className="text-[13px] mt-1 mb-4">
                    Create your first coupon voucher code to run promotions.
                  </p>
                  <button
                    onClick={handleOpenAddCouponModal}
                    className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-2xs text-[13px] font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Coupons Card List (< 768px) */}
                  <div className="md:hidden divide-y divide-[#F0ECE4]">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#1A1A1A] bg-[#F5F2EB] px-2.5 py-1 rounded-2xs border border-[#E8E3DA] tracking-wider text-[13px]">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleCouponStatus(coupon)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              coupon.isActive
                                ? "bg-[#EDF3E8] text-[#4E5942]"
                                : "bg-[#F5F5F5] text-[#888888]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? "bg-[#4E5942]" : "bg-[#888888]"}`}
                            />
                            <span>
                              {coupon.isActive ? "Active" : "Inactive"}
                            </span>
                          </button>
                        </div>

                        <div className="text-[13px] bg-[#FBF9F5] p-2.5 rounded-2xs border border-[#F0ECE4] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#736E67]">Discount:</span>
                            <span className="font-bold text-[#4E5942]">
                              {coupon.type === "percent"
                                ? `${coupon.value}% OFF`
                                : `${formatINR(coupon.value)} FLAT`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="text-[#736E67]">Min Order:</span>
                            <span className="text-[#4A4640]">
                              {coupon.minSubtotalRupees
                                ? formatINR(coupon.minSubtotalRupees)
                                : "None"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[12px]">
                            <span className="text-[#736E67]">Audience:</span>
                            <span className="text-[#4A4640]">
                              {coupon.firstOrderOnly
                                ? "First Order Only"
                                : "All Orders"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[12px] pt-1 border-t border-[#E8E3DA]/60">
                            <span className="text-[#736E67]">Redeemed:</span>
                            <span className="font-mono font-semibold text-[#1A1A1A]">
                              {coupon.redemptionsCount || 0} times
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleEditCoupon(coupon)}
                            className="flex-1 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E8E3DA] text-[#1A1A1A] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#4E5942]" />
                            <span>Edit Coupon</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCoupon(coupon.id, coupon.code)
                            }
                            className="bg-[#FDF2F2] hover:bg-[#FDE8E8] border border-[#F8B4B4] text-[#A94438] py-2 px-3 rounded-2xs text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Coupons Table (>= 768px) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                        <tr>
                          <th className="py-3.5 px-4">Coupon Code</th>
                          <th className="py-3.5 px-4">Discount</th>
                          <th className="py-3.5 px-4">Min. Subtotal</th>
                          <th className="py-3.5 px-4">Max. Discount</th>
                          <th className="py-3.5 px-4">Usage Limit</th>
                          <th className="py-3.5 px-4">Redemptions</th>
                          <th className="py-3.5 px-4">Audience</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0ECE4]">
                        {coupons.map((coupon) => (
                          <tr
                            key={coupon.id}
                            className="hover:bg-[#FBF9F5] transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#1A1A1A] bg-[#F5F2EB] px-2.5 py-1 rounded-2xs border border-[#E8E3DA] tracking-wider text-[13px]">
                                  {coupon.code}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-[#1A1A1A]">
                              {coupon.type === "percent" ? (
                                <span className="text-[#4E5942]">
                                  {coupon.value}% OFF
                                </span>
                              ) : (
                                <span className="text-[#4E5942]">
                                  {formatINR(coupon.value)} FLAT
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-[#4A4640]">
                              {coupon.minSubtotalRupees ? (
                                <span>
                                  Orders &ge;{" "}
                                  {formatINR(coupon.minSubtotalRupees)}
                                </span>
                              ) : (
                                <span className="text-[#736E67]">None</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-[#736E67]">
                              {coupon.maxDiscountRupees
                                ? formatINR(coupon.maxDiscountRupees)
                                : "No cap"}
                            </td>
                            <td className="py-4 px-4 text-[#736E67]">
                              {coupon.usageLimit
                                ? `${coupon.usageLimit} total`
                                : "Unlimited"}
                            </td>
                            <td className="py-4 px-4 font-mono font-semibold text-[#1A1A1A]">
                              {coupon.redemptionsCount || 0}
                            </td>
                            <td className="py-4 px-4">
                              {coupon.firstOrderOnly ? (
                                <span className="text-[11px] font-semibold bg-[#FFF4E5] text-[#B76E00] px-2 py-0.5 rounded-2xs border border-[#FFE2B8]">
                                  First Order Only
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#736E67]">
                                  All Orders
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleCouponStatus(coupon)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
                                  coupon.isActive
                                    ? "bg-[#EDF3E8] text-[#4E5942] hover:bg-[#DEEACF]"
                                    : "bg-[#F5F5F5] text-[#888888] hover:bg-[#EAEAEA]"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    coupon.isActive
                                      ? "bg-[#4E5942]"
                                      : "bg-[#888888]"
                                  }`}
                                />
                                <span>
                                  {coupon.isActive ? "Active" : "Inactive"}
                                </span>
                              </button>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditCoupon(coupon)}
                                  className="p-1.5 text-[#736E67] hover:text-[#1A1A1A] hover:bg-[#F5F2EB] rounded-2xs transition-colors cursor-pointer"
                                  title="Edit Coupon"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteCoupon(coupon.id, coupon.code)
                                  }
                                  className="p-1.5 text-[#A94438] hover:text-[#8B342B] hover:bg-[#FDF2F2] rounded-2xs transition-colors cursor-pointer"
                                  title="Delete Coupon"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: SUBSCRIBERS & EMAIL CAMPAIGN BROADCAST */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "subscribers" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                Newsletter & Subscriber Campaigns
              </h2>
              <p className="text-[12px] sm:text-[14px] text-[#736E67]">
                View newsletter subscribers, registered customers, and craft
                email campaigns to broadcast.
              </p>
            </div>

            {/* Campaign Composer */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-6 rounded-xs shadow-2xs space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E5942]" /> Craft
                & Broadcast Email Campaign
              </h3>
              <form onSubmit={handleBroadcastCampaign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Campaign Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      placeholder="e.g. Pure Botanical Glow: 20% Off Weekend Exclusive"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Target Audience
                    </label>
                    <select
                      value={campaignRecipientType}
                      onChange={(e) => setCampaignRecipientType(e.target.value)}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">
                        All Subscribers ({subscribersData.totalSubscribers})
                      </option>
                      <option value="newsletter">
                        Newsletter Signups Only
                      </option>
                      <option value="customers">
                        Registered Buyers Only (
                        {subscribersData.totalRegisteredCustomers})
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Email Message Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                    placeholder="Write your email body or newsletter announcement here..."
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-3 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-6 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isBroadcasting
                        ? "Sending Broadcast..."
                        : "Send Campaign Broadcast"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Subscribers List */}
            <div className="bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs overflow-hidden shadow-2xs space-y-2">
              <div className="p-3.5 sm:p-4 border-b border-[#F0ECE4] flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                  Subscriber List
                </h3>
                <span className="text-[12px] sm:text-[13px] text-[#736E67]">
                  {subscribersData.subscribers.length} total recorded
                </span>
              </div>

              {/* Mobile Subscribers Card List (< 768px) */}
              <div className="md:hidden divide-y divide-[#F0ECE4]">
                {subscribersData.subscribers.map((sub: any) => (
                  <div key={sub.id} className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-[13px] text-[#1A1A1A] truncate max-w-[220px]">
                        {sub.email}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                        {sub.isActive ? "Subscribed" : "Unsubscribed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#736E67]">
                      <span className="uppercase">
                        Via {sub.source || "Storefront"}
                      </span>
                      <span>
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Subscribers Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#FBF9F5] text-[#736E67] uppercase text-[12px] border-b border-[#E8E3DA]">
                    <tr>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4]">
                    {subscribersData.subscribers.map((sub: any) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-[#FBF9F5] transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-[#1A1A1A]">
                          {sub.email}
                        </td>
                        <td className="py-3.5 px-4 text-[#736E67] uppercase text-[12px]">
                          {sub.source || "storefront"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDF3E8] text-[#3E4534]">
                            {sub.isActive ? "Subscribed" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#736E67] text-[13px]">
                          {sub.createdAt
                            ? new Date(sub.createdAt).toLocaleDateString()
                            : "Recent"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: SITE SETTINGS & 2FA SECURITY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Website Settings & Security
              </h2>
              <p className="text-[14px] text-[#736E67]">
                Manage contact numbers, address, free shipping threshold,
                dynamic about images, and 2-step verification.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* Store Identity & Shipping */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs space-y-4 shadow-2xs">
                <h3 className="text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#F0ECE4]">
                  Store Details & Shipping
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.store_name}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          store_name: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.tagline}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          tagline: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={siteSettings.free_shipping_threshold}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          free_shipping_threshold: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Standard Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={siteSettings.shipping_fee}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          shipping_fee: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Care & Contact */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs space-y-4 shadow-2xs">
                <h3 className="text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#F0ECE4]">
                  Customer Support & Contact Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.support_email}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          support_email: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={siteSettings.support_phone}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          support_phone: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      WhatsApp Support Number
                    </label>
                    <input
                      type="text"
                      value={siteSettings.support_whatsapp}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          support_whatsapp: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Support Operating Hours
                    </label>
                    <input
                      type="text"
                      value={siteSettings.support_hours}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          support_hours: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Physical Store & Lab Address
                    </label>
                    <input
                      type="text"
                      value={siteSettings.store_address}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          store_address: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic About Us Images & Story */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs space-y-4 shadow-2xs">
                <h3 className="text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#F0ECE4]">
                  About Page Dynamic Images & Content
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      About Page Headline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.about_hero_title || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          about_hero_title: e.target.value,
                        })
                      }
                      placeholder="Clean Botanical Science for Resilient, Real Skin"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      About Page Hero Subtitle / Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      value={siteSettings.about_hero_subtitle || ""}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          about_hero_subtitle: e.target.value,
                        })
                      }
                      placeholder="Maysha was founded on an unwavering truth: skincare should support your skin's natural biology..."
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <CloudinaryUploader
                        label="About Hero Story Image (Cloudinary)"
                        folder="maysha/brand"
                        currentImage={siteSettings.about_hero_image}
                        onUploadSuccess={(url) =>
                          setSiteSettings({
                            ...siteSettings,
                            about_hero_image: url,
                          })
                        }
                      />
                    </div>
                    <div>
                      <CloudinaryUploader
                        label="Philosophy / Lab Visual (Cloudinary)"
                        folder="maysha/brand"
                        currentImage={siteSettings.about_philosophy_image}
                        onUploadSuccess={(url) =>
                          setSiteSettings({
                            ...siteSettings,
                            about_philosophy_image: url,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#F0ECE4] space-y-4">
                    <div>
                      <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                        &quot;Our Journey&quot; Section Headline
                      </label>
                      <input
                        type="text"
                        value={siteSettings.about_story_title || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            about_story_title: e.target.value,
                          })
                        }
                        placeholder="Born from a need for honest, barrier-conscious skincare."
                        className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                        &quot;Our Journey&quot; Story Narrative / Paragraphs (Optional override)
                      </label>
                      <textarea
                        rows={4}
                        value={siteSettings.about_story_content || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            about_story_content: e.target.value,
                          })
                        }
                        placeholder="Leave blank to use default brand story, or enter custom narrative paragraphs..."
                        className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Pages SEO Meta Settings (Home, About, Journal, Shop) */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs space-y-6 shadow-2xs">
                <div className="pb-3 border-b border-[#F0ECE4]">
                  <h3 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-[#4E5942]" /> Store Pages
                    SEO & OpenGraph Meta Management
                  </h3>
                  <p className="text-[13px] text-[#736E67] mt-0.5">
                    Configure Google search snippet titles and descriptions for
                    key storefront landing pages.
                  </p>
                </div>

                {/* Homepage SEO */}
                <div className="p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1A1A1A] flex items-center gap-2">
                      🏠 Homepage (/)
                    </span>
                    <span className="text-[12px] text-[#736E67]">
                      Primary Brand Portal
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Title
                        </span>
                        <span
                          className={
                            (siteSettings.seo_home_title?.length || 0) > 60
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_home_title?.length || 0} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={siteSettings.seo_home_title || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_home_title: e.target.value,
                          })
                        }
                        placeholder="Maysha | Clean Botanical Science for Real Skin"
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Description
                        </span>
                        <span
                          className={
                            (siteSettings.seo_home_description?.length || 0) >
                            160
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_home_description?.length || 0} / 160
                          chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={siteSettings.seo_home_description || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_home_description: e.target.value,
                          })
                        }
                        placeholder="Discover clean, bio-compatible skincare rituals formulated with pure botanical extracts..."
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* About Us Page SEO */}
                <div className="p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1A1A1A] flex items-center gap-2">
                      🌿 About Us (/about)
                    </span>
                    <span className="text-[12px] text-[#736E67]">
                      Brand Philosophy & Sourcing
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Title
                        </span>
                        <span
                          className={
                            (siteSettings.seo_about_title?.length || 0) > 60
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_about_title?.length || 0} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={siteSettings.seo_about_title || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_about_title: e.target.value,
                          })
                        }
                        placeholder="About Our Botanical Philosophy | Maysha Skincare"
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Description
                        </span>
                        <span
                          className={
                            (siteSettings.seo_about_description?.length || 0) >
                            160
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_about_description?.length || 0} /
                          160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={siteSettings.seo_about_description || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_about_description: e.target.value,
                          })
                        }
                        placeholder="Learn about Maysha's formulation ethos, ethical sourcing, and bio-compatible science..."
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Skincare Journal SEO */}
                <div className="p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1A1A1A] flex items-center gap-2">
                      📖 Skincare Journal (/journal)
                    </span>
                    <span className="text-[12px] text-[#736E67]">
                      Editorial & Science Articles
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Title
                        </span>
                        <span
                          className={
                            (siteSettings.seo_journal_title?.length || 0) > 60
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_journal_title?.length || 0} / 60
                          chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={siteSettings.seo_journal_title || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_journal_title: e.target.value,
                          })
                        }
                        placeholder="The Skincare Journal | Maysha Skincare Science"
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Description
                        </span>
                        <span
                          className={
                            (siteSettings.seo_journal_description?.length ||
                              0) > 160
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_journal_description?.length || 0} /
                          160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={siteSettings.seo_journal_description || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_journal_description: e.target.value,
                          })
                        }
                        placeholder="Expert skincare guides, ingredient deep-dives, barrier repair science, and holistic rituals..."
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Shop Catalog SEO */}
                <div className="p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1A1A1A] flex items-center gap-2">
                      🛍️ Shop Catalog (/shop)
                    </span>
                    <span className="text-[12px] text-[#736E67]">
                      Product Directory & Filter Collection
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Title
                        </span>
                        <span
                          className={
                            (siteSettings.seo_shop_title?.length || 0) > 60
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_shop_title?.length || 0} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={siteSettings.seo_shop_title || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_shop_title: e.target.value,
                          })
                        }
                        placeholder="Shop All Botanical Formulations | Maysha"
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-[#4A4640]">
                          Meta Description
                        </span>
                        <span
                          className={
                            (siteSettings.seo_shop_description?.length || 0) >
                            160
                              ? "text-[#A94438]"
                              : "text-[#736E67]"
                          }
                        >
                          {siteSettings.seo_shop_description?.length || 0} / 160
                          chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={siteSettings.seo_shop_description || ""}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            seo_shop_description: e.target.value,
                          })
                        }
                        placeholder="Explore all cleansers, serums, toners, moisturizers, and room mists thoughtfully engineered for real skin..."
                        className="w-full bg-white border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Step Authentication (2FA) */}
              <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-6 rounded-xs space-y-4 shadow-2xs">
                <h3 className="text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#F0ECE4] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#4E5942]" /> 2-Step
                  Authentication (2FA) Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#1A1A1A]">
                        Require 2-Factor PIN on Admin Sign-In
                      </p>
                      <p className="text-[12px] text-[#736E67]">
                        Adds a secondary security verification step for
                        administrative access.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(siteSettings.admin_2fa_enabled)}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            admin_2fa_enabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E8E3DA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4E5942]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                      Admin Security PIN
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={siteSettings.admin_2fa_pin}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          admin_2fa_pin: e.target.value,
                        })
                      }
                      placeholder="e.g. 9281"
                      className="max-w-xs bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] p-2.5 rounded-2xs font-mono tracking-wider"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-8 py-3 rounded-2xs text-[14px] uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSavingSettings
                      ? "Saving Settings..."
                      : "Save All Settings"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PRODUCT (EXPANDED PRODUCTION SUITE) */}
      {/* ------------------------------------------------------------- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-8 lg:p-10 rounded-xs max-w-4xl lg:max-w-5xl w-full max-h-[94vh] overflow-y-auto space-y-5 sm:space-y-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Catalog Inventory Manager
                </span>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#1A1A1A] mt-0.5">
                  {editingProduct
                    ? `Edit Product: ${editingProduct.name}`
                    : "Add New Botanical Product"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-[#736E67] hover:text-[#1A1A1A] p-2 text-xl font-bold rounded-2xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* SECTION 1: Product Basics */}
              <div className="space-y-4">
                <h4 className="text-[15px] font-semibold text-[#1A1A1A] pb-1 border-b border-[#F0ECE4] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#4E5942]" /> Basic Product
                  Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.name}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Pure Damask Rose Water Hydrosol"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={productFormData.slug}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="e.g. pure-damask-rose-water"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Category *
                    </label>
                    <select
                      value={productFormData.category_id}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                      Concern / Subtitle
                    </label>
                    <input
                      type="text"
                      value={productFormData.subtitle}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="e.g. Deep Hydration & Barrier Balance"
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Multi-Badge Selection */}
              <div className="p-4 sm:p-5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="text-[14px] font-semibold text-[#1A1A1A] block">
                      Product Badges (Multi-Select Enabled)
                    </label>
                    <p className="text-[12px] text-[#736E67]">
                      Click pills to toggle multiple promotional badges
                      simultaneously.
                    </p>
                  </div>
                  {productFormData.selectedBadges.length > 0 && (
                    <span className="text-[12px] font-semibold text-[#4E5942] bg-[#EDF3E8] px-2.5 py-0.5 rounded-full border border-[#C5D7BD] self-start sm:self-auto">
                      {productFormData.selectedBadges.length} Active
                    </span>
                  )}
                </div>

                {/* Preset Badges Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_BADGES.map((badgeName) => {
                    const isSelected =
                      productFormData.selectedBadges.includes(badgeName);
                    return (
                      <button
                        key={badgeName}
                        type="button"
                        onClick={() => handleToggleBadge(badgeName)}
                        className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#4E5942] text-white shadow-xs border border-[#3E4534]"
                            : "bg-[#FFFFFF] text-[#4A4640] border border-[#E8E3DA] hover:border-[#1A1A1A]"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                        <span>{badgeName}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Badge Option */}
                <div className="pt-2 flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={productFormData.customBadgeInput}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        customBadgeInput: e.target.value,
                      })
                    }
                    placeholder="Type custom badge..."
                    className="flex-1 bg-white border border-[#E8E3DA] text-[13px] px-3 py-2 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomBadge}
                    className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-[13px] font-semibold px-3.5 py-2 rounded-2xs transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* SECTION 3: Dynamic Product Variants & Pricing Table */}
              <div className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E8E3DA] rounded-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0ECE4]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#4E5942]" /> Product
                      Variations & Dynamic Pricing
                    </h4>
                    <p className="text-[12px] text-[#736E67]">
                      Configure size options (e.g. 30ml, 50ml, 100ml) with
                      independent selling rates, MRPs, and inventory.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="inline-flex items-center gap-1.5 bg-[#4E5942] hover:bg-[#3E4534] text-white text-[12px] sm:text-[13px] font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xs transition-colors self-start cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Variant</span>
                  </button>
                </div>

                {/* Variant Rows Table */}
                <div className="space-y-3">
                  {productFormData.variants.map((v, vIdx) => {
                    const discountPct =
                      v.mrp > v.price
                        ? Math.round(((v.mrp - v.price) / v.mrp) * 100)
                        : 0;
                    return (
                      <div
                        key={vIdx}
                        className="p-3 sm:p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-2xs grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 items-end sm:items-center"
                      >
                        <div className="col-span-2 sm:col-span-3">
                          <label className="text-[11px] sm:text-[12px] font-semibold text-[#736E67] block mb-1">
                            Size / Volume *
                          </label>
                          <input
                            type="text"
                            required
                            value={v.size}
                            onChange={(e) =>
                              handleUpdateVariantRow(
                                vIdx,
                                "size",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 50ml or 100ml"
                            className="w-full bg-white border border-[#E8E3DA] text-[13px] sm:text-[14px] py-2 px-3 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[11px] sm:text-[12px] font-semibold text-[#736E67] block mb-1">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={v.price}
                            onChange={(e) =>
                              handleUpdateVariantRow(
                                vIdx,
                                "price",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-white border border-[#E8E3DA] text-[13px] sm:text-[14px] py-2 px-3 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[11px] sm:text-[12px] font-semibold text-[#736E67] block mb-1">
                            MRP (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={v.mrp}
                            onChange={(e) =>
                              handleUpdateVariantRow(
                                vIdx,
                                "mrp",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-white border border-[#E8E3DA] text-[13px] sm:text-[14px] py-2 px-3 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[11px] sm:text-[12px] font-semibold text-[#736E67] block mb-1">
                            Stock Units *
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={v.stock}
                            onChange={(e) =>
                              handleUpdateVariantRow(
                                vIdx,
                                "stock",
                                Number(e.target.value),
                              )
                            }
                            className="w-full bg-white border border-[#E8E3DA] text-[13px] sm:text-[14px] py-2 px-3 rounded-2xs focus:outline-none focus:border-[#4E5942]"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                          {discountPct > 0 ? (
                            <span className="text-[11px] sm:text-[12px] font-bold text-[#A94438] bg-[#FDF2F0] border border-[#F8B4B4] px-2 py-1 rounded-2xs shrink-0">
                              {discountPct}% OFF
                            </span>
                          ) : (
                            <span className="text-[11px] sm:text-[12px] text-[#736E67]">
                              Standard
                            </span>
                          )}

                          <button
                            type="button"
                            disabled={productFormData.variants.length <= 1}
                            onClick={() => handleRemoveVariantRow(vIdx)}
                            className="p-2 text-[#736E67] hover:text-[#A94438] hover:bg-[#FDF2F0] rounded-2xs transition-colors disabled:opacity-30 cursor-pointer"
                            title="Remove variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: Cloudinary Multi-Image Uploader */}
              <div className="p-5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-2">
                <CloudinaryGalleryUploader
                  images={productFormData.images}
                  onChange={(imgs) =>
                    setProductFormData({ ...productFormData, images: imgs })
                  }
                  folder="maysha/products"
                  maxImages={6}
                  label="Product Imagery (Direct Cloudinary CDN Multi-Upload)"
                />
              </div>

              {/* SECTION 5: Short Description */}
              <div>
                <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Short Description (Catalog Cards & Subheadings)
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.short_description}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="e.g. Multi-weight hyaluronic acid with botanical ceramides for 72hr hydration"
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                />
              </div>

              {/* SECTION 6: Detailed Description with Rich Text Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block">
                    Detailed Formulation Description (Rich Text Editor)
                  </label>
                  <div className="flex items-center border border-[#E8E3DA] rounded-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setDescViewMode("write")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        descViewMode === "write"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Write / Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescViewMode("preview")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        descViewMode === "preview"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Customer Preview
                    </button>
                  </div>
                </div>

                {descViewMode === "write" ? (
                  <div className="border border-[#E8E3DA] rounded-xs overflow-hidden bg-white">
                    {/* Rich Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F6F3EC] border-b border-[#E8E3DA]">
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("bold")}
                        className="px-2.5 py-1 text-[13px] font-bold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bold (**text**)"
                      >
                        <Bold className="w-3.5 h-3.5" /> Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("italic")}
                        className="px-2.5 py-1 text-[13px] italic bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Italic (*text*)"
                      >
                        <Italic className="w-3.5 h-3.5" /> Italic
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("h2")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Heading 2 (## Title)"
                      >
                        <Heading2 className="w-3.5 h-3.5" /> H2 Title
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("bullet")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bullet List (• item)"
                      >
                        <List className="w-3.5 h-3.5" /> Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("number")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Numbered Steps (1. step)"
                      >
                        <ListOrdered className="w-3.5 h-3.5" /> Steps
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("quote")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Highlight Callout (> quote)"
                      >
                        <Quote className="w-3.5 h-3.5" /> Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertFormatting("hr")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Divider Line (---)"
                      >
                        Divider
                      </button>
                    </div>

                    <textarea
                      id="detailed-desc-textarea"
                      required
                      rows={6}
                      value={productFormData.description}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Write comprehensive product science, biological benefits, ritual tips..."
                      className="w-full bg-[#FFFFFF] p-4 text-[15px] leading-relaxed text-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="border border-[#E8E3DA] rounded-xs p-5 bg-[#FBF9F5] min-h-[160px] prose prose-stone max-w-none space-y-3">
                    {productFormData.description ? (
                      productFormData.description
                        .split("\n\n")
                        .map((para, pIdx) => {
                          if (para.startsWith("## ")) {
                            return (
                              <h3
                                key={pIdx}
                                className="text-lg font-semibold text-[#1A1A1A] mt-2 mb-1"
                              >
                                {para.replace(/^##\s*/, "")}
                              </h3>
                            );
                          }
                          if (para.startsWith("> ")) {
                            return (
                              <blockquote
                                key={pIdx}
                                className="border-l-4 border-[#4E5942] pl-3 py-1 italic text-[15px] text-[#3E4534] bg-white rounded-2xs"
                              >
                                {para.replace(/^>\s*/, "")}
                              </blockquote>
                            );
                          }
                          return (
                            <p
                              key={pIdx}
                              className="text-[15px] text-[#4A4640] leading-relaxed whitespace-pre-line"
                            >
                              {para}
                            </p>
                          );
                        })
                    ) : (
                      <p className="text-[#736E67] text-[14px] italic">
                        No description entered yet.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 7: Ingredients */}
              <div>
                <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                  Key Ingredients (INCI List)
                </label>
                <textarea
                  rows={2}
                  value={productFormData.ingredients}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      ingredients: e.target.value,
                    })
                  }
                  placeholder="e.g. Rosa Damascena Flower Water, Niacinamide (5%), Centella Asiatica Extract, Sodium Hyaluronate..."
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-2.5 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                />
              </div>

              {/* SECTION 7B: How To Use with Rich Text Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block">
                    How To Use Ritual (Rich Text Editor)
                  </label>
                  <div className="flex items-center border border-[#E8E3DA] rounded-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setHowToUseViewMode("write")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        howToUseViewMode === "write"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Write / Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setHowToUseViewMode("preview")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        howToUseViewMode === "preview"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Customer Preview
                    </button>
                  </div>
                </div>

                {howToUseViewMode === "write" ? (
                  <div className="border border-[#E8E3DA] rounded-xs overflow-hidden bg-white">
                    {/* Rich Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F6F3EC] border-b border-[#E8E3DA]">
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("step")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Add Numbered Steps (1. Step)"
                      >
                        <ListOrdered className="w-3.5 h-3.5 text-[#4E5942]" /> Step by Step
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("bold")}
                        className="px-2.5 py-1 text-[13px] font-bold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bold (**text**)"
                      >
                        <Bold className="w-3.5 h-3.5" /> Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("italic")}
                        className="px-2.5 py-1 text-[13px] italic bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Italic (*text*)"
                      >
                        <Italic className="w-3.5 h-3.5" /> Italic
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("bullet")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bullet Points (• AM / PM)"
                      >
                        <List className="w-3.5 h-3.5" /> Bullet
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("tip")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#4E5942] cursor-pointer"
                        title="Ritual Pro Tip (> Pro Tip: ...)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4E5942]" /> Pro Tip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertHowToUseFormatting("divider")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Divider Line (---)"
                      >
                        Divider
                      </button>
                    </div>

                    <textarea
                      id="how-to-use-textarea"
                      rows={5}
                      value={productFormData.usage_instructions}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          usage_instructions: e.target.value,
                        })
                      }
                      placeholder="e.g.&#10;1. Dispense 2-3 drops onto clean palms&#10;2. Warm between hands and press gently into face & neck&#10;3. Follow with moisturizer&#10;&#10;> Pro Tip: Apply to damp skin for maximum hydration lock."
                      className="w-full bg-[#FFFFFF] p-4 text-[15px] leading-relaxed text-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="border border-[#E8E3DA] rounded-xs p-5 bg-[#FBF9F5] min-h-[140px] space-y-3">
                    {productFormData.usage_instructions ? (
                      productFormData.usage_instructions
                        .split("\n")
                        .map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const stepMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
                          if (stepMatch) {
                            return (
                              <div key={idx} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-[#EDF3E8] text-[#3E4534] border border-[#C5D7BD] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                  {stepMatch[1]}
                                </span>
                                <p className="text-[14px] text-[#4A4640] leading-relaxed flex-1">
                                  {trimmed.replace(/^(\d+)[\.\)]\s*/, "")}
                                </p>
                              </div>
                            );
                          }
                          if (/^[•\-\*]\s*/.test(trimmed)) {
                            return (
                              <div key={idx} className="flex items-start gap-2.5 pl-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4E5942] shrink-0 mt-2" />
                                <p className="text-[14px] text-[#4A4640] leading-relaxed flex-1">
                                  {trimmed.replace(/^[•\-\*]\s*/, "")}
                                </p>
                              </div>
                            );
                          }
                          if (trimmed.startsWith(">")) {
                            return (
                              <div
                                key={idx}
                                className="p-3 bg-[#F6F8F4] border-l-3 border-[#4E5942] rounded-2xs text-[13px] text-[#3E4534] font-medium"
                              >
                                {trimmed.replace(/^>\s*/, "")}
                              </div>
                            );
                          }
                          if (trimmed === "---") {
                            return <hr key={idx} className="border-[#E8E3DA] my-1" />;
                          }
                          return (
                            <p key={idx} className="text-[14px] text-[#4A4640] leading-relaxed">
                              {trimmed}
                            </p>
                          );
                        })
                    ) : (
                      <p className="text-[13px] text-[#736E67] italic">
                        No usage ritual specified yet. Use the formatting buttons above to create structured ritual steps!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 8: Key Benefits & Skin Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Key Benefits (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={productFormData.key_benefits}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        key_benefits: e.target.value,
                      })
                    }
                    placeholder="Barrier support, Deep hydration, Antioxidant rich"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-[#1A1A1A] block mb-1.5">
                    Target Skin Types
                  </label>
                  <input
                    type="text"
                    value={productFormData.skin_types}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        skin_types: e.target.value,
                      })
                    }
                    placeholder="All Skin Types, Sensitive, Dry, Combination"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] py-3 px-4 rounded-2xs focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* SECTION 9: Search Engine Optimization (SEO) & Google SERP Live Preview */}
              <div className="p-5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DA]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#4E5942]" /> Product Page
                      SEO (Google & Meta Tags)
                    </h4>
                    <p className="text-[12px] text-[#736E67]">
                      Follow SEO best practices: 50–60 character title tag,
                      140–160 character meta description.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#4E5942] bg-[#EDF3E8] px-2.5 py-1 rounded-full border border-[#C5D7BD]">
                    Bluestone PIM Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[14px] font-semibold text-[#1A1A1A]">
                        SEO Meta Title
                      </label>
                      <span
                        className={`text-[12px] font-mono ${
                          productFormData.seo_title.length > 60
                            ? "text-[#A94438] font-bold"
                            : productFormData.seo_title.length >= 45
                              ? "text-[#4E5942] font-semibold"
                              : "text-[#736E67]"
                        }`}
                      >
                        {productFormData.seo_title.length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={productFormData.seo_title}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          seo_title: e.target.value,
                        })
                      }
                      placeholder={
                        productFormData.name
                          ? `${productFormData.name} | Maysha Skincare`
                          : "e.g. Pure Damask Rose Water | Maysha Skincare"
                      }
                      className="w-full bg-[#FFFFFF] border border-[#E8E3DA] text-[14px] py-2.5 px-3 rounded-2xs focus:outline-none focus:border-[#1A1A1A]"
                    />
                    <p className="text-[11px] text-[#736E67] mt-1">
                      Target primary product keyword + brand name.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[14px] font-semibold text-[#1A1A1A]">
                        SEO Meta Description
                      </label>
                      <span
                        className={`text-[12px] font-mono ${
                          productFormData.seo_description.length > 160
                            ? "text-[#A94438] font-bold"
                            : productFormData.seo_description.length >= 130
                              ? "text-[#4E5942] font-semibold"
                              : "text-[#736E67]"
                        }`}
                      >
                        {productFormData.seo_description.length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={productFormData.seo_description}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          seo_description: e.target.value,
                        })
                      }
                      placeholder={
                        productFormData.subtitle ||
                        "Shop pure Damask rose water mist to soothe, balance, and rehydrate thirsty skin..."
                      }
                      className="w-full bg-[#FFFFFF] border border-[#E8E3DA] text-[14px] py-2.5 px-3 rounded-2xs focus:outline-none focus:border-[#1A1A1A]"
                    />
                    <p className="text-[11px] text-[#736E67] mt-1">
                      Summarize core value, benefits, and call to action.
                    </p>
                  </div>
                </div>

                {/* Google SERP Live Snippet Preview */}
                <div className="mt-3 p-4 bg-[#FFFFFF] border border-[#DCD7CD] rounded-xs shadow-2xs space-y-1 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#736E67]">
                      Google Search Result Preview (Live Snippet)
                    </span>
                    <span className="text-[11px] text-[#4E5942] font-medium">
                      Desktop & Mobile SERP
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="text-[13px] text-[#202124] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#4E5942] text-white flex items-center justify-center text-[9px] font-bold">
                        M
                      </span>
                      <span className="text-[#4D5156] text-[12px]">
                        mayshaskincare.com
                      </span>
                      <span className="text-[#5F6368] text-[12px]">
                        › products › {productFormData.slug || "product-url"}
                      </span>
                    </div>
                    <h5 className="text-[18px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-snug mt-1">
                      {productFormData.seo_title ||
                        (productFormData.name
                          ? `${productFormData.name} | Maysha Skincare`
                          : "Product Name | Maysha Skincare")}
                    </h5>
                    <div className="flex items-center gap-2 text-[12px] text-[#5F6368] my-0.5">
                      <span className="text-[#e37400]">★★★★★</span>
                      <span>4.9 (48)</span>
                      <span>•</span>
                      <span>
                        ₹{productFormData.variants[0]?.price || 599}.00
                      </span>
                      <span>•</span>
                      <span className="text-[#137333]">In stock</span>
                    </div>
                    <p className="text-[13px] text-[#4d5156] leading-normal line-clamp-2">
                      {productFormData.seo_description ||
                        productFormData.short_description ||
                        productFormData.subtitle ||
                        "Experience biocompatible, botanical skincare thoughtfully formulated with pure Damask rose and clinical actives for resilient, balanced skin."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 sm:pt-5 border-t border-[#F0ECE4] flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[12px] sm:text-[13px] text-[#736E67]">
                  {productFormData.variants.length} variant(s) configured •{" "}
                  {productFormData.selectedBadges.length} badge(s)
                </span>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-[13px] sm:text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] transition-colors text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xs text-[13px] sm:text-[14px] font-semibold transition-colors cursor-pointer shadow-xs text-center"
                  >
                    {editingProduct
                      ? "Update Product"
                      : "Save Botanical Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT BANNER */}
      {/* ------------------------------------------------------------- */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-8 rounded-xs max-w-xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                {editingBanner
                  ? "Edit Carousel Banner"
                  : "Add New Carousel Banner"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                className="text-[#736E67] hover:text-[#1A1A1A] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={bannerFormData.title}
                  onChange={(e) =>
                    setBannerFormData({
                      ...bannerFormData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Pure Care for Naturally Radiant Skin"
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                  Subtitle / Supporting Text
                </label>
                <input
                  type="text"
                  value={bannerFormData.subtitle}
                  onChange={(e) =>
                    setBannerFormData({
                      ...bannerFormData,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="e.g. Thoughtfully crafted skincare with the goodness of nature."
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={bannerFormData.cta_text}
                    onChange={(e) =>
                      setBannerFormData({
                        ...bannerFormData,
                        cta_text: e.target.value,
                      })
                    }
                    placeholder="Shop Now"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={bannerFormData.cta_link}
                    onChange={(e) =>
                      setBannerFormData({
                        ...bannerFormData,
                        cta_link: e.target.value,
                      })
                    }
                    placeholder="/shop"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
              </div>

              {/* Cloudinary Direct Uploader for Desktop Banner */}
              <CloudinaryUploader
                label="Desktop Banner Image (1600x900 recommended)"
                folder="maysha/banners"
                currentImage={bannerFormData.desktop_image}
                onUploadSuccess={(url) =>
                  setBannerFormData({ ...bannerFormData, desktop_image: url })
                }
              />

              <div className="pt-2 border-t border-[#F0ECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerFormData.is_active}
                    onChange={(e) =>
                      setBannerFormData({
                        ...bannerFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="rounded-2xs text-[#4E5942]"
                  />
                  <span>Show as Active on Homepage Slider</span>
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddBannerModal(false)}
                    className="flex-1 sm:flex-none px-4 py-2 text-[13px] sm:text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold cursor-pointer text-center"
                  >
                    {editingBanner ? "Update Banner" : "Save Banner"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT JOURNAL ARTICLE */}
      {/* ------------------------------------------------------------- */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-8 rounded-xs max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] truncate">
                {editingArticle
                  ? `Edit Story: ${editingArticle.title}`
                  : "Create New Journal Story"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddArticleModal(false)}
                className="text-[#736E67] hover:text-[#1A1A1A] text-lg font-bold p-1 cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleFormData.title}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. The Right Way to Layer Your Skincare"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={articleFormData.slug}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        slug: e.target.value,
                      })
                    }
                    placeholder="the-right-way-to-layer"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[13px] font-semibold text-[#1A1A1A]">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIsCustom = !isCustomArticleCategory;
                        setIsCustomArticleCategory(nextIsCustom);
                        if (nextIsCustom) {
                          setCustomArticleCategoryInput("");
                        } else {
                          setArticleFormData({
                            ...articleFormData,
                            category:
                              dynamicArticleCategories[0] || "Skincare Science",
                          });
                        }
                      }}
                      className="text-[11px] font-semibold text-[#4E5942] hover:underline cursor-pointer"
                    >
                      {isCustomArticleCategory
                        ? "← Pick Existing"
                        : "+ New Category"}
                    </button>
                  </div>

                  {isCustomArticleCategory ? (
                    <input
                      type="text"
                      required
                      value={customArticleCategoryInput}
                      onChange={(e) => {
                        setCustomArticleCategoryInput(e.target.value);
                        setArticleFormData({
                          ...articleFormData,
                          category: e.target.value,
                        });
                      }}
                      placeholder="e.g. Skin Microbiome"
                      className="w-full bg-[#FFFFFF] border-2 border-[#4E5942] text-[14px] p-2.5 rounded-2xs focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <select
                      value={articleFormData.category}
                      onChange={(e) => {
                        if (e.target.value === "__create_new__") {
                          setIsCustomArticleCategory(true);
                          setCustomArticleCategoryInput("");
                        } else {
                          setArticleFormData({
                            ...articleFormData,
                            category: e.target.value,
                          });
                        }
                      }}
                      className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs cursor-pointer"
                    >
                      {dynamicArticleCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option
                        value="__create_new__"
                        className="font-semibold text-[#4E5942]"
                      >
                        + Create New Category...
                      </option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={articleFormData.author}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        author: e.target.value,
                      })
                    }
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={articleFormData.reading_time}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        reading_time: e.target.value,
                      })
                    }
                    placeholder="5 min read"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                  />
                </div>
              </div>

              {/* Cloudinary Hero Image Upload */}
              <CloudinaryUploader
                label="Article Hero Visual (Cloudinary Hosted)"
                folder="maysha/journal"
                currentImage={articleFormData.hero_image}
                onUploadSuccess={(url) =>
                  setArticleFormData({ ...articleFormData, hero_image: url })
                }
              />

              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                  Summary / Excerpt *
                </label>
                <input
                  type="text"
                  required
                  value={articleFormData.excerpt}
                  onChange={(e) =>
                    setArticleFormData({
                      ...articleFormData,
                      excerpt: e.target.value,
                    })
                  }
                  placeholder="Short introductory summary for cards and search..."
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block">
                    Full Article Content (Rich Text Editor) *
                  </label>
                  <div className="flex items-center border border-[#E8E3DA] rounded-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setArticleContentViewMode("write")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        articleContentViewMode === "write"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Write / Format
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleContentViewMode("preview")}
                      className={`px-3 py-1 text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        articleContentViewMode === "preview"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white text-[#736E67] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Story Preview
                    </button>
                  </div>
                </div>

                {articleContentViewMode === "write" ? (
                  <div className="border border-[#E8E3DA] rounded-xs overflow-hidden bg-white">
                    {/* Rich Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F6F3EC] border-b border-[#E8E3DA]">
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("bold")}
                        className="px-2.5 py-1 text-[12px] font-bold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bold (**text**)"
                      >
                        <Bold className="w-3 h-3" /> Bold
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("italic")}
                        className="px-2.5 py-1 text-[12px] italic bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Italic (*text*)"
                      >
                        <Italic className="w-3 h-3" /> Italic
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("h2")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Section Heading (## Title)"
                      >
                        <Heading2 className="w-3 h-3" /> H2 Title
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("h3")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Subheading (### Subtitle)"
                      >
                        H3 Subtitle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("bullet")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Bullet List (• item)"
                      >
                        <List className="w-3 h-3" /> Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("number")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Numbered Steps (1. step)"
                      >
                        <ListOrdered className="w-3 h-3" /> Steps
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("quote")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Editorial Quote (> quote)"
                      >
                        <Quote className="w-3 h-3" /> Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertArticleFormatting("hr")}
                        className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
                        title="Section Divider (---)"
                      >
                        Divider
                      </button>
                    </div>

                    <textarea
                      id="article-content-textarea"
                      required
                      rows={10}
                      value={articleFormData.content}
                      onChange={(e) =>
                        setArticleFormData({
                          ...articleFormData,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write your editorial story with scientific depth, ritual guidance, formatting..."
                      className="w-full bg-[#FFFFFF] p-4 text-[14px] leading-relaxed text-[#1A1A1A] focus:outline-none font-mono"
                    />
                  </div>
                ) : (
                  <div className="border border-[#E8E3DA] rounded-xs p-6 bg-[#FBF9F5] min-h-[220px] max-h-[380px] overflow-y-auto space-y-4">
                    {articleFormData.content ? (
                      articleFormData.content
                        .split("\n\n")
                        .map((para, pIdx) => {
                          const trimmed = para.trim();
                          if (!trimmed) return null;
                          if (trimmed.startsWith("## ")) {
                            return (
                              <h2
                                key={pIdx}
                                className="text-xl font-bold text-[#1A1A1A] font-serif tracking-tight mt-4 mb-2 pb-1 border-b border-[#E8E3DA]"
                              >
                                {trimmed.replace(/^##\s*/, "")}
                              </h2>
                            );
                          }
                          if (trimmed.startsWith("### ")) {
                            return (
                              <h3
                                key={pIdx}
                                className="text-lg font-semibold text-[#2C2925] mt-3 mb-1"
                              >
                                {trimmed.replace(/^###\s*/, "")}
                              </h3>
                            );
                          }
                          if (trimmed.startsWith("> ")) {
                            return (
                              <blockquote
                                key={pIdx}
                                className="border-l-4 border-[#4E5942] pl-4 py-2 italic text-[15px] text-[#3E4534] bg-white rounded-2xs shadow-xs"
                              >
                                {trimmed.replace(/^>\s*/, "")}
                              </blockquote>
                            );
                          }
                          if (trimmed === "---") {
                            return (
                              <hr
                                key={pIdx}
                                className="my-4 border-t border-[#E8E3DA]"
                              />
                            );
                          }
                          if (
                            trimmed.startsWith("• ") ||
                            trimmed.startsWith("- ")
                          ) {
                            const items = trimmed.split("\n");
                            return (
                              <ul
                                key={pIdx}
                                className="space-y-1.5 pl-4 list-disc text-[#4A4640] text-[14px]"
                              >
                                {items.map((it, iIdx) => (
                                  <li key={iIdx}>
                                    {it.replace(/^[•\-*]\s*/, "")}
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p
                              key={pIdx}
                              className="text-[14px] leading-relaxed text-[#4A4640] whitespace-pre-line"
                            >
                              {trimmed}
                            </p>
                          );
                        })
                    ) : (
                      <p className="text-[#736E67] text-[14px] italic">
                        No article content entered yet. Switch back to Write
                        mode to compose your story.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="px-4 py-2 text-[13px] sm:text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 sm:px-6 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold cursor-pointer"
                >
                  {editingArticle ? "Update Story" : "Publish Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT COUPON VOUCHER */}
      {/* ------------------------------------------------------------- */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-8 rounded-xs max-w-lg w-full max-h-[92vh] overflow-y-auto space-y-5 sm:space-y-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Promotions Engine
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] mt-0.5">
                  {editingCoupon
                    ? `Edit Coupon: ${editingCoupon.code}`
                    : "Create New Coupon Voucher"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="text-[#736E67] hover:text-[#1A1A1A] p-1 text-xl font-bold rounded-2xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={couponFormData.code}
                  onChange={(e) =>
                    setCouponFormData({
                      ...couponFormData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. ATC10, FESTIVE25, WELCOME50"
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[15px] p-2.5 rounded-2xs font-mono font-bold tracking-wider uppercase focus:outline-hidden focus:border-[#1A1A1A]"
                />
                <p className="text-[11px] text-[#736E67] mt-1">
                  Codes will automatically be uppercase.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={couponFormData.type}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        type: e.target.value as "percent" | "fixed",
                      })
                    }
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs cursor-pointer focus:outline-hidden"
                  >
                    <option value="percent">Percentage Discount (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponFormData.value}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        value: Number(e.target.value),
                      })
                    }
                    placeholder={
                      couponFormData.type === "percent"
                        ? "10 (for 10%)"
                        : "150 (for ₹150)"
                    }
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Min. Order Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponFormData.min_subtotal}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        min_subtotal: Number(e.target.value),
                      })
                    }
                    placeholder="0 (no minimum)"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden"
                  />
                  <p className="text-[11px] text-[#736E67] mt-1">
                    Minimum cart total to unlock.
                  </p>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponFormData.max_discount}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        max_discount: Number(e.target.value),
                      })
                    }
                    placeholder="0 (no cap)"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden"
                  />
                  <p className="text-[11px] text-[#736E67] mt-1">
                    Max discount amount allowed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Total Global Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={couponFormData.usage_limit}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        usage_limit: e.target.value,
                      })
                    }
                    placeholder="Unlimited"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Uses Per User
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={couponFormData.per_user_limit}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        per_user_limit: Number(e.target.value),
                      })
                    }
                    placeholder="1"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-[#F0ECE4]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponFormData.first_order_only}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        first_order_only: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#1A1A1A] accent-[#1A1A1A]"
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-[#1A1A1A] block">
                      First Order Only
                    </span>
                    <span className="text-[11px] text-[#736E67]">
                      Voucher will only be valid for a customer's very first
                      order.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponFormData.is_active}
                    onChange={(e) =>
                      setCouponFormData({
                        ...couponFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#1A1A1A] accent-[#1A1A1A]"
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-[#1A1A1A] block">
                      Active for Checkout & Offers Strip
                    </span>
                    <span className="text-[11px] text-[#736E67]">
                      When active, shoppers can apply this voucher and see it on
                      product detail offers.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-[#F0ECE4] flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 text-[13px] sm:text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCoupon}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-6 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold cursor-pointer disabled:opacity-60 text-center"
                >
                  {isSavingCoupon
                    ? "Saving..."
                    : editingCoupon
                      ? "Update Voucher"
                      : "Create Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT STORE CATEGORY */}
      {/* ------------------------------------------------------------- */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E8E3DA] p-4 sm:p-8 rounded-xs max-w-xl w-full max-h-[92vh] overflow-y-auto space-y-5 sm:space-y-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F0ECE4]">
              <div>
                <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#4E5942] block">
                  Store Taxonomy
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] mt-0.5">
                  {editingCategory
                    ? `Edit Category: ${editingCategory.name}`
                    : "Create New Category Collection"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="text-[#736E67] hover:text-[#1A1A1A] p-1 text-xl font-bold rounded-2xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Perfumes, Air Fresheners, Serums"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.slug}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        slug: e.target.value,
                      })
                    }
                    placeholder="e.g. perfumes, air-fresheners"
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                  />
                  <p className="text-[11px] text-[#736E67] mt-0.5">
                    Auto-generated from name if empty.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                  Collection Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData({
                      ...categoryFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g. Luxurious home and ambient air mists infused with Damask rose and essential botanical extracts."
                  className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              {/* Cloudinary Direct Uploader */}
              <CloudinaryUploader
                label="Category Banner / Icon Image (Cloudinary)"
                folder="maysha/categories"
                currentImage={categoryFormData.image}
                onUploadSuccess={(url) =>
                  setCategoryFormData({ ...categoryFormData, image: url })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#1A1A1A] block mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={categoryFormData.sort_order}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        sort_order: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#FBF9F5] border border-[#E8E3DA] text-[14px] p-2.5 rounded-2xs focus:outline-hidden"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFormData.is_active}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-[#4E5942] accent-[#4E5942]"
                    />
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">
                      Active in Navigation & Filters
                    </span>
                  </label>
                </div>
              </div>

              {/* Category SEO fields */}
              <div className="p-3.5 sm:p-4 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xs space-y-3">
                <span className="text-[13px] font-semibold text-[#1A1A1A] block border-b border-[#E8E3DA] pb-1">
                  Collection SEO Meta Tags
                </span>
                <div>
                  <label className="text-[12px] font-semibold text-[#4A4640] block mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.seo_title}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        seo_title: e.target.value,
                      })
                    }
                    placeholder={
                      categoryFormData.name
                        ? `${categoryFormData.name} Collection | Maysha`
                        : "e.g. Cleansers | Maysha"
                    }
                    className="w-full bg-white border border-[#E8E3DA] text-[13px] p-2 rounded-2xs"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#4A4640] block mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.seo_description}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        seo_description: e.target.value,
                      })
                    }
                    placeholder="Discover botanical formulas tailored to purify, tone, and restore..."
                    className="w-full bg-white border border-[#E8E3DA] text-[13px] p-2 rounded-2xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0ECE4] flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-[13px] sm:text-[14px] font-semibold text-[#736E67] hover:text-[#1A1A1A] cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-6 py-2.5 rounded-2xs text-[13px] sm:text-[14px] font-semibold cursor-pointer disabled:opacity-60 text-center"
                >
                  {isSavingCategory
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
