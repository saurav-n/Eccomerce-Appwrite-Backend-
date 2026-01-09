export default function OrderImageGrid({ images = [] }) {
  const displayImages = images.slice(0, 3)
  const remainingCount = images.length - 3

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        {displayImages.map((image, index) => (
          <div key={index} className="relative w-10 h-10 rounded-md overflow-hidden border border-blue-200 bg-gray-50">
            <img
              src={image || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
          <span>+{remainingCount} more</span>
        </div>
      )}
    </div>
  )
}