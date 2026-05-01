'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#1a1a1a] text-white p-6">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-white/60 text-center max-w-md">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border border-white/20 bg-transparent px-4 py-2 text-sm font-medium hover:bg-white/[0.06]"
      >
        Try again
      </button>
    </div>
  )
}
