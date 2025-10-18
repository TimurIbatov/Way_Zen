"use client"

import type React from "react"

import { useState, useMemo, useEffect, Component } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { PlaceCardWithAdd } from "@/components/place-card-with-add"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapIcon, List, Calculator, ShoppingCart } from "lucide-react"
import { getCategoriesWithTranslations } from "@/lib/mock-data"
import { storage } from "@/lib/storage"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { VerticalNav } from "@/components/vertical-nav"
import { useLanguage } from "@/lib/hooks/use-language"
import { InteractiveMap } from "@/components/interactive-map"
import { RouteCalculator } from "@/components/route-calculator"
import { useCart } from "@/lib/hooks/use-cart"
import { MobileNav } from "@/components/mobile-nav"
import type { Place, Tour } from "@/lib/types"
import { calculateTripCost } from "@/lib/cost-calculator"
import { CITY_KEYS, getCityTranslation, CITY_REVERSE_MAPPING } from "@/lib/cities"

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 text-gray-400">
          <h1>{this.props.children}</h1>
        </div>
      )
    }
    return this.props.children
  }
}

export default function MapPage() {
  const { user } = useAuth()
  const { favorites, toggleFavorite, isFavorite } = useFavorites(user?.id)
  const { t } = useLanguage()
  const { cart, addToCart, removeFromCart, isInCart } = useCart()
  const [places, setPlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map" | "calculator">("list")
  const [showCreateTourModal, setShowCreateTourModal] = useState(false)
  const [tourName, setTourName] = useState("")
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const categories = getCategoriesWithTranslations(t)

  useEffect(() => {
    const loadedPlaces = storage.getPlaces()
    const placesWithFallback = loadedPlaces.map((place) => ({
      ...place,
      image: place.images?.[0] || "/images/placeholder.jpg",
    }))
    setPlaces(placesWithFallback)
  }, [])

  const filteredPlaces = useMemo(() => {
    let filtered = places

    if (selectedCity) {
      filtered = filtered.filter((place) => place.city === selectedCity)
    }

    if (selectedCategory) {
      filtered = filtered.filter((place) => place.categoryId === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.description.toLowerCase().includes(query) ||
          place.city.toLowerCase().includes(query) ||
          place.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [places, selectedCity, selectedCategory, searchQuery])

  const handleCreateTourFromCart = () => {
    if (tourName.trim() && cart.length > 0) {
      const totalCost = cart.reduce((sum, p) => {
        const cost = calculateTripCost([p], 1)
        return sum + cost.totalCost
      }, 0)

      const newTour: Tour = {
        id: `tour-custom-${Date.now()}`,
        name: tourName,
        description: `${t("map.customTour")} ${cart.length} ${t("map.places")}`,
        city: cart[0]?.city || "Узбекистан",
        places: cart.map((p) => p.id),
        duration: cart.length * 2,
        price: Math.round(totalCost),
        estimatedCost: Math.round(totalCost),
        difficulty: "easy",
        rating: 0,
        reviewCount: 0,
        image: cart[0]?.images?.[0] || "/placeholder.svg",
        tags: ["пользовательский"],
        createdBy: user?.id || "user",
        createdAt: new Date().toISOString(),
        isActive: true,
        maxParticipants: 10,
        currentParticipants: 1,
        isCustom: true,
        route: cart.map((p) => p.name),
      }
      storage.addTour(newTour)
      setTourName("")
      setShowCreateTourModal(false)
      cart.forEach((place) => removeFromCart(place.id))
    }
  }

  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
          <VerticalNav />
          <MobileNav />

          <div className="pl-0 lg:pl-20 p-4 md:p-8 pb-24 md:pb-8">
            {/* Search and filters - Centered layout */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="relative flex-1 w-full max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("map.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/60 backdrop-blur-lg border-slate-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-lg rounded-lg p-1 border border-slate-700 flex-wrap md:flex-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-teal-500/20 text-teal-400" : "text-gray-400 hover:text-white"}
                  >
                    <List className="h-4 w-4 mr-2" />
                    {t("map.list")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className={viewMode === "map" ? "bg-teal-500/20 text-teal-400" : "text-gray-400 hover:text-white"}
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    {t("map.map")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("calculator")}
                    className={
                      viewMode === "calculator" ? "bg-teal-500/20 text-teal-400" : "text-gray-400 hover:text-white"
                    }
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {t("map.route")}
                  </Button>
                </div>

                {cart.length > 0 && (
                  <Button
                    onClick={() => setShowCreateTourModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("map.createTour")} ({cart.length})
                  </Button>
                )}
              </div>

              {/* Category filters - Centered */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={
                    selectedCategory === null
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
                  }
                >
                  {t("map.all")}
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                        : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* City filters - Centered with translations */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCity === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(null)}
                  className={
                    selectedCity === null
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
                  }
                >
                  {t("map.all")}
                </Button>
                {CITY_KEYS.map((cityKey) => {
                  const cityNameInDb = CITY_REVERSE_MAPPING[cityKey]
                  return (
                    <Button
                      key={cityKey}
                      variant={selectedCity === cityNameInDb ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCity(cityNameInDb)}
                      className={
                        selectedCity === cityNameInDb
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          : "bg-slate-800/60 border-slate-700 text-gray-300 hover:bg-slate-700"
                      }
                    >
                      {getCityTranslation(cityKey, t)}
                    </Button>
                  )
                })}
              </div>
            </div>

            {viewMode === "map" && (
              <div className="mb-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
                <InteractiveMap places={filteredPlaces} selectedCategory={selectedCategory} height="500px" />
              </div>
            )}

            {viewMode === "list" && (
              <main>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPlaces.map((place) => (
                      <PlaceCardWithAdd
                        key={place.id}
                        place={place}
                        isFavorite={isFavorite(place.id)}
                        isInCart={isInCart(place.id)}
                        onToggleFavorite={toggleFavorite}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                      />
                    ))}
                  </div>
                  {filteredPlaces.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-400">{places.length === 0 ? t("map.noPlaces") : t("map.noResults")}</p>
                    </div>
                  )}
                </div>
              </main>
            )}

            {viewMode === "calculator" && (
              <div className="max-w-2xl mx-auto">
                <RouteCalculator places={filteredPlaces} />
              </div>
            )}

            {/* Modal for creating tour from cart */}
            {showCreateTourModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold text-white mb-4">{t("map.createNewTour")}</h2>
                  <input
                    type="text"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    placeholder={t("map.tourName")}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder:text-gray-400 mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateTourFromCart}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {t("map.create")}
                    </Button>
                    <Button
                      onClick={() => setShowCreateTourModal(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      {t("map.cancel")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  )
}
