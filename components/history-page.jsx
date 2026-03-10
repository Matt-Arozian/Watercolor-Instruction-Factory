"use client"

import { useState, useEffect } from "react"

const ACCENT = "#c8a97e"
const DARK = "#1a1714"
const MID = "#2e2a26"
const LIGHT = "#f5f0e8"
const MUTED = "#8a8070"

const LEVELS = ["beginner", "intermediate", "expert"]
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" }
const LEVEL_COLORS = { beginner: "#7eb8c8", intermediate: "#c8a97e", expert: "#c87e7e" }

/* ─── Shared presentational components (mirrored from watercolor-factory.jsx) ─── */

function StepCard({ step }) {
  return (
    <div style={{
      display: "flex", gap: 16, padding: "14px 0",
      borderBottom: `1px solid #2e2a26`
    }}>
      <div style={{
        flexShrink: 0, width: 28, height: 28,
        background: MID, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", fontSize: 12, color: ACCENT, fontWeight: "bold"
      }}>
        {step.step}
      </div>
      <div>
        <div style={{ fontFamily: "'Georgia', serif", fontWeight: "bold", color: LIGHT, fontSize: 13, marginBottom: 4 }}>
          {step.title}
        </div>
        <div style={{ color: "#b0a898", fontSize: 13, lineHeight: 1.65, fontFamily: "Georgia, serif" }}>
          {step.instruction}
        </div>
      </div>
    </div>
  )
}

function TagList({ items, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {items.map((item, i) => (
        <span key={i} style={{
          padding: "3px 10px", borderRadius: 20,
          background: `${color}18`, border: `1px solid ${color}40`,
          color: color, fontSize: 11, fontFamily: "Georgia, serif"
        }}>{item}</span>
      ))}
    </div>
  )
}

