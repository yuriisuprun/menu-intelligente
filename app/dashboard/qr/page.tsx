import QRCode from "qrcode";

export default async function QrPage() {
  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/menu/tavola-demo?table=12`;
  const qr = await QRCode.toDataURL(menuUrl, { width: 280, margin: 1 });

  return (
    <div>
      <h1 className="text-2xl font-semibold">QR Management</h1>
      <p className="mt-2 text-white/70">Table-specific dynamic QR for Table 12.</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt="QR code" className="mt-4 rounded-lg border border-white/20 bg-white p-3" />
    </div>
  );
}
