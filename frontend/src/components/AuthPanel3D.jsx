import { useState } from "react"
import { login, signup, googleLogin } from "../services/authService"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Zap } from 'lucide-react'
import "../styles/advanced3d.css"
import "../styles/advanced3d-enhanced.css"

function AuthPanel3D({ onAuth }) {
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      let res
      if (mode === "login") {
        res = await login({ email, password })
      } else {
        res = await signup({ name, email, password })
      }
      const { token, user } = res.data
      localStorage.setItem("authToken", token)
      localStorage.setItem("authUser", JSON.stringify(user))
      onAuth(user)
    } catch (err) {
      console.error("Authentication Error:", err)
      const errorMessage = err.response?.data?.message || err.message || "Authentication failed"
      setError(errorMessage)
      
      if (err.response?.status === 500) {
        setError("Server error. Please check if backend is running.")
      } else if (err.response?.status === 400) {
        setError("Invalid credentials. Please check your email and password.")
      } else if (err.code === "NETWORK_ERROR") {
        setError("Network error. Please check your internet connection.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-3d" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    }}>
      <div className="auth-bg-elements">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="floating-shape shape-4" />
        <div className="floating-shape shape-5" />
        <div className="floating-shape shape-6" />
        <div className="light-ray ray-1" />
        <div className="light-ray ray-2" />
        <div className="light-ray ray-3" />
      </div>

      <div className="auth-form-3d glass-card" style={{ width: "100%", maxWidth: "480px", padding: "45px", position: "relative", zIndex: 10, background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.18)", borderRadius: "25px", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}>
        <div className="auth-header" style={{ textAlign: "center", marginBottom: "35px" }}>
          <div className="logo-3d" style={{ marginBottom: "15px" }}>
            <Sparkles style={{ width: "55px", height: "55px", color: "#8b5cf6", filter: "drop-shadow(0 0 25px rgba(139, 92, 246, 0.6))" }} />
          </div>
          <h1 className="text-3d" style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0 }}>
            NexusFlow
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.95rem", marginTop: "10px", fontWeight: 400 }}>
            {mode === "login" ? "Welcome back to the future" : "Create your digital universe"}
          </p>
        </div>

        <div className="mode-switcher-3d" style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
          <button onClick={() => setMode("login")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid rgba(255, 255, 255, 0.1)", background: mode === "login" ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" : "transparent", color: "white", fontWeight: 600, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            Login
          </button>
          <button onClick={() => setMode("signup")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid rgba(255, 255, 255, 0.1)", background: mode === "signup" ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" : "transparent", color: "white", fontWeight: 600, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {mode === "signup" && (
            <div className="input-group-3d">
              <div className="input-wrapper-3d" style={{ position: "relative" }}>
                <User style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.5)", width: "20px", height: "20px", transition: "all 0.3s ease" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required style={{ width: "100%", padding: "14px 14px 14px 48px", background: "rgba(255, 255, 255, 0.05)", border: "2px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", color: "white", fontSize: "15px", backdropFilter: "blur(10px)" }} />
              </div>
            </div>
          )}

          <div className="input-group-3d">
            <div className="input-wrapper-3d" style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.5)", width: "20px", height: "20px", transition: "all 0.3s ease" }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required style={{ width: "100%", padding: "14px 14px 14px 48px", background: "rgba(255, 255, 255, 0.05)", border: "2px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", color: "white", fontSize: "15px", backdropFilter: "blur(10px)" }} />
            </div>
          </div>

          <div className="input-group-3d">
            <div className="input-wrapper-3d" style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.5)", width: "20px", height: "20px", transition: "all 0.3s ease" }} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: "100%", padding: "14px 14px 14px 48px", background: "rgba(255, 255, 255, 0.05)", border: "2px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", color: "white", fontSize: "15px", backdropFilter: "blur(10px)" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", background: "none", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px", color: "rgba(255, 255, 255, 0.5)", cursor: "pointer", padding: "8px 12px" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", color: "#ef4444", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ padding: "14px 28px", background: loading ? "rgba(255, 255, 255, 0.1)" : "linear-gradient(45deg, #8b5cf6, #3b82f6)", border: "none", borderRadius: "14px", color: "white", fontSize: "16px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing..." : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                <Zap size={20} />
                <span>{mode === "login" ? "Enter NexusFlow" : "Create NexusFlow"}</span>
              </div>
            )}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "25px 0", gap: "15px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)" }} />
          <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px", fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)" }} />
        </div>

        <button onClick={googleLogin} disabled={loading} style={{ width: "100%", padding: "14px", background: "rgba(255, 255, 255, 0.05)", border: "2px solid rgba(255, 255, 255, 0.1)", borderRadius: "14px", color: "white", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default AuthPanel3D
