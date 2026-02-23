import { cookies } from "next/headers";

import { BackButton } from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderSuggestionStatusIcon, renderSuggestionTypeIcon } from "@/lib/icons";
import { getSuggestionDetail, getSuggestionTodoLog, type SuggestionStatus } from "@/lib/suggestion";

const TODO_STATUSES: SuggestionStatus[] = ["APPROVED", "PREPARING", "PROCESSING", "FINISHED"];

type TodoDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
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

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
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

  const logsByStatus = await Promise.all(
    TODO_STATUSES.map(async (status) => {
      const result = await getSuggestionTodoLog({
        token,
        suggestionId,
        status,
      });

      return {
        status,
        result,
      };
    }),
  );

  const suggestion = detailResult.data;

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
        </CardContent>
      </Card>

      {logsByStatus.map(({ status, result }) => {
        const isCurrentStatus = suggestion.status.toUpperCase() === status;

        return (
          <Card key={status} className={isCurrentStatus ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Badge
                  variant={getStatusBadgeVariant(status)}
                  className="inline-flex items-center gap-1.5"
                >
                  {renderSuggestionStatusIcon(status)}
                  {status}
                </Badge>
                {isCurrentStatus ? (
                  <span className="text-sm font-normal text-primary">Current Status</span>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!result.ok ? (
                <p className="text-sm text-destructive">{result.error}</p>
              ) : result.data.length ? (
                <div className="space-y-3">
                  {result.data.map((log, index) => (
                    <div key={`${status}-${index}`} className="rounded-md border p-3">
                      <p className="text-sm">{log.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{log.create_time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No logs for this status.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
