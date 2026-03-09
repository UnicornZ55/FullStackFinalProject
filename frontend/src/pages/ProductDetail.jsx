import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom"
import CommentSection from "../components/comments/CommentSection";

export default function ProductDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const add = useCartStore((s) => s.add);

  const [product,setProduct] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const fetchProduct = async ()=>{

      try{

        const res = await axios.get(`/products/${id}`)

        setProduct(res.data)

      }
      catch(err){

        setProduct(null)

      }
      finally{

        setLoading(false)

      }

    }

    fetchProduct()

  },[id])
  

  if(loading) return <p className="p-6">Loading...</p>

  if(!product) return <p className="p-6">Product not found</p>
  
  if(!product){
    return <p className="p-6">Product not found</p>
  }
  return(

    <div className="max-w-6xl mx-auto p-6">
      <button onClick={()=>navigate(-1)}>
        Back
      </button>
      <div className="grid md:grid-cols-2 gap-10">

        {/* image */}

        <div className="border rounded p-4 bg-white">

          <img
            src={product.image}
            alt={product.name}
            className="w-full object-contain"
          />

        </div>

        {/* product info */}

        <div>

          <p className="text-blue-600 font-semibold mb-2">
            {product.brand}
          </p>

          <h1 className="text-2xl font-bold mb-3">
            {product.name}
          </h1>

          <p className="text-gray-500 mb-4">
            {product.description}
          </p>

          <p className="text-xl font-semibold mb-4">
            {product.price} บาท
          </p>

          <button
            onClick={()=>add(product)}
            className="bg-blue-500 text-white px-5 py-2 rounded"
          >
            Add to Cart
          </button>

          <div className="mt-6 text-sm text-gray-500">

            <p>Category: {product.category}</p>

            <p>Age: {product.age}</p>

            <p>Stock: {product.stock}</p>

          </div>

        </div>

      </div>

      {/* ⭐ Comments (Function 1.4) */}

      <div className="mt-12 border-t pt-6">

        <CommentSection/>

      </div>

    </div>

  )

}