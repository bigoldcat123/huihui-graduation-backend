"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/lib/api-response";

export type AddImageRecognitionFormState = {
  error: string | null;
  success: boolean;
};

export async function addImageRecognitionAction(
  _prevState: AddImageRecognitionFormState,
  formData: FormData,
): Promise<AddImageRecognitionFormState> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_IMAGE_API_BASE_URL;

  if (!apiBaseUrl) {
    return { error: "缺少 NEXT_PUBLIC_IMAGE_API_BASE_URL 配置。", success: false };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { error: "登录已失效，请重新登录。", success: false };
  }

  const foodName = String(formData.get("food_name") ?? "").trim();
  const calStr = String(formData.get("cal") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageFile = formData.get("image");

  if (!foodName) {
    return { error: "食物名称不能为空。", success: false };
  }

  const cal = Number.parseInt(calStr, 10);
  if (!Number.isFinite(cal) || cal < 0) {
    return { error: "请输入有效的卡路里值。", success: false };
  }

  if (!description) {
    return { error: "描述不能为空。", success: false };
  }

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { error: "请选择并上传图片。", success: false };
  }

  try {
    const body = new FormData();
    body.append("food_name", foodName);
    body.append("cal", String(cal));
    body.append("description", description);
    body.append("image", imageFile);

    const response = await fetch(`${apiBaseUrl}/image/insert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<unknown>;

    if (payload.code !== 200) {
      return { error: payload.message || "新增图片识别记录失败。", success: false };
    }

    revalidatePath("/image-recognition");
    return { error: null, success: true };
  } catch {
    return { error: "无法连接到服务器，请重试。", success: false };
  }
}