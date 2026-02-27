"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { reviewSuggestionAction } from "@/app/(dashboard)/suggestion/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ICON_CLASS_NAME, X } from "@/lib/icons";
import { getSuggestionStatusLabel } from "@/lib/suggestion";

type SuggestionReviewFormProps = {
  suggestionId: number;
  status: string;
  currentReviewComment: string | null;
};

function ReviewButtons({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" name="status" value="APPROVED" disabled={disabled || pending}>
        <Check className={ICON_CLASS_NAME} aria-hidden="true" />
        {pending ? "提交中..." : "通过"}
      </Button>
      <Button
        type="submit"
        name="status"
        value="REJECTED"
        variant="destructive"
        disabled={disabled || pending}
      >
        <X className={ICON_CLASS_NAME} aria-hidden="true" />
        {pending ? "提交中..." : "拒绝"}
      </Button>
    </div>
  );
}

export function SuggestionReviewForm({
  suggestionId,
  status,
  currentReviewComment,
}: SuggestionReviewFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(reviewSuggestionAction, {
    error: null,
    success: false,
  });

  const normalizedStatus = status.toUpperCase();
  const isPending = normalizedStatus === "PENDING";

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.refresh();
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="suggestion_id" value={suggestionId} />
      <div className="space-y-2">
        <Label htmlFor="review_comment">审核备注</Label>
        <Textarea
          id="review_comment"
          name="review_comment"
          defaultValue={currentReviewComment ?? ""}
          rows={4}
          placeholder="请输入审核备注"
          disabled={!isPending}
        />
      </div>

      {!isPending ? (
        <Alert>
          <AlertTitle>已审核</AlertTitle>
          <AlertDescription>
            当前建议状态为 {getSuggestionStatusLabel(normalizedStatus)}，不可重复审核。
          </AlertDescription>
        </Alert>
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>审核失败</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      {state.success ? (
        <Alert>
          <AlertTitle>提交成功</AlertTitle>
          <AlertDescription>建议状态已成功更新。</AlertDescription>
        </Alert>
      ) : null}

      <ReviewButtons disabled={!isPending} />
    </form>
  );
}
