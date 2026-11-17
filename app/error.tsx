"use client";

import { ErrorState } from "@/components/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState message="Something went wrong while loading this page." onRetry={reset} />;
}
