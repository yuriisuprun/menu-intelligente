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
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-6">
      <div className="rounded-xl border border-[#d8e4f5] bg-white/90 p-3 shadow-[0_8px_28px_rgba(15,35,66,0.06)] backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="px-2 text-lg font-semibold tracking-tight text-[#16345f]">Tavola AI</h2>
          <nav className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-[#e6f0ff] text-gold"
                    : "text-slate-600 hover:bg-[#f1f6ff] hover:text-[#1d4f9f]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <section className="mt-6 rounded-xl border border-[#d8e4f5] bg-white/95 p-5 shadow-[0_8px_28px_rgba(15,35,66,0.05)] md:p-6">
        {children}
      </section>
    </main>
  );
}
