"use client"

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Sample Data
const dams = [
  {
    name: "Koyna Dam",
    capacity: "2797 MCM",
    position: [17.40, 73.74],
  },
  {
    name: "Bhakra Dam",
    capacity: "9340 MCM",
    position: [31.41, 76.43],
  },
]

const villages = [
  {
    name: "Village A",
    position: [17.42, 73.76],
  },
]

export default function DamMap() {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dam Markers */}
      {dams.map((dam, index) => (
        <Marker key={index} position={dam.position}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div>
              <strong>{dam.name}</strong>
              <br />
              Capacity: {dam.capacity}
            </div>
          </Tooltip>
          <Popup>
            <strong>{dam.name}</strong>
            <br />
            Capacity: {dam.capacity}
          </Popup>
        </Marker>
      ))}

      {/* Village Markers */}
      {villages.map((village, index) => (
        <Marker key={index} position={village.position}>
          <Popup>{village.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
