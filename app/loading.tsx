import { CardSkeletonGrid, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-11 w-72" />
      <CardSkeletonGrid />
    </div>
  );
}
