"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { moveToNextTodoStageAction } from "@/app/(dashboard)/todos/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronRight, ICON_CLASS_NAME } from "@/lib/icons";

const MOVABLE_STATUSES = new Set(["APPROVED", "PREPARING", "PROCESSING"]);

type NextStageButtonProps = {
  suggestionId: number;
  currentStatus: string;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button size={'xs'} type="submit" disabled={disabled || pending}>
      <ChevronRight className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "推进中..." : "进入下一状态"}
    </Button>
  );
}

export function NextStageButton({ suggestionId, currentStatus }: NextStageButtonProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(moveToNextTodoStageAction, {
    error: null,
    success: false,
    nextStatus: null,
  });

  const normalizedStatus = useMemo(() => currentStatus.trim().toUpperCase(), [currentStatus]);
  const canMove = MOVABLE_STATUSES.has(normalizedStatus);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    const query = state.nextStatus ? `?status=${encodeURIComponent(state.nextStatus)}` : "";
    router.replace(`/todos/detail/${suggestionId}${query}`);
    router.refresh();
  }, [router, state.nextStatus, state.success, suggestionId]);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="suggestion_id" value={suggestionId} />
        <SubmitButton disabled={!canMove} />
      </form>

      {!canMove ? (
        <p className="text-xs text-muted-foreground">
          当前状态不可继续流转。
        </p>
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>流转失败</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
