import { useState } from "react"

export default function Apply(){

 const [step,setStep] = useState(1)

 const [form,setForm] = useState({
  name:"",
  email:"",
  experience:""
 })

 // STEP 1
 if(step===1){
  return(

   <div style={{padding:"20px"}}>

    <h2>Step 1 : Personal Info</h2>

    <input
    placeholder="Name"
    value={form.name}
    onChange={(e)=>setForm({...form,name:e.target.value})}
    />

    <br/>

    <input
    placeholder="Email"
    value={form.email}
    onChange={(e)=>setForm({...form,email:e.target.value})}
    />

    <br/>

    <button onClick={()=>setStep(2)}>
    Next
    </button>

   </div>

  )
 }

 // STEP 2
 if(step===2){
  return(

   <div style={{padding:"20px"}}>

    <h2>Step 2 : Experience</h2>

    <input
    placeholder="Experience"
    value={form.experience}
    onChange={(e)=>setForm({...form,experience:e.target.value})}
    />

    <br/>

    <button onClick={()=>setStep(1)}>
    Back
    </button>

    <button onClick={()=>setStep(3)}>
    Next
    </button>

   </div>

  )
 }

 // STEP 3 REVIEW
 return(

  <div style={{padding:"20px"}}>

   <h2>Review</h2>

   <p>Name: {form.name}</p>

   <p>Email: {form.email}</p>

   <p>Experience: {form.experience}</p>

   <button onClick={()=>setStep(2)}>
   Back
   </button>

  </div>

 )

}