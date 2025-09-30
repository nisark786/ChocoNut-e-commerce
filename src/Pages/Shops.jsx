// src/pages/Shops.jsx
import { useEffect, useState, useContext } from "react";
import ProductCard from "../components/Products/ProductCard";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import { getPageItems, getTotalPages } from "../helpers/paginationHelpers";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

export default function Shops() {
  const { currentUser, cart, fetchCart } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 12;

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios("http://localhost:5000/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);


  // Apply search, filters, and sort (pagination safe)
  useEffect(() => {
    let temp = [...products];

    // Search
    if (searchQuery.trim()) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      temp = temp.filter((p) => p.category === categoryFilter);
    }

    // Premium filter
    if (premiumFilter !== "all") {
      temp = temp.filter((p) =>
        premiumFilter === "premium" ? p.premium === true : p.premium === false
      );
    }

    // Sort by price
    if (sortOrder === "low") temp.sort((a, b) => a.price - b.price);
    if (sortOrder === "high") temp.sort((a, b) => b.price - a.price);

    setFilteredProducts(temp);
    setCurrentPage(1); // reset page only when filters/search/sort change
  }, [products, searchQuery, categoryFilter, premiumFilter, sortOrder]);

  // Adjust stock based on cart items (does NOT reset page)
  useEffect(() => {
    if (cart.length) {
      setFilteredProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((i) => i.id === p.id);
          const updatedStock = cartItem
            ? Math.max(p.stock - cartItem.qty, 0)
            : p.stock;
          return { ...p, stock: updatedStock };
        })
      );
    }
  }, [cart]);

  // Pagination calculation
  const currentProducts = getPageItems(filteredProducts, currentPage, productsPerPage);
  const totalPages = getTotalPages(filteredProducts, productsPerPage);

  const categories = [
    { value: "all", label: "All Categories"},
    { value: "chocolates", label: "Chocolates"},
    { value: "nuts", label: "Nuts"},
  ];

  const premiumOptions = [
    { value: "all", label: "All Products" },
    { value: "premium", label: "Premium Only" },
    { value: "non-premium", label: "Standard" },
  ];

  const sortOptions = [
    { value: "", label: "Recommended" },
    { value: "low", label: "Price: Low to High" },
    { value: "high", label: "Price: High to Low" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">
            Our Delicious Collection
          </h1>
          <p className="text-amber-700 text-lg max-w-2xl mx-auto">
            Discover premium chocolates and fresh nuts - perfect treats for every occasion!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Filter controls */}
            <div
              className={`flex flex-col lg:flex-row gap-4 w-full ${
                showMobileFilters ? "block" : "hidden lg:flex"
              }`}
            >
              {/* Category */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Premium */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Quality
                </label>
                <select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                >
                  {premiumOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Sort By
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-amber-700 font-medium whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                            : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              No products found
            </h3>
            <p className="text-amber-700 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setPremiumFilter("all");
                setSortOrder("");
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
