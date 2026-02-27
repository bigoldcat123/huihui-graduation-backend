import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";
import { ChevronLeft, ChevronRight, ICON_CLASS_NAME } from "@/lib/icons";

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
        第 {page} 页 · 每页 {pageSize} 条
      </div>
      <div className="flex items-center gap-2">
        <FoodPageSizeSelect pageSize={pageSize} />
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(Math.max(1, page - 1), pageSize)} prefetch={false}>
              <ChevronLeft className={ICON_CLASS_NAME} aria-hidden="true" />
              上一页
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className={ICON_CLASS_NAME} aria-hidden="true" />
            上一页
          </Button>
        )}
        {hasNext ? (
          <Button asChild variant="outline" size="sm">
            <Link href={buildHref(page + 1, pageSize)} prefetch={false}>
              下一页
              <ChevronRight className={ICON_CLASS_NAME} aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            下一页
            <ChevronRight className={ICON_CLASS_NAME} aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
