"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Plus } from "lucide-react"
import { storage } from "@/lib/storage"
import type { Tour } from "@/lib/types"

interface PriceMonitoringProps {
  tour: Tour
  onUpdate: () => void
}

export function PriceMonitoring({ tour, onUpdate }: PriceMonitoringProps) {
  const [newAttraction, setNewAttraction] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddPrice = () => {
    if (newAttraction.trim() && newPrice) {
      storage.addPricePoint(tour.id, newAttraction, Number.parseFloat(newPrice))
      setNewAttraction("")
      setNewPrice("")
      setIsAdding(false)
      onUpdate()
    }
  }

  const priceHistory = tour.priceHistory || []
  const avgPrice =
    priceHistory.length > 0 ? (priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length).toFixed(2) : "0"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">Мониторинг цен</h3>
        <span className="text-sm text-gray-400">Средняя цена: ${avgPrice}</span>
      </div>

      {/* Price History */}
      {priceHistory.length > 0 && (
        <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
          <div className="space-y-2">
            {priceHistory.map((point, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded">
                <div>
                  <p className="text-white font-medium">{point.attraction}</p>
                  <p className="text-gray-400 text-xs">{new Date(point.date).toLocaleDateString("ru-RU")}</p>
                </div>
                <span className="text-teal-400 font-semibold">${point.price}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Price */}
      {isAdding ? (
        <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4 space-y-3">
          <Input
            placeholder="Название достопримечательности"
            value={newAttraction}
            onChange={(e) => setNewAttraction(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
          />
          <Input
            type="number"
            placeholder="Цена ($)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
          />
          <div className="flex gap-2">
            <Button onClick={handleAddPrice} className="flex-1 bg-teal-500 hover:bg-teal-600">
              Добавить
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1 border-slate-600">
              Отмена
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить цену
        </Button>
      )}
    </div>
  )
}
