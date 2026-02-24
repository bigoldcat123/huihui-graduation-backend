"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { updateFoodAction } from "@/app/(dashboard)/foods/actions";
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
import type { FoodItem, FoodTag, RestaurantItem } from "@/lib/food";
import { ICON_CLASS_NAME, Pencil } from "@/lib/icons";

type EditFoodDialogProps = {
  food: FoodItem;
  restaurants: RestaurantItem[];
  tags: FoodTag[];
  optionsError: string | null;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      <Pencil className={ICON_CLASS_NAME} aria-hidden="true" />
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function EditFoodDialog({ food, restaurants, tags, optionsError }: EditFoodDialogProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(food.image ?? "");
  const [state, formAction] = useActionState(updateFoodAction, {
    error: null,
    success: false,
  });
  const initialRestaurantId =
    food.restaurant_id ??
    restaurants.find((restaurant) => restaurant.name === food.restaurant_name)?.id;

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
        <Button size="sm" variant="outline">
          <Pencil className={ICON_CLASS_NAME} aria-hidden="true" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Food</DialogTitle>
          <DialogDescription>Update food fields, restaurant, image, and tags.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={food.id} />

          <div className="space-y-2">
            <Label htmlFor={`restaurant-${food.id}`}>Restaurant</Label>
            <select
              id={`restaurant-${food.id}`}
              name="restaurant_id"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              defaultValue={initialRestaurantId ? String(initialRestaurantId) : ""}
              required
            >
              <option value="" disabled>
                Select a restaurant
              </option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`food-name-${food.id}`}>Food Name</Label>
            <Input id={`food-name-${food.id}`} name="name" defaultValue={food.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`food-description-${food.id}`}>Description</Label>
            <Textarea
              id={`food-description-${food.id}`}
              name="description"
              defaultValue={food.description}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`food-price-${food.id}`}>Price</Label>
            <Input
              id={`food-price-${food.id}`}
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={String(food.price)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`food-image-${food.id}`}>Food Image</Label>
            <input type="hidden" name="image" value={imageUrl} />
            <FileUpload onUploadSuccess={setImageUrl} />
            {!imageUrl ? (
              <p className="text-sm text-muted-foreground">Select an image to upload.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Image uploaded and attached.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            {tags.length ? (
              <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={tag.id}
                      defaultChecked={food.tags.some((foodTag) => foodTag.id === tag.id)}
                      className="h-4 w-4 rounded border"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags available.</p>
            )}
          </div>

          {optionsError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load options</AlertTitle>
              <AlertDescription>{optionsError}</AlertDescription>
            </Alert>
          ) : null}

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>Food updated</AlertTitle>
              <AlertDescription>Food was updated successfully. The list has been refreshed.</AlertDescription>
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
