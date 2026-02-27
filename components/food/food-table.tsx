import { EditFoodDialog } from "@/components/food/edit-food-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FoodItem, FoodTag, RestaurantItem } from "@/lib/food";

type FoodTableProps = {
  foods: FoodItem[];
  restaurants: RestaurantItem[];
  tags: FoodTag[];
  optionsError: string | null;
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

export function FoodTable({ foods, restaurants, tags, optionsError }: FoodTableProps) {
  if (!foods.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        当前页暂无菜品数据。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>编号</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>餐厅</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>价格</TableHead>
            <TableHead>标签</TableHead>
            <TableHead>图片</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell className="font-medium">{food.id}</TableCell>
              <TableCell>{food.name}</TableCell>
              <TableCell>{food.restaurant_name}</TableCell>
              <TableCell className="max-w-md truncate">{food.description}</TableCell>
              <TableCell>{food.price.toFixed(2)}</TableCell>
              <TableCell>
                {food.tags?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {food.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {food.image ? (
                  // Food images can come from arbitrary remote URLs controlled by backend data.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveDisplayImageUrl(food.image)}
                    alt={food.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <EditFoodDialog
                  food={food}
                  restaurants={restaurants}
                  tags={tags}
                  optionsError={optionsError}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
