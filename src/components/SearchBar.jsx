// src/components/SearchBar.jsx
import { Search } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
        <input
          type="text"
          placeholder="Search chocolates, nuts, snacks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-amber-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900 hover:border-amber-300"
        />
        
        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search hint */}
      <div className="absolute top-full left-0 right-0 bg-amber-50 border border-amber-200 rounded-b-lg p-2 shadow-lg opacity-0 pointer-events-none group-focus-within:opacity-100 transition-opacity duration-200">
        <p className="text-xs text-amber-600 text-center">
          Try searching for "dark chocolate", "almonds", "cashews", etc.
        </p>
      </div>
    </div>
  );
}