import Link from "next/link";
import { cookies } from "next/headers";

import { SuggestionReviewForm } from "@/components/suggestion/suggestion-review-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSuggestionDetail } from "@/lib/suggestion";

type SuggestionDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b pb-3 last:border-b-0 md:grid-cols-[140px_1fr]">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export default async function SuggestionDetailPage({ params }: SuggestionDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const suggestionId = Number.parseInt(resolvedParams.id, 10);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  const result = await getSuggestionDetail({
    token,
    suggestionId,
  });

  return (
    <div className="space-y-4">
      <Button asChild variant="outline" size="sm">
        <Link href="/suggestion">Back</Link>
      </Button>

      {!result.ok ? (
        <Card>
          <CardHeader>
            <CardTitle>Suggestion Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-2xl">
                Suggestion #{result.data.id}
                <Badge variant={getTypeBadgeVariant(result.data.type)}>{result.data.type}</Badge>
                <Badge variant={getStatusBadgeVariant(result.data.status)}>{result.data.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow label="Food" value={result.data.food?.name ?? "-"} />
              <DetailRow label="Restaurant" value={result.data.restaurant?.name ?? "-"} />
              <DetailRow label="Created At" value={result.data.created_at} />
              <DetailRow label="Reviewed At" value={result.data.reviewed_at ?? "-"} />
              <DetailRow label="Existing Review Comment" value={result.data.review_comment ?? "-"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggestion Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Content</p>
                <p className="text-sm">{result.data.content || "-"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                {result.data.images?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {result.data.images.map((image, index) => (
                      // Suggestion images come from backend/user content and can be remote.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${image}-${index}`}
                        src={resolveDisplayImageUrl(image)}
                        alt={`suggestion-${result.data.id}-${index + 1}`}
                        width={72}
                        height={72}
                        className="h-[72px] w-[72px] rounded-md border object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">-</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
              <SuggestionReviewForm
                suggestionId={result.data.id}
                status={result.data.status}
                currentReviewComment={result.data.review_comment}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
