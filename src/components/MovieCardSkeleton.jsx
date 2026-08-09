const MovieCardSkeleton = () => {
  return (
    <div className="movie-card animate-pulse">
      <div className="bg-light-100/10 rounded-lg w-full h-auto aspect-2/3" />

      <div className="mt-4">
        <div className="h-4 bg-light-100/10 rounded-sm w-3/4" />

        <div className="content mt-2">
          <div className="flex flex-row items-center gap-1">
            <div className="size-4 bg-light-100/10 rounded-full" />
            <div className="h-3 w-6 bg-light-100/10 rounded-sm" />
          </div>

          <span className="text-sm text-gray-100">•</span>
          <div className="h-3 w-10 bg-light-100/10 rounded-sm" />

          <span className="text-sm text-gray-100">•</span>
          <div className="h-3 w-8 bg-light-100/10 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export default MovieCardSkeleton