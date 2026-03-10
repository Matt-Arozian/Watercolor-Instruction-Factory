"use client"

import { useState, useRef, useCallback, useEffect } from "react"

const ACCENT = "#c8a97e"
const DARK = "#1a1714"
const MID = "#2e2a26"
const LIGHT = "#f5f0e8"
const MUTED = "#8a8070"

const LEVELS = ["beginner", "intermediate", "expert"]
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" }
const LEVEL_COLORS = { beginner: "#7eb8c8", intermediate: "#c8a97e", expert: "#c87e7e" }

function Spinner({ elapsed, onCancel }) {
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  const timeStr = mins > 0
    ? `${mins}:${secs.toString().padStart(2, "0")}`
    : `0:${secs.toString().padStart(2, "0")}`

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 0" }}>
      <div style={{
        width: 48, height: 48, border: `3px solid ${MID}`,
        borderTop: `3px solid ${ACCENT}`, borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <p style={{ color: MUTED, fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 14, margin: 0 }}>
        Analyzing your image…
      </p>
      <span style={{ color: ACCENT, fontFamily: "'Georgia', serif", fontSize: 18, fontVariantNumeric: "tabular-nums" }}>
        {timeStr}
      </span>
      <p style={{ color: MUTED, fontFamily: "'Georgia', serif", fontSize: 13, margin: 0, textAlign: "center", maxWidth: 300 }}>
        Please be patient. Analyzing your image may take a few minutes.
      </p>
      <button
        onClick={onCancel}
        style={{
          marginTop: 4, padding: "8px 20px", background: "transparent",
          border: `1px solid #c87e7e60`, borderRadius: 6, cursor: "pointer",
          color: "#c87e7e", fontFamily: "'Georgia', serif", fontSize: 13,
          transition: "background 0.2s, border-color 0.2s"
        }}
        onMouseOver={e => { e.target.style.background = "#c87e7e15"; e.target.style.borderColor = "#c87e7e" }}
        onMouseOut={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "#c87e7e60" }}
      >
        Cancel Analysis
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

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
          {/* Key Principle */}
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

          {/* Materials */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              Materials
            </div>
            <TagList items={data.materials} color={color} />
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: "Georgia, serif", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              Step-by-Step Process
            </div>
            {data.steps.map(step => <StepCard key={step.step} step={step} />)}
          </div>

          {/* Common Mistakes */}
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

export default function WatercolorFactory() {
  const [image, setImage] = useState(null)
  const [imageB64, setImageB64] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const fileRef = useRef()
  const abortRef = useRef(null)

  // Elapsed timer while loading
  useEffect(() => {
    if (!loading) { setElapsed(0); return }
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [loading])

  const processFile = useCallback((file) => {
    if (!file) return
    const isImage = file.type.startsWith("image/") || file.type === "" ||
      /\.(png|jpg|jpeg|webp|gif|bmp)$/i.test(file.name)
    if (!isImage) { setError(`Unsupported file type: "${file.type || "unknown"}". Please upload a JPG, PNG, or WEBP.`); return }
    setError(null)
    const reader = new FileReader()
    reader.onerror = () => setError("Failed to read file. Try re-saving the image and uploading again.")
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => setError("Could not decode image. File may be corrupt or an unsupported format.")
      img.onload = () => {
        const MAX = 1568
        let { width, height } = img
        if (width > MAX || height > MAX) {
          const scale = Math.min(MAX / width, MAX / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        canvas.getContext("2d").drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
        setImage(dataUrl)
        setImageB64(dataUrl.split(",")[1])
        setAnalysis(null)
        setError(null)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const analyze = async () => {
    if (!imageB64) return
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64 }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setAnalysis(data)
    } catch (err) {
      if (err.name === "AbortError") return // cancelled by user
      const msg = err?.message || String(err)
      if (msg.includes("fetch")) {
        setError("Network error — image may be too large or connection failed. Try a smaller image.")
      } else {
        setError(msg)
      }
      console.error(err)
    } finally {
      abortRef.current = null
      setLoading(false)
    }
  }

  const cancelAnalysis = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: "100vh", background: DARK, padding: "0 0 60px",
      fontFamily: "Georgia, serif"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid #2e2a26`, padding: "28px 40px",
        display: "flex", alignItems: "baseline", gap: 16
      }}>
        <h1 style={{
          margin: 0, fontFamily: "Georgia, serif", fontWeight: "normal",
          fontSize: 22, color: LIGHT, letterSpacing: 0.5
        }}>
          Watercolor Technique Factory
        </h1>
        <span style={{ color: MUTED, fontSize: 13, fontStyle: "italic" }}>
          Upload any image — receive beginner, intermediate &amp; expert painting guides
        </span>
        <a
          href="/history"
          style={{
            marginLeft: "auto", color: ACCENT, textDecoration: "none",
            fontSize: 13, fontFamily: "Georgia, serif", opacity: 0.7,
            transition: "opacity 0.2s", whiteSpace: "nowrap",
          }}
          onMouseOver={e => e.target.style.opacity = 1}
          onMouseOut={e => e.target.style.opacity = 0.7}
        >
          History →
        </a>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !image && fileRef.current.click()}
          style={{
            border: `2px dashed ${dragging ? ACCENT : "#3a3530"}`,
            borderRadius: 16, padding: image ? 0 : "48px 24px",
            textAlign: "center", cursor: image ? "default" : "pointer",
            background: dragging ? `${ACCENT}08` : "transparent",
            transition: "all 0.2s", overflow: "hidden", marginBottom: 24
          }}
        >
          {image ? (
            <div style={{ position: "relative" }}>
              <img src={image} alt="Uploaded" style={{ width: "100%", display: "block", borderRadius: 14 }} />
              <button
                onClick={() => { setImage(null); setImageB64(null); setAnalysis(null) }}
                style={{
                  position: "absolute", top: 12, right: 12,
                  background: "#000000aa", border: "none", borderRadius: "50%",
                  width: 32, height: 32, color: LIGHT, cursor: "pointer", fontSize: 16
                }}
              >&#x2715;</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>&#x1f5bc;</div>
              <div style={{ color: LIGHT, fontFamily: "Georgia, serif", fontSize: 15, marginBottom: 6 }}>
                Drop an image here or click to browse
              </div>
              <div style={{ color: MUTED, fontSize: 12 }}>
                JPG, PNG, WEBP — any subject matter
              </div>
            </>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => processFile(e.target.files[0])} />

        {/* Analyze Button */}
        {image && !loading && !analysis && (
          <button
            onClick={analyze}
            style={{
              width: "100%", padding: "16px", background: ACCENT,
              border: "none", borderRadius: 10, cursor: "pointer",
              fontFamily: "Georgia, serif", fontSize: 15, color: DARK,
              fontWeight: "bold", letterSpacing: 0.5,
              transition: "opacity 0.2s", marginBottom: 24
            }}
            onMouseOver={e => e.target.style.opacity = 0.85}
            onMouseOut={e => e.target.style.opacity = 1}
          >
            Generate Technique Breakdown &rarr;
          </button>
        )}

        {/* Loading */}
        {loading && <Spinner elapsed={elapsed} onCancel={cancelAnalysis} />}

        {/* Error */}
        {error && (
          <div style={{ padding: 16, background: "#c87e7e20", border: "1px solid #c87e7e40",
            borderRadius: 8, color: "#c87e7e", fontSize: 13, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>

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

            {/* Reset */}
            <button
              onClick={() => { setImage(null); setImageB64(null); setAnalysis(null) }}
              style={{
                marginTop: 16, padding: "12px 24px", background: "transparent",
                border: `1px solid #3a3530`, borderRadius: 8, cursor: "pointer",
                color: MUTED, fontFamily: "Georgia, serif", fontSize: 13,
                transition: "color 0.2s, border-color 0.2s"
              }}
              onMouseOver={e => { e.target.style.color = LIGHT; e.target.style.borderColor = "#5a5550" }}
              onMouseOut={e => { e.target.style.color = MUTED; e.target.style.borderColor = "#3a3530" }}
            >
              &larr; Analyze another image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
