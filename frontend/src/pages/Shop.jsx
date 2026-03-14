import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "../api/axios";
import { isCancel } from "axios";
import debounce from "lodash.debounce";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

export default function Shop() {

  const [products, setProducts] = useState([]);

  // ✅ loading + error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 search
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 🎯 multi-filter
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    age: [],
    minPrice: 0,
    maxPrice: 999999,
  });

  // 🔄 pagination
  const [page, setPage] = useState(1);
  const perPage = 8;

  // request cancellation (race condition safe)
  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(
    async (query) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = { inStock: "true" };
        if (query) {
          params.search = query;
        }

        const res = await axios.get("/products", {
          params,
          signal: controller.signal,
        });

        setProducts(res.data);
      } catch (err) {
        if (isCancel(err) || controller.signal.aborted) return;
        setError("Error loading products");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Debounced search to avoid firing on every keystroke
  // function 6.2 C5
  const debouncedSearch = useRef(
    debounce((value) => {
      setPage(1);
      setSearchQuery(value);
    }, 600)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      abortControllerRef.current?.abort();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [fetchProducts, searchQuery]);

  // 🔍 filter + search
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchStock = (p.stock || 0) > 0;

      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        filters.category.length === 0 ||
        filters.category.includes(p.category);

      const matchBrand =
        filters.brand.length === 0 ||
        filters.brand.includes(p.brand);

      const matchAge =
        filters.age.length === 0 ||
        filters.age.includes(p.age);

      const matchPrice =
        p.price >= filters.minPrice && p.price <= filters.maxPrice;

      return (
        matchStock &&
        matchSearch &&
        matchCategory &&
        matchBrand &&
        matchAge &&
        matchPrice
      );
    });
  }, [products, filters, searchQuery]);

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // ✅ loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="h-40 w-full bg-gray-200 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
                  <div className="h-8 w-1/2 bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ error screen
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={() => fetchProducts(searchQuery)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* 🔍 Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-6">

        {/* 🎯 Sidebar Filter */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resetPage={() => setPage(1)}
        />

        {/* 🧱 Product Grid */}
        <div className="flex-1">

          <p className="mb-4 text-gray-500">
            แสดง {filtered.length} รายการ
          </p>

          {/* ✅ empty state */}
          {filtered.length === 0 && (
            <p className="text-gray-400 mb-6">
              No products found for "{searchQuery}"
            </p>
          )}

          <ProductGrid products={paginated} />

          {/* 🔄 Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </div>

      </div>

    </div>
  );
}