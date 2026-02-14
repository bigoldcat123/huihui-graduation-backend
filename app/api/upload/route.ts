import { NextResponse } from "next/server";

type UploadResponse = {
  code: number;
  message: string;
  data?: string[];
};

export async function POST(request: Request) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json<UploadResponse>({
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

    const payload = (await response.json()) as UploadResponse;
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json<UploadResponse>({
      code: 500,
      message: "Unable to upload file.",
    });
  }
}
