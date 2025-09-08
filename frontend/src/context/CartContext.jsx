import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items when app loads
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await API.get("/cart");
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
