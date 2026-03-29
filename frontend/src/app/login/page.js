"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      router.push("/dashboard")
    } else {
      alert(data.message)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-96 border border-gray-200">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition duration-300 font-semibold text-white"
          >
            Login
          </button>

        </form>

        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?
          <a href="/register" className="text-purple-600 hover:underline ml-1">
            Register
          </a>
        </p>

      </div>

    </div>

  )
}