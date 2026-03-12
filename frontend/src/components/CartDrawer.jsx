import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

export default function CartDrawer({ isOpen, onClose, accentColor }) {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatCurrency = (amount) =>
    amount.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    });

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
            <p className="text-sm text-slate-500">{items.length} product rows</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
                🛒
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Cart is empty</h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a few items from the shop and they will appear here instantly.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="mt-5 inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: accentColor }}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">🐾</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(item.price)} x {item.qty}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(item._id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="text-base font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              to="/cart"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ background: accentColor }}
            >
              View Full Cart
            </Link>

            <button
              type="button"
              onClick={clear}
              disabled={items.length === 0}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}