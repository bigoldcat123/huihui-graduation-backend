import { FoodTrackChartsClient } from "@/app/(outter)/foodtrack/charts-client";
import type { ApiResponse } from "@/lib/api-response";

type LikedTagValue = {
  name: string;
  value: number;
};

async function getLikedTagValues(token?: string): Promise<LikedTagValue[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return [];
  }

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

type FoodTrackChartsServerProps = {
  token?: string;
};

export async function FoodTrackChartsServer({ token }: FoodTrackChartsServerProps) {
  const pieData = await getLikedTagValues(token);
  return <FoodTrackChartsClient pieData={pieData} />;
}
