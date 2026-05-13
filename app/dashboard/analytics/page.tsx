export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Most Viewed Dishes</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">Vitello Tonnato, Risotto alla Milanese, Ossobuco</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Language Split</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">EN 46% | IT 24% | FR 12% | DE 10% | ES 8%</p>
        </div>
      </div>
    </div>
  );
}
