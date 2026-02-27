"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { updateRestaurantAction } from "@/app/(dashboard)/restaurants/actions";
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
import { ICON_CLASS_NAME, Pencil } from "@/lib/icons";
import type { RestaurantItem } from "@/lib/restaurant";

type EditRestaurantDialogProps = {
  restaurant: RestaurantItem;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Pencil className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "保存中..." : "保存修改"}
    </Button>
  );
}

export function EditRestaurantDialog({ restaurant }: EditRestaurantDialogProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(restaurant.image ?? "");
  const [state, formAction] = useActionState(updateRestaurantAction, {
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
        <Button size="sm" variant="outline">
          <Pencil className={ICON_CLASS_NAME} aria-hidden="true" />
          编辑
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>编辑餐厅</DialogTitle>
          <DialogDescription>更新餐厅名称、位置、描述与图片。</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={restaurant.id} />

          <div className="space-y-2">
            <Label htmlFor={`restaurant-name-${restaurant.id}`}>名称</Label>
            <Input
              id={`restaurant-name-${restaurant.id}`}
              name="name"
              defaultValue={restaurant.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-location-${restaurant.id}`}>位置</Label>
            <Input
              id={`restaurant-location-${restaurant.id}`}
              name="location"
              defaultValue={restaurant.location}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-description-${restaurant.id}`}>描述（可选）</Label>
            <Textarea
              id={`restaurant-description-${restaurant.id}`}
              name="description"
              defaultValue={restaurant.description ?? ""}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-image-upload-${restaurant.id}`}>图片</Label>
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
              <AlertTitle>更新失败</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>更新成功</AlertTitle>
              <AlertDescription>餐厅已成功更新，列表已刷新。</AlertDescription>
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
