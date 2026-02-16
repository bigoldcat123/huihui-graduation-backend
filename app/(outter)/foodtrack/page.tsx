import { FoodTrackChartsServer } from "@/app/(outter)/foodtrack/charts-server";

type SearchParamValue = string | string[] | undefined;

type FoodTrackPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>;
};

function getFirstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function FoodTrackPage({ searchParams }: FoodTrackPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const token = getFirstValue(resolvedSearchParams.token);
  return <FoodTrackChartsServer token={token} />;
}
