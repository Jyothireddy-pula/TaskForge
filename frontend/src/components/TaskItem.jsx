import { motion } from "framer-motion"

function TaskItem({ task, onDelete }) {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="task-card"
    >
      <h3>{task.title}</h3>

      <button onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </motion.div>
  )
}