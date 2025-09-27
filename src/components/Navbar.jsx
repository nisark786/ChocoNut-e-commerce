// src/components/Navbar.jsx
import { useState, useEffect, useContext } from "react";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  // Update cart/wishlist counts when currentUser changes
  useEffect(() => {
    setCartCount(currentUser?.cart?.length || 0);
    setWishlistCount(currentUser?.wishlist?.length || 0);
  }, [currentUser]);

  const handleLogout = () => {
    logout(); // ✅ Properly clear state + localStorage
    navigate("/login");
  };

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
            <Link to="/" className="hover:text-green-400">Home</Link>
            <Link to="/shops" className="hover:text-green-400">Shops</Link>
            <Link to="/orders" className="hover:text-green-400">Orders</Link>
          </div>

          {/* Icons & User */}
          <div className="flex items-center space-x-4">
            <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            <div onClick={() => navigate("/wishlist")} className="relative cursor-pointer">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>

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
        <div className="md:hidden bg-amber-700 text-white px-4 pb-4 space-y-2">
          <Link to="/" className="block hover:text-yellow-300">Home</Link>
          <Link to="/shops" className="block hover:text-yellow-300">Shops</Link>
          <Link to="/orders" className="block hover:text-yellow-300">Orders</Link>
        </div>
      )}
    </nav>
  );
}
