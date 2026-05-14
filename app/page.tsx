import Link from "next/link";

export default function HomePage() {
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#13233d] sm:px-8 sm:py-8">
      <section className="mx-auto grid w-full max-w-[1400px] gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-[#d8e4f5] bg-white/95 p-6 shadow-[0_8px_28px_rgba(15,35,66,0.05)] sm:p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight text-[#17345f] sm:text-4xl">
              Tavola AI
            </h1>
            <p className="text-xl leading-[1.5] text-[#1d3150] sm:text-2xl">
              An AI-powered multilingual hospitality platform for modern restaurants.
            </p>
            <p className="text-base leading-[1.7] text-slate-600 sm:text-lg">
              Guests scan a code to order and pay from their phone. Reduces wait times and staffing pressure.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {tenantSlug && (
                <Link
                  href={`/menu/${tenantSlug}`}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-[#2F6FDD] bg-[#2F6FDD] px-5 text-sm font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-[#255dc0]"
                >
                  Start Guest Ordering
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#bcd0ed] bg-[#eef4ff] px-5 text-sm font-semibold uppercase tracking-[0.06em] text-[#1d4f9f] transition hover:bg-[#e3edff]"
              >
                Staff Dashboard
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-xl border border-[#d8e4f5] bg-white/95 p-6 shadow-[0_8px_28px_rgba(15,35,66,0.05)] sm:p-8">
          <div className="space-y-5">
            <h2 className="text-lg font-semibold uppercase tracking-[0.06em] text-[#17345f]">
              QR Ordering Flow
            </h2>
            <ol className="space-y-3 text-sm leading-[1.7] text-slate-700 sm:text-base">
              <li>1. Guest scans table QR code.</li>
              <li>2. Menu opens in guest language.</li>
              <li>3. Guest places order and pays.</li>
              <li>4. Kitchen and service teams receive updates in real time.</li>
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}
