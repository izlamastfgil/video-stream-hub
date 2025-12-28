export function VideoCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Thumbnail Skeleton */}
      <div className="aspect-video animate-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded animate-shimmer" />
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded animate-shimmer" />
          <div className="h-4 w-20 rounded animate-shimmer" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-12 rounded animate-shimmer" />
          <div className="h-5 w-12 rounded animate-shimmer" />
          <div className="h-5 w-12 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
