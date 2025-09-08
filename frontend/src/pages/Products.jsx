import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", price: "" });
  const [message, setMessage] = useState("");
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products", { params: filters });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await API.post("/cart/add", { productId, quantity: 1 });
      setMessage(res.data.message);
      fetchCartCount(); // 🔹 refresh cart count in Navbar
    } catch (err) {
      setMessage(err.response?.data?.message || "Please login to add product in cart");
    }
  };


  return (
      <div className="p-6">
        {message && (
          <div className="mb-4 text-green-600 font-medium">{message}</div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
                <p className="text-gray-600 text-sm mb-3">{p.description}</p>
                <p className="text-blue-600 font-bold mb-3">₹{p.price}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {p.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToCart(p._id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
}
