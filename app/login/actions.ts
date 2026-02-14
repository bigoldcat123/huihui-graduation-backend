"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginFormState = {
  error: string | null;
};

const INITIAL_STATE: LoginFormState = {
  error: null,
};

type RootLoginResponse = {
  code: number;
  message: string;
  data?: {
    token?: string;
  } | null;
};

export async function rootLoginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "Missing NEXT_PUBLIC_API_BASE_URL configuration." };
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
    

    const payload = (await response.json()) as RootLoginResponse;
    if (payload.code !== 200 || !payload.data?.token) {
      return { error: payload.message ?? "Login failed." };
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
    return { error: "Unable to reach the server." };
  }
  redirect("/");
  return INITIAL_STATE;
}
