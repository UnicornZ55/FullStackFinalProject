import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, ThemeContext } from "./context/ThemeContext"
import { useContext } from "react"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Feedback from "./pages/Feedback"


function Layout(){

  const { config } = useContext(ThemeContext)

  return (

    <div
      className={`min-h-screen transition-colors duration-300 ${
        config.theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <Navbar/>

      <Routes>

        <Route path="/" element={<Home/>}/>

        <Route path="/shop" element={<Shop/>}/>

        <Route path="/product/:id" element={<ProductDetail/>}/>

        <Route path="/login" element={<Login/>}/>

        <Route path="/cart" element={<Cart/>}/>

        <Route path="/dashboard" element={<Dashboard/>}/>

        <Route path="/feedback" element={<Feedback/>}/>

      </Routes>

    </div>

  )
}


export default function App(){

 return(

    <ThemeProvider>

      <BrowserRouter>

        <Layout/>

      </BrowserRouter>

    </ThemeProvider>

 )

}