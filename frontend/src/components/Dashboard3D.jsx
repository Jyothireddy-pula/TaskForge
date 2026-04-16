import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { 
  getTasks, 
  createTask, 
  deleteTask, 
  updateTask, 
  uploadAttachment 
} from "../services/taskService"
import { 
  Plus, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Settings, 
  LogOut, 
  User,
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react'
import "../styles/advanced3d.css"

const API_BASE_URL = "http://localhost:5000"
const socket = io(API_BASE_URL)

function Dashboard3D() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState("board")
  const [user, setUser] = useState(null)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }

    const stored = localStorage.getItem("tasks")
    if (stored) {
      setTasks(JSON.parse(stored))
    }
    loadTasks()

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [task, ...prev])
    })
    socket.on("taskUpdated", (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)))
    })
    socket.on("taskDeleted", ({ id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== id))
    })

    return () => {
      socket.off("taskCreated")
      socket.off("taskUpdated")
      socket.off("taskDeleted")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const loadTasks = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addTask = async () => {
    if (!title) return

    const payload = { title }
    if (dueDate) payload.dueDate = new Date(dueDate).toISOString()
    await createTask(payload)
    setTitle("")
    setDueDate("")
    setIsAddingTask(false)
    loadTasks()
  }

  const removeTask = async (id) => {
    await deleteTask(id)
    loadTasks()
  }

  const toggleTask = async (task) => {
    await updateTask(task._id, {
      completed: !task.completed
    })
    loadTasks()
  }

  const exportCSV = () => {
    if (!tasks.length) return

    const header = ["Title", "Completed", "Due Date"]
    const rows = tasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.completed ? "Yes" : "No",
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""
    ])

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "tasks.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const total = tasks.length
  const completedCount = tasks.filter((t) => t.completed).length
  const pending = total - completedCount
  const progress = total ? (completedCount / total) * 100 : 0

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed))
  )

  return (
    <div className="container-3d" style={{ minHeight: "100vh", padding: "20px" }}>
      {/* 3D Header */}
      <header className="header-3d" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        padding: "20px 30px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "25px",
        boxShadow: "var(--glass-shadow)",
        transform: "translateZ(20px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="logo-3d" style={{
            fontSize: "2.5rem",
            animation: "logoSpin 4s ease-in-out infinite"
          }}>
            <Sparkles style={{ 
              width: "50px", 
              height: "50px", 
              color: "#8b5cf6",
              filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))"
            }} />
          </div>
          <div>
            <h1 className="text-3d" style={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0
            }}>
              NexusFlow
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
              Digital Task Management
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="user-profile-3d glass-card" style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "15px 25px",
            borderRadius: "20px",
            transform: "translateZ(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255, 255, 255, 0.2)"
                }}
              />
            ) : (
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <User size={20} color="white" />
              </div>
            )}
            <div>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: 600, 
                color: "white" 
              }}>
                {user.name}
              </div>
              <div style={{ 
                fontSize: "12px", 
                color: "rgba(255, 255, 255, 0.7)" 
              }}>
                {user.provider === 'google' ? 'Google Account' : 'Local Account'}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3D Stats Cards */}
      <div className="stats-grid-3d" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div className="stat-card-3d glass-card hover-glow" style={{
          padding: "25px",
          textAlign: "center",
          transform: "translateZ(15px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <Target style={{ 
            width: "40px", 
            height: "40px", 
            color: "#8b5cf6",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))"
          }} />
          <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
            {total}
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            Total Tasks
          </p>
        </div>

        <div className="stat-card-3d glass-card hover-glow" style={{
          padding: "25px",
          textAlign: "center",
          transform: "translateZ(15px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <CheckCircle2 style={{ 
            width: "40px", 
            height: "40px", 
            color: "#10b981",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))"
          }} />
          <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
            {completedCount}
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            Completed
          </p>
        </div>

        <div className="stat-card-3d glass-card hover-glow" style={{
          padding: "25px",
          textAlign: "center",
          transform: "translateZ(15px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <Clock style={{ 
            width: "40px", 
            height: "40px", 
            color: "#f97316",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))"
          }} />
          <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
            {pending}
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            Pending
          </p>
        </div>

        <div className="stat-card-3d glass-card hover-glow" style={{
          padding: "25px",
          textAlign: "center",
          transform: "translateZ(15px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <TrendingUp style={{ 
            width: "40px", 
            height: "40px", 
            color: "#ec4899",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))"
          }} />
          <h3 style={{ color: "white", fontSize: "2rem", fontWeight: 700, margin: 0 }}>
            {Math.round(progress)}%
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            Progress
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container-3d" style={{
        marginBottom: "40px",
        padding: "20px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "20px",
        boxShadow: "var(--glass-shadow)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <span style={{ color: "white", fontWeight: 600 }}>Overall Progress</span>
          <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{
          width: "100%",
          height: "10px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)",
            borderRadius: "10px",
            transition: "width 0.3s ease",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
          }} />
        </div>
      </div>

      {/* Task Input Section */}
      <div className="task-input-3d glass-card" style={{
        marginBottom: "40px",
        padding: "30px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "25px",
        boxShadow: "var(--glass-shadow)",
        transform: "translateZ(10px)"
      }}>
        {isAddingTask ? (
          <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="input-3d"
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "15px",
                  color: "white",
                  fontSize: "16px",
                  backdropFilter: "blur(10px)"
                }}
              />
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-3d"
              style={{
                padding: "15px 20px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "15px",
                color: "white",
                backdropFilter: "blur(10px)"
              }}
            />
            <button
              onClick={addTask}
              className="btn-3d"
              style={{
                padding: "15px 25px",
                background: "linear-gradient(45deg, #10b981, #3b82f6)",
                border: "none",
                borderRadius: "15px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <CheckCircle2 size={20} />
              Add Task
            </button>
            <button
              onClick={() => {
                setIsAddingTask(false)
                setTitle("")
                setDueDate("")
              }}
              style={{
                padding: "15px 20px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "15px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="btn-3d"
            style={{
              width: "100%",
              padding: "20px",
              background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
              border: "none",
              borderRadius: "20px",
              color: "white",
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transform: "translateZ(5px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <Plus size={24} />
            Add New Task
          </button>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="filter-search-3d glass-card" style={{
        marginBottom: "40px",
        padding: "25px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "20px",
        boxShadow: "var(--glass-shadow)",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ position: "relative" }}>
            <Search 
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255, 255, 255, 0.5)",
                width: "20px",
                height: "20px"
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-3d"
              style={{
                width: "100%",
                padding: "12px 15px 12px 45px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
                backdropFilter: "blur(10px)"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {["all", "pending", "completed"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`filter-btn-3d ${filter === filterType ? "active" : ""}`}
              style={{
                padding: "10px 20px",
                background: filter === filterType 
                  ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" 
                  : "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: filter === filterType ? "translateZ(5px)" : "translateZ(0)"
              }}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={exportCSV}
          className="btn-3d"
          style={{
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-grid-3d" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {filteredTasks.map((task, index) => (
          <div
            key={task._id}
            className="task-card-3d glass-card"
            onMouseEnter={() => setHoveredCard(task._id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              padding: "25px",
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "20px",
              boxShadow: "var(--glass-shadow)",
              transform: hoveredCard === task._id 
                ? "translateZ(20px) rotateX(2deg) rotateY(2deg)" 
                : `translateZ(${10 + index * 2}px)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              opacity: task.completed ? 0.7 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
              <button
                onClick={() => toggleTask(task)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                  marginTop: "2px"
                }}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : (
                  <Circle size={20} color="rgba(255, 255, 255, 0.5)" />
                )}
              </button>
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 10px 0",
                  textDecoration: task.completed ? "line-through" : "none"
                }}>
                  {task.title}
                </h3>
                
                {task.dueDate && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "14px"
                  }}>
                    <Calendar size={14} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeTask(task._id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                  color: "rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ef4444"
                  e.target.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(255, 255, 255, 0.5)"
                  e.target.style.transform = "scale(1)"
                }}
              >
                <AlertCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state-3d glass-card" style={{
          padding: "60px",
          textAlign: "center",
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          borderRadius: "25px",
          boxShadow: "var(--glass-shadow)",
          transform: "translateZ(10px)"
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "20px",
            animation: "float 3s ease-in-out infinite"
          }}>
            <Zap style={{ 
              width: "80px", 
              height: "80px", 
              color: "#8b5cf6",
              filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))"
            }} />
          </div>
          <h3 style={{ 
            color: "white", 
            fontSize: "1.5rem", 
            fontWeight: 600,
            marginBottom: "10px"
          }}>
            No tasks found
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {search ? "Try adjusting your search terms" : "Start by adding a new task"}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes logoSpin {
          0%, 100% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .task-card-3d:hover {
          box-shadow: 0 25px 50px rgba(139, 92, 246, 0.3) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
        }

        .stat-card-3d:hover {
          transform: translateZ(25px) translateY(-5px) !important;
        }

        .filter-btn-3d:hover {
          transform: translateY(-2px) translateZ(10px) !important;
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3) !important;
        }
      `}</style>
    </div>
  )
}

export default Dashboard3D
