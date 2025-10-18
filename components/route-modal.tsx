"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/hooks/use-language"
import type { Place } from "@/lib/types"

interface RouteModalProps {
  isOpen: boolean
  onClose: () => void
  places: Place[]
  route: string[]
  cost: number
}

export function RouteModal({ isOpen, onClose, places, route, cost }: RouteModalProps) {
  const { t } = useLanguage()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    // Load Leaflet CSS and JS dynamically
    if (!window.L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.onload = () => {
        setMapLoaded(true)
        initMap()
      }
      document.body.appendChild(script)
    } else {
      setMapLoaded(true)
      initMap()
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isOpen])

  const initMap = () => {
    if (!mapContainer.current || map.current || !mapLoaded) return

    const L = window.L
    map.current = L.map(mapContainer.current).setView([41.2995, 69.2401], 6)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    // Get selected places in route order
    const selectedPlaces = route.map((placeName) => places.find((p) => p.name === placeName)).filter(Boolean) as Place[]

    // Add markers and draw route
    const markers: any[] = []
    const coordinates: [number, number][] = []

    selectedPlaces.forEach((place, index) => {
      const marker = L.marker([place.location.lat, place.location.lng])
        .addTo(map.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${index + 1}. ${place.name}</h3>
            <p class="text-xs text-gray-600">${place.city}</p>
          </div>
        `)

      markers.push(marker)
      coordinates.push([place.location.lat, place.location.lng])
    })

    // Draw polyline connecting all points
    if (coordinates.length > 1) {
      L.polyline(coordinates, {
        color: "#14b8a6",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 5",
      }).addTo(map.current)
    }

    // Fit bounds
    if (markers.length > 0) {
      const group = new window.L.featureGroup(markers)
      map.current.fitBounds(group.getBounds().pad(0.1))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span>Маршрут между местами</span>
            <span className="text-lg font-bold text-teal-400">${cost}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Map */}
          <div
            ref={mapContainer}
            style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
            className="border border-slate-700"
          />

          {/* Route details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="text-sm text-gray-400 mb-2">Количество мест</div>
              <div className="text-2xl font-bold text-teal-400">{route.length}</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="text-sm text-gray-400 mb-2">Общая стоимость</div>
              <div className="text-2xl font-bold text-cyan-400">${cost}</div>
            </div>
          </div>

          {/* Route list */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
            <div className="text-sm text-gray-400 mb-3">Рекомендуемый маршрут</div>
            <ol className="space-y-2">
              {route.map((placeName, index) => (
                <li key={index} className="flex items-start gap-3 text-white">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center text-xs font-semibold text-teal-400">
                    {index + 1}
                  </span>
                  <span>{placeName}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
