import { cookies } from "next/headers";

import { ImageRecognitionError } from "@/components/image-recognition/image-recognition-error";
import { ImageRecognitionPagination } from "@/components/image-recognition/image-recognition-pagination";
import { ImageRecognitionTable } from "@/components/image-recognition/image-recognition-table";
import { getImageRecognitionList } from "@/lib/image-recognition";

type SearchParamValue = string | string[] | undefined;

type ImageRecognitionListSectionProps = {
  searchParams: Record<string, SearchParamValue>;
};

function getFirstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parsePositiveInt(value: SearchParamValue, fallback: number) {
  const parsed = Number.parseInt(getFirstValue(value) ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function toHref(page: number, pageSize: number) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return `/image-recognition?${query.toString()}`;
}

export async function ImageRecognitionListSection({
  searchParams,
}: ImageRecognitionListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getImageRecognitionList({
    token,
    page,
    pageSize,
  });

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">第 {page} 页 · 每页 {pageSize} 条</p>
        <ImageRecognitionError message={result.error} retryHref={toHref(page, pageSize)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        第 {page} 页 · 每页 {pageSize} 条
      </p>
      <ImageRecognitionTable items={result.data} />
      <ImageRecognitionPagination
        page={page}
        pageSize={pageSize}
        totalPages={result.total_pages}
      />
    </div>
  );
}