import { cookies } from "next/headers";

import { AddFoodDialog } from "@/components/food/add-food-dialog";
import { FoodError } from "@/components/food/food-error";
import { FoodPagination } from "@/components/food/food-pagination";
import { FoodTable } from "@/components/food/food-table";
import { getFoodList, getRestaurantList, getTagList } from "@/lib/food";

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

  const [result, tagsResult, restaurantsResult] = await Promise.all([
    getFoodList({
      token,
      page,
      pageSize,
    }),
    getTagList(),
    getRestaurantList(),
  ]);

  const subtitle = `Page ${page} • ${pageSize} per page`;
  const tags = tagsResult.ok ? tagsResult.data : [];
  const restaurants = restaurantsResult.ok ? restaurantsResult.data : [];
  const optionsError = [tagsResult, restaurantsResult]
    .filter((response) => !response.ok)
    .map((response) => response.error)
    .join(" ");

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <AddFoodDialog
        tags={tags}
        restaurants={restaurants}
        optionsError={optionsError ? optionsError : null}
      />
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
