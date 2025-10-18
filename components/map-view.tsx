"use client"

import { useState, useMemo } from "react"
import type { Place } from "@/lib/types"
import Link from "next/link"

interface MapViewProps {
  places: Place[]
  selectedCategory: string | null
  onPlaceClick: (place: Place) => void
  favorites: string[]
  onToggleFavorite: (placeId: string) => void
}

export function MapView({ places, selectedCategory, onPlaceClick, favorites, onToggleFavorite }: MapViewProps) {
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null)

  const filteredPlaces = useMemo(() => {
    if (!selectedCategory) return places
    return places.filter((place) => place.categoryId === selectedCategory)
  }, [places, selectedCategory])

  // Calculate map bounds based on places
  const bounds = useMemo(() => {
    if (filteredPlaces.length === 0) {
      return { minLat: 39, maxLat: 42, minLng: 59, maxLng: 72 }
    }
    const lats = filteredPlaces.map((p) => p.location.lat)
    const lngs = filteredPlaces.map((p) => p.location.lng)
    return {
      minLat: Math.min(...lats) - 0.5,
      maxLat: Math.max(...lats) + 0.5,
      minLng: Math.min(...lngs) - 0.5,
      maxLng: Math.max(...lngs) + 0.5,
    }
  }, [filteredPlaces])

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100
    return { x, y }
  }

  return (
    <div className="relative w-full h-full bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden border border-border">
      {/* Simplified map background */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="100" height="100" fill="hsl(var(--card))" />

        {/* Decorative map elements */}
        <circle cx="20" cy="30" r="15" fill="hsl(var(--muted))" opacity="0.3" />
        <circle cx="70" cy="60" r="20" fill="hsl(var(--muted))" opacity="0.3" />
        <circle cx="50" cy="80" r="12" fill="hsl(var(--muted))" opacity="0.3" />

        {/* Place markers */}
        {filteredPlaces.map((place) => {
          const { x, y } = latLngToXY(place.location.lat, place.location.lng)
          const isFavorite = favorites.includes(place.id)
          const isHovered = hoveredPlace === place.id

          return (
            <Link key={place.id} href={`/place/${place.id}`}>
              <g
                onMouseEnter={() => setHoveredPlace(place.id)}
                onMouseLeave={() => setHoveredPlace(null)}
                className="cursor-pointer"
              >
                {/* Marker shadow */}
                <circle cx={x} cy={y + 0.5} r={isHovered ? "2.5" : "2"} fill="hsl(var(--foreground))" opacity="0.2" />

                {/* Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "2.5" : "2"}
                  fill={isFavorite ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                  stroke="hsl(var(--background))"
                  strokeWidth="0.5"
                  className="transition-all"
                />

                {/* Hover label */}
                {isHovered && (
                  <>
                    <rect x={x - 15} y={y - 8} width="30" height="6" rx="1" fill="hsl(var(--popover))" opacity="0.95" />
                    <text
                      x={x}
                      y={y - 4.5}
                      textAnchor="middle"
                      fill="hsl(var(--popover-foreground))"
                      fontSize="2.5"
                      fontWeight="600"
                    >
                      {place.name.length > 20 ? place.name.substring(0, 20) + "..." : place.name}
                    </text>
                  </>
                )}
              </g>
            </Link>
          )
        })}
      </svg>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent border-2 border-background"></div>
            <span className="text-foreground">Места</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
            <span className="text-foreground">Избранное</span>
          </div>
        </div>
      </div>

      {/* Place count */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border shadow-lg">
        <p className="text-sm font-medium text-foreground">
          {filteredPlaces.length} {filteredPlaces.length === 1 ? "место" : "мест"}
        </p>
      </div>
    </div>
  )
}
