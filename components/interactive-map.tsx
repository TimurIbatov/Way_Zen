"use client"

import { useEffect, useRef } from "react"
import type { Place } from "@/lib/types"

interface InteractiveMapProps {
  places: Place[]
  selectedCategory?: string | null
  onPlaceClick?: (place: Place) => void
  height?: string
}

export function InteractiveMap({ places, selectedCategory, onPlaceClick, height = "500px" }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Убедимся, что код выполняется только в браузере
    if (typeof window !== "undefined") {
      if (!window.L) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        // Важно использовать `async: false` или `defer` для предсказуемого порядка загрузки,
        // но `onload` в вашем случае справляется с этой задачей.
        script.onload = () => initMap()
        document.body.appendChild(script)
      } else {
        initMap()
      }
    }

    // Функция очистки остается той же
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null; // Также обнуляем ref
      }
    }
  }, []) // Зависимости пустые, чтобы запуск был только один раз

  const initMap = () => {
    if (!mapContainer.current || map.current) return

    const L = window.L

    // --- НАЧАЛО ИСПРАВЛЕНИЯ ---
    // Это исправляет ошибку 'appendChild' при использовании CDN
    // Мы вручную указываем путь к изображениям иконок
    delete (L.Icon.Default.prototype as any)._getIconUrl
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

    map.current = L.map(mapContainer.current).setView([41.2995, 69.2401], 6)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    // Вызываем updateMarkers после инициализации
    updateMarkers()
  }

  // Функция updateMarkers остается без изменений
  const updateMarkers = () => {
    if (!map.current) return

    const L = window.L

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const filteredPlaces = selectedCategory ? places.filter((p) => p.categoryId === selectedCategory) : places

    filteredPlaces.forEach((place) => {
      const marker = L.marker([place.location.lat, place.location.lng])
        .addTo(map.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${place.name}</h3>
            <p class="text-xs text-gray-600">${place.city}</p>
            <p class="text-xs mt-1">${place.description.substring(0, 100)}...</p>
          </div>
        `)

      marker.on("click", () => {
        if (onPlaceClick) {
          onPlaceClick(place)
        }
      })

      markersRef.current.push(marker)
    })
    
    if (filteredPlaces.length > 0) {
      const group = new L.FeatureGroup(markersRef.current)
      map.current.fitBounds(group.getBounds().pad(0.1))
    }
  }

  // Этот хук отвечает за обновление маркеров при изменении пропсов
  useEffect(() => {
    // Убедимся, что карта уже создана перед обновлением маркеров
    if (map.current) {
      updateMarkers()
    }
  }, [places, selectedCategory])

  return <div ref={mapContainer} style={{ height, width: "100%", borderRadius: "0.5rem" }} />
}
