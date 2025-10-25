export function CampaignPageSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button skeleton */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="h-5 w-32 bg-border rounded animate-pulse" />
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            {/* Hero image skeleton */}
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8 bg-border animate-pulse">
              <div className="absolute top-4 left-4 w-24 h-8 rounded-full bg-bg" />
            </div>

            {/* Title and creator skeleton */}
            <div className="mb-8">
              <div className="h-10 bg-border rounded animate-pulse w-3/4 mb-4" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-border animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 bg-border rounded animate-pulse w-20 mb-2" />
                  <div className="h-4 bg-border rounded animate-pulse w-32" />
                </div>
              </div>
            </div>

            {/* Campaign stats - Mobile skeleton */}
            <div className="lg:hidden mb-8 p-6 bg-surface rounded-xl border border-border">
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <div className="h-8 bg-border rounded animate-pulse w-32" />
                  <div className="h-4 bg-border rounded animate-pulse w-24" />
                </div>
                <div className="w-full h-3 bg-bg rounded-full overflow-hidden mb-4">
                  <div className="h-full w-0 bg-border" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="h-8 bg-border rounded animate-pulse w-16 mx-auto mb-1" />
                    <div className="h-4 bg-border rounded animate-pulse w-12 mx-auto" />
                  </div>
                  <div>
                    <div className="h-8 bg-border rounded animate-pulse w-16 mx-auto mb-1" />
                    <div className="h-4 bg-border rounded animate-pulse w-16 mx-auto" />
                  </div>
                </div>
              </div>

              {/* Backing section skeleton for mobile */}
              <div className="border-t border-border pt-6">
                <div className="h-5 bg-border rounded animate-pulse w-32 mb-4" />

                {/* Quick amounts skeleton */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-bg rounded-lg border border-border animate-pulse"
                    />
                  ))}
                </div>

                {/* Custom amount skeleton */}
                <div className="mb-4">
                  <div className="h-4 bg-border rounded animate-pulse w-36 mb-2" />
                  <div className="h-12 bg-bg border border-border rounded-lg animate-pulse" />
                </div>

                <div className="h-12 bg-border rounded-lg animate-pulse mb-4" />
                <div className="h-3 bg-border rounded animate-pulse w-3/4 mx-auto" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mb-12">
              <div className="h-7 bg-border rounded animate-pulse w-48 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-border rounded animate-pulse w-full" />
                <div className="h-4 bg-border rounded animate-pulse w-full" />
                <div className="h-4 bg-border rounded animate-pulse w-5/6" />
                <div className="h-4 bg-border rounded animate-pulse w-full" />
                <div className="h-4 bg-border rounded animate-pulse w-4/5" />
              </div>
            </div>

            {/* Recent backers skeleton */}
            <div>
              <div className="h-7 bg-border rounded animate-pulse w-40 mb-6" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-border animate-pulse" />
                      <div>
                        <div className="h-4 bg-border rounded animate-pulse w-24 mb-2" />
                        <div className="h-3 bg-border rounded animate-pulse w-20" />
                      </div>
                    </div>
                    <div className="h-5 bg-border rounded animate-pulse w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Funding stats - Desktop skeleton */}
              <div className="hidden lg:block p-6 bg-surface rounded-xl border border-border mb-6">
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="h-8 bg-border rounded animate-pulse w-32" />
                  </div>
                  <div className="h-4 bg-border rounded animate-pulse w-28 mb-4" />
                  <div className="w-full h-3 bg-bg rounded-full overflow-hidden mb-6">
                    <div className="h-full w-0 bg-border" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <div className="h-8 bg-border rounded animate-pulse w-12 mx-auto mb-1" />
                      <div className="h-4 bg-border rounded animate-pulse w-12 mx-auto" />
                    </div>
                    <div>
                      <div className="h-8 bg-border rounded animate-pulse w-12 mx-auto mb-1" />
                      <div className="h-4 bg-border rounded animate-pulse w-16 mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Backing section skeleton */}
                <div className="border-t border-border pt-6">
                  <div className="h-5 bg-border rounded animate-pulse w-32 mb-4" />

                  {/* Quick amounts skeleton */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-bg rounded-lg border border-border animate-pulse"
                      />
                    ))}
                  </div>

                  {/* Custom amount skeleton */}
                  <div className="mb-4">
                    <div className="h-4 bg-border rounded animate-pulse w-36 mb-2" />
                    <div className="h-12 bg-bg border border-border rounded-lg animate-pulse" />
                  </div>

                  <div className="h-12 bg-border rounded-lg animate-pulse mb-4" />
                  <div className="h-3 bg-border rounded animate-pulse w-3/4 mx-auto" />
                </div>
              </div>

              {/* Info box skeleton */}
              <div className="p-6 bg-surface rounded-xl border border-border">
                <div className="h-5 bg-border rounded animate-pulse w-28 mb-4" />
                <ul className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex gap-2">
                      <div className="h-4 w-4 bg-border rounded-full animate-pulse shrink-0 mt-0.5" />
                      <div className="h-4 bg-border rounded animate-pulse flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
