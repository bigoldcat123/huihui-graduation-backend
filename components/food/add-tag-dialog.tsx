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
      {pending ? "Adding..." : "Add Tag"}
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
          Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
          <DialogDescription>Create a tag with an uploaded relative image URL.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Tag Name</Label>
            <Input id="tag-name" name="name" placeholder="Spicy" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-image-upload">Tag Image</Label>
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
              <AlertTitle>Add tag failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          {state.success ? (
            <Alert>
              <AlertTitle>Tag added</AlertTitle>
              <AlertDescription>Tag was created successfully. The list has been refreshed.</AlertDescription>
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
