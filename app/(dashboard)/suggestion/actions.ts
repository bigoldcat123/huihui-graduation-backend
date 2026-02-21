"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import type { ApiResponse } from "@/lib/api-response";

export type ReviewSuggestionFormState = {
  error: string | null;
  success: boolean;
};

export async function reviewSuggestionAction(
  _prevState: ReviewSuggestionFormState,
  formData: FormData,
): Promise<ReviewSuggestionFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "Missing NEXT_PUBLIC_API_BASE_URL configuration.", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "Not authenticated. Please sign in again.", success: false };
  }

  const suggestionId = Number.parseInt(String(formData.get("suggestion_id") ?? ""), 10);
  const status = String(formData.get("status") ?? "").trim().toUpperCase();
  const reviewComment = String(formData.get("review_comment") ?? "").trim();

  if (!Number.isFinite(suggestionId) || suggestionId < 1) {
    return { error: "Invalid suggestion id.", success: false };
  }

  if (status !== "APPROVED" && status !== "REJECTED") {
    return { error: "Invalid review status.", success: false };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/suggestion/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        suggestion_id: suggestionId,
        status,
        review_comment: reviewComment,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<null>;

    if (payload.code !== 200) {
      return { error: payload.message || "Failed to submit review.", success: false };
    }

    revalidatePath("/suggestion");
    revalidatePath(`/suggestion/detail/${suggestionId}`);
    return { error: null, success: true };
  } catch {
    return { error: "Unable to reach the server. Please retry.", success: false };
  }
}
