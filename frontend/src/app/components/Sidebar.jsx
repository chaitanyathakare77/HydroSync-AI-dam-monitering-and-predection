"use client"

const NAV_ITEMS = [
  {
    key: "map",
    label: "Map",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 16l-5.447 2.724A1 1 0 0115 19.382V8.618a1 1 0 00-1.447-.894L9 7" />
      </svg>
    ),
  },
  {
    key: "visualize",
    label: "Visualize",
    href: "/visualize",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: "villagers",
    label: "Nearby Villagers",
    href: "/villagers",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "statistics",
    label: "Dam Statistics",
    href: "/statistics",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "alerts",
    label: "Alerts & Warnings",
    href: "/alerts",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    badge: 3,
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "predictions",
    label: "Prediction",
    href: "/predictions",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "3d visualization",
    label: "3D Visualization",
    href: "/3d-visualization",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

const BOTTOM_ITEMS = [
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeKey, onNavClick, user, onLogout }) {
  return (
    <aside className="relative z-1100 flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-200">
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-gray-900">Jayakwadi Dam</p>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase">Water Monitoring</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[9px] font-semibold tracking-[0.15em] text-gray-400 uppercase">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavClick(item)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${isActive
                  ? "bg-linear-to-r from-blue-100 to-cyan-50 text-blue-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500" />
              )}

              <span className={isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"}>
                {item.icon}
              </span>

              <span className="flex-1 font-medium">{item.label}</span>

              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 px-3 py-3">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = activeKey === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavClick(item)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${isActive
                ? "bg-linear-to-r from-blue-100 to-cyan-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500" />
              )}
              <span className={isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"}>
                {item.icon}
              </span>
              <span className="flex-1 font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* User Card */}
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-[10px] text-gray-500">{user.email ?? "Operator"}</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="shrink-0 text-gray-400 transition hover:text-red-500"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}