import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-gray-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">HydroSync AI</h1>

        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center h-[85vh] px-6">
        <h2 className="text-5xl font-bold mb-6 animate-in fade-in">
          AI Powered Dam Monitoring & Flood Prediction
        </h2>

        <p className="text-gray-300 max-w-2xl text-lg">
          Real-time analytics, inflow-outflow monitoring, rainfall tracking and AI risk prediction for water infrastructure.
        </p>

        
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-12 pb-20">
        <Feature title="Live Monitoring" desc="Track water levels, inflow & rainfall in real time." />
        <Feature title="AI Risk Engine" desc="Predict flood probability using ML models." />
        <Feature title="Interactive Dam Map" desc="Locate dams and monitor surrounding villages." />
      </section>
    </div>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  )
}
