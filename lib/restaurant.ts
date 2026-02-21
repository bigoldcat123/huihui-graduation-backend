import type { ApiResponse } from "@/lib/api-response";

export type RestaurantItem = {
  id: number;
  name: string;
  description: string | null;
  location: string;
  image: string | null;
};

export type GetRestaurantListResult =
  | { ok: true; data: RestaurantItem[] }
  | { ok: false; error: string };

type GetRestaurantListInput = {
  token?: string;
  page: number;
  pageSize: number;
};

export async function getRestaurantList({
  token,
  page,
  pageSize,
}: GetRestaurantListInput): Promise<GetRestaurantListResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL configuration." };
  }

  if (!token) {
    return { ok: false, error: "Not authenticated. Please sign in again." };
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    const response = await fetch(`${apiBaseUrl}/restaurant/list?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<RestaurantItem[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "Failed to load restaurants." };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}
