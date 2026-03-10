import express from "express"

const router = express.Router()

router.get("/user/:id", async (req,res)=>{

 try{

  const id = req.params.id

  const response = await fetch(
   `https://jsonplaceholder.typicode.com/users/${id}`
  )

  const data = await response.json()

  const result = {
   id:data.id,
   name:data.name,
   email:data.email,
   location:`${data.address.street}, ${data.address.suite}`,
   company:data.company.name
  }

  res.setHeader("X-Powered-By","PetVerse-Gateway")
  res.setHeader("X-Student-ID","663xxxx")

  res.json(result)

 }
 catch(err){

  res.status(502).json({
   error:"Bad Gateway"
  })

 }

})

export default router