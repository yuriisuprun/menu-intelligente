export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Restaurant Overview</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-sm text-white/70">Active Menus</p>
          <p className="text-2xl text-gold">4</p>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-sm text-white/70">Scans (7d)</p>
          <p className="text-2xl text-gold">1,284</p>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-sm text-white/70">Top Language</p>
          <p className="text-2xl text-gold">EN</p>
        </div>
      </div>
    </div>
  );
}
