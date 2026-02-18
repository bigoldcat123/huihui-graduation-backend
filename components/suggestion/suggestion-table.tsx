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
            <TableHead>Restaurant</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <TableRow key={suggestion.id}>
              <TableCell className="font-medium">{suggestion.id}</TableCell>
              <TableCell>{suggestion.type}</TableCell>
              <TableCell>{suggestion.status}</TableCell>
              <TableCell className="max-w-md truncate">{suggestion.content}</TableCell>
              <TableCell>{suggestion.restaurant?.name ?? "-"}</TableCell>
              <TableCell>{suggestion.user_id}</TableCell>
              <TableCell>{suggestion.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
