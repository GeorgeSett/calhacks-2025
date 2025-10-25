export function CampaignCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border">
      {/* Image skeleton */}
      <div className="relative h-48 bg-bg animate-pulse">
        <div className="absolute top-3 right-3 w-20 h-6 rounded-full bg-border" />
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-7 bg-border rounded mb-2 animate-pulse w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-border rounded animate-pulse w-full" />
          <div className="h-4 bg-border rounded animate-pulse w-5/6" />
        </div>

        {/* Progress bar skeleton */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-border rounded animate-pulse w-24" />
            <div className="h-4 bg-border rounded animate-pulse w-28" />
          </div>
          <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
            <div className="h-full w-0 bg-border" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="flex justify-between">
          <div className="h-4 bg-border rounded animate-pulse w-20" />
          <div className="h-4 bg-border rounded animate-pulse w-24" />
        </div>

        {/* Creator skeleton */}
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-border animate-pulse" />
          <div className="h-3 bg-border rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}
