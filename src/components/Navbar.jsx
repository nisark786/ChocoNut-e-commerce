// src/components/Navbar.jsx
import { useState, useContext } from "react";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Cart & Wishlist counts derived directly from currentUser
  const cartCount = currentUser?.cart?.length || 0;
  const wishlistCount = currentUser?.wishlist?.length || 0;

  const handleLogout = () => {
    logout(); // Clear state + localStorage
    navigate("/login");
  };

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-red-900 text-2xl font-bold cursor-pointer"
          >
            Choco<span className="text-green-400">Nut</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-black font-medium">
            <Link
              to="/"
              className={`hover:text-green-400 ${isActive("/") ? "font-bold text-green-500" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/shops"
              className={`hover:text-green-400 ${isActive("/shops") ? "font-bold text-green-500" : ""}`}
            >
              Shops
            </Link>
            <Link
              to="/orders"
              className={`hover:text-green-400 ${isActive("/orders") ? "font-bold text-green-500" : ""}`}
            >
              Orders
            </Link>
          </div>

          {/* Icons & User */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Wishlist Icon */}
            <div onClick={() => navigate("/wishlist")} className="relative cursor-pointer">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* User / Login */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-1 hover:text-green-500 px-3 py-1 rounded-full font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>{currentUser.name || "Profile"}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-1 hover:text-green-500 px-3 py-1 rounded-full font-medium"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md text-black px-4 pb-4 space-y-2">
          <Link
            to="/"
            className={`block hover:text-green-400 ${isActive("/") ? "font-bold text-green-500" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/shops"
            className={`block hover:text-green-400 ${isActive("/shops") ? "font-bold text-green-500" : ""}`}
          >
            Shops
          </Link>
          <Link
            to="/orders"
            className={`block hover:text-green-400 ${isActive("/orders") ? "font-bold text-green-500" : ""}`}
          >
            Orders
          </Link>
        </div>
      )}
    </nav>
  );
}
