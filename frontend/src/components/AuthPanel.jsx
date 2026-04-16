import { useState } from "react"
import { login, signup, googleLogin } from "../services/authService"

function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "60px auto",
        padding: 24,
        borderRadius: 16,
        background: "rgba(15,23,42,0.85)",
        color: "white",
        boxShadow:
          "0 20px 40px rgba(15,23,42,0.7), 0 0 0 1px rgba(148,163,184,0.3)"
      }}
    >
      <div style={{ display: "flex", marginBottom: 16, gap: 8 }}>
        <button
          onClick={() => setMode("login")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: mode === "login" ? "#6366f1" : "transparent",
            color: "white"
          }}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: mode === "signup" ? "#6366f1" : "transparent",
            color: "white"
          }}
        >
          Sign up
        </button>
      </div>

      <h2 style={{ marginBottom: 8 }}>
        {mode === "login" ? "Welcome back" : "Create your workspace"}
      </h2>
      <p style={{ opacity: 0.8, marginBottom: 20, fontSize: 14 }}>
        {mode === "login"
          ? "Log in to see your personal TaskForge board."
          : "Sign up to sync your tasks across devices."}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "signup" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.6)",
              background: "rgba(15,23,42,0.8)",
              color: "white"
            }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.8)",
            color: "white"
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.8)",
            color: "white"
          }}
        />

        {error && (
          <div style={{ color: "#fecaca", fontSize: 13 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 6,
            padding: "10px 0",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: loading ? "#4b5563" : "#22c55e",
            color: "white",
            fontWeight: 600
          }}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create account"}
        </button>
      </form>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          margin: "16px 0" 
        }}>
          <div style={{ 
            flex: 1, 
            height: 1, 
            background: "rgba(148,163,184,0.3)" 
          }} />
          <span style={{ 
            padding: "0 16px", 
            fontSize: 12, 
            opacity: 0.7 
          }}>
            OR
          </span>
          <div style={{ 
            flex: 1, 
            height: 1, 
            background: "rgba(148,163,184,0.3)" 
          }} />
        </div>

        <button
          onClick={googleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.8)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default AuthPanel

