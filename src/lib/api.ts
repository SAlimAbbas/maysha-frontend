import { ApiEnvelope, ApiError } from "@/types";

/**
 * Format currency in Indian Rupees.
 * If given paise, converts to rupees. Whole numbers show no decimals (e.g. ₹399),
 * while fractional values display 2 decimals (e.g. ₹458.10).
 */
export function formatINR(amount: number, isPaise: boolean = false): string {
  const value = isPaise ? amount / 100 : amount;
  if (isNaN(value)) return "₹0";

  const isWhole = Number.isInteger(value);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `₹${formatted}`;
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Map dotted server validation errors into flat form field errors.
 * Example: 'shipping_address.line1' -> 'address'
 */
export function mapDottedErrors(
  errors?: Record<string, string[]>,
  keyMap: Record<string, string> = {
    "shipping_address.line1": "address",
    "shipping_address.name": "name",
    "shipping_address.phone": "phone",
    "shipping_address.city": "city",
    "shipping_address.state": "state",
    "shipping_address.pincode": "pincode",
  }
): Record<string, string> {
  if (!errors) return {};
  const mapped: Record<string, string> = {};

  for (const [key, messages] of Object.entries(errors)) {
    const targetKey = keyMap[key] || key;
    if (messages && messages.length > 0) {
      mapped[targetKey] = messages[0];
    }
  }

  return mapped;
}

/**
 * Server-side direct fetch to Laravel API (with Next.js ISR and cache tags).
 * Strictly used in Server Components.
 */
export async function apiServerFetch<T>(
  path: string,
  options: {
    revalidate?: number | false;
    tags?: string[];
    cache?: RequestCache;
  } = {}
): Promise<T> {
  const baseUrl = process.env.API_URL || "http://127.0.0.1:8000";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const fullUrl = `${baseUrl.replace(/\/$/, "")}/api/v1/${cleanPath}`;

  const fetchOptions: RequestInit = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (options.revalidate !== undefined || options.tags) {
    fetchOptions.next = {
      revalidate: options.revalidate ?? 60,
      tags: options.tags,
    };
  } else if (options.cache) {
    fetchOptions.cache = options.cache;
  }

  try {
    const res = await fetch(fullUrl, fetchOptions);
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new ApiClientError(
        errorJson.message || `Failed to fetch from server (${res.status})`,
        res.status,
        errorJson.errors
      );
    }

    const envelope: ApiEnvelope<T> = await res.json();
    return envelope.data;
  } catch (error: any) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(error.message || "Network error communicating with backend", 500);
  }
}

/**
 * Client-side fetch helper communicating exclusively with the Next.js BFF proxy (/api/bff/*).
 * Automatically carries cookies and handles envelope unwrapping.
 */
export async function apiBffFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; message: string; meta?: any }> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `/api/bff/${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Requested-With", "maysha");

  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(
      json.message || `Request failed with status ${res.status}`,
      res.status,
      json.errors
    );
  }

  return {
    data: json.data as T,
    message: json.message || "Success",
    meta: json.meta,
  };
}
