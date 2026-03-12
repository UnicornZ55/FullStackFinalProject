import { useState } from "react";

const Section = ({ title, children, open, onToggle }) => (
  <div className="border-b pb-3">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center py-2 font-semibold"
    >
      {title}
      <span>{open ? "−" : "+"}</span>
    </button>
    {open && <div className="mt-2 space-y-2">{children}</div>}
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input
      type="checkbox"
      className="accent-blue-600"
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);

export default function FilterSidebar({ filters, setFilters, resetPage }) {
  const [open, setOpen] = useState({
    category: true,
    brand: true,
    age: true,
    price: true,
  });

  const toggleOpen = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  const toggleArray = (key, value) => {
    setFilters((f) => {
      const arr = f[key];
      const exists = arr.includes(value);
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [key]: next };
    });
    resetPage();
  };

  return (
    <aside className="w-64 border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-3">ฟิลเตอร์</h3>

      {/* Category */}
      <Section
        title="ประเภทสินค้า"
        open={open.category}
        onToggle={() => toggleOpen("category")}
      >
        {["food", "toy", "accessory"].map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={filters.category.includes(c)}
            onChange={() => toggleArray("category", c)}
          />
        ))}
      </Section>

      {/* Brand */}
      <Section
        title="แบรนด์"
        open={open.brand}
        onToggle={() => toggleOpen("brand")}
      >
        {["Hill's", "Royal Canin", "SmartHeart"].map((b) => (
          <Checkbox
            key={b}
            label={b}
            checked={filters.brand.includes(b)}
            onChange={() => toggleArray("brand", b)}
          />
        ))}
      </Section>

      {/* Age */}
      <Section
        title="ช่วงอายุ"
        open={open.age}
        onToggle={() => toggleOpen("age")}
      >
        {["puppy", "adult", "senior"].map((a) => (
          <Checkbox
            key={a}
            label={a}
            checked={filters.age.includes(a)}
            onChange={() => toggleArray("age", a)}
          />
        ))}
      </Section>

      {/* Price */}
      <Section
        title="ช่วงราคา"
        open={open.price}
        onToggle={() => toggleOpen("price")}
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="ต่ำสุด"
            className="w-1/2 border rounded px-2 py-1 text-sm"
            value={filters.minPrice}
            onChange={(e) => {
              setFilters((f) => ({ ...f, minPrice: Number(e.target.value) || 0 }));
              resetPage();
            }}
          />
          <input
            type="number"
            placeholder="สูงสุด"
            className="w-1/2 border rounded px-2 py-1 text-sm"
            value={filters.maxPrice}
            onChange={(e) => {
              setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) || 999999 }));
              resetPage();
            }}
          />
        </div>
      </Section>
    </aside>
  );
}