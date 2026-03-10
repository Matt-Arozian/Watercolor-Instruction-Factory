"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const DARK = "#1a1714"
const MID = "#2e2a26"
const LIGHT = "#f5f0e8"
const ACCENT = "#c8a97e"
const MUTED = "#8a8070"

function LoginContent() {
  const params = useSearchParams()
  const errorParam = params.get("error")

  const errorMessage =
    errorParam === "AccessDenied"
      ? "Your email is not on the access list. Contact the admin to request access."
      : errorParam
        ? "Something went wrong. Please try again."
        : null

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          background: MID,
          border: `1px solid #3a3530`,
          borderRadius: 16,
          padding: "48px 40px",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 16 }}>&#x1f3a8;</div>
        <h1
          style={{
            margin: "0 0 8px",
            fontWeight: "normal",
            fontSize: 22,
            color: LIGHT,
            letterSpacing: 0.5,
          }}
        >
          Watercolor Technique Factory
        </h1>
        <p
          style={{
            margin: "0 0 32px",
            color: MUTED,
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          Sign in to generate watercolor painting guides from any image
        </p>

        {errorMessage && (
          <div
            style={{
              padding: 12,
              background: "#c87e7e20",
              border: "1px solid #c87e7e40",
              borderRadius: 8,
              color: "#c87e7e",
              fontSize: 13,
              marginBottom: 24,
            }}
          >
            {errorMessage}
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: ACCENT,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontSize: 15,
            color: DARK,
            fontWeight: "bold",
            letterSpacing: 0.5,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.opacity = 0.85)}
          onMouseOut={(e) => (e.target.style.opacity = 1)}
        >
          Sign in with Google
        </button>

        <p
          style={{
            margin: "24px 0 0",
            color: MUTED,
            fontSize: 11,
          }}
        >
          Access is limited to approved email addresses
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: MUTED,
            fontFamily: "Georgia, serif",
          }}
        >
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
