// src/pages/ProductDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Star, 
  Package, 
  Truck, 
  Shield, 
  Leaf,
  Plus,
  Minus
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addToCart, removeFromCart, toggleWishlist } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // fetch product from backend
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

  // sync local states with context when user/cart changes
  useEffect(() => {
    if (product && currentUser) {
      setInCart(currentUser.cart?.some(item => item.id === product.id));
      setInWishlist(currentUser.wishlist?.some(item => item.id === product.id));
    }
  }, [currentUser, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Package className="w-16 h-16 text-amber-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <button 
          onClick={() => navigate("/shops")}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // update stock in backend
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

  // toggle add/remove cart
  const handleCartToggle = async () => {
    if (!currentUser) return navigate("/login");
    if (product.stock === 0 && !inCart) return toast.error("Out of stock!");

    setLoading(true);
    try {
      if (inCart) {
        await removeFromCart(product.id);
        toast.info("Removed from cart!");
        setProduct(prev => ({ ...prev, stock: prev.stock + quantity }));
        await updateStock(product.stock + quantity);
        setInCart(false);
      } else {
        await addToCart({ ...product, qty: quantity });
        toast.success("Added to cart!");
        setProduct(prev => ({ ...prev, stock: prev.stock - quantity }));
        await updateStock(product.stock - quantity);
        setInCart(true);
      }
    } catch (err) {
      toast.error("Cart update failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // direct buy now
  const handleBuyNow = async () => {
    if (!currentUser) return navigate("/login");
    if (!inCart) {
      await addToCart({ ...product, qty: quantity });
      await updateStock(product.stock - quantity);
      setInCart(true);
    }
    navigate("/payment");
  };

  // toggle wishlist
  const handleWishlistToggle = async () => {
    if (!currentUser) return navigate("/login");

    setLoading(true);
    try {
      await toggleWishlist(product);
      toast.info(inWishlist ? "Removed from wishlist!" : "Added to wishlist!");
      setInWishlist(!inWishlist);
    } catch (err) {
      toast.error("Wishlist update failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // qty controls
  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // product images (using same image multiple times for gallery)
  const productImages = [product?.image, product?.image, product?.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Images */}
        <div>
          <img 
            src={productImages[activeImage]} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-xl shadow-lg" 
          />
          <div className="flex mt-4 space-x-3">
            {productImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                  activeImage === idx ? "border-amber-500" : "border-gray-200"
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-amber-600 font-semibold">₹{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          {/* Stock */}
          <p className={`font-medium ${
            product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"
          }`}>
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
          </p>

          {/* Quantity */}
          <div className="flex items-center space-x-3">
            <button onClick={decreaseQuantity} disabled={quantity <= 1}> <Minus /> </button>
            <span className="font-semibold">{quantity}</span>
            <button onClick={increaseQuantity} disabled={quantity >= product.stock}> <Plus /> </button>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCartToggle} 
              disabled={loading || (product.stock === 0 && !inCart)}
              className={`px-4 py-2 rounded-lg text-white ${
                inCart ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </button>
            <button 
              onClick={handleBuyNow} 
              disabled={loading || product.stock === 0}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
            >
              Buy Now
            </button>
            <button 
              onClick={handleWishlistToggle} 
              disabled={loading}
              className={`col-span-2 px-4 py-2 rounded-lg border ${
                inWishlist ? "bg-pink-500 text-white" : "bg-white text-amber-600"
              }`}
            >
              {inWishlist ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-sm text-amber-700">
            <div className="flex items-center"><Truck className="w-4 h-4 mr-1"/> Free Shipping</div>
            <div className="flex items-center"><Shield className="w-4 h-4 mr-1"/> Quality Guarantee</div>
            <div className="flex items-center"><Leaf className="w-4 h-4 mr-1"/> Fresh Ingredients</div>
            <div className="flex items-center"><Package className="w-4 h-4 mr-1"/> Gift Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
