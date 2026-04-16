import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMe } from "../services/authService"

function AuthCallback() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        
        if (!token) {
          setError("No token received from OAuth callback")
          setTimeout(() => navigate("/login"), 3000)
          return
        }

        localStorage.setItem("authToken", token)
        
        const response = await getMe(token)
        const user = response.data.user
        localStorage.setItem("authUser", JSON.stringify(user))
        
        window.location.href = "/"
      } catch (err) {
        setError("Failed to authenticate with Google")
        setTimeout(() => navigate("/login"), 3000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [navigate])

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>Authenticating...</div>
          <div style={{ opacity: 0.7 }}>Please wait while we complete your login</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 16, color: "#ef4444" }}>Authentication Error</div>
          <div style={{ opacity: 0.7, marginBottom: 16 }}>{error}</div>
          <div style={{ opacity: 0.5 }}>Redirecting to login page...</div>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback
