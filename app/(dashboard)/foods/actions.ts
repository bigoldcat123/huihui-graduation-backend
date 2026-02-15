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
    return { error: "Missing NEXT_PUBLIC_API_BASE_URL configuration.", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "Not authenticated. Please sign in again.", success: false };
  }

  const restaurantId = Number.parseInt(String(formData.get("restaurant_id") ?? ""), 10);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const tagIds = formData
    .getAll("tag_ids")
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!Number.isFinite(restaurantId) || restaurantId < 1) {
    return { error: "Please select a restaurant.", success: false };
  }

  if (!name || !description || !image) {
    return { error: "Name, description, and image are required.", success: false };
  }

  try {
    const body: {
      restaurant_id: number;
      name: string;
      description: string;
      image: string;
      tag_ids?: number[];
    } = {
      restaurant_id: restaurantId,
      name,
      description,
      image,
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
      return { error: payload.message || "Failed to add food.", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}

export async function createTagAction(
  _prevState: CreateTagFormState,
  formData: FormData,
): Promise<CreateTagFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "Missing NEXT_PUBLIC_API_BASE_URL configuration.", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "Not authenticated. Please sign in again.", success: false };
  }

  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name || !image) {
    return { error: "Name and image are required.", success: false };
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
      return { error: payload.message || "Failed to add tag.", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}

export async function updateFoodAction(
  _prevState: UpdateFoodFormState,
  formData: FormData,
): Promise<UpdateFoodFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "Missing NEXT_PUBLIC_API_BASE_URL configuration.", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "Not authenticated. Please sign in again.", success: false };
  }

  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  const restaurantId = Number.parseInt(String(formData.get("restaurant_id") ?? ""), 10);
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const tagIds = formData
    .getAll("tag_ids")
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!Number.isFinite(id) || id < 1) {
    return { error: "Invalid food id.", success: false };
  }

  if (!Number.isFinite(restaurantId) || restaurantId < 1) {
    return { error: "Please select a restaurant.", success: false };
  }

  if (!name || !description || !image) {
    return { error: "Name, description, and image are required.", success: false };
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
        // Required semantics for update API: this fully replaces existing tags.
        tag_ids: tagIds,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<unknown>;

    if (payload.code !== 200) {
      return { error: payload.message || "Failed to update food.", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}
