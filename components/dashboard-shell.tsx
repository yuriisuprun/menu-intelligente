"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, LayoutGrid, QrCode, UtensilsCrossed } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/menu", label: "Menu Editor", icon: UtensilsCrossed },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/qr", label: "QR", icon: QrCode },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-gold">Tavola AI</h2>
        <nav className="grid gap-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-gold/10 text-gold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">{children}</section>
    </main>
  );
}
