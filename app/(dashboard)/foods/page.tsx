import { cookies } from "next/headers";

import { FoodError } from "@/components/food/food-error";
import { FoodPagination } from "@/components/food/food-pagination";
import { FoodTable } from "@/components/food/food-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoodList } from "@/lib/food";

type SearchParamValue = string | string[] | undefined;

type FoodsPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>;
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

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const page = parsePositiveInt(resolvedSearchParams.page, 1);
  const parsedPageSize = parsePositiveInt(resolvedSearchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getFoodList({
    token,
    page,
    pageSize,
  });

  const headerSubtitle = `Page ${page} • ${pageSize} per page`;

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl">Food Management</CardTitle>
        <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.ok ? (
          <>
            <FoodTable foods={result.data} />
            <FoodPagination
              page={page}
              pageSize={pageSize}
              hasPrev={page > 1}
              hasNext={result.data.length === pageSize}
            />
          </>
        ) : (
          <FoodError message={result.error} retryHref={toHref(page, pageSize)} />
        )}
      </CardContent>
    </Card>
  );
}
