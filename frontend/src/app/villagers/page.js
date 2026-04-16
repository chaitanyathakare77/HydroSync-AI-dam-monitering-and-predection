"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/Sidebar"

const VILLAGES = [
  {
    name: "Paithan (Town/Major area)",
    description: "Located immediately adjacent to the dam.",
  },
  {
    name: "Kawsan",
    description: "Situated within 5 km of the dam.",
  },
  {
    name: "Telwadi",
    description: "Located near the reservoir area.",
  },
  {
    name: "Katpur",
    description: "Located in the vicinity of the dam.",
  },
  {
    name: "Mudhalwadi",
    description: "Located near the dam construction area.",
  },
  {
    name: "Pimpalwadi (Pirachi)",
    description: "Located in close proximity to the dam.",
  },
]

export default function VillagersPage() {
  const [user, setUser] = useState(null)
  const [activeKey, setActiveKey] = useState("villagers")
  const [formData, setFormData] = useState({
    village: "",
    name: "",
    mobile: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    if (item.key !== "villagers") {
      router.push(item.href)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "mobile") {
      // Allow only digits and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, mobile: digitsOnly }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsSubmitting(true)

    // Validation
    if (!formData.village.trim()) {
      setErrorMessage("❌ Please select a village near Jayakwadi Dam.")
      setIsSubmitting(false)
      return
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("❌ Please enter a valid name (at least 2 characters).")
      setIsSubmitting(false)
      return
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setErrorMessage("❌ Please enter a valid 10-digit mobile number.")
      setIsSubmitting(false)
      return
    }

    // Store data in localStorage
    try {
      const existingData = localStorage.getItem("villager_registrations")
      const registrations = existingData ? JSON.parse(existingData) : []

      // Check for duplicate mobile number
      const isDuplicate = registrations.some(
        (reg) => reg.mobile === formData.mobile
      )

      if (isDuplicate) {
        setErrorMessage(
          "❌ This mobile number is already registered. Please use a different number."
        )
        setIsSubmitting(false)
        return
      }

      // Add new registration
      const newRegistration = {
        id: Date.now(),
        village: formData.village,
        name: formData.name.trim(),
        mobile: formData.mobile,
        registeredAt: new Date().toLocaleString("en-IN"),
      }

      registrations.push(newRegistration)
      localStorage.setItem("villager_registrations", JSON.stringify(registrations))

      // Success
      setSuccessMessage(
        "✅ Registration successful! Your details have been registered for alert notifications."
      )
      setFormData({ village: "", name: "", mobile: "" })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    } catch (error) {
      setErrorMessage("❌ An error occurred while registering. Please try again.")
    }

    setIsSubmitting(false)
  }

  if (!user)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-blue-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm tracking-widest uppercase opacity-70">
            Loading Villagers…
          </span>
        </div>
      </div>
    )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-50 via-sky-50 to-amber-50 font-sans text-gray-900">
      <Sidebar
        activeKey={activeKey}
        onNavClick={handleNavClick}
        user={user}
        onLogout={handleLogout}
      />

      <main className="relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl p-6 md:p-10">
          {/* Header Section */}
          <section className="mb-8 rounded-3xl border border-sky-200 bg-gradient-to-br from-white to-sky-50 p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🏘️</div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-sky-900">
                  Jayakwadi Villager Portal
                </h1>
                <p className="mt-1 text-sm text-sky-700">
                  Register your details to receive critical dam alert notifications
                </p>
              </div>
            </div>
          </section>

          {/* Registration Form */}
          <section className="rounded-3xl border border-amber-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              📝 Villager Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Village Select */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  🏞️ Select Your Village
                </label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border-2 border-sky-200 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
                  required
                >
                  <option value="">-- Select a village --</option>
                  {VILLAGES.map((village) => (
                    <option key={village.name} value={village.name}>
                      {village.name}
                    </option>
                  ))}
                </select>
                {formData.village && (
                  <p className="text-xs text-sky-600">
                    📍{" "}
                    {
                      VILLAGES.find((v) => v.name === formData.village)
                        ?.description
                    }
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  👤 Your Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border-2 border-sky-200 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  📱 Mobile Number (10 Digits)
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  className="w-full rounded-xl border-2 border-sky-200 bg-white px-4 py-3 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
                  required
                />
                <p className="text-xs text-gray-500">
                  {formData.mobile.length}/10 digits entered
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-3 text-center font-bold text-white transition hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Registering...
                    </span>
                  ) : (
                    "✅ Register Now"
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Info Section */}
          <section className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-8 shadow-lg">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">
              ℹ️ Important Information
            </h3>
            <ul className="space-y-3 text-sm text-emerald-800">
              <li className="flex gap-3">
                <span className="text-xl">🔒</span>
                <span>
                  Your personal information is securely stored and will be used only for critical dam alert notifications.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">📲</span>
                <span>
                  You will receive SMS notifications on your registered mobile number when water level reaches critical levels.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">⚠️</span>
                <span>
                  In case of emergency, immediate action must be taken upon receiving alerts. Follow official guidelines.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">✔️</span>
                <span>
                  Each mobile number can be registered only once. Use a different number for multiple registrations.
                </span>
              </li>
            </ul>
          </section>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>
              Jayakwadi Dam Monitoring & Prediction System — Protecting Communities Through
              Technology
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}