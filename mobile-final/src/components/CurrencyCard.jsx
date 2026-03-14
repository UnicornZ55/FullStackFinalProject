export default function CurrencyCard({ label, value }) {
  return (
    //function 7.2 C2 / C3
    <div
      className="rounded-2xl border border-white/40 bg-[rgba(255,255,255,0.2)] p-4 shadow-lg backdrop-blur-md"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 14,
        elevation: 8,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}