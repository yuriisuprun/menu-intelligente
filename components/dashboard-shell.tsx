import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/menu", label: "Menu Editor" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/qr", label: "QR" },
  { href: "/dashboard/billing", label: "Billing" }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-lg border border-white/10 p-3">
        <h2 className="mb-4 text-lg font-medium text-gold">Tavola AI</h2>
        <nav className="grid gap-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}
