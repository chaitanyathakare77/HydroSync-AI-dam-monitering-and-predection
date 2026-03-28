"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = async (e)=>{
    e.preventDefault()

    const res = await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({email,password})
    })

    const data = await res.json()

    if(res.ok){
      localStorage.setItem("token",data.token)
      router.push("/dashboard")
    }else{
      alert(data.message)
    }
  }

  return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900">

  <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-96 border border-white/20">

    <h2 className="text-3xl font-bold text-center text-white mb-6">
      Welcome Back
    </h2>

    <form onSubmit={handleLogin} className="space-y-5">

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-black/40 text-white outline-none focus:ring-2 focus:ring-purple-500"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-lg bg-black/40 text-white outline-none focus:ring-2 focus:ring-purple-500"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition duration-300 font-semibold"
      >
        Login
      </button>

    </form>

    <p className="text-gray-300 text-sm text-center mt-6">
      Don't have an account?
      <a href="/register" className="text-purple-400 hover:underline ml-1">
        Register
      </a>
    </p>

  </div>

</div>

  )
}