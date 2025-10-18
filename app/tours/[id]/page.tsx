"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { VerticalNav } from "@/components/vertical-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Plus, Share2, Edit } from "lucide-react"
import { storage } from "@/lib/storage"
import { TourShareModal } from "@/components/tour-share-modal"
import { PriceMonitoring } from "@/components/price-monitoring"
import { ExpenseTracker } from "@/components/expense-tracker"
import { useAuth } from "@/lib/hooks/use-auth"
import { MobileNav } from "@/components/mobile-nav"
import { InteractiveMap } from "@/components/interactive-map"

export default function TourDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tourId = params.id as string

  const [tour, setTour] = useState(() => {
    const tours = storage.getTours()
    return tours.find((t) => t.id === tourId)
  })

  const [places] = useState(() => {
    if (!tour) return []
    const allPlaces = storage.getPlaces()
    return allPlaces.filter((p) => tour.places.includes(p.id))
  })

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const handleRefresh = () => {
    const tours = storage.getTours()
    const updated = tours.find((t) => t.id === tourId)
    if (updated) setTour(updated)
  }

  const isOwner = tour && user && tour.createdBy === user.id

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Тур не найден</p>
          <Button onClick={() => router.push("/tours")} className="bg-teal-500 hover:bg-teal-600">
            Вернуться к турам
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <VerticalNav />
      <MobileNav />

      <div className="pl-20 md:pl-20 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4 flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{tour.name}</h1>
                <p className="text-gray-400">{tour.description}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Поделиться
                </Button>
                {isOwner && (
                  <Button
                    onClick={() => router.push(`/tours/${tourId}/edit`)}
                    className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </Button>
                )}
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Присоединиться
                </Button>
              </div>
            </div>
          </div>

          {/* Tour Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span className="text-gray-400 text-sm">Город</span>
              </div>
              <p className="text-white font-semibold">{tour.city}</p>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-teal-400" />
                <span className="text-gray-400 text-sm">Длительность</span>
              </div>
              <p className="text-white font-semibold">{tour.duration} часов</p>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-teal-400" />
                <span className="text-gray-400 text-sm">Участники</span>
              </div>
              <p className="text-white font-semibold">
                {tour.currentParticipants}/{tour.maxParticipants}
              </p>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-teal-400" />
                <span className="text-gray-400 text-sm">Стоимость</span>
              </div>
              <p className="text-white font-semibold">~${tour.price}</p>
            </Card>
          </div>

          {tour.route && tour.route.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Маршрут тура</h2>
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
                <InteractiveMap places={places} selectedCategory={null} height="400px" />
              </div>
              <div className="mt-4 bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Остановки маршрута:</h3>
                <ol className="space-y-2">
                  {tour.route.map((stop, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-3">
                      <span className="text-teal-400 font-semibold">{index + 1}.</span>
                      <span>{stop}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Places */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Места в туре</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((place) => (
                <Card
                  key={place.id}
                  className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4 hover:border-teal-500/50 transition-all cursor-pointer overflow-hidden group"
                  onClick={() => router.push(`/map?place=${place.id}`)}
                >
                  {place.images && place.images.length > 0 && (
                    <div className="relative h-32 mb-3 rounded overflow-hidden">
                      <img
                        src={place.images[0] || "/placeholder.svg"}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-white mb-2">{place.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{place.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300 text-sm">{place.rating}</span>
                    </div>
                    <span className="text-teal-400 text-sm">{place.city}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Price Monitoring and Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PriceMonitoring tour={tour} onUpdate={handleRefresh} />
            <ExpenseTracker tour={tour} onUpdate={handleRefresh} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <TourShareModal tour={tour} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  )
}
