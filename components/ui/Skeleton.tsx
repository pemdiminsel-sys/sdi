"use client";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height: "1rem", borderRadius: "0.375rem", ...style }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton style={{ width: 40, height: 40, borderRadius: "0.5rem" }} />
        <div className="flex-1 space-y-2">
          <Skeleton style={{ width: "60%", height: "0.875rem" }} />
          <Skeleton style={{ width: "40%", height: "0.75rem" }} />
        </div>
      </div>
      <Skeleton style={{ height: "2rem", width: "50%" }} />
      <Skeleton style={{ height: "0.75rem", width: "80%" }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          <Skeleton style={{ width: "8rem", height: "0.875rem" }} />
          <Skeleton style={{ flex: 1, height: "0.875rem" }} />
          <Skeleton style={{ width: "6rem", height: "0.875rem" }} />
          <Skeleton style={{ width: "5rem", height: "0.875rem" }} />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  // Use deterministic heights to avoid React hydration mismatch
  const heights = [65, 82, 45, 90, 70, 55, 88, 60];
  
  return (
    <div className="w-full flex items-end gap-2 px-4" style={{ height }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="skeleton flex-1 rounded-t-md"
          style={{ height: `${heights[i % heights.length]}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <Skeleton style={{ width: "40%", height: "1rem", marginBottom: "1rem" }} />
          <ChartSkeleton />
        </div>
        <div className="glass-card p-5 space-y-4">
          <Skeleton style={{ width: "60%", height: "1rem" }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              <div className="flex-1 space-y-1">
                <Skeleton style={{ height: "0.8rem" }} />
                <Skeleton style={{ width: "60%", height: "0.7rem" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
