'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl font-bold text-gray-900">Oops</div>
            <p className="mt-3 text-sm text-gray-600">
              Something went wrong while loading this application view.
            </p>
            <button
              onClick={() => reset()}
              className="mt-6 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
