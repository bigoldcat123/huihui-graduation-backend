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
import type { SuggestionItem } from "@/lib/suggestion";

type SuggestionTableProps = {
  suggestions: SuggestionItem[];
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

export function SuggestionTable({ suggestions }: SuggestionTableProps) {
  if (!suggestions.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No suggestions found on this page.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Food</TableHead>
            <TableHead>Restaurant</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <TableRow key={suggestion.id}>
              <TableCell className="font-medium">{suggestion.id}</TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(suggestion.type)}>{suggestion.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(suggestion.status)}>{suggestion.status}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">{suggestion.content}</TableCell>
              <TableCell>{suggestion.food?.name ?? "-"}</TableCell>
              <TableCell>{suggestion.restaurant?.name ?? "-"}</TableCell>
              <TableCell>{suggestion.created_at}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/suggestion/detail/${suggestion.id}`}>Detail</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
