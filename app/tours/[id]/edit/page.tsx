"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { VerticalNav } from "@/components/vertical-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Copy } from "lucide-react"
import { storage } from "@/lib/storage"
import type { Tour, Place } from "@/lib/types"
import { useAuth } from "@/lib/hooks/use-auth"
import { MobileNav } from "@/components/mobile-nav"

export default function EditTourPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const tourId = params.id as string

  const [tour, setTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    maxParticipants: 10,
  })
  const [places, setPlaces] = useState<Place[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingCopy, setIsCreatingCopy] = useState(false)

  useEffect(() => {
    const loadedTour = storage.getTourById(tourId)
    if (loadedTour) {
      setTour(loadedTour)
      setFormData({
        name: loadedTour.name,
        description: loadedTour.description,
        price: loadedTour.price,
        duration: loadedTour.duration,
        maxParticipants: loadedTour.maxParticipants,
      })

      const allPlaces = storage.getPlaces()
      const tourPlaces = allPlaces.filter((p) => loadedTour.places.includes(p.id))
      setPlaces(tourPlaces)
    }
  }, [tourId])

  const handleSave = () => {
    if (!tour) return

    setIsSaving(true)
    const updatedTour: Tour = {
      ...tour,
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    storage.updateTour(updatedTour)
    setIsSaving(false)
    router.push(`/tours/${tourId}`)
  }

  const handleCreateCopy = () => {
    if (!tour) return

    setIsCreatingCopy(true)
    const newTour: Tour = {
      ...tour,
      id: `tour-copy-${Date.now()}`,
      name: `${formData.name} (копия)`,
      description: formData.description,
      price: formData.price,
      duration: formData.duration,
      maxParticipants: formData.maxParticipants,
      createdAt: new Date().toISOString(),
      baseTourId: tour.id,
      version: (tour.version || 1) + 1,
    }

    storage.addTour(newTour)
    setIsCreatingCopy(false)
    router.push(`/tours/${newTour.id}`)
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20 flex items-center justify-center">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <VerticalNav />
      <MobileNav />

      <div className="pl-20 md:pl-20 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Редактировать тур</h1>
          </div>

          {/* Form */}
          <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-6 space-y-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Название тура</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder:text-gray-400 min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Цена ($)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Длительность (часов)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Макс. участников</label>
                <Input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Places in tour */}
            <div>
              <label className="block text-white font-semibold mb-3">Места в туре</label>
              <div className="space-y-2">
                {places.map((place) => (
                  <div key={place.id} className="bg-slate-700/50 rounded p-3 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{place.name}</p>
                      <p className="text-sm text-gray-400">{place.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Сохранение..." : "Сохранить изменения"}
            </Button>
            <Button
              onClick={handleCreateCopy}
              disabled={isCreatingCopy}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {isCreatingCopy ? "Создание копии..." : "Создать копию"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
