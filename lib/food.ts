import type { ApiResponse } from "@/lib/api-response";

export type FoodTag = {
  id: number;
  name: string;
  image: string | null;
};

export type RestaurantItem = {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string | null;
};

export type FoodItem = {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  image: string | null;
  tags: FoodTag[];
};

export type GetFoodListResult =
  | { ok: true; data: FoodItem[] }
  | { ok: false; error: string };

export type GetListResult<T> = { ok: true; data: T[] } | { ok: false; error: string };

type GetFoodListInput = {
  token?: string;
  page: number;
  pageSize: number;
};

async function getListFromApi<T>(path: string): Promise<GetListResult<T>> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL configuration." };
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json()) as ApiResponse<T[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "Failed to load data." };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}

export function getTagList(): Promise<GetListResult<FoodTag>> {
  return getListFromApi<FoodTag>("/tag");
}

export function getRestaurantList(): Promise<GetListResult<RestaurantItem>> {
  return getListFromApi<RestaurantItem>("/restaurant");
}

export async function getFoodList({
  token,
  page,
  pageSize,
}: GetFoodListInput): Promise<GetFoodListResult> {
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

    const response = await fetch(`${apiBaseUrl}/food/list?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<FoodItem[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "Failed to load foods." };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}
