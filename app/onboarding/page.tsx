"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-[#17345f]">
      <h1 className="text-3xl font-semibold tracking-tight">Restaurant Onboarding</h1>
      <p className="mt-2 text-sm text-slate-600">Step {step} of 3</p>
      {step === 1 && <div className="mt-5 rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">Restaurant profile and city</div>}
      {step === 2 && <div className="mt-5 rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">Upload first menu and dish photos</div>}
      {step === 3 && <div className="mt-5 rounded-lg border border-[#d9e4f4] bg-[#f7faff] p-4">Generate table QR codes and activate trial</div>}
      <div className="mt-5 flex gap-2">
        <Button disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button disabled={step === 3} onClick={() => setStep((s) => s + 1)}>
          Next
        </Button>
      </div>
    </main>
  );
}
