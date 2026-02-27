import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  ICON_CLASS_NAME,
  renderSuggestionStatusIcon,
  renderSuggestionTypeIcon,
} from "@/lib/icons";
import {
  getSuggestionStatusLabel,
  getSuggestionTypeLabel,
  type SuggestionItem,
} from "@/lib/suggestion";

type SuggestionTableProps = {
  suggestions: SuggestionItem[];
  detailBasePath?: string;
};

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const normalized = status.toUpperCase();
  if (normalized === "APPROVED") {
    return "default";
  }
  if (normalized === "REJECTED") {
    return "destructive";
  }
  if (normalized === "PENDING") {
    return "secondary";
  }
  return "outline";
}

function getTypeBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
  const normalized = type.toUpperCase();
  if (normalized.includes("ADD")) {
    return "default";
  }
  if (normalized.includes("UPDATE")) {
    return "secondary";
  }
  if (normalized.includes("DELETE")) {
    return "destructive";
  }
  return "outline";
}

export function SuggestionTable({ suggestions, detailBasePath = "/suggestion/detail" }: SuggestionTableProps) {
  if (!suggestions.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        当前页暂无建议数据。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>编号</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>菜品</TableHead>
            <TableHead>餐厅</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <TableRow key={suggestion.id}>
              <TableCell className="font-medium">{suggestion.id}</TableCell>
              <TableCell>
                <Badge
                  variant={getTypeBadgeVariant(suggestion.type)}
                  className="inline-flex items-center gap-1.5"
                >
                  {renderSuggestionTypeIcon(suggestion.type)}
                  {getSuggestionTypeLabel(suggestion.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(suggestion.status)}
                  className="inline-flex items-center gap-1.5"
                >
                  {renderSuggestionStatusIcon(suggestion.status)}
                  {getSuggestionStatusLabel(suggestion.status)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">{suggestion.content}</TableCell>
              <TableCell>{suggestion.food?.name ?? "-"}</TableCell>
              <TableCell>{suggestion.restaurant?.name ?? "-"}</TableCell>
              <TableCell>{suggestion.created_at}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={`${detailBasePath}/${suggestion.id}`}>
                    <Eye className={ICON_CLASS_NAME} aria-hidden="true" />
                    详情
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
