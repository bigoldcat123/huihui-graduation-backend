import Link from "next/link";
import { cookies } from "next/headers";

import { AddTodoLogForm } from "@/components/todo/add-todo-log-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderSuggestionStatusIcon } from "@/lib/icons";
import { getSuggestionTodoLog, type SuggestionStatus } from "@/lib/suggestion";

type TodoLogsViewerProps = {
  suggestionId: number;
  currentStatus: string;
  selectedStatus?: string;
  statuses: SuggestionStatus[];
};

function normalizeStatus(status?: string) {
  return status?.trim().toUpperCase() ?? "";
}

export async function TodoLogsViewer({
  suggestionId,
  currentStatus,
  selectedStatus,
  statuses,
}: TodoLogsViewerProps) {
  const normalizedCurrentStatus = normalizeStatus(currentStatus);
  const currentIndex = statuses.indexOf(normalizedCurrentStatus as SuggestionStatus);

  const clickableStatuses = statuses.filter((status, index) => {
    if (currentIndex < 0) {
      return status === normalizedCurrentStatus;
    }
    return index <= currentIndex;
  });

  const normalizedSelectedStatus = normalizeStatus(selectedStatus);
  const activeStatus =
    clickableStatuses.find((status) => status === normalizedSelectedStatus) ??
    (clickableStatuses.at(-1) ?? statuses[0]);

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const logsResult = await getSuggestionTodoLog({
    token,
    suggestionId,
    status: activeStatus,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Todo Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((status, index) => {
            const clickable = currentIndex < 0 ? status === normalizedCurrentStatus : index <= currentIndex;
            const isActive = status === activeStatus;
            const href = `/todos/detail/${suggestionId}?status=${status}`;

            if (!clickable) {
              return (
                <Button key={status} type="button" size="sm" variant="outline" disabled>
                  {renderSuggestionStatusIcon(status)}
                  {status}
                </Button>
              );
            }

            return (
              <Button key={status} asChild size="sm" variant={isActive ? "default" : "outline"}>
                <Link href={href} prefetch={false} replace>
                  {renderSuggestionStatusIcon(status)}
                  {status}
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{activeStatus}</p>
            {activeStatus === normalizedCurrentStatus ? (
              <span className="text-xs text-primary">Current Status</span>
            ) : null}
          </div>

          {!logsResult.ok ? (
            <p className="text-sm text-destructive">{logsResult.error}</p>
          ) : logsResult.data.length ? (
            <div className="space-y-3">
              {logsResult.data.map((log, index) => (
                <div key={`${activeStatus}-${index}`} className="rounded-md border p-3">
                  <p className="text-sm">{log.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{log.create_time}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No logs for this status.</p>
          )}
        </div>

        <AddTodoLogForm
          suggestionId={suggestionId}
          activeStatus={activeStatus}
          currentStatus={normalizedCurrentStatus}
        />
      </CardContent>
    </Card>
  );
}
