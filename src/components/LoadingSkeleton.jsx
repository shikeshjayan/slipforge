const SkeletonBar = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
)

export const ReceiptFormSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <SkeletonBar className="h-4 w-24" />
        <SkeletonBar className="h-10 w-full" />
      </div>
      <div className="space-y-1.5">
        <SkeletonBar className="h-4 w-24" />
        <SkeletonBar className="h-10 w-full" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <SkeletonBar className="h-4 w-28" />
      <SkeletonBar className="h-4 w-28" />
    </div>
    <SkeletonBar className="h-10 w-full" />
    <SkeletonBar className="h-10 w-full" />
  </div>
)

export const ReceiptSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6">
    <div className="flex justify-between">
      <div className="space-y-2">
        <SkeletonBar className="h-7 w-48" />
        <SkeletonBar className="h-4 w-20" />
      </div>
      <div className="space-y-2 text-right">
        <SkeletonBar className="h-4 w-36 ml-auto" />
        <SkeletonBar className="h-4 w-28 ml-auto" />
      </div>
    </div>
    <SkeletonBar className="h-24 w-full" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <SkeletonBar key={i} className="h-8 w-full" />
      ))}
    </div>
    <SkeletonBar className="h-20 w-64 ml-auto" />
  </div>
)

export const HistoryListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
        <SkeletonBar className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonBar className="h-4 w-40" />
          <SkeletonBar className="h-3 w-24" />
        </div>
        <SkeletonBar className="h-8 w-20 rounded-lg" />
      </div>
    ))}
  </div>
)
