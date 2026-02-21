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
      {pending ? "Saving..." : "Save Changes"}
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
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
          <DialogDescription>Update restaurant name, location, description, and image.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={restaurant.id} />

          <div className="space-y-2">
            <Label htmlFor={`restaurant-name-${restaurant.id}`}>Name</Label>
            <Input
              id={`restaurant-name-${restaurant.id}`}
              name="name"
              defaultValue={restaurant.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-location-${restaurant.id}`}>Location</Label>
            <Input
              id={`restaurant-location-${restaurant.id}`}
              name="location"
              defaultValue={restaurant.location}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-description-${restaurant.id}`}>Description (optional)</Label>
            <Textarea
              id={`restaurant-description-${restaurant.id}`}
              name="description"
              defaultValue={restaurant.description ?? ""}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restaurant-image-upload-${restaurant.id}`}>Image</Label>
            <input type="hidden" name="image" value={imageUrl} />
            <FileUpload onUploadSuccess={setImageUrl} />
            {!imageUrl ? (
              <p className="text-sm text-muted-foreground">Select an image to upload.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Image uploaded and attached.</p>
            )}
          </div>

          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>Restaurant updated</AlertTitle>
              <AlertDescription>Restaurant was updated successfully. The list has been refreshed.</AlertDescription>
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
