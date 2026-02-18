import type { ApiResponse } from "@/lib/api-response";

export type SuggestionItem = {
  id: number;
  content: string;
  images: string[] | null;
  type: string;
  status: string;
  food: {
    id: number;
    name: string;
  } | null;
  restaurant: {
    id: number;
    name: string;
    description: string;
    location: string;
    image: string | null;
  } | null;
  reviewer_id: number | null;
  review_comment: string | null;
  user_id: number;
  created_at: string;
  reviewed_at: string | null;
};

export type GetSuggestionListResult =
  | { ok: true; data: SuggestionItem[] }
  | { ok: false; error: string };

type GetSuggestionListInput = {
  token?: string;
  page: number;
  pageSize: number;
};

export async function getSuggestionList({
  token,
  page,
  pageSize,
}: GetSuggestionListInput): Promise<GetSuggestionListResult> {
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

    const response = await fetch(`${apiBaseUrl}/suggestion/list?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<SuggestionItem[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "Failed to load suggestions." };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}
