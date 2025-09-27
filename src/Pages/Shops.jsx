// src/pages/Shops.jsx
import { useEffect, useState, useContext } from "react";
import ProductCard from "../components/Products/ProductCard";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import { getPageItems, getTotalPages } from "../helpers/paginationHelpers";

export default function Shops() {
  const { currentUser } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart for current user
  useEffect(() => {
    if (!currentUser) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cart?userId=${currentUser.id}`);
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [currentUser]);

  // Apply filters, search, and stock adjustment
  useEffect(() => {
    let temp = [...products];

    // Search by name
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
        premiumFilter === "premium" ? p.premium : !p.premium
      );
    }

    // Sort by price
    if (sortOrder === "low") temp.sort((a, b) => a.price - b.price);
    if (sortOrder === "high") temp.sort((a, b) => b.price - a.price);

    // Update stock based on server cart
    if (cartItems.length) {
      temp = temp.map((p) => {
        const cartItem = cartItems.find((i) => i.productId === p.id);
        const updatedStock = cartItem ? Math.max(p.stock - cartItem.qty, 0) : p.stock;
        return { ...p, stock: updatedStock };
      });
    }

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [products, searchQuery, categoryFilter, premiumFilter, sortOrder, cartItems]);

  const currentProducts = getPageItems(filteredProducts, currentPage, productsPerPage);
  const totalPages = getTotalPages(filteredProducts, productsPerPage);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Shops</h2>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <select
          className="border rounded px-3 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="chocolates">Chocolates</option>
          <option value="nuts">Nuts</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={premiumFilter}
          onChange={(e) => setPremiumFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="premium">Premium</option>
          <option value="non-premium">Non-Premium</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {currentProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">🚫 Product not found</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-green-500 text-white" : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
