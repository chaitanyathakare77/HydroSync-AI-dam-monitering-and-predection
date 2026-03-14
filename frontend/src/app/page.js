"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="bg-black text-white min-h-screen">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">HydroSync AI</h1>
        <div className="flex gap-6">
          <button onClick={()=>router.push("/login")} className="hover:text-cyan-400">Login</button>
          <button onClick={()=>router.push("/register")} className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-400">Register</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-12 px-12 py-20 items-center">
        <div>
          <h1 className="text-6xl font-bold leading-tight">
            AI Dam Monitoring <span className="text-cyan-400"> & Flood Prediction</span>
          </h1>
          <p className="text-gray-400 mt-6 text-lg">
            HydroSync predicts floods using artificial intelligence, real-time dam monitoring and village risk analysis.
          </p>
          <button
            onClick={()=>router.push("/register")}
            className="mt-8 bg-cyan-500 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400"
          >
            Live Dam Monitoring
          </button>
        </div>

        {/* Use the generated AI image */}
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <img src="/images/hydro_ai.png" alt="Hydro AI illustration" className="w-full"/>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-950 py-24 px-12">
        <h2 className="text-4xl font-bold text-center mb-16">HydroSync Features</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-black p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl text-cyan-400 font-bold mb-3">Real Time Dam Monitoring</h3>
            <p className="text-gray-400 mt-2">Monitor water level, reservoir capacity and nearby villages on an interactive map.</p>
          </div>
          <div className="bg-black p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl text-cyan-400 font-bold mb-3">AI Flood Prediction</h3>
            <p className="text-gray-400 mt-2">Predict floods using rainfall data, reservoir capacity and water flow analysis.</p>
          </div>
          <div className="bg-black p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl text-cyan-400 font-bold mb-3">Village Alert System</h3>
            <p className="text-gray-400 mt-2">Nearby villages receive alerts before flood water reaches critical levels.</p>
          </div>
        </div>
      </section>

      {/* HOW HYDROSYNC WORKS */}
      <section className="px-12 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">How HydroSync Works</h2>
        <div className="grid md:grid-cols-4 gap-12 text-center">
          {["Data Collection", "AI Processing", "Flood Prediction", "Village Alerts"].map((step,index)=>(
            <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <img src="/images/hydro_ai.png" className="w-20 mx-auto mb-4" />
              <h3 className="text-cyan-400 font-bold">{step}</h3>
              <p className="text-gray-400 text-sm mt-2">Illustration of {step.toLowerCase()} process.</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 text-center py-10 text-gray-500">
        HydroSync AI Monitoring System © 2026
      </footer>

    </div>
  )
}
