import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json<ApiResponse<string[]>>({
      code: 500,
      message: "Missing NEXT_PUBLIC_API_BASE_URL configuration.",
    });
  }

  try {
    const formData = await request.formData();

    const response = await fetch(`${apiBaseUrl}/upload`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<string[]>;
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json<ApiResponse<string[]>>({
      code: 500,
      message: "Unable to upload file.",
    });
  }
}
