import { useEffect, useState } from "react"
import io from "socket.io-client"
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  uploadAttachment
} from "../services/taskService"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  LayoutGrid, 
  Moon, 
  Sun, 
  Download, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  Award
} from "lucide-react"
import "../styles/dashboard-modern.css"

const API_BASE_URL = "http://localhost:5000"
const socket = io(API_BASE_URL)

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("priority")
  const [sortOrder, setSortOrder] = useState("desc")
  const [view, setView] = useState("board")
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("general")
  const [selectedTask, setSelectedTask] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPriority, setEditPriority] = useState("medium")
  const [editCategory, setEditCategory] = useState("general")
  const [editDueDate, setEditDueDate] = useState("")

  // Quick stats
  const [stats, setStats] = useState({
    todayCompleted: 0,
    weekProgress: 0,
    streak: 5,
    productivity: 85
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
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

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

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
    if (!title) {
      alert("Please enter a task title")
      return
    }

    try {
      const payload = { title, priority, category }
      if (dueDate) payload.dueDate = new Date(dueDate).toISOString()
      const res = await createTask(payload)
      
      // Add the new task directly to state for immediate UI update
      setTasks(prev => [res.data, ...prev])
      
      setTitle("")
      setDueDate("")
      setPriority("medium")
      setCategory("general")
    } catch (err) {
      console.error("Error adding task:", err)
      alert("Failed to add task. Please try again.")
    }
  }

  const applyTemplate = (template) => {
    setTitle(template.title)
    setCategory(template.category)
    setPriority(template.priority)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.setAttribute("data-theme", darkMode ? "light" : "dark")
  }

  const bulkDelete = async () => {
    for (const id of selectedTasks) {
      await deleteTask(id)
    }
    setSelectedTasks([])
    loadTasks()
  }

  const bulkComplete = async () => {
    for (const id of selectedTasks) {
      await updateTask(id, { completed: true })
    }
    setSelectedTasks([])
    loadTasks()
  }

  const toggleTaskSelection = (id) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    )
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

  const updateTaskTitle = async (id, data) => {
    await updateTask(id, data)
    loadTasks()
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditPriority(task.priority || "medium")
    setEditCategory(task.category || "general")
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : "")
  }

  const closeEditModal = () => {
    setEditingTask(null)
    setEditTitle("")
    setEditPriority("medium")
    setEditCategory("general")
    setEditDueDate("")
  }

  const saveEdit = async () => {
    if (!editTitle || !editingTask) return

    try {
      const payload = { 
        title: editTitle, 
        priority: editPriority, 
        category: editCategory 
      }
      if (editDueDate) payload.dueDate = new Date(editDueDate).toISOString()
      
      await updateTask(editingTask._id, payload)
      setTasks(prev => prev.map(t => t._id === editingTask._id ? { ...t, ...payload } : t))
      closeEditModal()
    } catch (err) {
      console.error("Error updating task:", err)
      alert("Failed to update task. Please try again.")
    }
  }

  const duplicateTask = async (task) => {
    try {
      const payload = { 
        title: task.title + " (copy)", 
        priority: task.priority || "medium", 
        category: task.category || "general" 
      }
      if (task.dueDate) payload.dueDate = task.dueDate
      const res = await createTask(payload)
      setTasks(prev => [res.data, ...prev])
    } catch (err) {
      console.error("Error duplicating task:", err)
    }
  }

  const exportCSV = () => {
    if (!tasks.length) return

    const header = [
      "Title",
      "Completed",
      "Priority",
      "Category",
      "Status",
      "Due Date"
    ]
    const rows = tasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.completed ? "Yes" : "No",
      t.priority || "",
      t.category || "",
      t.status || "",
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""
    ])

    const csvContent =
      [header.join(","), ...rows.map((r) => r.join(","))].join("\n")

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

  const filteredByStatus = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    if (filter === "focus") return !task.completed
    return true
  })

  const filteredTasks = filteredByStatus.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
    return matchesSearch && matchesPriority && matchesCategory
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority] || 2
      const bPriority = priorityOrder[b.priority] || 2
      return sortOrder === "desc" ? bPriority - aPriority : aPriority - bPriority
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      const aDate = new Date(a.dueDate)
      const bDate = new Date(b.dueDate)
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate
    }
    if (sortBy === "created") {
      const aDate = new Date(a.createdAt || 0)
      const bDate = new Date(b.createdAt || 0)
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate
    }
    return 0
  })

  useEffect(() => {
    const now = new Date()
    const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const dueSoon = tasks.filter(
      (t) => t.dueDate && !t.completed && new Date(t.dueDate) <= soon
    )

    if (dueSoon.length && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Task due soon", {
          body: `${dueSoon.length} task(s) are due within 24 hours`
        })
      }
    }
  }, [tasks])

  const getPriorityColor = (p) => {
    const colors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" }
    return colors[p] || colors.medium
  }

  const getCategoryIcon = (c) => {
    const icons = { work: "💼", personal: "🏠", health: "💪", general: "📋" }
    return icons[c] || icons.general
  }

  return (
    <div className={`modern-dashboard ${darkMode ? 'dark' : ''}`}>
      {/* Floating Background Elements */}
      <div className="floating-bg">
        <div className="floating-circle c1" />
        <div className="floating-circle c2" />
        <div className="floating-circle c3" />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Zap className="logo-icon" />
            <span>NexusFlow</span>
          </div>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${view === 'board' ? 'active' : ''}`}
            onClick={() => setView('board')}
          >
            <LayoutGrid size={20} />
            <span>Board View</span>
          </button>
          <button 
            className={`nav-item ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          <button className="nav-item" onClick={exportCSV}>
            <Download size={20} />
            <span>Export</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="top-actions">
            <div className="filter-chips">
              {['all', 'pending', 'completed'].map(f => (
                <button 
                  key={f}
                  className={`chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="filter-dropdowns">
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="general">📋 General</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="health">💪 Health</option>
              </select>
            </div>

            {user && (
              <div className="user-badge">
                {user.avatar && (
                  <img src={user.avatar} alt="" className="avatar" />
                )}
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">
                    {user.provider === 'google' ? 'Google' : 'Local'} Account
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stat-card glow">
            <div className="stat-icon" style={{ background: "#8b5cf6" }}>
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <h3>{completedCount}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card glow">
            <div className="stat-icon" style={{ background: "#3b82f6" }}>
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card glow">
            <div className="stat-icon" style={{ background: "#ef4444" }}>
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{tasks.filter(t => t.priority === "high" && !t.completed).length}</h3>
              <p>High Priority</p>
            </div>
          </div>

          <div className="stat-card glow">
            <div className="stat-icon" style={{ background: "#10b981" }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{Math.round(progress)}%</h3>
              <p>Progress</p>
            </div>
          </div>

          <div className="stat-card glow streak-card">
            <div className="stat-icon" style={{ background: "#f59e0b" }}>
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.streak} 🔥</h3>
              <p>Day Streak</p>
            </div>
          </div>
        </section>

        {/* Quick Add Task */}
        <section className="quick-add-section">
          <div className="quick-add-card">
            <div className="input-group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="task-input"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-input"
              />
            </div>
            
            <div className="input-actions">
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
                style={{ borderColor: getPriorityColor(priority) }}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="general">📋 General</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="health">💪 Health</option>
              </select>

              <button 
                className="add-btn"
                onClick={addTask}
                disabled={!title}
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>
        </section>

        {/* Task List */}
        <section className="tasks-section">
          <div className="section-header">
            <h2>Your Tasks</h2>
            <div className="section-actions">
              <span className="task-count">{filteredTasks.length} tasks</span>
              <div className="sort-controls">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="created">Sort by Created</option>
                </select>
                <button 
                  className="sort-order-btn"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>
          </div>

          <div className="tasks-container">
            {sortedTasks.length === 0 ? (
              <div className="empty-state">
                <Target size={48} />
                <h3>No tasks found</h3>
                <p>Add your first task to get started!</p>
              </div>
            ) : (
              <div className="task-list">
                {sortedTasks.map((task) => (
                  <div 
                    key={task._id}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                    onClick={() => toggleTask(task)}
                  >
                    <div className="task-checkbox">
                      {task.completed && <CheckCircle2 size={20} />}
                    </div>
                    
                    <div className="task-content">
                      <span className="task-title">{task.title}</span>
                      <div className="task-meta">
                        <span 
                          className="priority-badge"
                          style={{ background: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </span>
                        <span className="category-badge">
                          {getCategoryIcon(task.category)} {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="due-date">
                            <Clock size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(task)
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn duplicate-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateTask(task)
                        }}
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTask(task._id)
                        }}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Progress Ring */}
      <div className="progress-ring-container">
        <svg className="progress-ring" viewBox="0 0 100 100">
          <circle 
            className="progress-ring-bg" 
            cx="50" cy="50" r="45"
          />
          <circle 
            className="progress-ring-fill" 
            cx="50" cy="50" r="45"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
            }}
          />
        </svg>
        <div className="progress-text">{Math.round(progress)}%</div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <div className="modal-inputs">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                className="modal-input"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="modal-input"
              />
              <select 
                value={editPriority} 
                onChange={(e) => setEditPriority(e.target.value)}
                className="modal-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              <select 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)}
                className="modal-select"
              >
                <option value="general">📋 General</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="health">💪 Health</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={closeEditModal}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard