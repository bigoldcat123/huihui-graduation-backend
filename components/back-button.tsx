"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type BackButtonProps = {
  label?: string;
};

export function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      {label}
    </Button>
  );
}
