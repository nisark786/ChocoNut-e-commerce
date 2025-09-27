// src/pages/ProductDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { currentUser, addToCart, removeFromCart, toggleWishlist } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch product and adjust stock based on cart
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        const inCartQty = currentUser?.cart?.find(item => item.id === data.id)?.qty || 0;
        setProduct({ ...data, stock: data.stock - inCartQty });
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id, currentUser]);

  if (!product) {
    return (
      <div className="flex flex-col items-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate("/shops")}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const inCart = currentUser?.cart?.some(item => item.id === product.id);
  const inWishlist = currentUser?.wishlist?.some(item => item.id === product.id);

  // Update stock in backend
  const updateStock = async (newStock) => {
    try {
      await fetch(`http://localhost:5000/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
    } catch (err) {
      console.error("Stock update failed", err);
    }
  };

  const handleCartToggle = async () => {
    if (!currentUser) return navigate("/login");
    if (product.stock === 0) return toast.error("Out of stock!");

    setLoading(true);
    try {
      if (inCart) {
        await removeFromCart(product.id);
        toast.info("Removed from cart!");
        setProduct(prev => ({ ...prev, stock: prev.stock + 1 }));
        await updateStock(product.stock + 1);
      } else {
        await addToCart(product);
        toast.success("Added to cart!");
        setProduct(prev => ({ ...prev, stock: prev.stock - 1 }));
        await updateStock(product.stock - 1);
      }
    } catch (err) {
      toast.error("Operation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) return navigate("/login");
    if (!inCart) {
      await addToCart(product);
      await updateStock(product.stock - 1);
    }
    navigate("/payment");
  };

  const handleWishlistToggle = async () => {
    if (!currentUser) return navigate("/login");

    setLoading(true);
    try {
      await toggleWishlist(product);
      toast.info(inWishlist ? "Removed from wishlist!" : "Added to wishlist!");
    } catch (err) {
      toast.error("Operation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        {/* Product Image */}
        <div className="flex-1 w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto md:h-[500px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl md:text-2xl text-green-600 font-semibold mb-2">₹{product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <p className={`font-medium mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} left in stock` : "Out of stock"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCartToggle}
              disabled={product.stock === 0 || loading}
              className={`px-6 py-2 rounded-lg font-semibold transition w-full sm:w-auto ${
                inCart ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
              } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0 || loading}
              className={`px-6 py-2 rounded-lg font-semibold w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold border w-full sm:w-auto ${
                inWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <button
            onClick={() => navigate("/shops")}
            className="px-6 py-2 mt-4 rounded-lg font-semibold border border-gray-400 hover:bg-gray-100 w-full sm:w-auto"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
