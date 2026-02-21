import Link from "next/link";

import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ICON_CLASS_NAME } from "@/lib/icons";

type RestaurantPaginationProps = {
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

  return `/restaurants?${params.toString()}`;
}

export function RestaurantPagination({
  page,
  pageSize,
  hasPrev,
  hasNext,
}: RestaurantPaginationProps) {
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
              <ChevronLeft className={ICON_CLASS_NAME} aria-hidden="true" />
              Prev
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className={ICON_CLASS_NAME} aria-hidden="true" />
            Prev
          </Button>
        )}
        {hasNext ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(page + 1, pageSize)} prefetch={false}>
              Next
              <ChevronRight className={ICON_CLASS_NAME} aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className={ICON_CLASS_NAME} aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
