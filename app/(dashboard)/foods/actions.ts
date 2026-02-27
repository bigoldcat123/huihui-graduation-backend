"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/lib/api-response";

export type CreateFoodFormState = {
  error: string | null;
  success: boolean;
};

export type CreateTagFormState = {
  error: string | null;
  success: boolean;
};

export type UpdateFoodFormState = {
  error: string | null;
  success: boolean;
};

export async function createFoodAction(
  _prevState: CreateFoodFormState,
  formData: FormData,
): Promise<CreateFoodFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false };
  }

  const restaurantId = Number.parseInt(String(formData.get("restaurant_id") ?? ""), 10);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const price = Number.parseFloat(String(formData.get("price") ?? ""));
  const tagIds = formData
    .getAll("tag_ids")
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!Number.isFinite(restaurantId) || restaurantId < 1) {
    return { error: "请选择餐厅。", success: false };
  }

  if (!name || !description || !image || !Number.isFinite(price) || price < 0) {
    return { error: "名称、描述、图片和有效价格不能为空。", success: false };
  }

  try {
    const body: {
      restaurant_id: number;
      name: string;
      description: string;
      image: string;
      price: number;
      tag_ids?: number[];
    } = {
      restaurant_id: restaurantId,
      name,
      description,
      image,
      price,
    };

    if (tagIds.length) {
      body.tag_ids = tagIds;
    }

    const response = await fetch(`${apiBaseUrl}/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<unknown>;

    if (payload.code !== 200) {
      return { error: payload.message || "新增菜品失败。", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false };
  }
}

export async function createTagAction(
  _prevState: CreateTagFormState,
  formData: FormData,
): Promise<CreateTagFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false };
  }

  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name || !image) {
    return { error: "名称和图片不能为空。", success: false };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/tag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        image,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<unknown>;

    if (payload.code !== 200) {
      return { error: payload.message || "新增标签失败。", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false };
  }
}

export async function updateFoodAction(
  _prevState: UpdateFoodFormState,
  formData: FormData,
): Promise<UpdateFoodFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false };
  }

  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  const restaurantId = Number.parseInt(String(formData.get("restaurant_id") ?? ""), 10);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const price = Number.parseFloat(String(formData.get("price") ?? ""));
  const tagIds = formData
    .getAll("tag_ids")
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!Number.isFinite(id) || id < 1) {
    return { error: "菜品 ID 无效。", success: false };
  }

  if (!Number.isFinite(restaurantId) || restaurantId < 1) {
    return { error: "请选择餐厅。", success: false };
  }

  if (!name || !description || !image || !Number.isFinite(price) || price < 0) {
    return { error: "名称、描述、图片和有效价格不能为空。", success: false };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/food/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        restaurant_id: restaurantId,
        name,
        description,
        image,
        price,
        // Required semantics for update API: this fully replaces existing tags.
        tag_ids: tagIds,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<unknown>;

    if (payload.code !== 200) {
      return { error: payload.message || "更新菜品失败。", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false };
  }
}
