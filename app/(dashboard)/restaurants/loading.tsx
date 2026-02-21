import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantsLoading() {
  return (
    <div className="space-y-4">
      <p className="animate-pulse text-sm text-muted-foreground">Loading restaurants...</p>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
