"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

const DamMap = dynamic(() => import("./DamMap"), {
  ssr: false,
})

export default function MapPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token") // if you store token
    router.push("/login")
  }

  const userName = localStorage.getItem("user") || "User"

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      
      {/* Profile + Logout */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          zIndex: 1000,
          background: "white",
          padding: "8px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          display: "flex",
          gap: "15px",
          alignItems: "center"
        }}
      >
        <span>👤 {userName}</span>
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <DamMap />
    </div>
  )
}
