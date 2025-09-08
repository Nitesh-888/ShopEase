// src/components/Navbar.jsx
import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, fetchCartCount } = useCart();
  const { token, isAuthenticated, logout } = useAuth();

  // when token appears, ensure cart count is fresh
  // (fetchCartCount is safe to call multiple times)
  React.useEffect(() => {
    if (isAuthenticated) fetchCartCount();
  }, [isAuthenticated, fetchCartCount]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <NavLink to="/" className="text-xl font-bold text-blue-600 flex">
            <img src="/ShopEase-icon.png" alt="image loading" className="w-[25px]" />ShopEase
          </NavLink>

          <div className="flex items-center space-x-3">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/cart" className={linkClass}>
              <span className="flex items-center">
                Cart
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                  {cartCount ?? 0}
                </span>
              </span>
            </NavLink>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={linkClass}>
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
