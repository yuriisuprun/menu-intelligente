export default function BillingPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-[#17345f]">Billing</h1>
      <div className="mt-6 rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">
        <p className="text-sm font-medium text-slate-500">Current Plan</p>
        <p className="mt-2 text-2xl font-semibold text-gold">Premium</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">Stripe customer portal integration endpoint is ready for connection.</p>
      </div>
    </div>
  );
}
