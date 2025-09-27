// src/pages/Wishlist.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Wishlist() {
  const { currentUser, addToCart, toggleWishlist } = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ---------------- Fetch wishlist ----------------
  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/wishlists/${currentUser.id}`);
        const data = await res.json();
        setWishlist(data.items || []);
      } catch (err) {
        toast.error("❌ Failed to load wishlist");
        console.error(err);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold mb-4">Please login to view your wishlist.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    );
  }

  // ---------------- Remove from wishlist ----------------
  const handleRemove = async (product) => {
    setLoadingIds((prev) => [...prev, product.id]);
    try {
      await toggleWishlist(product); // context handles server & state
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Removed from wishlist!");
    } catch (err) {
      toast.error("Failed to remove from wishlist.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  // ---------------- Add to cart & remove from wishlist ----------------
  const handleAddToCart = async (product) => {
    setLoadingIds((prev) => [...prev, product.id]);
    try {
      await addToCart(product); // adds to cart in context & server
      await toggleWishlist(product); // removes from wishlist
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Added to cart and removed from wishlist!");
    } catch (err) {
      toast.error("Failed to add to cart.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold mb-4">Your wishlist is empty</p>
        <button
          onClick={() => navigate("/shops")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-red-600 font-bold mb-4">₹{product.price}</p>
              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingIds.includes(product.id)}
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product)}
                  disabled={loadingIds.includes(product.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
