import { Suspense } from "react";

import { FoodListSection } from "@/app/(dashboard)/foods/food-list-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SearchParamValue = string | string[] | undefined;

type FoodsPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>;
};

function searchParamToValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function FoodListSectionFallback() {
  return (
    <div className="space-y-4">
      <p className="animate-pulse text-sm text-muted-foreground">Loading foods...</p>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const suspenseKey = `${searchParamToValue(resolvedSearchParams.page)}:${searchParamToValue(
    resolvedSearchParams.page_size,
  )}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Food Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense key={suspenseKey} fallback={<FoodListSectionFallback />}>
          <FoodListSection searchParams={resolvedSearchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
