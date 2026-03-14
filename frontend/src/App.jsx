import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Dashboard from "./pages/Dashboard"
import AuthPanel from "./components/AuthPanel"

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true

    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light") {
      return stored === "dark"
    }

    if (window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    return true
  })

  const [user, setUser] = useState(null)

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
    const theme = darkMode ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    setUser(null)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "Arial, sans-serif",
        transition: "all 0.3s ease"
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: `1px solid var(--border)`
        }}
      >
        <h2 style={{ letterSpacing: "1px", color: "var(--text-h)" }}>
          🚀 TaskForge
        </h2>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user && (
            <>
              <span style={{ fontSize: 14, opacity: 0.8 }}>
                Hi, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: "var(--border)",
                  color: "var(--text)"
                }}
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: darkMode ? "#6366f1" : "#2563eb",
              color: "white"
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Animated main container */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "40px"
        }}
      >
        {user ? (
          <Dashboard />
        ) : (
          <AuthPanel
            onAuth={(u) => {
              setUser(u)
            }}
          />
        )}
      </motion.main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          opacity: 0.6
        }}
      >
        TaskForge • Productivity Platform
      </footer>
    </div>
  )
}

export default App