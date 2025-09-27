import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  // Example alert function
  const showAlert = (message) => {
    alert(message); // You can replace this with a toast notification if you use one
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showAlert={showAlert} />
      ))}
    </div>
  );
}
