interface TutorialCardSkeletonProps {
  count: number;
}

export function TutorialCardSkeleton({ count }: TutorialCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
