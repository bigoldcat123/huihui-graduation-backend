"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type FoodPageSizeSelectProps = {
  pageSize: number;
};

export function FoodPageSizeSelect({ pageSize }: FoodPageSizeSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onPageSizeChange = (value: string) => {
    const nextSize = Number(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("page_size", String(nextSize));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="每页条数" />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size} 条/页
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
