function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function getCalendarDays(current) {
  const start = startOfMonth(current)
  const end = endOfMonth(current)

  const startWeekDay = start.getDay() // 0-6
  const daysInMonth = end.getDate()

  const cells = []
  // leading empty cells
  for (let i = 0; i < startWeekDay; i++) {
    cells.push(null)
  }
  // days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(current.getFullYear(), current.getMonth(), d))
  }
  return cells
}

function CalendarView({ tasks }) {
  const today = new Date()
  const [current, setCurrent] = React.useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const cells = getCalendarDays(current)

  const tasksByDay = tasks.reduce((acc, t) => {
    if (!t.dueDate) return acc
    const d = new Date(t.dueDate)
    if (
      d.getMonth() === current.getMonth() &&
      d.getFullYear() === current.getFullYear()
    ) {
      const key = d.getDate()
      if (!acc[key]) acc[key] = []
      acc[key].push(t)
    }
    return acc
  }, {})

  const monthLabel = current.toLocaleString("default", {
    month: "long",
    year: "numeric"
  })

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button
          onClick={() =>
            setCurrent(
              new Date(current.getFullYear(), current.getMonth() - 1, 1)
            )
          }
        >
          ‹
        </button>
        <span>{monthLabel}</span>
        <button
          onClick={() =>
            setCurrent(
              new Date(current.getFullYear(), current.getMonth() + 1, 1)
            )
          }
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
        ))}

        {cells.map((date, idx) => {
          if (!date) {
            return <div key={idx} className="calendar-cell empty" />
          }

          const day = date.getDate()
          const dayTasks = tasksByDay[day] || []

          return (
            <div key={idx} className="calendar-cell">
              <div className="calendar-cell-date">{day}</div>
              <div className="calendar-cell-tasks">
                {dayTasks.map((t) => (
                  <div
                    key={t._id}
                    className={`calendar-task ${
                      t.completed ? "calendar-task-completed" : ""
                    }`}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView

