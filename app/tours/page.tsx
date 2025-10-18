"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VerticalNav } from "@/components/vertical-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Clock, DollarSign, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/storage"
import { useAuth } from "@/lib/hooks/use-auth"
import { useLanguage } from "@/lib/hooks/use-language"
import { CITY_KEYS, getCityTranslation, CITY_REVERSE_MAPPING } from "@/lib/cities"

export default function ToursPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const allTours = storage.getTours()
  const activeTours = allTours.filter(
    (tour) => tour.isActive && tour.currentParticipants > 0 && user && tour.places.length > 0,
  )
  const userTours = allTours.filter((tour) => tour.createdBy === user?.id)
  const tourHistory = user ? storage.getUserTourHistory(user.id) : []

  const filteredTours = (tours: typeof allTours) => {
    return tours.filter((tour) => {
      const matchesCity = !selectedCity || tour.city === selectedCity
      const matchesSearch =
        !searchQuery ||
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCity && matchesSearch
    })
  }

  const TourCard = ({ tour }: { tour: (typeof allTours)[0] }) => (
    <Card
      className="bg-slate-800/60 backdrop-blur-lg border-slate-700 hover:border-teal-500/50 transition-all cursor-pointer overflow-hidden group"
      onClick={() => router.push(`/tours/${tour.id}`)}
    >
      <div className="relative h-40 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 overflow-hidden">
        <img
          src={tour.image || "/placeholder.svg?height=160&width=300"}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <button className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 backdrop-blur-lg rounded-full p-2 transition-all">
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white line-clamp-2">{tour.name}</h3>

        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-400" />
            <span>{tour.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-400" />
            <span>
              {tour.duration} {t("tours.hours")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-400" />
            <span>
              {tour.currentParticipants}/{tour.maxParticipants} {t("tours.participants")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-teal-400" />
            <span className="text-white font-semibold">~{tour.price}</span>
          </div>
          <span className="text-xs text-gray-400">{tour.difficulty}</span>
        </div>
      </div>
    </Card>
  )

  const CityFilters = () => (
    <div className="space-y-3">
      <h3 className="text-white font-semibold text-center">{t("tours.filterByCity")}</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => setSelectedCity(null)}
          variant={selectedCity === null ? "default" : "outline"}
          className={
            selectedCity === null
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
          }
        >
          {t("tours.allCities")}
        </Button>
        {CITY_KEYS.map((cityKey) => {
          const cityNameInDb = CITY_REVERSE_MAPPING[cityKey]
          return (
            <Button
              key={cityKey}
              onClick={() => setSelectedCity(cityNameInDb)}
              variant={selectedCity === cityNameInDb ? "default" : "outline"}
              className={
                selectedCity === cityNameInDb
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
              }
            >
              {getCityTranslation(cityKey, t)}
            </Button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <VerticalNav />

      <div className="pl-0 lg:pl-20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Centered header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{t("tours.title")}</h1>
            <p className="text-gray-400">{t("tours.subtitle")}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-slate-800/50 border border-slate-700 mx-auto">
              <TabsTrigger value="active">{t("tours.activeTours")}</TabsTrigger>
              <TabsTrigger value="all">{t("tours.allTours")}</TabsTrigger>
              <TabsTrigger value="my-tours">{t("tours.myTours")}</TabsTrigger>
              <TabsTrigger value="history">{t("tours.history")}</TabsTrigger>
            </TabsList>

            {/* Active Tours Tab */}
            <TabsContent value="active" className="space-y-6 mt-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("tours.searchTours")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/60 backdrop-blur-lg border-slate-700 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* City Filter */}
                <CityFilters />
              </div>

              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours(activeTours).length > 0 ? (
                  filteredTours(activeTours).map((tour) => <TourCard key={tour.id} tour={tour} />)
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">{t("tours.noActiveTours")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* All Tours Tab */}
            <TabsContent value="all" className="space-y-6 mt-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("tours.searchTours")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/60 backdrop-blur-lg border-slate-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <CityFilters />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours(allTours).length > 0 ? (
                  filteredTours(allTours).map((tour) => <TourCard key={tour.id} tour={tour} />)
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">{t("tours.noToursFound")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* My Tours Tab */}
            <TabsContent value="my-tours" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTours.length > 0 ? (
                  userTours.map((tour) => (
                    <Card
                      key={tour.id}
                      className="bg-slate-800/60 backdrop-blur-lg border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => router.push(`/tours/${tour.id}`)}
                    >
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-white">{tour.name}</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-400" />
                            <span>{tour.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span>
                              {tour.currentParticipants} {t("tours.participants")}
                            </span>
                          </div>
                        </div>
                        <Button className="w-full bg-purple-500 hover:bg-purple-600">{t("tours.manageTour")}</Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 mb-4">{t("tours.noCreatedTours")}</p>
                    <Button className="bg-purple-500 hover:bg-purple-600">{t("tours.createNew")}</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6
