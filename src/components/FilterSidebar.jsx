export default function FilterSidebar({ filters, setFilters, products }) {
  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div className="w-64 bg-white shadow p-4 rounded-md space-y-4">
      <h2 className="font-bold text-lg mb-2">Filter By</h2>

      {/* Category */}
      <div>
        <h3 className="font-semibold mb-1">Category</h3>
        {categories.map(cat => (
          <button
            key={cat}
            className={`block mb-1 px-2 py-1 rounded ${filters.category === cat ? "bg-green-400 text-white" : "bg-gray-200"}`}
            onClick={() => setFilters(f => ({ ...f, category: cat }))}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Premium */}
      <div>
        <h3 className="font-semibold mb-1">Premium</h3>
        {["All", "Premium"].map(p => (
          <button
            key={p}
            className={`block mb-1 px-2 py-1 rounded ${filters.premium === p ? "bg-green-400 text-white" : "bg-gray-200"}`}
            onClick={() => setFilters(f => ({ ...f, premium: p }))}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-1">Sort by Price</h3>
        <button
          className={`block mb-1 px-2 py-1 rounded ${filters.sort === "low" ? "bg-green-400 text-white" : "bg-gray-200"}`}
          onClick={() => setFilters(f => ({ ...f, sort: "low" }))}
        >Low to High</button>
        <button
          className={`block mb-1 px-2 py-1 rounded ${filters.sort === "high" ? "bg-green-400 text-white" : "bg-gray-200"}`}
          onClick={() => setFilters(f => ({ ...f, sort: "high" }))}
        >High to Low</button>
      </div>
    </div>
  );
}
