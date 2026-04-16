import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Routes, Route, Navigate } from "react-router-dom"
import { Sparkles, Zap } from 'lucide-react'
import Dashboard3D from "./components/Dashboard3D"
import AuthPanel3D from "./components/AuthPanel3D"
import AuthCallback from "./pages/AuthCallback"
import Background3D from "./components/Background3D"
import "./styles/advanced3d.css"

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

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          handleLogout()
          alert("Your session has expired. Please log in again.")
        }
      } catch (error) {
        console.error("Error checking token expiration:", error)
      }
    }
  }

  useEffect(() => {
    checkTokenExpiration()
    const interval = setInterval(checkTokenExpiration, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container-3d" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Advanced 3D Background */}
      <Background3D />
      
      {/* Floating Navigation Header */}
      <header className="nav-header-3d glass-card" style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%) translateZ(50px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "25px",
        boxShadow: "var(--glass-shadow)",
        minWidth: "300px",
        maxWidth: "600px",
        width: "90%"
      }}>
        <div className="logo-section-3d" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            fontSize: "1.5rem",
            animation: "logoSpin 4s ease-in-out infinite"
          }}>
            <Sparkles style={{ 
              width: "30px", 
              height: "30px", 
              color: "#8b5cf6",
              filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))"
            }} />
          </div>
          <h1 className="text-3d" style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            background: "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0
          }}>
            NexusFlow
          </h1>
        </div>

        <div className="nav-actions-3d" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {user && (
            <button
              onClick={handleLogout}
              className="btn-3d logout-btn"
              style={{
                padding: "8px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "12px",
                color: "#ef4444",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: "translateZ(5px)"
              }}
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="btn-3d theme-btn"
            style={{
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: "translateZ(5px)"
            }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content-3d" style={{
        paddingTop: "100px",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1
      }}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/*" element={
            user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Dashboard3D />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <AuthPanel3D
                  onAuth={(u) => {
                    setUser(u)
                  }}
                />
              </motion.div>
            )
          } />
        </Routes>
      </main>

      {/* Floating Action Buttons */}
      <div className="floating-actions-3d" style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        zIndex: 100
      }}>
        <button className="fab-3d" style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
          transform: "translateZ(20px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <Zap size={24} />
        </button>
      </div>

      <style jsx>{`
        @keyframes logoSpin {
          0%, 100% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); }
        }

        .nav-header-3d:hover {
          transform: translateX(-50%) translateZ(60px) translateY(-2px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          transform: translateZ(10px) translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3) !important;
        }

        .theme-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateZ(10px) translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2) !important;
        }

        .fab-3d:hover {
          transform: translateZ(30px) scale(1.1) rotate(90deg);
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
        }

        .fab-3d:active {
          transform: translateZ(25px) scale(1.05) rotate(45deg);
        }
      `}</style>
    </div>
  )
}

export default App