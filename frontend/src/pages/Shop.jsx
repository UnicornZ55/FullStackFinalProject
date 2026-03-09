import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
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

  // fetch products
  useEffect(() => {

    const fetchProducts = async () => {
      try {

        setLoading(true);

        const res = await axios.get("/products");

        setProducts(res.data);

      } catch (err) {

        setError("Error loading products");

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);

  // 🔍 filter + search
  const filtered = useMemo(() => {
    return products.filter((p) => {

      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase());

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
        matchSearch &&
        matchCategory &&
        matchBrand &&
        matchAge &&
        matchPrice
      );
    });
  }, [products, filters, search]);

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // ✅ loading screen
  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ✅ error screen
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
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
            setPage(1);
            setSearch(e.target.value);
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
              No results found for "{search}"
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