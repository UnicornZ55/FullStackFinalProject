import express from "express"

const router = express.Router()

router.get("/user/:id", async (req,res)=>{

 try{

    const id = req.params.id

  const response = await fetch(
   `https://jsonplaceholder.typicode.com/users/${id}`
  )

    if(!response.ok){
     throw new Error("Upstream service returned non-OK status")
    }

  const data = await response.json()

    if(!data || typeof data !== "object" || !data.id){
     throw new Error("Invalid upstream payload")
    }

    const locationParts = [data.address?.street, data.address?.suite].filter(Boolean)

  const result = {
   id:data.id,
   name:data.name,
   email:data.email,
     location:locationParts.join(", "),
   company:data.company.name
  }

  res.setHeader("X-Powered-By","PetVerse-Gateway")
    res.setHeader("X-Student-ID", process.env.STUDENT_ID || "663xxxx")

  res.json(result)

 }
 catch(err){

  res.status(502).json({
   error:"Bad Gateway"
  })

 }

})

export default router