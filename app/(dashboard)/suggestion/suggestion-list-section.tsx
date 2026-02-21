import { cookies } from "next/headers";

import { FoodError } from "@/components/food/food-error";
import { SuggestionFilters } from "@/components/suggestion/suggestion-filters";
import { SuggestionPagination } from "@/components/suggestion/suggestion-pagination";
import { SuggestionTable } from "@/components/suggestion/suggestion-table";
import {
  getSuggestionList,
  SUGGESTION_STATUS_OPTIONS,
  SUGGESTION_TYPE_OPTIONS,
  type SuggestionStatus,
  type SuggestionType,
} from "@/lib/suggestion";

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

function parseEnumParam<T extends string>(
  value: SearchParamValue,
  options: readonly T[],
): T | undefined {
  const raw = getFirstValue(value);
  if (!raw) {
    return undefined;
  }

  const normalized = raw.trim().toUpperCase();
  const found = options.find((option) => option === normalized);
  return found;
}

function toHref(
  page: number,
  pageSize: number,
  status?: SuggestionStatus,
  suggestionType?: SuggestionType,
) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (status) {
    query.set("status", status);
  }
  if (suggestionType) {
    query.set("suggestion_type", suggestionType);
  }
  return `/suggestion?${query.toString()}`;
}

export async function SuggestionListSection({ searchParams }: SuggestionListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const status = parseEnumParam(searchParams.status, SUGGESTION_STATUS_OPTIONS);
  const suggestionType = parseEnumParam(searchParams.suggestion_type, SUGGESTION_TYPE_OPTIONS);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getSuggestionList({
    token,
    page,
    pageSize,
    status,
    suggestionType,
  });

  const subtitle = `Page ${page} • ${pageSize} per page`;

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <SuggestionFilters status={status} suggestionType={suggestionType} />
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <FoodError
          message={result.error}
          retryHref={toHref(page, pageSize, status, suggestionType)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SuggestionFilters status={status} suggestionType={suggestionType} />
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <SuggestionTable suggestions={result.data} />
      <SuggestionPagination
        page={page}
        pageSize={pageSize}
        hasPrev={page > 1}
        hasNext={result.data.length === pageSize}
        status={status}
        suggestionType={suggestionType}
      />
    </div>
  );
}
