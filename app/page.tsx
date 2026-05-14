import Link from "next/link";

export default function HomePage() {
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-5 py-6 text-[#1e2330] sm:px-8 sm:py-8">
      <section className="mx-auto grid w-full max-w-[1400px] gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-lg border border-[#dcdfe5] bg-white p-6 sm:p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-[#1d2533] sm:text-4xl">
              Tavola AI
            </h1>
            <p className="text-xl leading-[1.5] text-[#273041] sm:text-2xl">
              An AI-powered multilingual hospitality platform for modern restaurants.
            </p>
            <p className="text-base leading-[1.7] text-[#3a4353] sm:text-lg">
              Guests scan a code to order and pay from their phone. Reduces wait times and staffing pressure.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {tenantSlug && (
                <Link href={`/menu/${tenantSlug}`} className="rounded-md border border-[#1f2532] px-5 py-2 text-sm font-semibold uppercase tracking-[0.06em]">
                  Start Guest Ordering
                </Link>
              )}
              <Link href="/dashboard" className="rounded-md border border-[#1f2532] px-5 py-2 text-sm font-semibold uppercase tracking-[0.06em]">
                Staff Dashboard
              </Link>
            </div>
          </div>
        </article>

        <aside className="rounded-lg border border-[#dcdfe5] bg-white p-6 sm:p-8">
          <div className="space-y-5">
            <h2 className="text-lg font-semibold uppercase tracking-[0.06em] text-[#2a3343]">
              QR Ordering Flow
            </h2>
            <ol className="space-y-3 text-sm leading-[1.7] text-[#3b4556] sm:text-base">
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
