import { cookies } from "next/headers";

import { FoodError } from "@/components/food/food-error";
import { SuggestionPagination } from "@/components/suggestion/suggestion-pagination";
import { SuggestionTable } from "@/components/suggestion/suggestion-table";
import { getSuggestionList } from "@/lib/suggestion";

type SearchParamValue = string | string[] | undefined;

type SuggestionListSectionProps = {
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
  return `/suggestion?${query.toString()}`;
}

export async function SuggestionListSection({ searchParams }: SuggestionListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getSuggestionList({
    token,
    page,
    pageSize,
  });

  const subtitle = `Page ${page} • ${pageSize} per page`;

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <FoodError message={result.error} retryHref={toHref(page, pageSize)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <SuggestionTable suggestions={result.data} />
      <SuggestionPagination
        page={page}
        pageSize={pageSize}
        hasPrev={page > 1}
        hasNext={result.data.length === pageSize}
      />
    </div>
  );
}
