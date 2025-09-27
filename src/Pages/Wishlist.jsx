// src/pages/Wishlist.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Wishlist() {
  const { currentUser, toggleWishlist, addToCart } = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
  const [localWishlist, setLocalWishlist] = useState(currentUser?.wishlist || []);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold mb-4">
          Please login to view your wishlist.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    );
  }

  const handleRemove = async (productId) => {
    setLoadingIds((prev) => [...prev, productId]);
    try {
      await toggleWishlist({ id: productId }); // remove from wishlist in backend
      setLocalWishlist((prev) => prev.filter((p) => p.id !== productId)); // remove from local state
      toast.success("Removed from wishlist!");
    } catch (err) {
      toast.error("Failed to remove from wishlist.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleAddToCart = async (product) => {
    setLoadingIds((prev) => [...prev, product.id]);
    try {
      // Add to cart
      await addToCart(product);
      toast.success("Added to cart!");

      // Remove from wishlist
      await toggleWishlist(product);
      setLocalWishlist((prev) => prev.filter((p) => p.id !== product.id));
      toast.info("Removed from wishlist!");
    } catch (err) {
      toast.error("Failed to add to cart.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">My Wishlist</h2>

      {localWishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-semibold mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate("/shops")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {localWishlist.map((product) => (
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
                    onClick={() => handleRemove(product.id)}
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
      )}
    </section>
  );
}
