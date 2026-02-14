"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { createFoodAction } from "@/app/(dashboard)/foods/actions";
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

type AddFoodDialogProps = {
  restaurants: RestaurantItem[];
  tags: FoodTag[];
  optionsError: string | null;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? "Adding..." : "Add Food"}
    </Button>
  );
}

export function AddFoodDialog({ restaurants, tags, optionsError }: AddFoodDialogProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(createFoodAction, {
    error: null,
    success: false,
  });

  const submitDisabled = useMemo(
    () => Boolean(optionsError) || restaurants.length === 0,
    [optionsError, restaurants.length],
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
        <Button>Add Food</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Food</DialogTitle>
          <DialogDescription>
            Fill in food details, choose a restaurant, and optionally assign tags.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant_id">Restaurant</Label>
            <select
              id="restaurant_id"
              name="restaurant_id"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              defaultValue=""
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
            <Label htmlFor="name">Food Name</Label>
            <Input id="name" name="name" placeholder="Spicy Chicken" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Hot and crispy."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://cdn.example.com/foods/spicy-chicken.jpg"
              required
            />
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
              <AlertTitle>Unable to load form options</AlertTitle>
              <AlertDescription>{optionsError}</AlertDescription>
            </Alert>
          ) : null}

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Add food failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>Food added</AlertTitle>
              <AlertDescription>
                Food was created successfully. The list has been refreshed.
              </AlertDescription>
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
