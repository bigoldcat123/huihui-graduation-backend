"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import type { ApiResponse } from "@/lib/api-response";

export type NextTodoStageFormState = {
  error: string | null;
  success: boolean;
  nextStatus: string | null;
};

export type AddTodoLogFormState = {
  error: string | null;
  success: boolean;
};

export async function moveToNextTodoStageAction(
  _prevState: NextTodoStageFormState,
  formData: FormData,
): Promise<NextTodoStageFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return {
      error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。",
      success: false,
      nextStatus: null,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false, nextStatus: null };
  }

  const suggestionId = Number.parseInt(String(formData.get("suggestion_id") ?? ""), 10);

  if (!Number.isFinite(suggestionId) || suggestionId < 1) {
    return { error: "建议 ID 无效。", success: false, nextStatus: null };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/suggestion/next_stage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        suggestion_id: suggestionId,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<string>;

    if (payload.code !== 200) {
      return {
        error: payload.message || "推进到下一状态失败。",
        success: false,
        nextStatus: null,
      };
    }

    const nextStatus = typeof payload.data === "string" ? payload.data.toUpperCase() : null;

    revalidatePath("/todos");
    revalidatePath(`/todos/detail/${suggestionId}`);

    return { error: null, success: true, nextStatus };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false, nextStatus: null };
  }
}

export async function addTodoLogAction(
  _prevState: AddTodoLogFormState,
  formData: FormData,
): Promise<AddTodoLogFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false };
  }

  const suggestionId = Number.parseInt(String(formData.get("suggestion_id") ?? ""), 10);
  const currentStatus = String(formData.get("current_status") ?? "").trim().toUpperCase();
  const logContent = String(formData.get("log_content") ?? "").trim();

  if (!Number.isFinite(suggestionId) || suggestionId < 1) {
    return { error: "建议 ID 无效。", success: false };
  }

  if (!currentStatus) {
    return { error: "当前状态无效。", success: false };
  }

  if (!logContent) {
    return { error: "日志内容不能为空。", success: false };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/suggestion/todo_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        suggestion_id: suggestionId,
        current_status: currentStatus,
        log_content: logContent,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<number>;

    if (payload.code !== 200) {
      return {
        error: payload.message || "新增待办日志失败。",
        success: false,
      };
    }

    revalidatePath("/todos");
    revalidatePath(`/todos/detail/${suggestionId}`);

    return { error: null, success: true };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false };
  }
}
