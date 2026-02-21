import { Suspense } from "react";

import { SuggestionListSection } from "@/app/(dashboard)/suggestion/suggestion-list-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SearchParamValue = string | string[] | undefined;

type SuggestionPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>;
};

function searchParamToValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function SuggestionListSectionFallback() {
  return (
    <div className="space-y-4">
      <p className="animate-pulse text-sm text-muted-foreground">Loading suggestions...</p>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export default async function SuggestionPage({ searchParams }: SuggestionPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const suspenseKey = `${searchParamToValue(resolvedSearchParams.page)}:${searchParamToValue(
    resolvedSearchParams.page_size,
  )}:${searchParamToValue(resolvedSearchParams.status)}:${searchParamToValue(
    resolvedSearchParams.suggestion_type,
  )}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense key={suspenseKey} fallback={<SuggestionListSectionFallback />}>
          <SuggestionListSection searchParams={resolvedSearchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
