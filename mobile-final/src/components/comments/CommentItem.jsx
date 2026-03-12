import { useState } from "react";

export default function CommentItem({ comment, addReply }) {

  const [text,setText] = useState("")
  const [showReply,setShowReply] = useState(false)

  return (

    <div className="ml-6 mt-4">

      {/* comment bubble */}

      <div className="bg-gray-100 p-3 rounded-md w-fit max-w-md">
        {comment.text}
      </div>

      {/* reply button */}

      <button
        className="text-blue-500 text-sm mt-1"
        onClick={()=>setShowReply(!showReply)}
      >
        Reply
      </button>

      {/* reply input */}

      {showReply && (

        <div className="flex gap-2 mt-2">

          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            className="border px-2 py-1 rounded"
            placeholder="write reply..."
          />

          <button
            className="bg-blue-500 text-white px-3 rounded"
            onClick={()=>{
              addReply(comment.id,text)
              setText("")
            }}
          >
            Send
          </button>

        </div>

      )}

      {/* recursive replies */}

      <div className="ml-4 border-l pl-4">

        {comment.replies.map(reply=>(
          <CommentItem
            key={reply.id}
            comment={reply}
            addReply={addReply}
          />
        ))}

      </div>

    </div>

  )
}