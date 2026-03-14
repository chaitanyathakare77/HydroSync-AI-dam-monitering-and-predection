"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useEffect, useState } from "react"
import Papa from "papaparse"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// DAM ICON
const damIcon = new L.Icon({
  iconUrl: "/icons/dam.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
})

// VILLAGE ICON
const villageIcon = new L.Icon({
  iconUrl: "/icons/village.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25]
})

export default function DamMap() {

  const [data, setData] = useState([])

  useEffect(() => {

    fetch("/csv/dams_villages.csv")
      .then(res => res.text())
      .then(csv => {

        const parsed = Papa.parse(csv, {
          header: true
        })

        setData(parsed.data)

      })

  }, [])

  return (

    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((row, index) => {

        const lat = parseFloat(row.latitude)
        const lng = parseFloat(row.longitude)

        if (isNaN(lat) || isNaN(lng)) return null

        const position = [lat, lng]

        // DAM MARKER
        if (row.type === "dam") {
          return (
            <Marker key={index} position={position} icon={damIcon}>
              <Popup>

                <strong>{row.name}</strong> 🏞<br/>
                State: {row.state}<br/>
                River: {row.river}<br/>
                Height: {row.height_m} m<br/>
                Status: {row.status}

              </Popup>
            </Marker>
          )
        }

        // VILLAGE MARKER
        if (row.type === "village") {
          return (
            <Marker key={index} position={position} icon={villageIcon}>
              <Popup>

                <strong>{row.name}</strong> 🏠<br/>
                Population: {row.population}<br/>
                Nearby Dam: {row.nearby_dam}

              </Popup>
            </Marker>
          )
        }

      })}

    </MapContainer>

  )
}
