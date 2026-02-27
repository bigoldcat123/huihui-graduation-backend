"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { addTodoLogAction } from "@/app/(dashboard)/todos/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICON_CLASS_NAME, Plus } from "@/lib/icons";
import { getSuggestionStatusLabel } from "@/lib/suggestion";

type AddTodoLogFormProps = {
  suggestionId: number;
  activeStatus: string;
  currentStatus: string;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" disabled={disabled || pending}>
      <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "提交中..." : "提交日志"}
    </Button>
  );
}

export function AddTodoLogForm({ suggestionId, activeStatus, currentStatus }: AddTodoLogFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(addTodoLogAction, {
    error: null,
    success: false,
  });

  const normalizedActiveStatus = activeStatus.trim().toUpperCase();
  const normalizedCurrentStatus = currentStatus.trim().toUpperCase();
  const canAdd = normalizedActiveStatus === normalizedCurrentStatus;

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.refresh();
  }, [router, state.success]);

  return (
    <div className="space-y-2">
      <Button type="button" size="sm" variant="outline" onClick={() => setIsOpen((value) => !value)}>
        <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
        新增日志
      </Button>

      {isOpen ? (
        <form action={formAction} className="space-y-2 rounded-md border p-3">
          <input type="hidden" name="suggestion_id" value={suggestionId} />
          <input type="hidden" name="current_status" value={normalizedActiveStatus} />
          <Input
            name="log_content"
            placeholder="请输入待办日志"
            required
            disabled={!canAdd}
          />

          {!canAdd ? (
            <p className="text-xs text-muted-foreground">
              仅可在当前状态（{getSuggestionStatusLabel(normalizedCurrentStatus)}）下新增日志。
            </p>
          ) : null}

          <div className="flex items-center gap-2">
            <SubmitButton disabled={!canAdd} />
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              取消
            </Button>
          </div>
        </form>
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>新增日志失败</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
