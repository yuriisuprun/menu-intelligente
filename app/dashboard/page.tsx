export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-[#17345f]">Restaurant Overview</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">
          <p className="text-sm font-medium text-slate-500">Active Menus</p>
          <p className="mt-2 text-3xl font-semibold text-gold">4</p>
        </div>
        <div className="rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">
          <p className="text-sm font-medium text-slate-500">Scans (7d)</p>
          <p className="mt-2 text-3xl font-semibold text-gold">1,284</p>
        </div>
        <div className="rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">
          <p className="text-sm font-medium text-slate-500">Top Language</p>
          <p className="mt-2 text-3xl font-semibold text-gold">EN</p>
        </div>
      </div>
    </div>
  );
}
