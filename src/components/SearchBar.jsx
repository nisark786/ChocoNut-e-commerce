// src/components/SearchBar.jsx
export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border rounded px-3 py-2 flex-1 min-w-[200px]"
    />
  );
}
