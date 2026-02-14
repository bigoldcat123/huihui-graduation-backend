import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type FoodErrorProps = {
  message: string;
  retryHref: string;
};

export function FoodError({ message, retryHref }: FoodErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Failed to load foods</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>{message}</p>
        <Button asChild size="sm" variant="outline">
          <Link href={retryHref}>Retry</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
