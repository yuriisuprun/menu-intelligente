"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AssistantModal({ tenantSlug, language }: { tenantSlug: string; language: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    const res = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantSlug, language, question: q })
    });
    const data = await res.json();
    setA(data.answer ?? "");
    setLoading(false);
  }

  if (!open) return <Button onClick={() => setOpen(true)}>AI Waiter</Button>;

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg border border-white/20 bg-bg p-4">
        <div className="mb-3 flex justify-between">
          <h3 className="font-medium">AI Waiter Assistant</h3>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
        <input
          className="w-full rounded-md border border-white/20 bg-white/5 p-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What wine pairs with steak?"
        />
        <div className="mt-2">
          <Button onClick={ask} disabled={loading || !q.trim()}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </div>
        {a && <p className="mt-3 text-sm text-white/90">{a}</p>}
      </div>
    </div>
  );
}
