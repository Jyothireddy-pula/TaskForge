require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const taskRoutes = require("./routes/tasks")
const authRoutes = require("./routes/auth")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

app.set("io", io)

io.on("connection", () => {
  // Socket connected
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.send("TaskForge API running")
})

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")

    const PORT = process.env.PORT || 5000

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err)
  })
