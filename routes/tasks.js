const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const Task = require("../models/Task")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// All task routes require authentication
router.use(authMiddleware)

/*
GET /api/tasks
Get all tasks for the logged-in user
*/
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .exec()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
POST /api/tasks
Create a new task
*/
router.post("/", async (req, res) => {
  try {
    const { title, priority, category, dueDate, attachmentUrl } = req.body

    const task = new Task({
      title,
      priority,
      category,
      dueDate,
      attachmentUrl,
      user: req.user.id
    })

    const savedTask = await task.save()

    const io = req.app.get("io")
    if (io) {
      io.emit("taskCreated", savedTask)
    }

    res.status(201).json(savedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
PUT /api/tasks/:id
Update a task
*/
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    const io = req.app.get("io")
    if (io) {
      io.emit("taskUpdated", updatedTask)
    }

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
DELETE /api/tasks/:id
Delete a task
*/
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    const io = req.app.get("io")
    if (io) {
      io.emit("taskDeleted", { id: req.params.id })
    }

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/*
POST /api/tasks/:id/attachment
Upload a file and link it to the task
*/
router.post("/:id/attachment", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" })
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    const uploaded = await cloudinary.uploader.upload_stream(
      {
        folder: "taskforge",
        resource_type: "auto"
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message })
        }

        task.attachmentUrl = result.secure_url
        const saved = await task.save()

        const io = req.app.get("io")
        if (io) {
          io.emit("taskUpdated", saved)
        }

        res.json(saved)
      }
    )

    uploaded.end(req.file.buffer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
