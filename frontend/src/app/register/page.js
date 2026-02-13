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
      window.location.href = "/dashboard"
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleRegister} className="space-y-4 w-80">
        <h2 className="text-2xl font-bold">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 bg-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 p-2">
          Register
        </button>
      </form>
    </div>
  )
}
