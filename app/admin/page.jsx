"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const DARK = "#1a1714"
const ACCENT = "#c8a97e"
const MID = "#2e2a26"
const LIGHT = "#f5f0e8"
const MUTED = "#8a8070"
const ERROR_RED = "#d9534f"
const SUCCESS_GREEN = "#5cb85c"

export default function AdminPage() {
  const [emails, setEmails] = useState([])
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [message, setMessage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchEmails()
  }, [])

  async function fetchEmails() {
    try {
      const res = await fetch("/api/admin/users")
      if (res.status === 403) {
        router.push("/")
        return
      }
      const data = await res.json()
      setEmails(data.emails || [])
    } catch {
      setMessage({ type: "error", text: "Failed to load users" })
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newEmail.trim()) return

    setAdding(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.error })
      } else {
        setMessage({ type: "success", text: `Added ${newEmail.trim().toLowerCase()}` })
        setNewEmail("")
        fetchEmails()
      }
    } catch {
      setMessage({ type: "error", text: "Failed to add user" })
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(email) {
    setRemoving(email)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.error })
      } else {
        setMessage({ type: "success", text: `Removed ${email}` })
        fetchEmails()
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove user" })
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: DARK,
        color: LIGHT,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: ACCENT,
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Manage Users
          </h1>
          <p style={{ color: MUTED, fontSize: 14 }}>
            Add or remove users who can access the Watercolor Instruction Factory
          </p>
        </div>

        {/* Back link */}
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 24,
            color: ACCENT,
            textDecoration: "none",
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          ← Back to app
        </a>

        {/* Add user form */}
        <form
          onSubmit={handleAdd}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <input
            type="email"
            placeholder="user@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: MID,
              border: `1px solid ${MUTED}40`,
              borderRadius: 6,
              color: LIGHT,
              fontSize: 15,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={adding}
            style={{
              padding: "12px 24px",
              backgroundColor: ACCENT,
              color: DARK,
              border: "none",
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: adding ? "wait" : "pointer",
              opacity: adding ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {adding ? "Adding…" : "Add User"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: "10px 16px",
              marginBottom: 16,
              borderRadius: 6,
              fontSize: 14,
              backgroundColor:
                message.type === "error" ? `${ERROR_RED}20` : `${SUCCESS_GREEN}20`,
              color: message.type === "error" ? ERROR_RED : SUCCESS_GREEN,
              border: `1px solid ${message.type === "error" ? ERROR_RED : SUCCESS_GREEN}40`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* User list */}
        <div
          style={{
            backgroundColor: MID,
            borderRadius: 8,
            border: `1px solid ${MUTED}20`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${MUTED}20`,
              fontSize: 13,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Allowed Users ({loading ? "…" : emails.length})
          </div>

          {loading ? (
            <div style={{ padding: 24, textAlign: "center", color: MUTED }}>
              Loading…
            </div>
          ) : emails.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: MUTED }}>
              No users added yet
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${MUTED}15`,
                }}
              >
                <span style={{ fontSize: 15, color: LIGHT }}>{email}</span>
                <button
                  onClick={() => handleRemove(email)}
                  disabled={removing === email}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "transparent",
                    color: ERROR_RED,
                    border: `1px solid ${ERROR_RED}60`,
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: "inherit",
                    cursor: removing === email ? "wait" : "pointer",
                    opacity: removing === email ? 0.5 : 1,
                  }}
                >
                  {removing === email ? "Removing…" : "Remove"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
