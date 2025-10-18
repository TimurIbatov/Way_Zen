"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { calculateTripCost, generateRoute } from "@/lib/cost-calculator"
import { RouteModal } from "./route-modal"
import type { Place } from "@/lib/types"
import { useLanguage } from "@/lib/hooks/use-language"
import { MapPin, DollarSign, Navigation } from "lucide-react"

interface RouteCalculatorProps {
  places: Place[]
  onCalculate?: (result: { cost: number; route: string[] }) => void
}

export function RouteCalculator({ places, onCalculate }: RouteCalculatorProps) {
  const { t } = useLanguage()
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])
  const [result, setResult] = useState<{ cost: number; route: string[] } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTogglePlace = (placeId: string) => {
    setSelectedPlaces((prev) => (prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]))
  }

  const handleCalculate = () => {
    if (selectedPlaces.length === 0) return

    const selected = places.filter((p) => selectedPlaces.includes(p.id))
    const cost = calculateTripCost(selected, 1)
    const route = generateRoute(selected)

    const calculatedResult = {
      cost: Math.round(cost.totalCost),
      route: route.route,
    }

    setResult(calculatedResult)
    setIsModalOpen(true)
    onCalculate?.(calculatedResult)
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Navigation className="h-5 w-5 text-teal-400" />
              {t("map.selectPlaces")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/40 border border-slate-600"
                >
                  <Checkbox
                    id={place.id}
                    checked={selectedPlaces.includes(place.id)}
                    onCheckedChange={() => handleTogglePlace(place.id)}
                    className="mt-1"
                  />
                  <label htmlFor={place.id} className="flex-1 cursor-pointer">
                    <div className="font-medium text-white">{place.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <MapPin className="h-3 w-3" />
                      {place.city}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-teal-400 mt-1">
                      <DollarSign className="h-3 w-3" />${Math.round(calculateTripCost([place], 1).totalCost)}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCalculate}
              disabled={selectedPlaces.length === 0}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50"
            >
              {t("map.calculateRoute")} ({selectedPlaces.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <RouteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          places={places}
          route={result.route}
          cost={result.cost}
        />
      )}
    </>
  )
}
