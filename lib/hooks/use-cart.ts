"use client"

import { useState, useCallback } from "react"
import type { Place } from "@/lib/types"

interface CartItem {
  place: Place
  addedAt: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = useCallback((place: Place) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.place.id === place.id)
      if (exists) return prev
      return [...prev, { place, addedAt: new Date().toISOString() }]
    })
  }, [])

  const removeFromCart = useCallback((placeId: string) => {
    setCart((prev) => prev.filter((item) => item.place.id !== placeId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const isInCart = useCallback(
    (placeId: string) => {
      return cart.some((item) => item.place.id === placeId)
    },
    [cart],
  )

  return { cart, addToCart, removeFromCart, clearCart, isInCart }
}
