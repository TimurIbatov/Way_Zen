"use client"

import { useState, useEffect } from "react"

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (userId) {
      const stored = localStorage.getItem(`favorites_${userId}`)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    }
  }, [userId])

  const toggleFavorite = (placeId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites))
      }
      return newFavorites
    })
  }

  const isFavorite = (placeId: string) => favorites.includes(placeId)

  return { favorites, toggleFavorite, isFavorite }
}
