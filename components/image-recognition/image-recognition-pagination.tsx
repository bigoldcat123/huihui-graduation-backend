import Link from "next/link";

import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ICON_CLASS_NAME } from "@/lib/icons";

type ImageRecognitionPaginationProps = {
  page: number;
  pageSize: number;
  totalPages: number;
};

function buildHref(page: number, pageSize: number) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return `/image-recognition?${params.toString()}`;
}

export function ImageRecognitionPagination({
  page,
  pageSize,
  totalPages,
}: ImageRecognitionPaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        第 {page} 页 · 每页 {pageSize} 条 · 共 {totalPages} 页
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