import "./globals.css"

export const metadata = {
  title: "Watercolor Technique Factory",
  description:
    "Upload any image — receive beginner, intermediate & expert watercolor painting guides",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
