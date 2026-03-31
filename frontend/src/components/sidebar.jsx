"use client"

import { useRouter } from "next/navigation"

export default function Sidebar({ user, activeKey, setActiveKey }) {
    const router = useRouter()

    const NAV_ITEMS = [
        { key: "map", label: "Map", href: "/dashboard" },
        { key: "visualize", label: "Visualize", href: "/visualize" },
        { key: "villagers", label: "Nearby Villagers", href: "/villagers" },
        { key: "statistics", label: "Dam Statistics", href: "/statistics" },
        { key: "alerts", label: "Alerts & Warnings", href: "/alerts", badge: 3 },
        { key: "reports", label: "Reports", href: "/reports" },
        { key: "3d visualization", label: "3D Visualization", href: "/3d-visualization" },
    ]

    const BOTTOM_ITEMS = [
        { key: "settings", label: "Settings", href: "/settings" },
        { key: "profile", label: "Profile", href: "/profile" },
    ]

    const handleNavClick = (item) => {
        setActiveKey(item.key)
        router.push(item.href)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    return (
        <aside className="relative z-[1100] flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm">

            {/* Logo */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
                    <span className="text-white font-bold">D</span>
                </div>
                <div>
                    <p className="text-sm font-bold">Jayakwadi Dam</p>
                    <p className="text-[10px] uppercase text-gray-400">Water Monitoring</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeKey === item.key

                    return (
                        <button
                            key={item.key}
                            onClick={() => handleNavClick(item)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${isActive
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {item.label}

                            {item.badge && (
                                <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="border-t px-3 py-3">
                {BOTTOM_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => handleNavClick(item)}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                        {item.label}
                    </button>
                ))}

                {/* User */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border bg-gray-50 px-3 py-2">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <p className="text-xs font-semibold">{user?.name}</p>
                        <p className="text-[10px] text-gray-500">{user?.email}</p>
                    </div>

                    <button onClick={handleLogout} className="text-red-500 text-xs">
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    )
}