import { useMemo, useState } from "react";
import CurrencyCard from "../components/CurrencyCard";

const RATES = {
  USD: 0.028,
  JPY: 4.2,
  EUR: 0.026,
};

function sanitizeNumericInput(value) {
  const normalized = value.replace(/,/g, ".");
  const cleaned = normalized.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");

  if (firstDot === -1) return cleaned;

  const beforeDot = cleaned.slice(0, firstDot + 1);
  const afterDot = cleaned.slice(firstDot + 1).replace(/\./g, "");
  return beforeDot + afterDot;
}

export default function CurrencyConverter() {
  const [thbInput, setThbInput] = useState("");

  const handleInputFocus = (event) => {
    event.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const thbAmount = useMemo(() => {
    const parsed = parseFloat(thbInput);
    if (!thbInput || Number.isNaN(parsed)) return 0;
    return parsed;
  }, [thbInput]);

  const converted = useMemo(
    () => ({
      USD: (thbAmount * RATES.USD).toFixed(2),
      JPY: (thbAmount * RATES.JPY).toFixed(2),
      EUR: (thbAmount * RATES.EUR).toFixed(2),
    }),
    [thbAmount]
  );

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-y-auto bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 px-4 py-10">
      <div className="pointer-events-none absolute -left-16 top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-56 w-56 rounded-full bg-cyan-200/30 blur-2xl" />

      <section className="relative mx-auto w-full max-w-md rounded-3xl border border-white/40 bg-[rgba(255,255,255,0.2)] p-6 shadow-2xl backdrop-blur-xl">
        <h1 className="text-center text-2xl font-extrabold text-white">
          Dynamic Currency Converter
        </h1>
        <p className="mt-2 text-center text-sm text-white/85">
          Convert THB instantly to USD, JPY, and EUR
        </p>

        <div className="mt-6 rounded-2xl border border-white/40 bg-white/25 p-4">
          <label htmlFor="thb-input" className="block text-xs font-semibold uppercase tracking-wide text-white/80">
            THB
          </label>
          <input
            id="thb-input"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={thbInput}
            onChange={(e) => setThbInput(sanitizeNumericInput(e.target.value))}
            onFocus={handleInputFocus}
            placeholder="Enter amount in THB"
            className="mt-2 w-full rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-lg font-semibold text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-white"
          />
        </div>

        <div className="mt-5 space-y-3 pb-2">
          <CurrencyCard label="USD" value={converted.USD} />
          <CurrencyCard label="JPY" value={converted.JPY} />
          <CurrencyCard label="EUR" value={converted.EUR} />
        </div>
      </section>
    </main>
  );
}