"use client"

import { useMemo, useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { PlaceCard } from "@/components/place-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MapPin, Compass } from "lucide-react"
import { storage } from "@/lib/storage"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFavorites } from "@/lib/hooks/use-favorites"
import Link from "next/link"
import { VerticalNav } from "@/components/vertical-nav"
import { useLanguage } from "@/lib/hooks/use-language"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Place, Tour } from "@/lib/types"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { favorites, toggleFavorite, isFavorite } = useFavorites(user?.id)
  const { t } = useLanguage()
  const [places, setPlaces] = useState<Place[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    setPlaces(storage.getPlaces())
    setTours(storage.getTours())
  }, [])

  const favoritePlaces = useMemo(() => {
    let filtered = places.filter((place) => favorites.includes(place.id))

    if (selectedCategory) {
      filtered = filtered.filter((place) => place.categoryId === selectedCategory)
    }

    if (selectedCity) {
      filtered = filtered.filter((place) => place.city === selectedCity)
    }

    return filtered
  }, [places, favorites, selectedCategory, selectedCity])

  const favoriteTours = useMemo(() => {
    let filtered = tours.filter((tour) => favorites.includes(tour.id))

    if (selectedCity) {
      filtered = filtered.filter((tour) => tour.city === selectedCity)
    }

    return filtered
  }, [tours, favorites, selectedCity])

  // Get unique categories and cities
  const categories = useMemo(() => {
    const cats = new Set(places.map((p) => p.categoryId))
    return Array.from(cats)
  }, [places])

  const cities = useMemo(() => {
    const citiesSet = new Set([...places.map((p) => p.city), ...tours.map((t) => t.city)])
    return Array.from(citiesSet).sort()
  }, [places, tours])

  const isEmpty = favoritePlaces.length === 0 && favoriteTours.length === 0

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
        <VerticalNav />

        {/* Content */}
        <main className="pl-20 p-8">
          {isEmpty ? (
            <div className="text-center py-16 space-y-4">
              <Heart className="h-16 w-16 text-gray-500 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{t("favorites.noFavorites")}</h2>
                <p className="text-gray-400 text-balance max-w-md mx-auto leading-relaxed">
                  Добавляйте места и туры в избранное, чтобы сохранить их для позже
                </p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              >
                <Link href="/map">Исследовать</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-teal-400" />
                <h1 className="text-2xl font-bold text-white">{t("favorites.title")}</h1>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="places" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50 border border-slate-700">
                  <TabsTrigger value="places" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("favorites.places")} ({favoritePlaces.length})
                  </TabsTrigger>
                  <TabsTrigger value="tours" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    {t("tours.activeTours")} ({favoriteTours.length})
                  </TabsTrigger>
                </TabsList>

                {/* Places Tab */}
                <TabsContent value="places" className="space-y-6 mt-6">
                  {/* Filters */}
                  <div className="space-y-4">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-300">{t("favorites.filterByCategory")}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => setSelectedCategory(null)}
                          variant={selectedCategory === null ? "default" : "outline"}
                          size="sm"
                          className={selectedCategory === null ? "bg-teal-500 hover:bg-teal-600" : ""}
                        >
                          {t("map.all")}
                        </Button>
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            className={selectedCategory === cat ? "bg-teal-500 hover:bg-teal-600" : ""}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-300">{t("favorites.filterByCity")}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => setSelectedCity(null)}
                          variant={selectedCity === null ? "default" : "outline"}
                          size="sm"
                          className={selectedCity === null ? "bg-teal-500 hover:bg-teal-600" : ""}
                        >
                          {t("map.all")}
                        </Button>
                        {cities.map((city) => (
                          <Button
                            key={city}
                            onClick={() => setSelectedCity(city)}
                            variant={selectedCity === city ? "default" : "outline"}
                            size="sm"
                            className={selectedCity === city ? "bg-teal-500 hover:bg-teal-600" : ""}
                          >
                            {city}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Places Grid */}
                  {favoritePlaces.length > 0 ? (
                    <div>
                      <p className="text-gray-400 mb-4">
                        {favoritePlaces.length} {favoritePlaces.length === 1 ? "место" : "мест"}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoritePlaces.map((place) => (
                          <PlaceCard
                            key={place.id}
                            place={place}
                            isFavorite={isFavorite(place.id)}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Нет избранных мест с выбранными фильтрами</p>
                    </div>
                  )}
                </TabsContent>

                {/* Tours Tab */}
                <TabsContent value="tours" className="space-y-6 mt-6">
                  {/* City Filter for Tours */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-300">{t("favorites.filterByCity")}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setSelectedCity(null)}
                        variant={selectedCity === null ? "default" : "outline"}
                        size="sm"
                        className={selectedCity === null ? "bg-teal-500 hover:bg-teal-600" : ""}
                      >
                        {t("map.all")}
                      </Button>
                      {cities.map((city) => (
                        <Button
                          key={city}
                          onClick={() => setSelectedCity(city)}
                          variant={selectedCity === city ? "default" : "outline"}
                          size="sm"
                          className={selectedCity === city ? "bg-teal-500 hover:bg-teal-600" : ""}
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tours Grid */}
                  {favoriteTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteTours.map((tour) => (
                        <Card
                          key={tour.id}
                          className="bg-slate-800/60 backdrop-blur-lg border-slate-700 hover:border-teal-500/50 transition-all cursor-pointer p-4"
                        >
                          <h3 className="font-semibold text-white mb-2">{tour.name}</h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tour.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-teal-400">{tour.city}</span>
                            <span className="text-gray-400">~${tour.price}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Нет избранных туров</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
