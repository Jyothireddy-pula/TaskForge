const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  category: {
    type: String,
    default: "general"
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  // Link each task to a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  // Optional file attachment URL (e.g. Cloudinary)
  attachmentUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Task", TaskSchema)