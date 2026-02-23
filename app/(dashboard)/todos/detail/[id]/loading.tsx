import { Skeleton } from "@/components/ui/skeleton";

export default function TodoDetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-16" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  );
}
