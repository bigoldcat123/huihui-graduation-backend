import Link from "next/link";

import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";
import { Button } from "@/components/ui/button";
import type { SuggestionStatus, SuggestionType } from "@/lib/suggestion";

type SuggestionPaginationProps = {
  page: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
  status?: SuggestionStatus;
  suggestionType?: SuggestionType;
};

function buildHref(
  page: number,
  pageSize: number,
  status?: SuggestionStatus,
  suggestionType?: SuggestionType,
) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (status) {
    params.set("status", status);
  }
  if (suggestionType) {
    params.set("suggestion_type", suggestionType);
  }
  return `/suggestion?${params.toString()}`;
}

export function SuggestionPagination({
  page,
  pageSize,
  hasPrev,
  hasNext,
  status,
  suggestionType,
}: SuggestionPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        Page {page} · {pageSize} items per page
      </div>
      <div className="flex items-center gap-2">
        <FoodPageSizeSelect pageSize={pageSize} />
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(Math.max(1, page - 1), pageSize, status, suggestionType)}
              prefetch={false}
            >
              Prev
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Prev
          </Button>
        )}
        {hasNext ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(page + 1, pageSize, status, suggestionType)} prefetch={false}>
              Next
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
