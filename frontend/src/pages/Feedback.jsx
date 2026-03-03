import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "../api/axios"

const schema = z.object({
 fullName:z.string().min(3),
 email:z.string().email(),
 message:z.string().min(5)
})

export default function Feedback(){
 const {register,handleSubmit} = useForm({
  resolver:zodResolver(schema)
 })

 const onSubmit = async(data)=>{
  await axios.post("/feedback",data)
  alert("sent")
 }

 return(
  <form onSubmit={handleSubmit(onSubmit)}>
   <input {...register("fullName")} placeholder="name"/>
   <input {...register("email")} placeholder="email"/>
   <textarea {...register("message")} placeholder="msg"/>
   <button>Submit</button>
  </form>
 )
}