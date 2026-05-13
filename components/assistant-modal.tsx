"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssistantModal({
  tenantSlug,
  language,
  openKey,
  prefilledQuestion
}: {
  tenantSlug: string;
  language: string;
  openKey?: number;
  prefilledQuestion?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof openKey !== "number") return;
    setOpen(true);
    setQ(prefilledQuestion ?? "");
    setA("");
  }, [openKey, prefilledQuestion]);

  async function ask() {
    setLoading(true);
    setA("");
    const res = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantSlug, language, question: q })
    });
    const data = await res.json();
    setA(data.answer ?? "");
    setLoading(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Sparkles className="h-4 w-4" />
        AI Waiter
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-lg border border-black/10 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">AI Waiter Assistant</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What wine pairs with steak?"
        />
        <div className="mt-3">
          <Button onClick={ask} disabled={loading || !q.trim()}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </div>
        {a && <p className="mt-4 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">{a}</p>}
      </div>
    </div>
  );
}
