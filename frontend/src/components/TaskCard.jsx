import { useState } from "react"

function TaskCard({ task, onDelete, onToggle, onUpdate, onUpload }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleSave = () => {
    if (!title.trim()) return
    onUpdate(task._id, { title })
    setEditing(false)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      await onUpload(task._id, file)
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="task-card">
      {editing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-edit-input"
          />
          <div className="task-actions">
            <button className="btn-edit" onClick={handleSave}>
              Save
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className={task.completed ? "completed" : ""}>{task.title}</h3>
          <div style={{ marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Status:</span>
            <select
              value={task.status || "todo"}
              onChange={(e) =>
                onUpdate(task._id, { status: e.target.value })
              }
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid #e5e7eb"
              }}
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Due:</span>
            <input
              type="date"
              value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
              onChange={(e) => {
                const val = e.target.value
                onUpdate(task._id, { dueDate: val ? new Date(val).toISOString() : null })
              }}
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #e5e7eb"
              }}
            />
          </div>
          <div className="task-actions">
            <button className="btn-toggle" onClick={() => onToggle(task)}>
              {task.completed ? "Undo" : "Done"}
            </button>
            <button className="btn-edit" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: 12 }}>
            <div style={{ marginBottom: 4 }}>
              Attachment:{" "}
              {task.attachmentUrl ? (
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#3b82f6" }}
                >
                  Open file
                </a>
              ) : (
                <span style={{ opacity: 0.7 }}>None</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ fontSize: 11 }}
              />
              <button
                disabled={!file || uploading}
                onClick={handleUpload}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  background: "#6366f1",
                  color: "white",
                  fontSize: 11
                }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard

