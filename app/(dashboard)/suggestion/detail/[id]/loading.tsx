import { Skeleton } from "@/components/ui/skeleton";

export default function SuggestionDetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-16" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}
