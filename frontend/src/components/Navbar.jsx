import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {

  const navigate = useNavigate();

  // Zustand stores
  const cartItems = useCartStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Theme Context
  const { config, toggleTheme, changeColor } = useContext(ThemeContext);

  const logoutHandler = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`flex items-center justify-between px-6 py-3 shadow-md ${
        config.theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
      }`}
    >

      {/* LEFT SIDE */}
      <div className="flex items-center gap-6 font-semibold text-lg">

        <Link
          to="/"
          style={{ color: config.primaryColor }}
        >
          🐶 PetVerse
        </Link>

        <Link to="/shop">Shop</Link>
        
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/feedback">Feedback</Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* 🎨 Color Picker */}
        <input
          type="color"
          value={config.primaryColor}
          onChange={(e) => changeColor(e.target.value)}
          className="w-8 h-8 border rounded"
        />

        {/* 🌙 Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="border px-3 py-1 rounded"
        >
          {config.theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* 🛒 Cart */}
        <Link to="/cart" className="relative">

          🛒 Cart

          {cartItems.length > 0 && (
            <span
              className="ml-1 text-sm"
              style={{ color: config.primaryColor }}
            >
              ({cartItems.length})
            </span>
          )}

        </Link>

        {/* 🔐 Auth */}
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <button
              onClick={logoutHandler}
              style={{ background: config.primaryColor }}
              className="text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{ background: config.primaryColor }}
            className="text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}