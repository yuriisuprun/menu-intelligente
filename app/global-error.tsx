"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-2xl font-semibold">Application error</h2>
          <p className="text-sm text-zinc-600">
            A critical error occurred while rendering. Try reloading the app.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
