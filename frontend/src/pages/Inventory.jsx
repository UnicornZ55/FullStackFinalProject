import { useEffect, useMemo, useRef, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = ["all", "in-stock", "out-of-stock"];

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const rollbackRef = useRef({});

  const rawStatus = searchParams.get("status") || "all";
  const statusFilter = STATUS_OPTIONS.includes(rawStatus) ? rawStatus : "all";

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/products");
      setItems(res.data);
    } catch (err) {
      setError("Unable to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (rawStatus !== statusFilter) {
      const nextParams = new URLSearchParams(searchParams);
      if (statusFilter === "all") {
        nextParams.delete("status");
      } else {
        nextParams.set("status", statusFilter);
      }
      setSearchParams(nextParams, { replace: true });
    }
  }, [rawStatus, searchParams, setSearchParams, statusFilter]);

  const handleDelete = async (id) => {
    // backup state before mutation (for rollback safety)
    const previousItems = [...items];

    const index = items.findIndex((it) => it._id === id);
    if (index === -1) return;

    const removedItem = items[index];
    rollbackRef.current[id] = { item: removedItem, index, previousItems };

    setItems((prev) => prev.filter((it) => it._id !== id));

    const toastId = toast.loading("Deleting item... (syncing)");

    try {
      await axios.delete(`/products/${id}`);
      toast.success("Deleted", { id: toastId });
      delete rollbackRef.current[id];
    } catch (err) {
      // rollback
      // rollback to exactly the previous list (no chance of race condition)
    setItems(previousItems);

      toast.error("Unable to delete — restored", { id: toastId });
    }
  };

  const handleToggleStock = async (id) => {
    const item = items.find((it) => it._id === id);
    if (!item) return;

    const prevStock = item.stock;
    const newStock = prevStock > 0 ? 0 : 10;

    rollbackRef.current[id] = { stock: prevStock };
    setItems((prev) =>
      prev.map((it) =>
        it._id === id
          ? {
              ...it,
              stock: newStock,
            }
          : it
      )
    );

    const toastId = toast.loading("Updating stock... (syncing)");

    try {
      await axios.patch(`/products/${id}`, { stock: newStock });
      toast.success("Stock updated", { id: toastId });
      delete rollbackRef.current[id];
    } catch (err) {
      setItems((prev) =>
        prev.map((it) =>
          it._id === id
            ? {
                ...it,
                stock: prevStock,
              }
            : it
        )
      );

      toast.error("Sync failed — reverted", { id: toastId });
    }
  };

  const inStockText = (stock) => (stock > 0 ? "In stock" : "Out of stock");

  const totalStock = useMemo(
    () => items.reduce((acc, it) => acc + (it.stock || 0), 0),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (statusFilter === "in-stock") {
      return items.filter((item) => item.stock > 0);
    }

    if (statusFilter === "out-of-stock") {
      return items.filter((item) => item.stock <= 0);
    }

    return items;
  }, [items, statusFilter]);

  const updateStatusFilter = (nextStatus) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextStatus === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", nextStatus);
    }

    setSearchParams(nextParams);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchItems}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Manager</h1>
          <p className="text-sm text-gray-500">
            Total items: {filteredItems.length} of {items.length} · Total stock: {totalStock}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateStatusFilter("all")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => updateStatusFilter("in-stock")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              statusFilter === "in-stock"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => updateStatusFilter("out-of-stock")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              statusFilter === "out-of-stock"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Active URL filter: {statusFilter === "all" ? "none" : `?status=${statusFilter}`}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item._id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </td>
                <td className="px-4 py-3">฿{item.price.toFixed(2)}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inStockText(item.stock)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStock(item._id)}
                    className="mr-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    {item.stock > 0 ? "Mark Out" : "Restock"}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-8 rounded border bg-yellow-50 p-4 text-sm text-yellow-800">
          No items found for this filter.
        </div>
      )}
    </div>
  );
}

export default Inventory;
