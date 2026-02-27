import Link from "next/link";

import { FoodPageSizeSelect } from "@/components/food/food-page-size-select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ICON_CLASS_NAME } from "@/lib/icons";
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
        第 {page} 页 · 每页 {pageSize} 条
      </div>
      <div className="flex items-center gap-2">
        <FoodPageSizeSelect pageSize={pageSize} />
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(Math.max(1, page - 1), pageSize, status, suggestionType)}
              prefetch={false}
            >
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
            <Link href={buildHref(page + 1, pageSize, status, suggestionType)} prefetch={false}>
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
