export default function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  )
}
