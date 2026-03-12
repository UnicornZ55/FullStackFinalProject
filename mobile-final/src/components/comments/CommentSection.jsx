import { useState } from "react"
import CommentItem from "./CommentItem"

export default function CommentSection(){

  const [comments,setComments] = useState([
    {
      id:1,
      text:"First comment",
      replies:[]
    }
  ])

  const addReply = (id,text)=>{

    const update = (list)=>{

      return list.map(c=>{

        if(c.id===id){
          return {
            ...c,
            replies:[
              ...c.replies,
              {id:Date.now(),text,replies:[]}
            ]
          }
        }

        if(c.replies.length>0){
          return {
            ...c,
            replies:update(c.replies)
          }
        }

        return c

      })

    }

    setComments(update(comments))
  }

  return(
    <div>

      {comments.map(c=>(
        <CommentItem
          key={c.id}
          comment={c}
          addReply={addReply}
        />
      ))}

    </div>
  )
}