import { useCartStore } from "../store/useCartStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Cart</h1>

      {items.length === 0 && <p>No items in cart</p>}

      {items.map((item, i) => (
        <div key={i}>
          {item.name} - {item.price} บาท
        </div>
      ))}

      <h3>Total: {total} บาท</h3>
    </div>
  );
}