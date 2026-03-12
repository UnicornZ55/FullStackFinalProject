import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, ThemeContext } from "./context/ThemeContext"
import { useContext } from "react"
import { Toaster } from "react-hot-toast"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Feedback from "./pages/Feedback"
import Register from "./pages/Register"
import Inventory from "./pages/Inventory"
import DynamicForm from "./pages/DynamicForm"
import LinkInBio from "./pages/LinkInBio"
import CurrencyConverter from "./pages/CurrencyConverter"
import LibraryHome from "./pages/LibraryHome"
import LibraryDetails from "./pages/LibraryDetails"
import MultiSourceDashboard from "./pages/MultiSourceDashboard"
import OfflineTaskSynchronizer from "./pages/OfflineTaskSynchronizer"
import { RegisterProvider } from "./context/RegisterContext"

function Layout(){

  const { config } = useContext(ThemeContext)

  return (

    <div
      className={`min-h-screen transition-colors duration-300 ${
        config.theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-[#FFE6C9] text-black"
      }`}
    >

      <Navbar/>

      <Routes>

        <Route path="/" element={<Home/>}/>

        <Route path="/shop" element={<Shop/>}/>

        <Route path="/product/:id" element={<ProductDetail/>}/>

        <Route path="/login" element={<Login/>}/>

        <Route path="/register" element={<Register/>}/>

        <Route
          path="/inventory"
          element={
            <ProtectedRoute role={["admin", "manager"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route path="/dynamic-form" element={<DynamicForm />} />

        <Route path="/link-in-bio" element={<LinkInBio />} />

        <Route path="/currency-converter" element={<CurrencyConverter />} />

        <Route path="/library" element={<LibraryHome />} />

        <Route path="/library/:workId" element={<LibraryDetails />} />

        <Route path="/multi-source-dashboard" element={<MultiSourceDashboard />} />

        <Route path="/offline-task-sync" element={<OfflineTaskSynchronizer />} />

        <Route path="/cart" element={<Cart/>}/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard/>
            </ProtectedRoute>
          }
        />

        <Route path="/feedback" element={<Feedback/>}/>
      </Routes>

    </div>

  )
}


export default function App(){

 return(

    <ThemeProvider>

      <RegisterProvider>
        <BrowserRouter>

          <Layout/>        <Toaster position="top-right" />
        </BrowserRouter>
      </RegisterProvider>

    </ThemeProvider>

 )

}