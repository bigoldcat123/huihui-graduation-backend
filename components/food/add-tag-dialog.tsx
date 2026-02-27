"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createTagAction } from "@/app/(dashboard)/foods/actions";
import { FileUpload } from "@/components/file-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICON_CLASS_NAME, Tag } from "@/lib/icons";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Tag className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "添加中..." : "新增标签"}
    </Button>
  );
}

export function AddTagDialog() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [state, formAction] = useActionState(createTagAction, {
    error: null,
    success: false,
  });

  const submitDisabled = useMemo(() => imageUrl.trim().length === 0, [imageUrl]);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.refresh();
  }, [router, state.success]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tag className={ICON_CLASS_NAME} aria-hidden="true" />
          新增标签
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>新增标签</DialogTitle>
          <DialogDescription>创建标签并上传相对路径图片。</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">标签名称</Label>
            <Input id="tag-name" name="name" placeholder="微辣" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-image-upload">标签图片</Label>
            <input type="hidden" name="image" value={imageUrl} />
            <FileUpload onUploadSuccess={setImageUrl} />
            {!imageUrl ? (
              <p className="text-sm text-muted-foreground">请选择并上传图片。</p>
            ) : (
              <p className="text-sm text-muted-foreground">图片已上传并绑定。</p>
            )}
          </div>

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>新增标签失败</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>新增成功</AlertTitle>
              <AlertDescription>标签已成功创建，列表已刷新。</AlertDescription>
            </Alert>
          ) : null}

          <DialogFooter>
            <SubmitButton disabled={submitDisabled} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
