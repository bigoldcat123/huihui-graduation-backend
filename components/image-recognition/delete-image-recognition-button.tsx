"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { deleteImageRecognitionAction } from "@/app/(dashboard)/image-recognition/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ICON_CLASS_NAME, Trash2 } from "@/lib/icons";

type DeleteImageRecognitionButtonProps = {
  pointId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "删除中..." : "删除"}
    </Button>
  );
}

export function DeleteImageRecognitionButton({ pointId }: DeleteImageRecognitionButtonProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteImageRecognitionAction, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (!state.success) {
      return;
    }
    router.refresh();
  }, [router, state.success]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Trash2 className={ICON_CLASS_NAME} aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除这条图片识别记录吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="point_id" value={pointId} />
          {state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}