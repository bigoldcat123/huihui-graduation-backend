import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageIcon, ICON_CLASS_NAME } from "@/lib/icons";
import type { ImageRecognitionItem } from "@/lib/image-recognition";
import Image from "next/image";

type ImageRecognitionTableProps = {
  items: ImageRecognitionItem[];
};

function FoodNameCell({ food_name, image_url }: { food_name: string; image_url: string }) {
  return (
    <div className="flex items-center gap-2">
      {image_url ? (
        <Image
          src={image_url}
          alt={food_name}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          <ImageIcon className={ICON_CLASS_NAME} />
        </div>
      )}
      <span>{food_name}</span>
    </div>
  );
}

export function ImageRecognitionTable({ items }: ImageRecognitionTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        当前页暂无数据。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>菜品名称</TableHead>
            <TableHead>卡路里</TableHead>
            <TableHead>描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>
                <FoodNameCell food_name={item.food_name} image_url={item.image_url} />
              </TableCell>
              <TableCell>{item.cal}</TableCell>
              <TableCell className="max-w-md truncate">{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}