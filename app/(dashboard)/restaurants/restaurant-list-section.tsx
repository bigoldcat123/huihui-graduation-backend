import { cookies } from "next/headers";

import { AddRestaurantDialog } from "@/components/restaurant/add-restaurant-dialog";
import { RestaurantPagination } from "@/components/restaurant/restaurant-pagination";
import { RestaurantTable } from "@/components/restaurant/restaurant-table";
import { FoodError } from "@/components/food/food-error";
import { getRestaurantList } from "@/lib/restaurant";

type SearchParamValue = string | string[] | undefined;

type RestaurantListSectionProps = {
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
  return `/restaurants?${query.toString()}`;
}

export async function RestaurantListSection({ searchParams }: RestaurantListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getRestaurantList({
    token,
    page,
    pageSize,
  });

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">第 {page} 页 • 每页 {pageSize} 条</p>
      <AddRestaurantDialog />
    </div>
  );

  if (!result.ok) {
    return (
      <div className="space-y-4">
        {toolbar}
        <FoodError message={result.error} retryHref={toHref(page, pageSize)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toolbar}
      <RestaurantTable restaurants={result.data} />
      <RestaurantPagination
        page={page}
        pageSize={pageSize}
        hasPrev={page > 1}
        hasNext={result.data.length === pageSize}
      />
    </div>
  );
}
