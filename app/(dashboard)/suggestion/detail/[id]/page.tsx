import { cookies } from "next/headers";

import { BackButton } from "@/components/back-button";
import { SuggestionReviewForm } from "@/components/suggestion/suggestion-review-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  renderSuggestionStatusIcon,
  renderSuggestionTypeIcon,
} from "@/lib/icons";
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

  if (!result.ok) {
    return (
      <div className="space-y-4">
        <BackButton />
        <Card>
          <CardHeader>
            <CardTitle>Suggestion Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const suggestion = result.data;

  return (
    <div className="space-y-4">
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-2xl">
            Suggestion #{suggestion.id}
            <Badge variant={getTypeBadgeVariant(suggestion.type)} className="inline-flex items-center gap-1.5">
              {renderSuggestionTypeIcon(suggestion.type)}
              {suggestion.type}
            </Badge>
            <Badge
              variant={getStatusBadgeVariant(suggestion.status)}
              className="inline-flex items-center gap-1.5"
            >
              {renderSuggestionStatusIcon(suggestion.status)}
              {suggestion.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Food" value={suggestion.food?.name ?? "-"} />
          <DetailRow label="Restaurant" value={suggestion.restaurant?.name ?? "-"} />
          <DetailRow label="Created At" value={suggestion.created_at} />
          <DetailRow label="Reviewed At" value={suggestion.reviewed_at ?? "-"} />
          <DetailRow label="Existing Review Comment" value={suggestion.review_comment ?? "-"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suggestion Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Content</p>
            <p className="text-sm">{suggestion.content || "-"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Images</p>
            {suggestion.images?.length ? (
              <div className="flex flex-wrap gap-2">
                {suggestion.images.map((image, index) => (
                  // Suggestion images come from backend/user content and can be remote.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${image}-${index}`}
                    src={resolveDisplayImageUrl(image)}
                    alt={`suggestion-${suggestion.id}-${index + 1}`}
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
            suggestionId={suggestion.id}
            status={suggestion.status}
            currentReviewComment={suggestion.review_comment}
          />
        </CardContent>
      </Card>
    </div>
  );
}
