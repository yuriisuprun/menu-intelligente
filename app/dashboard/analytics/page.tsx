export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-sm text-white/70">Most Viewed Dishes</p>
          <p className="mt-2">Vitello Tonnato, Risotto alla Milanese, Ossobuco</p>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-sm text-white/70">Language Split</p>
          <p className="mt-2">EN 46% | IT 24% | FR 12% | DE 10% | ES 8%</p>
        </div>
      </div>
    </div>
  );
}
