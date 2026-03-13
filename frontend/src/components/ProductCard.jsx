import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

export default function ProductCard({ product }) {

  const add = useCartStore((s) => s.add);

  return (

    <div className="border p-4 rounded shadow hover:shadow-xl transition duration-300">

      <Link to={`/product/${product._id}`}>
        <div className="border rounded p-4 bg-white mb-2">

          <img
            src={product.image}
            alt={product.name}
            className="w-full object-contain"
          />

        </div>

        <h3 className="font-bold text-lg mb-2">
          {product.name}
        </h3>

        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          {product.category || "Uncategorized"}
        </span>

      </Link>

      <p className="text-gray-500 mb-2">
        {product.price} บาท
      </p>

      <button
        onClick={() => add(product)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add to Cart
      </button>

    </div>

  );
}