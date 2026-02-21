"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  SUGGESTION_STATUS_OPTIONS,
  SUGGESTION_TYPE_OPTIONS,
  type SuggestionStatus,
  type SuggestionType,
} from "@/lib/suggestion";
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All Status</SelectItem>
          {SUGGESTION_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={suggestionType ?? ALL_VALUE}
        onValueChange={(value) => updateParam("suggestion_type", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All Type</SelectItem>
          {SUGGESTION_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
