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
      {pending ? "Adding..." : "Add Restaurant"}
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
          Add Restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
          <DialogDescription>Create a restaurant with name, location, optional description, and image.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">Name</Label>
            <Input id="restaurant-name" name="name" placeholder="Sunset Noodle House" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-location">Location</Label>
            <Input id="restaurant-location" name="location" placeholder="Downtown" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-description">Description (optional)</Label>
            <Textarea id="restaurant-description" name="description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant-image-upload">Image</Label>
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
              <AlertTitle>Add restaurant failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>Restaurant added</AlertTitle>
              <AlertDescription>Restaurant was created successfully. The list has been refreshed.</AlertDescription>
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
