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

const SUGGESTION_STATUS_LABELS: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
  PREPARING: "备料中",
  PROCESSING: "制作中",
  FINISHED: "已完成",
};

const SUGGESTION_TYPE_LABELS: Record<string, string> = {
  ADD_FOOD: "新增菜品",
  UPDATE_FOOD: "更新菜品",
  OTHER: "其他",
};

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

export type SuggestionTodoLogItem = {
  content: string;
  create_time: string;
};

export type GetSuggestionTodoLogResult =
  | { ok: true; data: SuggestionTodoLogItem[] }
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

type GetSuggestionTodoLogInput = {
  token?: string;
  suggestionId: number;
  status: string;
};

function getApiBaseError() {
  return { ok: false as const, error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。" };
}

function getAuthError() {
  return { ok: false as const, error: "登录已失效，请重新登录。" };
}

export function getSuggestionStatusLabel(status: string) {
  const normalized = status.trim().toUpperCase();
  return SUGGESTION_STATUS_LABELS[normalized] ?? status;
}

export function getSuggestionTypeLabel(type: string) {
  const normalized = type.trim().toUpperCase();
  return SUGGESTION_TYPE_LABELS[normalized] ?? type;
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
      return { ok: false, error: payload.message || "加载建议列表失败。" };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
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
      return { ok: false, error: payload.message || "加载待办列表失败。" };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
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
    return { ok: false, error: "建议 ID 无效。" };
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
      return { ok: false, error: payload.message || "加载建议详情失败。" };
    }

    return { ok: true, data: payload.data };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
  }
}

export async function getSuggestionTodoLog({
  token,
  suggestionId,
  status,
}: GetSuggestionTodoLogInput): Promise<GetSuggestionTodoLogResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return getApiBaseError();
  }

  if (!token) {
    return getAuthError();
  }

  if (!Number.isFinite(suggestionId) || suggestionId < 1) {
    return { ok: false, error: "建议 ID 无效。" };
  }

  const normalizedStatus = status.trim().toUpperCase();
  if (!normalizedStatus) {
    return { ok: false, error: "建议状态无效。" };
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/suggestion/todo_log/${suggestionId}/${encodeURIComponent(normalizedStatus)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'force-cache',
      },
    );

    const payload = (await response.json()) as ApiResponse<SuggestionTodoLogItem[]>;

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "加载待办日志失败。" };
    }

    return { ok: true, data: Array.isArray(payload.data) ? payload.data : [] };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
  }
}
