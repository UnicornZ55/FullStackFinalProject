import { useCartStore } from "../store/useCartStore";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);

  return (
    <div>
      {items.map((i, idx) => (
        <div key={idx}>{i.name}</div>
      ))}
    </div>
  );
}