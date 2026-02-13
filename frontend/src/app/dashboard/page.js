"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"


const DamMap = dynamic(
  () => import("../map/DamMap"),
  { ssr: false }
)



export default function DashboardPage() {

  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
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

  if (!user) return <div className="text-white p-10">Loading Map...</div>

  return (
    <div className="relative h-screen w-full bg-black text-white">

      {/* Top Right Menu */}
      <div className="absolute top-4 right-6 flex gap-6 z-[1000]">

        <span className="font-semibold">
          👤 {user.name}
        </span>

        <button
          onClick={() => router.push("/map")}
          className="hover:text-blue-400"
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-600"
        >
          Logout
        </button>

      </div>

      {/* Map */}
      <DamMap />

    </div>
  )
}
