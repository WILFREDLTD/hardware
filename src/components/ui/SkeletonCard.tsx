export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/5"></div>
    </div>
  )
}
