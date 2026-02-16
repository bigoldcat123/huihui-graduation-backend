import { cookies } from "next/headers";

import { FoodTrackChartsClient } from "@/app/(outter)/foodtrack/charts-client";
import type { ApiResponse } from "@/lib/api-response";

type LikedTagValue = {
  name: string;
  value: number;
};

async function getLikedTagValues(): Promise<LikedTagValue[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return [];
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${apiBaseUrl}/tag/liked-values`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<LikedTagValue[]>;
    if (payload.code !== 200 || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data.map((item) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }));
  } catch {
    return [];
  }
}

export async function FoodTrackChartsServer() {
  const pieData = await getLikedTagValues();
  return <FoodTrackChartsClient pieData={pieData} />;
}
