import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { useCartStore } from "../store/useCartStore"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"

export default function Navbar(){

 const user = useAuthStore(s=>s.user)
 const logout = useAuthStore(s=>s.logout)

 const cartItems = useCartStore(s=>s.items)

 const {config,toggleTheme} = useContext(ThemeContext)

 return(

  <nav className="flex justify-between items-center px-6 py-3 shadow-lg">

   {/* LEFT */}

   <div className="flex gap-5 items-center">

    <Link
     to="/"
     className="font-bold text-lg"
     style={{color:config.primaryColor}}
    >
     🐶 PetVerse
    </Link>

    {/* <Link to="/shop">
     Shop
    </Link> */}

    {user?.role === "admin" || user?.role === "manager" ? (
      <Link to="/inventory">
        Inventory
      </Link>
    ) : null}

    {/* <Link to="/dynamic-form">
      Join Us
    </Link> */}

    <Link to="/link-in-bio">
      LinkInBio
    </Link>

    <Link to="/currency-converter">
      Currency
    </Link>

    <Link to="/library">
      Library
    </Link>

    <Link to="/multi-source-dashboard">
      Command Center
    </Link>

    <Link to="/offline-task-sync">
      🐾 Paw Notes
    </Link>

    {/* admin only */}
    {user?.role === "admin" && (
      <Link to="/dashboard">
        Dashboard
      </Link>
    )}

    <Link to="/feedback">
     Feedback
    </Link>

   </div>

   {/* RIGHT */}

   <div className="flex gap-4 items-center">

    {/* theme toggle */}

    <button
     onClick={toggleTheme}
     className="border px-2 py-1 rounded"
    >
     {config.theme==="dark"?"Light":"Dark"}
    </button>

    {/* cart */}

    {/* <Link to="/cart">
     🛒 Cart ({cartItems.length})
    </Link> */}


    {/* profile */}

    {user && (

     <div className="relative group">

      <img
       src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
       className="w-8 h-8 rounded-full cursor-pointer"
      />

      {/* hover email */}

      <div
       className="absolute right-0 top-10 text-white shadow px-3 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition"
       style={{background:config.primaryColor}}
      >

       {user.email}

      </div>

     </div>

    )}


    {/* auth buttons */}

    {user ? (

     <button
      onClick={logout}
      className="text-white px-3 py-1 rounded"
      style={{background:config.primaryColor}}
     >
      Logout
     </button>

    ) : (

     <>
      <Link
       to="/register"
       className="text-white px-3 py-1 rounded"
       style={{background:config.primaryColor}}
      >
       Register
      </Link>
      <Link
       to="/login"
       className="text-white px-3 py-1 rounded"
       style={{background:config.primaryColor}}
      >
       Login
      </Link>
     </>

    )}

   </div>

  </nav>

 )
}