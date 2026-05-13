import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gold">Tavola AI</h1>
        <Link href="/dashboard" className="text-sm text-white/80">
          Restaurant Login
        </Link>
      </header>
      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold leading-tight">Multilingual AI menus.</h2>
          <p className="mt-4 text-white/80">
            QR-first guest experience, dynamic menu management, and AI translation tuned for international visitors.
          </p>
          <Link href="/menu/tavola-demo-milano" className="mt-6 inline-block rounded-md border border-gold/40 px-4 py-2 text-gold">
            Open Demo Menu
          </Link>
        </div>
      </section>
    </main>
  );
}
