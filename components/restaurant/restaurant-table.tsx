import { EditRestaurantDialog } from "@/components/restaurant/edit-restaurant-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RestaurantItem } from "@/lib/restaurant";

type RestaurantTableProps = {
  restaurants: RestaurantItem[];
};

function resolveDisplayImageUrl(rawImage: string) {
  if (!rawImage.startsWith("/")) {
    return rawImage;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return rawImage;
  }

  try {
    return new URL(rawImage, apiBaseUrl).toString();
  } catch {
    return rawImage;
  }
}

export function RestaurantTable({ restaurants }: RestaurantTableProps) {
  if (!restaurants.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No restaurants found on this page.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant.id}>
              <TableCell className="font-medium">{restaurant.id}</TableCell>
              <TableCell>{restaurant.name}</TableCell>
              <TableCell>{restaurant.location}</TableCell>
              <TableCell className="max-w-md truncate">{restaurant.description ?? "-"}</TableCell>
              <TableCell>
                {restaurant.image ? (
                  // Restaurant images can come from arbitrary remote URLs controlled by backend data.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveDisplayImageUrl(restaurant.image)}
                    alt={restaurant.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <EditRestaurantDialog restaurant={restaurant} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
