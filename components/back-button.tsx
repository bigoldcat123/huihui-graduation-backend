"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ICON_CLASS_NAME } from "@/lib/icons";

type BackButtonProps = {
  label?: string;
};

export function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft className={ICON_CLASS_NAME} aria-hidden="true" />
      {label}
    </Button>
  );
}
