import type { ApiResponse } from "@/lib/api-response";

export type ImageRecognitionItem = {
  id: string;
  cal: number;
  food_name: string;
  description: string;
  image_url: string;
};

export type PagingResponse = {
  page: number;
  total_pages: number;
  data: ImageRecognitionItem[];
};

export type GetImageRecognitionListResult =
  | { ok: true; data: ImageRecognitionItem[]; total_pages: number }
  | { ok: false; error: string };

type GetImageRecognitionListInput = {
  token?: string;
  page: number;
  pageSize: number;
};

function getApiBaseError() {
  return { ok: false as const, error: "缺少 NEXT_PUBLIC_API_BASE_URL 配置。" };
}

function getAuthError() {
  return { ok: false as const, error: "登录已失效，请重新登录。" };
}

export async function getImageRecognitionList({
  token,
  page,
  pageSize,
}: GetImageRecognitionListInput): Promise<GetImageRecognitionListResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_IMAGE_API_BASE_URL;

  if (!apiBaseUrl) {
    return getApiBaseError();
  }

  if (!token) {
    return getAuthError();
  }

  try {
    const response = await fetch(`${apiBaseUrl}/image/list/${page}/${pageSize}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<PagingResponse>;
    console.log(payload)

    if (payload.code !== 200) {
      return { ok: false, error: payload.message || "加载图片识别列表失败。" };
    }

    return {
      ok: true,
      data: Array.isArray(payload.data?.data) ? payload.data.data : [],
      total_pages: payload.data?.total_pages ?? 1,
    };
  } catch {
    return { ok: false, error: "无法连接到服务器，请重试。" };
  }
}