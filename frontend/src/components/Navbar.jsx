import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();

  // Zustand stores (Function 2.3)
  const cartItems = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Theme context (Function 2.1)
  const { dark, setDark } = useContext(ThemeContext);

  const logoutHandler = async () => {
    try {
      // optional: call backend logout (Function 5.5)
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {}

    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`flex items-center justify-between px-6 py-3 shadow-md ${
        dark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 font-semibold text-lg">
        <Link to="/" className="hover:text-blue-500">
          🐶 PetVerse
        </Link>

        <Link to="/shop" className="hover:text-blue-500">
          Shop
        </Link>

        <Link to="/feedback" className="hover:text-blue-500">
          Feedback
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* 🌙 Theme Toggle (Function 2.1) */}
        <button
          onClick={() => setDark(!dark)}
          className="border px-2 py-1 rounded"
        >
          {dark ? "Light" : "Dark"}
        </button>

        {/* 🛒 Cart (Function 2.3 Zustand global state) */}
        <Link to="/cart" className="relative">
          🛒 Cart
          {cartItems.length > 0 && (
            <span className="ml-1 text-sm text-red-500">
              ({cartItems.length})
            </span>
          )}
        </Link>

        {/* 🔐 Auth UI (Function 2.5 Protected + RBAC UI) */}
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>

            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}