import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tavola AI",
  description: "AI multilingual menu platform for premium restaurants."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
