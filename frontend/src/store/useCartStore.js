import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(

 persist(

 (set,get)=>({

  items:[],

  add:(product)=>{

   const items = get().items

   const exist = items.find(i=>i._id===product._id)

   if(exist){

    set({
     items:items.map(i=>
      i._id===product._id
       ? {...i,qty:i.qty+1}
       : i
     )
    })

   }else{

    set({
     items:[...items,{...product,qty:1}]
    })

   }

  },

  remove:(id)=>{

   set({
    items:get().items.filter(i=>i._id!==id)
   })

  },

  clear:()=>set({items:[]})

 }),

 {
  name:"cart-storage"
 }

 )

)