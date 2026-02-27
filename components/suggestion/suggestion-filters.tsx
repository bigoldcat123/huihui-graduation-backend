"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  SUGGESTION_STATUS_OPTIONS,
  SUGGESTION_TYPE_OPTIONS,
  getSuggestionStatusLabel,
  getSuggestionTypeLabel,
  type SuggestionStatus,
  type SuggestionType,
} from "@/lib/suggestion";
import { ICON_CLASS_NAME, ListFilter, Shapes } from "@/lib/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "__ALL__";

type SuggestionFiltersProps = {
  status?: SuggestionStatus;
  suggestionType?: SuggestionType;
};

export function SuggestionFilters({ status, suggestionType }: SuggestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (name: "status" | "suggestion_type", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value === ALL_VALUE) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status ?? ALL_VALUE} onValueChange={(value) => updateParam("status", value)}>
        <SelectTrigger className="w-[180px] gap-2">
          <ListFilter className={ICON_CLASS_NAME} aria-hidden="true" />
          <SelectValue placeholder="按状态筛选" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>全部状态</SelectItem>
          {SUGGESTION_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {getSuggestionStatusLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={suggestionType ?? ALL_VALUE}
        onValueChange={(value) => updateParam("suggestion_type", value)}
      >
        <SelectTrigger className="w-[180px] gap-2">
          <Shapes className={ICON_CLASS_NAME} aria-hidden="true" />
          <SelectValue placeholder="按类型筛选" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>全部类型</SelectItem>
          {SUGGESTION_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {getSuggestionTypeLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
