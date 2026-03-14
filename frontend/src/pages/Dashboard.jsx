import { useEffect, useState } from "react"
import io from "socket.io-client"
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  uploadAttachment
} from "../services/taskService"
import TaskList from "../components/TaskList"
import StatsChart from "../components/StatsChart"
import CalendarView from "../components/CalendarView"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const socket = io(API_BASE_URL)

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState("board")

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
    if (!title) return

    await createTask({ title })
    setTitle("")
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

  const updateTaskTitle = async (id, data) => {
    await updateTask(id, data)
    loadTasks()
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

  const filteredTasks = filteredByStatus.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

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

  return (
    <div className="dashboard">
      <h1>TaskForge</h1>

      <div className="view-toggle">
        <button
          className={view === "board" ? "view-toggle-active" : ""}
          onClick={() => setView("board")}
        >
          Board
        </button>
        <button
          className={view === "calendar" ? "view-toggle-active" : ""}
          onClick={() => setView("calendar")}
        >
          Calendar
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completedCount}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <StatsChart tasks={tasks} />
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="task-input">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
        />

        <button onClick={addTask}>Add</button>

        <button onClick={exportCSV}>Export CSV</button>
      </div>

      {view === "board" ? (
        <>
          <div className="task-filters">
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-buttons">
              <button onClick={() => setFilter("all")}>All</button>
              <button onClick={() => setFilter("completed")}>Completed</button>
              <button onClick={() => setFilter("pending")}>Pending</button>
              <button onClick={() => setFilter("focus")}>Focus mode</button>
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            onDelete={removeTask}
            onToggle={toggleTask}
            onUpdate={updateTaskTitle}
            onReorder={(reordered) => setTasks(reordered)}
            onUpload={async (id, file) => {
              await uploadAttachment(id, file)
              loadTasks()
            }}
          />
        </>
      ) : (
        <CalendarView tasks={tasks} />
      )}
    </div>
  )
}

export default Dashboard