import { useState } from "react"
import { login, signup } from "../services/authService"

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
    </div>
  )
}

export default AuthPanel

