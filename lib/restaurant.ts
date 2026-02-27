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
    return { ok: false, error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。" };
  }

  if (!token) {
    return { ok: false, error: "登录已失效，请重新登录。" };
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
      return { ok: false, error: payload.message || "加载餐厅失败。" };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
  }
}
