import { cookies } from "next/headers";

import { FoodError } from "@/components/food/food-error";
import { SuggestionTable } from "@/components/suggestion/suggestion-table";
import { TodoPagination } from "@/components/todo/todo-pagination";
import { getSuggestionTodoList } from "@/lib/suggestion";

type SearchParamValue = string | string[] | undefined;

type TodoListSectionProps = {
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
  return `/todos?${query.toString()}`;
}

export async function TodoListSection({ searchParams }: TodoListSectionProps) {
  const page = parsePositiveInt(searchParams.page, 1);
  const parsedPageSize = parsePositiveInt(searchParams.page_size, 10);
  const pageSize = Math.min(100, Math.max(1, parsedPageSize));
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getSuggestionTodoList({
    token,
    page,
    pageSize,
  });

  const subtitle = `第 ${page} 页 • 每页 ${pageSize} 条`;

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <FoodError message={result.error} retryHref={toHref(page, pageSize)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <SuggestionTable suggestions={result.data} detailBasePath="/todos/detail" />
      <TodoPagination
        page={page}
        pageSize={pageSize}
        hasPrev={page > 1}
        hasNext={result.data.length === pageSize}
      />
    </div>
  );
}
