"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/40 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-blue-400">
          HydroSync AI
        </h1>

        <div className="space-x-6">
          <Link href="/login" className="text-white hover:text-blue-400">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
