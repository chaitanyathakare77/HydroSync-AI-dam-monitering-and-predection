"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/Sidebar"

export default function StatisticsPage() {
  const [user, setUser] = useState(null)
  const [activeKey, setActiveKey] = useState("statistics")
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
    if (item.key !== "statistics") {
      router.push(item.href)
    }
  }

  if (!user)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-blue-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm tracking-widest uppercase opacity-70">Loading Statistics…</span>
        </div>
      </div>
    )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-linear-to-br from-gray-50 to-blue-50 font-sans text-gray-900">
      <Sidebar activeKey={activeKey} onNavClick={handleNavClick} user={user} onLogout={handleLogout} />
      <main className="relative flex-1 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dam Statistics</h1>
          <p className="text-gray-600">This page will display detailed statistics about the dam operations.</p>
          {/* Add content here */}
        </div>
      </main>
    </div>
  )
}