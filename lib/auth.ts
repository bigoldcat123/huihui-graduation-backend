import type { ApiResponse } from "@/lib/api-response";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  profile: string | null;
};

function resolveProfileUrl(rawProfile: string | null) {
  if (!rawProfile || !rawProfile.startsWith("/")) {
    return rawProfile;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return rawProfile;
  }

  try {
    return new URL(rawProfile, apiBaseUrl).toString();
  } catch {
    return rawProfile;
  }
}

export async function getCurrentUser(token?: string): Promise<AuthUser | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl || !token) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<AuthUser>;

    if (payload.code !== 200 || !payload.data) {
      return null;
    }

    return {
      ...payload.data,
      profile: resolveProfileUrl(payload.data.profile),
    };
  } catch {
    return null;
  }
}
