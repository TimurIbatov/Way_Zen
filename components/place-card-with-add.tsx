"use client"

import { Star, MapPin, Heart, Plus, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Place } from "@/lib/types"
import { calculateTripCost } from "@/lib/cost-calculator"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

interface PlaceCardWithAddProps {
  place: Place
  isFavorite: boolean
  isInCart: boolean
  onToggleFavorite: (placeId: string) => void
  onAddToCart: (place: Place) => void
  onRemoveFromCart: (placeId: string) => void
}

export function PlaceCardWithAdd({
  place,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  onRemoveFromCart,
}: PlaceCardWithAddProps) {
  const cost = calculateTripCost([place], 1)
  const estimatedCost = Math.round(cost.totalCost)
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateDescription = async () => {
      try {
        const response = await fetch("/api/generate-description", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeName: place.name,
            city: place.city,
            category: place.categoryId,
          }),
        })

        if (!response.ok) {
          console.error("[v0] API error:", response.status)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        if (data.description && data.description.trim()) {
          setGeneratedDescription(data.description)
        }
      } catch (error) {
        console.error("[v0] Error generating description:", error)
      } finally {
        setIsLoading(false)
      }
    }

    generateDescription()
  }, [place.id, place.name, place.city, place.categoryId])

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-slate-700 bg-slate-800/60 backdrop-blur-lg">
      <Link href={`/place/${place.id}`}>
        <div className="relative h-48 bg-muted">
          <Image src={place.images[0] || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
          {place.isHidden && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white flex items-center gap-1">
              💎 Скрытая жемчужина
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/place/${place.id}`} className="flex-1">
            <h3 className="font-semibold text-white hover:text-teal-400 transition-colors line-clamp-1">
              {place.name}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(place.id)
            }}
            className="flex-shrink-0"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-teal-500 text-teal-500" : "text-gray-400"}`} />
          </Button>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{place.city}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-teal-500 text-teal-500" />
            <span className="font-medium text-white">{place.rating}</span>
            <span className="text-sm text-gray-400">({place.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-teal-400">
            <span className="font-semibold">~${estimatedCost}</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {generatedDescription || place.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3 mb-3">
          {place.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault()
            if (isInCart) {
              onRemoveFromCart(place.id)
            } else {
              onAddToCart(place)
            }
          }}
          className={`w-full ${
            isInCart
              ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/50"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
          }`}
        >
          {isInCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />В туре
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Добавить в тур
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
