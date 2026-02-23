import type { ApiResponse } from "@/lib/api-response";

export const SUGGESTION_STATUS_OPTIONS = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PREPARING",
  "PROCESSING",
  "FINISHED",
] as const;

export const SUGGESTION_TYPE_OPTIONS = ["ADD_FOOD", "UPDATE_FOOD", "OTHER"] as const;

export type SuggestionStatus = (typeof SUGGESTION_STATUS_OPTIONS)[number];
export type SuggestionType = (typeof SUGGESTION_TYPE_OPTIONS)[number];

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

export type GetSuggestionTodoListResult =
  | { ok: true; data: SuggestionItem[] }
  | { ok: false; error: string };

export type GetSuggestionDetailResult =
  | { ok: true; data: SuggestionItem }
  | { ok: false; error: string };

type GetSuggestionListInput = {
  token?: string;
  page: number;
  pageSize: number;
  status?: SuggestionStatus;
  suggestionType?: SuggestionType;
};

type GetSuggestionDetailInput = {
  token?: string;
  suggestionId: number;
};

type GetSuggestionTodoListInput = {
  token?: string;
  page: number;
  pageSize: number;
};

function getApiBaseError() {
  return { ok: false as const, error: "Missing NEXT_PUBLIC_API_BASE_URL configuration." };
}

function getAuthError() {
  return { ok: false as const, error: "Not authenticated. Please sign in again." };
}

export async function getSuggestionList({
  token,
  page,
  pageSize,
  status,
  suggestionType,
}: GetSuggestionListInput): Promise<GetSuggestionListResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return getApiBaseError();
  }

  if (!token) {
    return getAuthError();
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status) {
      query.set("status", status);
    }
    if (suggestionType) {
      query.set("suggestion_type", suggestionType);
    }

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

export async function getSuggestionTodoList({
  token,
  page,
  pageSize,
}: GetSuggestionTodoListInput): Promise<GetSuggestionTodoListResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return getApiBaseError();
  }

  if (!token) {
    return getAuthError();
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    const response = await fetch(`${apiBaseUrl}/suggestion/list/todos?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<SuggestionItem[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "Failed to load todos." };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}

export async function getSuggestionDetail({
  token,
  suggestionId,
}: GetSuggestionDetailInput): Promise<GetSuggestionDetailResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return getApiBaseError();
  }

  if (!token) {
    return getAuthError();
  }

  if (!Number.isFinite(suggestionId) || suggestionId < 1) {
    return { ok: false, error: "Invalid suggestion id." };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/suggestion/${suggestionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<SuggestionItem>;

    if (payload.code !== 200 || !payload.data) {
      return { ok: false, error: payload.message || "Failed to load suggestion detail." };
    }

    return { ok: true, data: payload.data };
  } catch {
    return { ok: false, error: "Unable to reach the server. Please retry." };
  }
}
