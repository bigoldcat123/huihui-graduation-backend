"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { addImageRecognitionAction } from "@/app/(dashboard)/image-recognition/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { ICON_CLASS_NAME, Plus } from "@/lib/icons";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "添加中..." : "新增"}
    </Button>
  );
}

export function AddImageRecognitionDialog() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [state, formAction] = useActionState(addImageRecognitionAction, {
    error: null,
    success: false,
  });

  const submitDisabled = useMemo(() => !imageFile, [imageFile]);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.refresh();
  }, [router, state.success]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
          新增
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>新增图片识别记录</DialogTitle>
          <DialogDescription>上传图片并填写食物信息。</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food_name">食物名称</Label>
            <Input id="food_name" name="food_name" placeholder="香辣鸡排" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cal">卡路里</Label>
            <Input id="cal" name="cal" type="number" min="0" placeholder="500" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="外酥里嫩，微辣。"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">图片</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />
            {imageFile ? (
              <p className="text-sm text-muted-foreground">已选择: {imageFile.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">请选择图片文件。</p>
            )}
          </div>

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>新增失败</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>新增成功</AlertTitle>
              <AlertDescription>图片识别记录已创建，列表已刷新。</AlertDescription>
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