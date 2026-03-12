export default function CurrencyCard({ label, value }) {
  return (
    //function 7.2 C2 / C3
    <div
      className="rounded-2xl border border-white/40 bg-[rgba(255,255,255,0.2)] p-4 shadow-lg backdrop-blur-md"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}