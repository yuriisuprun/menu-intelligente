import QRCode from "qrcode";

export default async function QrPage() {
  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/menu/tavola-demo?table=12`;
  const qr = await QRCode.toDataURL(menuUrl, { width: 280, margin: 1 });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">QR Management</h1>
      <p className="mt-2 text-sm text-slate-600">Table-specific dynamic QR for Table 12.</p>
      <div className="mt-6 w-fit rounded-lg border border-slate-200 bg-slate-50 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="QR code" className="rounded-md border border-slate-200 bg-white p-3" />
      </div>
    </div>
  );
}
