import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import axios from "../api/axios"

const schema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .regex(/^[A-Za-zก-๙\s]+$/, "Only English/Thai letters allowed"),
  email: z.string().email("Invalid email format"),
  category: z.enum(["Bug", "Suggestion", "Inquiry"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(500, "Message must be at most 500 characters"),
})

export default function Feedback() {
 const [serverResponse, setServerResponse] = useState(null)

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
 } = useForm({
  resolver: zodResolver(schema),
  mode: "onTouched",
 })

 const onSubmit = async (data) => {
  setServerResponse(null)

  //function 6.1 C5
  try {
   const response = await axios.post("/feedback", data)
   setServerResponse(response.data)
   toast.success("Feedback submitted successfully")
   reset()
  } catch (err) {
   const message =
    err?.response?.data?.message ||
    err?.message ||
    "Unable to send feedback"
   toast.error(message)
  }
 }

 return (
  <div className="max-w-xl mx-auto p-4">
   <h1 className="text-2xl font-semibold mb-4">Customer Feedback Form™</h1>

   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div>
     <label className="block text-sm font-medium mb-1" htmlFor="fullName">
      Full name
     </label>
     <input
      id="fullName"
      type="text"
      {...register("fullName")}
      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
       errors.fullName
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
      }`}
     />
     {errors.fullName && (
      <p className="mt-1 text-sm text-red-600">
       {errors.fullName.message}
      </p>
     )}
    </div>

    <div>
     <label className="block text-sm font-medium mb-1" htmlFor="email">
      Email
     </label>
     <input
      id="email"
      type="email"
      {...register("email")}
      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
       errors.email
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
      }`}
     />
     {errors.email && (
      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
     )}
    </div>

    <div>
     <label className="block text-sm font-medium mb-1" htmlFor="category">
      Category
     </label>
     <select
      id="category"
      {...register("category")}
      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
       errors.category
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
      }`}
     >
      <option value="">Select category</option>
      <option value="Bug">Bug</option>
      <option value="Suggestion">Suggestion</option>
      <option value="Inquiry">Inquiry</option>
     </select>
     {errors.category && (
      <p className="mt-1 text-sm text-red-600">
       {errors.category.message}
      </p>
     )}
    </div>

    <div>
     <label className="block text-sm font-medium mb-1" htmlFor="message">
      Message
     </label>
     <textarea
      id="message"
      rows={6}
      {...register("message")}
      className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring ${
       errors.message
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
      }`}
     />
     {errors.message && (
      <p className="mt-1 text-sm text-red-600">
       {errors.message.message}
      </p>
     )}
    </div>

    <button
     type="submit"
     disabled={isSubmitting}
     className={`w-full rounded py-2 text-white font-semibold transition ${
      isSubmitting
       ? "bg-gray-400 cursor-not-allowed"
       : "bg-indigo-600 hover:bg-indigo-700"
     }`}
    >
     {isSubmitting ? "Sending..." : "Send Feedback"}
    </button>
   </form>

   {serverResponse && (
    <div className="mt-6 rounded border border-green-200 bg-green-50 p-4">
     <h2 className="font-semibold">Server response</h2>
     <pre className="mt-2 text-xs text-gray-800">
      {JSON.stringify(serverResponse, null, 2)}
     </pre>
    </div>
   )}
  </div>
 )
}
