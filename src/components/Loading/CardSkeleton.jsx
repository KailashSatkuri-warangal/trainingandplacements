export default function CardSkeleton({ count = 3 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#e6e6df] p-6 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-neutral-200 rounded w-20" />
            <div className="h-5 bg-neutral-200 rounded-full w-24" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 bg-neutral-200 rounded w-28" />
            <div className="h-6 bg-neutral-200 rounded w-4/5" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-8 bg-neutral-100 rounded-lg" />
            <div className="h-8 bg-neutral-100 rounded-lg" />
            <div className="h-8 bg-neutral-100 rounded-lg" />
            <div className="h-8 bg-neutral-100 rounded-lg" />
          </div>

          <div className="pt-4 border-t border-[#f0f0ea] flex justify-between">
            <div className="h-8 bg-neutral-200 rounded-lg w-28" />
            <div className="h-8 bg-neutral-200 rounded-lg w-28" />
          </div>
        </div>
      ))}
    </>
  );
}
