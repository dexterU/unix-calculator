import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-gray-600 text-center max-w-md">
        The page you requested does not exist or has been moved.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Back to home
      </Link>
    </div>
  )
}
