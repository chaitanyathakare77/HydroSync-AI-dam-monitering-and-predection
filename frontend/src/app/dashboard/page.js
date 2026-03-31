"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Sidebar from "../components/Sidebar"

const DamMap = dynamic(() => import("../map/DamMap"), { ssr: false })

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [activeKey, setActiveKey] = useState("map")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          setUser(data)
        }
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleNavClick = (item) => {
    setActiveKey(item.key)
    if (item.key !== "map") {
      router.push(item.href)
    }
  }

  if (!user)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-blue-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm tracking-widest uppercase opacity-70">Loading Map…</span>
        </div>
      </div>
    )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-linear-to-br from-gray-50 to-blue-50 font-sans text-gray-900">

      {/* ── Sidebar ── */}
      <Sidebar activeKey={activeKey} onNavClick={handleNavClick} user={user} onLogout={handleLogout} />

      {/* ── Main Content ── */}
      <main className="relative flex-1 overflow-hidden">
        <DamMap />
      </main>

    </div>
  )
}