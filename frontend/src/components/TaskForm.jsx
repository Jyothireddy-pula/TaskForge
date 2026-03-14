import { useState } from "react"

function TaskForm({onAdd}) {

 const [title,setTitle] = useState("")

 const handleSubmit = (e)=>{
  e.preventDefault()

  if(!title) return

  onAdd({title})

  setTitle("")
 }

 return(

  <form onSubmit={handleSubmit}>

   <input
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
    placeholder="Add new task"
   />

   <button type="submit">
    Add Task
   </button>
   <button onClick={()=>setEditing(true)}>Edit</button>

  </form>

 )
}

export default TaskForm