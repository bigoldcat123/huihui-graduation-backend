"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createRestaurantAction } from "@/app/(dashboard)/restaurants/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { ICON_CLASS_NAME, Plus } from "@/lib/icons";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "添加中..." : "新增餐厅"}
    </Button>
  );
}

export function AddRestaurantDialog() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [state, formAction] = useActionState(createRestaurantAction, {
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
        <Button>
          <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
          新增餐厅
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>新增餐厅</DialogTitle>
          <DialogDescription>填写餐厅名称、位置、可选描述并上传图片。</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">名称</Label>
            <Input id="restaurant-name" name="name" placeholder="落日面馆" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-location">位置</Label>
            <Input id="restaurant-location" name="location" placeholder="市中心" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-description">描述（可选）</Label>
            <Textarea id="restaurant-description" name="description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-image-upload">图片</Label>
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
              <AlertTitle>新增餐厅失败</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>新增成功</AlertTitle>
              <AlertDescription>餐厅已成功创建，列表已刷新。</AlertDescription>
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
