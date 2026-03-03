import { useCartStore } from "../store/useCartStore";

export default function ProductCard({ product }) {
  const add = useCartStore((s) => s.add);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h4>{product.name}</h4>
      <p>{product.price} บาท</p>

      <button onClick={() => add(product)}>
        Add to Cart
      </button>
    </div>
  );
}