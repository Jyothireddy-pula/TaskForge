const express = require("express")
const Workspace = require("../models/Workspace")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// All workspace routes require authentication
router.use(authMiddleware)

// POST /api/workspaces
router.post("/", async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    const workspace = new Workspace({
      name,
      owner: req.user.id
    })

    const saved = await workspace.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/workspaces
router.get("/", async (req, res) => {
  try {
    const workspaces = await Workspace.find({ owner: req.user.id }).sort({
      createdAt: -1
    })
    res.json(workspaces)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

