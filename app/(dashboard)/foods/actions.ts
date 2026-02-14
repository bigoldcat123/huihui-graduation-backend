"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type CreateFoodFormState = {
  error: string | null;
  success: boolean;
};

type CreateFoodResponse = {
  code: number;
  message: string;
  data?: unknown;
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

    const payload = (await response.json()) as CreateFoodResponse;

    if (payload.code !== 200) {
      return { error: payload.message || "Failed to add food.", success: false };
    }

    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}
