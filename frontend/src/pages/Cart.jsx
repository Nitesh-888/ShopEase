import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await API.post("/cart/add", { productId, quantity });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.post("/cart/remove", { productId });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not remove item");
    }
  };

  const total = (cart?.items || []).reduce(
    (acc, it) => acc + (it.product?.price || 0) * it.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {message && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
          {message}
        </div>
      )}

      {cart?.items?.length ? (
        <div className="grid grid-cols-1 gap-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row items-center sm:items-start bg-white shadow rounded-lg p-4"
            >
              {/* Placeholder image */}
              <div className="w-28 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center mr-4">
                <span className="text-xs text-gray-500">No Image</span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                <p className="text-blue-600 font-bold mt-2">₹{item.product.price}</p>

                <div className="mt-3 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-3 py-1 border rounded-md"
                  >
                    −
                  </button>

                  <div className="px-3 py-1 border rounded-md">{item.quantity}</div>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 border rounded-md"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product._id)}
                    className="ml-4 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold">₹{item.product.price * item.quantity}</div>
              </div>
            </div>
          ))}

          {/* Summary / Checkout */}
          <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold">₹{total}</div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="mb-3">Your cart is empty.</p>
          <a href="/" className="text-blue-600 hover:underline">Go to products</a>
        </div>
      )}
    </div>
  );
}
