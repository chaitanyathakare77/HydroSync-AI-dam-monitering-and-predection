"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, BrainCircuit, MapPinned, Siren, Waves, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  const featureCards = [
    {
      title: "Real-Time Dam Monitoring",
      description: "Track reservoir level, inflow-outflow trends, and upstream pressure indicators through a unified monitoring interface.",
      icon: Waves,
    },
    {
      title: "AI Flood Prediction Engine",
      description: "Machine-learning models estimate overflow probabilities and seasonal risk so teams can act before critical levels.",
      icon: BrainCircuit,
    },
    {
      title: "Village Alert Distribution",
      description: "Critical alerts can be delivered quickly to downstream villages and operators for early preparedness.",
      icon: Siren,
    },
    {
      title: "Risk Map Visualization",
      description: "Overlay dams, villages, and potential impact zones on map views for clear incident response planning.",
      icon: MapPinned,
    },
  ]

  const projectStats = [
    { label: "Monitoring Coverage", value: "24x7" },
    { label: "Prediction Horizon", value: "Up to 2026+" },
    { label: "Core Modules", value: "Dashboard, Map, Alerts, Reports" },
  ]

  const processFlow = [
    {
      step: "Collect",
      detail: "Inflow, outflow, level, and rainfall records are consolidated into one operational stream.",
    },
    {
      step: "Analyze",
      detail: "Machine-learning models evaluate trends and estimate overflow risk ahead of time.",
    },
    {
      step: "Map",
      detail: "Potential impact zones are visualized with village overlays for location-aware response.",
    },
    {
      step: "Alert",
      detail: "Authorities and communities receive targeted warnings for faster preparedness.",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Smart Dam Intelligence</p>
              <h1 className="text-xl font-bold text-blue-600">HydroSync AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button size="sm" variant="ghost" onClick={() => router.push("/login")}>Login</Button>
            <Button size="sm" onClick={() => router.push("/register")}>Register</Button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:px-12 md:py-16 lg:gap-12">
        <div className="space-y-5 md:space-y-6">
          <p className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            AI-Powered Disaster Preparedness Platform
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Dam Monitoring, Forecasting, and Early Alerts for Safer Communities
          </h2>
          <p className="max-w-xl text-base text-gray-600 sm:text-lg">
            HydroSync combines reservoir telemetry, machine learning, and mapped village risk data to provide faster, clearer decisions before flood events.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button onClick={() => router.push("/dashboard")} className="gap-2">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/predictions")}>View Predictions</Button>
          </div>
          <div className="grid gap-3 pt-1 sm:grid-cols-3 sm:gap-4">
            {projectStats.map((item) => (
              <Card key={item.label} className="shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-gray-200 shadow-xl">
          <CardContent className="p-0">
            <img
              src="/images/dam.png"
              alt="HydroSync AI monitoring overview"
              className="h-62.5 w-full object-cover sm:h-80 md:h-full"
            />
          </CardContent>
        </Card>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-12 md:pb-16">
        <div className="relative mx-auto flex h-75 w-full max-w-7xl items-end overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-xl sm:h-90 md:h-105">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hydrosync-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-transparent" />
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl">Core HydroSync Capabilities</h3>
          <p className="mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            Designed for dam operators, disaster teams, and local administrators to analyze trends, anticipate risk, and trigger protective action.
          </p>
          <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="h-full border-gray-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 sm:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h3 className="text-2xl font-bold sm:text-3xl">How HydroSync Works</h3>
          <p className="mt-2 max-w-4xl text-sm text-gray-600 sm:text-base">
            A simple end-to-end workflow helps teams move from data to action quickly during changing water conditions.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processFlow.map((item, index) => (
              <div key={item.step} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Step {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{item.step}</p>
                <p className="mt-2 text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 sm:grid-cols-2">
            <p><span className="font-semibold text-gray-900">For Operators:</span> get one place to monitor trends and receive predictive support.</p>
            <p><span className="font-semibold text-gray-900">For Administrators:</span> map-based context improves regional planning and response.</p>
            <p><span className="font-semibold text-gray-900">For Villages:</span> early warnings increase preparation time before escalation.</p>
            <p><span className="font-semibold text-gray-900">For Teams:</span> coordinated insights reduce communication gaps during critical hours.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-6 py-10 text-center text-sm text-gray-500 md:px-12">
        HydroSync AI Dam Monitoring and Prediction Platform © 2026
      </footer>
    </div>
  )
}