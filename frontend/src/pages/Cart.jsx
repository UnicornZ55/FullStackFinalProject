import { useCartStore } from "../store/useCartStore";
import axios from "../api/axios"
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Cart() {

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatCurrency = (amount) =>
    amount.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    });

  const checkout = async () => {

    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    try{

      for(const item of items){

        await axios.post("/orders",{
          productId: item._id,
          quantity: item.qty
        })

      }

      alert("Order successful")

      clear()

    }
    catch(err){

      alert(err.response?.data?.message || "Order failed")

    }
    finally {
      setIsCheckingOut(false);
    }

  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const itemsCount = items.reduce((sum, item) => sum + item.qty, 0);

  const vat = subtotal * 0.07;

  const shipping = items.length > 0 ? 100 : 0;

  const total = subtotal + vat + shipping;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
            🛒
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">
            Looks like you have not added anything yet. Let&apos;s find something for your pet.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-600">Review your selected items before checkout</p>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm">
            {itemsCount} total units
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">🐾</div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatCurrency(item.price)} × {item.qty}
                    </p>
                    <p className="mt-2 text-base font-bold text-gray-900">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(item._id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <p className="mt-1 text-xs text-gray-500">Taxes and shipping are calculated at checkout</p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">VAT (7%)</span>
              <span className="font-semibold">{formatCurrency(vat)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">{formatCurrency(shipping)}</span>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-gray-300" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={checkout}
              disabled={isCheckingOut}
              className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>

            <button
              type="button"
              onClick={clear}
              disabled={isCheckingOut}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear Cart
            </button>
          </div>

          <Link
            to="/shop"
            className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}