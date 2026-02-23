import { Suspense } from "react";
import { cookies } from "next/headers";

import { BackButton } from "@/components/back-button";
import { NextStageButton } from "@/components/todo/next-stage-button";
import { TodoLogsViewer } from "@/components/todo/todo-logs-viewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { renderSuggestionStatusIcon, renderSuggestionTypeIcon } from "@/lib/icons";
import { getSuggestionDetail, type SuggestionStatus } from "@/lib/suggestion";

const TODO_STATUSES: SuggestionStatus[] = ["APPROVED", "PREPARING", "PROCESSING", "FINISHED"];

type TodoDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ status?: string | string[] }> | { status?: string | string[] };
};

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const normalized = status.toUpperCase();
  if (normalized === "APPROVED") {
    return "default";
  }
  if (normalized === "REJECTED") {
    return "destructive";
  }
  if (normalized === "PENDING") {
    return "secondary";
  }
  return "outline";
}

function getTypeBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  const normalized = type.toUpperCase();
  if (normalized.includes("ADD")) {
    return "default";
  }
  if (normalized.includes("UPDATE")) {
    return "secondary";
  }
  if (normalized.includes("DELETE")) {
    return "destructive";
  }
  return "outline";
}

function TodoLogsViewerFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Todo Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

function readStatusParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function TodoDetailPage({ params, searchParams }: TodoDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const suggestionId = Number.parseInt(resolvedParams.id, 10);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const detailResult = await getSuggestionDetail({ token, suggestionId });

  if (!detailResult.ok) {
    return (
      <div className="space-y-4">
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>Todo Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{detailResult.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const suggestion = detailResult.data;
  const selectedStatus = readStatusParam(resolvedSearchParams.status);
  const suspenseKey = `${suggestion.id}:${selectedStatus ?? ""}:${suggestion.status}`;

  return (
    <div className="space-y-4">
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-2xl">
            Todo #{suggestion.id}
            <Badge variant={getTypeBadgeVariant(suggestion.type)} className="inline-flex items-center gap-1.5">
              {renderSuggestionTypeIcon(suggestion.type)}
              {suggestion.type}
            </Badge>
            <Badge
              variant={getStatusBadgeVariant(suggestion.status)}
              className="inline-flex items-center gap-1.5"
            >
              {renderSuggestionStatusIcon(suggestion.status)}
              {suggestion.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-muted-foreground">Food:</span> {suggestion.food?.name ?? "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Restaurant:</span>{" "}
            {suggestion.restaurant?.name ?? "-"}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Created At:</span> {suggestion.created_at}
          </p>
          <p>
            <span className="font-medium text-muted-foreground">Reviewed At:</span>{" "}
            {suggestion.reviewed_at ?? "-"}
          </p>
            <NextStageButton suggestionId={suggestion.id} currentStatus={suggestion.status} />
        </CardContent>
      </Card>

      

      <Suspense key={suspenseKey} fallback={<TodoLogsViewerFallback />}>
        <TodoLogsViewer
          suggestionId={suggestion.id}
          currentStatus={suggestion.status}
          selectedStatus={selectedStatus}
          statuses={TODO_STATUSES}
        />
      </Suspense>
    </div>
  );
}
