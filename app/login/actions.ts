"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiResponse } from "@/lib/api-response";

export type LoginFormState = {
  error: string | null;
};

const INITIAL_STATE: LoginFormState = {
  error: null,
};

export async function rootLoginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "用户名和密码不能为空。" };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。" };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login/root`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      cache: "no-store",
    });
    

    const payload = (await response.json()) as ApiResponse<{ token?: string }>;
    if (payload.code !== 200 || !payload.data?.token) {
      return { error: payload.message ?? "登录失败。" };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_token", payload.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch {
    return { error: "无法连接到服务器。" };
  }
  redirect("/");
  return INITIAL_STATE;
}
