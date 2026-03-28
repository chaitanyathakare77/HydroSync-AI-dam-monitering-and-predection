"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("../components/MapComponent"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="h-screen w-full">
      <div className="absolute z-10 p-4">
        <input
          type="text"
          placeholder="Search dam, river, village..."
          className="px-4 py-2 rounded-md shadow-md border"
        />
      </div>

      <MapComponent />
    </div>
  );
}
