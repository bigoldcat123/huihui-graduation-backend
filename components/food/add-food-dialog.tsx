"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createFoodAction } from "@/app/(dashboard)/foods/actions";
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
import type { FoodTag, RestaurantItem } from "@/lib/food";
import { ICON_CLASS_NAME, Plus } from "@/lib/icons";

type AddFoodDialogProps = {
  restaurants: RestaurantItem[];
  tags: FoodTag[];
  optionsError: string | null;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Plus className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "添加中..." : "新增菜品"}
    </Button>
  );
}

export function AddFoodDialog({ restaurants, tags, optionsError }: AddFoodDialogProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [state, formAction] = useActionState(createFoodAction, {
    error: null,
    success: false,
  });

  const submitDisabled = useMemo(
    () => Boolean(optionsError) || restaurants.length === 0 || imageUrl.trim().length === 0,
    [imageUrl, optionsError, restaurants.length],
  );

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
          新增菜品
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>新增菜品</DialogTitle>
          <DialogDescription>填写菜品信息，选择所属餐厅，并可选关联标签。</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant_id">所属餐厅</Label>
            <select
              id="restaurant_id"
              name="restaurant_id"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              defaultValue=""
              required
            >
              <option value="" disabled>
                请选择餐厅
              </option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">菜品名称</Label>
            <Input id="name" name="name" placeholder="香辣鸡排" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">菜品描述</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="外酥里嫩，微辣。"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">价格</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="12.50" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload">菜品图片</Label>
            <input type="hidden" name="image" value={imageUrl} />
            <FileUpload onUploadSuccess={setImageUrl} />
            {!imageUrl ? (
              <p className="text-sm text-muted-foreground">请选择并上传图片。</p>
            ) : (
              <p className="text-sm text-muted-foreground">图片已上传并绑定。</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>标签（可选）</Label>
            {tags.length ? (
              <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={tag.id}
                      className="h-4 w-4 rounded border"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">暂无可选标签。</p>
            )}
          </div>

          {optionsError ? (
            <Alert variant="destructive">
              <AlertTitle>表单选项加载失败</AlertTitle>
              <AlertDescription>{optionsError}</AlertDescription>
            </Alert>
          ) : null}

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>新增菜品失败</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>新增成功</AlertTitle>
              <AlertDescription>菜品已成功创建，列表已刷新。</AlertDescription>
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
