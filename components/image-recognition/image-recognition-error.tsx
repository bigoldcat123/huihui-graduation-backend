import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ImageRecognitionErrorProps = {
  message: string;
  retryHref: string;
};

export function ImageRecognitionError({ message, retryHref }: ImageRecognitionErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>加载失败</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>{message}</p>
        <Button asChild size="sm" variant="outline">
          <Link href={retryHref}>重试</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}