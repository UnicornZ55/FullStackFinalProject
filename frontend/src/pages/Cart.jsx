import { useCartStore } from "../store/useCartStore";

export default function Cart() {

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const vat = subtotal * 0.07;

  const shipping = items.length > 0 ? 100 : 0;

  const total = subtotal + vat + shipping;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>

      <h1>🛒 Cart</h1>

      {items.length === 0 && <p>No items in cart</p>}

      {items.map((i) => (
        <div
          key={i._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            {i.name} x{i.qty}
          </p>

          <p>{i.price * i.qty} บาท</p>

          <button onClick={() => remove(i._id)}>
            remove
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: "20px" }}>

          <p>Subtotal: {subtotal} บาท</p>

          <p>VAT (7%): {vat.toFixed(2)} บาท</p>

          <p>Shipping: {shipping} บาท</p>

          <h3>Total: {total.toFixed(2)} บาท</h3>

          <button
            onClick={clear}
            style={{
              marginTop: "10px",
              background: "red",
              color: "white",
              padding: "8px",
            }}
          >
            Clear Cart
          </button>

        </div>
      )}

    </div>
  );
}