function LevelPanel({ data, level }) {
  const [open, setOpen] = useState(false)
  const color = LEVEL_COLORS[level]

  return (
    <div style={{
      background: MID, borderRadius: 12,
      border: `1px solid #3a3530`, overflow: "hidden",
      marginBottom: 12
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "18px 24px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ fontFamily: "'Georgia', serif", fontWeight: "bold", color: LIGHT, fontSize: 16 }}>
            {LEVEL_LABELS[level]}
          </span>
        </div>
        <span style={{ color: MUTED, fontSize: 18, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          ↓
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{
            padding: "12px 16px", background: `${color}12`,
            borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0",
            marginBottom: 20
          }}>
            <div style={{ fontSize: 10, color: color, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
              Key Principle
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: LIGHT, fontSize: 13, lineHeight: 1.6 }}>
              &ldquo;{data.keyPrinciple}&rdquo;
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              Materials
            </div>
            <TagList items={data.materials} color={color} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              Step-by-Step Process
            </div>
            {data.steps.map(step => <StepCard key={step.step} step={step} />)}
          </div>

          <div>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              Common Mistakes to Avoid
            </div>
            {data.commonMistakes.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#c87e7e", fontSize: 12, marginTop: 2, flexShrink: 0 }}>&#x2715;</span>
                <span style={{ color: "#b0a898", fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.55 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── History page ─── */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function HistoryCard({ entry, onSelect, onDelete, deleting }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div style={{
      background: MID, borderRadius: 10, border: "1px solid #3a3530",
      overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s",
    }}
      onMouseOver={e => e.currentTarget.style.borderColor = "#5a5550"}
      onMouseOut={e => e.currentTarget.style.borderColor = "#3a3530"}
    >
      {/* Thumbnail */}
      <div onClick={() => onSelect(entry.id)} style={{ position: "relative" }}>
        {entry.thumbnail ? (
          <img
            src={`data:image/jpeg;base64,${entry.thumbnail}`}
            alt={entry.imageDescription}
            style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: 140, background: DARK,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: MUTED, fontSize: 32
          }}>
            &#x1f5bc;
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px" }}>
        <div
          onClick={() => onSelect(entry.id)}
          style={{
            fontFamily: "Georgia, serif", fontSize: 13, color: LIGHT,
            lineHeight: 1.4, marginBottom: 8,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {entry.imageDescription || "Untitled analysis"}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: "Georgia, serif" }}>
            {formatDate(entry.createdAt)}
          </span>

          {confirmDelete ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => { setConfirmDelete(false); onDelete(entry.id) }}
                disabled={deleting}
                style={{
                  padding: "3px 10px", background: "#c87e7e20", border: "1px solid #c87e7e60",
                  borderRadius: 4, color: "#c87e7e", fontSize: 11,
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                {deleting ? "…" : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "3px 10px", background: "transparent", border: "1px solid #3a3530",
                  borderRadius: 4, color: MUTED, fontSize: 11,
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                padding: "3px 10px", background: "transparent", border: "1px solid #3a353050",
                borderRadius: 4, color: MUTED, fontSize: 11,
                fontFamily: "Georgia, serif", cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseOver={e => e.target.style.color = "#c87e7e"}
              onMouseOut={e => e.target.style.color = MUTED}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => { fetchEntries() }, [])

  async function fetchEntries() {
    try {
      const res = await fetch("/api/history")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setEntries(data.entries || [])
    } catch {
      setError("Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(id) {
    setLoadingDetail(true)
    setError(null)
    try {
      const res = await fetch(`/api/history/${id}`)
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setSelected(data)
    } catch {
      setError("Failed to load analysis")
    } finally {
      setLoadingDetail(false)
    }
  }

  async function handleDelete(id) {
    setDeleting(id)
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Failed to delete")
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch {
      setError("Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  // Detail view
  if (selected) {
    const analysis = selected.analysis
    return (
      <div style={{
        minHeight: "100vh", background: DARK, padding: "0 0 60px",
        fontFamily: "Georgia, serif"
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
          <button
            onClick={() => setSelected(null)}
            style={{
              display: "inline-block", marginBottom: 24,
              color: ACCENT, background: "none", border: "none",
              fontFamily: "Georgia, serif", fontSize: 14, cursor: "pointer",
              padding: 0, opacity: 0.8,
            }}
          >
            ← Back to history
          </button>

          <div style={{ marginBottom: 8, fontSize: 11, color: MUTED }}>
            {formatDate(selected.createdAt)}
          </div>

          {/* Thumbnail */}
          {selected.thumbnail && (
            <div style={{ marginBottom: 24 }}>
              <img
                src={`data:image/jpeg;base64,${selected.thumbnail}`}
                alt={selected.imageDescription}
                style={{ borderRadius: 12, maxWidth: 300, display: "block" }}
              />
            </div>
          )}

          {/* Image Summary */}
          <div style={{
            background: MID, borderRadius: 12, padding: "20px 24px",
            border: "1px solid #3a3530", marginBottom: 20
          }}>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
              Image Analysis
            </div>
            <p style={{ color: LIGHT, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>
              {analysis.imageDescription}
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Depth Planes</div>
                <TagList items={analysis.depthPlanes} color={ACCENT} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Dominant Colors</div>
                <TagList items={analysis.colorPalette} color="#7eb8c8" />
              </div>
            </div>
          </div>

          {/* Level Panels */}
          {LEVELS.map(level => (
            <LevelPanel key={level} data={analysis[level]} level={level} />
          ))}

          <button
            onClick={() => setSelected(null)}
            style={{
              marginTop: 16, padding: "12px 24px", background: "transparent",
              border: "1px solid #3a3530", borderRadius: 8, cursor: "pointer",
              color: MUTED, fontFamily: "Georgia, serif", fontSize: 13,
              transition: "color 0.2s, border-color 0.2s"
            }}
            onMouseOver={e => { e.target.style.color = LIGHT; e.target.style.borderColor = "#5a5550" }}
            onMouseOut={e => { e.target.style.color = MUTED; e.target.style.borderColor = "#3a3530" }}
          >
            ← Back to history
          </button>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div style={{
      minHeight: "100vh", background: DARK, color: LIGHT,
      fontFamily: "Georgia, serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 400, color: ACCENT,
              letterSpacing: "0.05em", margin: "0 0 6px",
            }}>
              Analysis History
            </h1>
            <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>
              Your past watercolor technique breakdowns
            </p>
          </div>
          <a
            href="/"
            style={{
              color: ACCENT, textDecoration: "none", fontSize: 14, opacity: 0.8,
            }}
          >
            ← Back to app
          </a>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: 16, background: "#c87e7e20", border: "1px solid #c87e7e40",
            borderRadius: 8, color: "#c87e7e", fontSize: 13, marginBottom: 24
          }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 48, color: MUTED }}>Loading…</div>
        )}

        {/* Loading detail spinner */}
        {loadingDetail && (
          <div style={{ textAlign: "center", padding: 48, color: MUTED }}>
            Loading analysis…
          </div>
        )}

        {/* Empty state */}
        {!loading && !loadingDetail && entries.length === 0 && (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            color: MUTED, fontSize: 15,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#x1f5bc;</div>
            <p style={{ margin: "0 0 8px" }}>No analyses yet</p>
            <p style={{ margin: 0, fontSize: 13 }}>
              Upload an image and generate a technique breakdown — it will appear here automatically.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !loadingDetail && entries.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {entries.map(entry => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                onSelect={handleSelect}
                onDelete={handleDelete}
                deleting={deleting === entry.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
