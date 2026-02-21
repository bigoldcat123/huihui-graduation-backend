"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import type { ApiResponse } from "@/lib/api-response";

export type CreateRestaurantFormState = {
  error: string | null;
  success: boolean;
};

export type UpdateRestaurantFormState = {
  error: string | null;
  success: boolean;
};

export async function createRestaurantAction(
  _prevState: CreateRestaurantFormState,
  formData: FormData,
): Promise<CreateRestaurantFormState> {
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
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name || !location || !image) {
    return { error: "Name, location, and image are required.", success: false };
  }

  try {
    const payload: {
      name: string;
      description?: string;
      location: string;
      image: string;
    } = {
      name,
      location,
      image,
    };

    if (description) {
      payload.description = description;
    }

    const response = await fetch(`${apiBaseUrl}/restaurant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const apiResponse = (await response.json()) as ApiResponse<unknown>;

    if (apiResponse.code !== 200) {
      return { error: apiResponse.message || "Failed to add restaurant.", success: false };
    }

    revalidatePath("/restaurants");
    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}

export async function updateRestaurantAction(
  _prevState: UpdateRestaurantFormState,
  formData: FormData,
): Promise<UpdateRestaurantFormState> {
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
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!Number.isFinite(id) || id < 1) {
    return { error: "Invalid restaurant id.", success: false };
  }

  if (!name || !location || !image) {
    return { error: "Name, location, and image are required.", success: false };
  }

  try {
    const payload: {
      id: number;
      name: string;
      description?: string;
      location: string;
      image: string;
    } = {
      id,
      name,
      location,
      image,
    };

    if (description) {
      payload.description = description;
    }

    const response = await fetch(`${apiBaseUrl}/restaurant/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const apiResponse = (await response.json()) as ApiResponse<unknown>;

    if (apiResponse.code !== 200) {
      return { error: apiResponse.message || "Failed to update restaurant.", success: false };
    }

    revalidatePath("/restaurants");
    revalidatePath("/foods");
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}
