import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useCartStore } from "../store/useCartStore"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"

export default function Navbar(){

 const user = useAuthStore(s=>s.user)
 const logout = useAuthStore(s=>s.logout)

 const cartItems = useCartStore(s=>s.items)

 const {config,toggleTheme} = useContext(ThemeContext)
 const location = useLocation()
 const [menuOpen, setMenuOpen] = useState(false)

 useEffect(()=>{
  setMenuOpen(false)
 },[location.pathname])

 return(

  <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/90 px-3 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/90">
   <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2">
    <Link
     to="/"
     className="truncate text-base font-bold sm:text-lg"
     style={{color:config.primaryColor}}
    >
     🐶 PetVerse
    </Link>

    <div className="flex items-center gap-2">
     <Link
      to="/cart"
      className="rounded-lg border border-black/15 px-2 py-1 text-sm font-medium dark:border-white/20"
      aria-label="Open cart"
     >
      🛒 {cartItems.length}
     </Link>

     <button
      onClick={()=>setMenuOpen(prev=>!prev)}
      className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-semibold dark:border-white/20"
      aria-expanded={menuOpen}
      aria-controls="mobile-nav-menu"
      aria-label="Toggle navigation menu"
     >
      {menuOpen ? "Close" : "Menu"}
     </button>
    </div>
   </div>

   {menuOpen && (
    <div id="mobile-nav-menu" className="mx-auto mt-3 w-full max-w-6xl rounded-xl border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-gray-900">
     <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
      <Link to="/" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Home</Link>
      <Link to="/shop" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Shop</Link>
      <Link to="/dynamic-form" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Join Us</Link>
      <Link to="/link-in-bio" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">LinkInBio</Link>
      <Link to="/currency-converter" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Currency</Link>
      <Link to="/library" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Library</Link>
      <Link to="/multi-source-dashboard" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Command Center</Link>
      <Link to="/offline-task-sync" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Paw Notes</Link>
      <Link to="/feedback" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Feedback</Link>

      {(user?.role === "admin" || user?.role === "manager") && (
       <Link to="/inventory" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Inventory</Link>
      )}

      {user?.role === "admin" && (
       <Link to="/dashboard" className="rounded-lg bg-black/5 px-3 py-2 font-medium dark:bg-white/10">Dashboard</Link>
      )}
     </div>

     <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 dark:border-white/10">
      <button
       onClick={toggleTheme}
       className="rounded-lg border border-black/15 px-3 py-2 text-sm font-semibold dark:border-white/20"
      >
       Theme: {config.theme === "dark" ? "Light" : "Dark"}
      </button>

      {user && (
       <span className="max-w-full truncate text-xs text-gray-600 dark:text-gray-300">
        {user.email}
       </span>
      )}

      {user ? (
       <button
        onClick={logout}
        className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
        style={{background:config.primaryColor}}
       >
        Logout
       </button>
      ) : (
       <div className="flex gap-2">
        <Link
         to="/register"
         className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
         style={{background:config.primaryColor}}
        >
         Register
        </Link>
        <Link
         to="/login"
         className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
         style={{background:config.primaryColor}}
        >
         Login
        </Link>
       </div>
      )}
     </div>
    </div>
   )}
  </nav>

 )
}