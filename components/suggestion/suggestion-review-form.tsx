"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { reviewSuggestionAction } from "@/app/(dashboard)/suggestion/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        {pending ? "Submitting..." : "Accept"}
      </Button>
      <Button
        type="submit"
        name="status"
        value="REJECTED"
        variant="destructive"
        disabled={disabled || pending}
      >
        {pending ? "Submitting..." : "Reject"}
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
        <Label htmlFor="review_comment">Review Comment</Label>
        <Textarea
          id="review_comment"
          name="review_comment"
          defaultValue={currentReviewComment ?? ""}
          rows={4}
          placeholder="Write your review comment"
          disabled={!isPending}
        />
      </div>

      {!isPending ? (
        <Alert>
          <AlertTitle>Already reviewed</AlertTitle>
          <AlertDescription>This suggestion is {normalizedStatus}. You cannot review it again.</AlertDescription>
        </Alert>
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Review failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      {state.success ? (
        <Alert>
          <AlertTitle>Review submitted</AlertTitle>
          <AlertDescription>Suggestion status was updated successfully.</AlertDescription>
        </Alert>
      ) : null}

      <ReviewButtons disabled={!isPending} />
    </form>
  );
}
