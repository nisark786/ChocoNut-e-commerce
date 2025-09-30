// src/components/Navbar.jsx
import { useState, useEffect, useContext } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Store,
  Home,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, cart, wishlist, logout } =
    useContext(UserContext);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live counts
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg backdrop-blur-sm"
          : "bg-gradient-to-r from-amber-50 to-orange-50 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:to-orange-700 transition-all">
              Choco<span className="text-green-600">Nut</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Link>
              <Link
                to="/shops"
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 group"
              >
                <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Shops</span>
              </Link>
              <Link
                to="/orders"
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 group"
              >
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Orders</span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6 ml-2">
              {/* Cart */}
              <div
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors duration-200 group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-amber-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <div
                onClick={() => navigate("/wishlist")}
                className="relative p-2 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors duration-200 group"
              >
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-pink-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {/* User Section */}
              <div className="flex items-center space-x-3 ml-2">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <User className="w-4 h-4" />
                      <span>{currentUser.name.split(" ")[0]}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors duration-200"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-100 transition-colors duration-200"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {/* Links */}
            <Link
              to="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 text-gray-700 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/shops"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 text-gray-700 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <Store className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Shops</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-50 text-gray-700 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <Package className="w-5 h-5 text-amber-600" />
              <span className="font-medium">Orders</span>
            </Link>

            {/* Mobile Actions */}
            <div className="flex space-x-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  navigate("/cart");
                  setMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </span>
              </button>

              <button
                onClick={() => {
                  navigate("/wishlist");
                  setMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-pink-50 text-pink-700 font-medium hover:bg-pink-100 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </span>
              </button>
            </div>

            {/* Mobile User */}
            <div className="pt-4 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {currentUser.name.split(" ")[0][0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {currentUser.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  <User className="w-5 h-5" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
