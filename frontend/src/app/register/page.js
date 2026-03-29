"use client"

import { useState } from "react"

export default function RegisterPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      window.location.href = "/login"
    } else {
      alert(data.message)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-96 border border-gray-200">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 font-semibold text-white"
          >
            Register
          </button>

        </form>

        <p className="text-gray-600 text-sm text-center mt-6">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline ml-1">
            Login
          </a>
        </p>

      </div>

    </div>

  )
}