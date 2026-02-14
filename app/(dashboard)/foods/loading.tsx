import { Skeleton } from "@/components/ui/skeleton";

export default function FoodsLoading() {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-40" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
