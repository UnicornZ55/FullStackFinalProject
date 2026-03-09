import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import axios from "../api/axios"

export default function Login(){

 const navigate = useNavigate()
 const login = useAuthStore(s=>s.login)

 const [step,setStep] = useState(1)

 const [form,setForm] = useState({
  email:"",
  password:"",
 })

 const progress = (step/3)*100

 return(

  <div className="flex justify-center items-center min-h-screen">

   <div className="bg-white shadow-lg rounded-xl p-8 w-[380px]">

    {/* STEP TEXT */}

    <h2 className="text-center text-xl font-semibold mb-4">
     Step {step} of 3
    </h2>

    {/* PROGRESS BAR */}

    <div className="w-full bg-gray-200 h-2 rounded mb-6">

     <div
      className="bg-blue-500 h-2 rounded transition-all"
      style={{width:`${progress}%`}}
     />

    </div>

    {/* STEP 1 */}

    {step===1 &&(

     <>

      <label>Email</label>

      <input
      required
      className="w-full border rounded p-2 mb-3"
      value={form.email}
      onChange={(e)=>setForm({...form,email:e.target.value})}
      />

      <label>Password</label>

      <input
      type="password"
      className="w-full border rounded p-2 mb-3"
      value={form.password}
      onChange={(e)=>setForm({...form,password:e.target.value})}
      />

      <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={()=>{

        if(!form.email || !form.password){

          alert("email and password are required")

          return

        }

        setStep(2)

      }}
      >
      Next
      </button>

     </>

    )}

    {/* STEP 2 */}

    {step===2 &&(

     <>

      <p>Email: {form.email}</p>
      {/* <p>Username: {form.username}</p> */}

      <div className="flex gap-3 mt-4">

       <button
       className="border px-4 py-2 rounded"
       onClick={()=>setStep(1)}
       >
       Back
       </button>

       <button
       className="bg-blue-500 text-white px-4 py-2 rounded"
       onClick={()=>setStep(3)}
       >
       Next
       </button>

      </div>

     </>

    )}

    {/* STEP 3 */}

    {step===3 &&(

     <>

      <p className="mb-4">Confirm Login</p>

      <p>Email: {form.email}</p>
      {/* <p>Username: {form.username}</p> */}

      <div className="flex gap-3 mt-4">

       <button
       className="border px-4 py-2 rounded"
       onClick={()=>setStep(2)}
       >
       Back
       </button>

       <button
       className="bg-blue-500 text-white px-4 py-2 rounded"
       onClick={async () => {

        try{

        const res = await axios.post("/auth/login",{

          email:form.email,
          password:form.password

        })

        login(res.data)

        navigate("/dashboard")

      }
      catch(err){

        alert("Invalid login")

        }

       }}
       >
       Login
       </button>

      </div>

     </>

    )}

   </div>

  </div>

 )

}