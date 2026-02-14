import { cookies } from "next/headers";

import { FoodError } from "@/components/food/food-error";
import { FoodPagination } from "@/components/food/food-pagination";
import { FoodTable } from "@/components/food/food-table";
import { getFoodList } from "@/lib/food";

type SearchParamValue = string | string[] | undefined;

type FoodListSectionProps = {
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
  return `/foods?${query.toString()}`;
}

export async function FoodListSection({ searchParams }: FoodListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getFoodList({
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
      <FoodTable foods={result.data} />
      <FoodPagination
        page={page}
        pageSize={pageSize}
        hasPrev={page > 1}
        hasNext={result.data.length === pageSize}
      />
    </div>
  );
}
