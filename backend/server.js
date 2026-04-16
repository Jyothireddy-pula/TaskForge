require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const session = require("express-session")
const passport = require("./config/passport")

const taskRoutes = require("./routes/tasks")
const authRoutes = require("./routes/auth")
const workspaceRoutes = require("./routes/workspaces")

const app = express()
const server = http.createServer(app)

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173"

const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

app.set("io", io)

io.on("connection", () => {
  // Socket connected
})

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Security & core middleware
app.use(helmet())
app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
)
app.use(express.json())

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})
app.use("/api/auth", authLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/workspaces", workspaceRoutes)

app.get("/", (req, res) => {
  res.send("NexusFlow API running")
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
