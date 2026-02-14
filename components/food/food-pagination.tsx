import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";

type FoodPaginationProps = {
  page: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
};

function buildHref(page: number, pageSize: number) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return `/foods?${params.toString()}`;
}

export function FoodPagination({
  page,
  pageSize,
  hasPrev,
  hasNext,
}: FoodPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        Page {page} · {pageSize} items per page
      </div>
      <div className="flex items-center gap-2">
        <FoodPageSizeSelect pageSize={pageSize} />
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(Math.max(1, page - 1), pageSize)} prefetch={false}>
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
            <Link href={buildHref(page + 1, pageSize)} prefetch={false}>
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
