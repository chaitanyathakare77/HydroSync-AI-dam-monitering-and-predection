import "./globals.css"

export const metadata = {
  title: "HydroSync AI",
  description: "AI Powered Dam Monitoring System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
