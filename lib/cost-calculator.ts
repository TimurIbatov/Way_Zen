import type { Place } from "./types"

export interface TripCost {
  totalCost: number
  breakdown: {
    entrance: number
    transport: number
    food: number
    accommodation: number
  }
}

export interface RouteInfo {
  places: Place[]
  totalDistance: number
  estimatedDuration: number
  route: string[]
}

// Approximate costs in USD
const COST_ESTIMATES = {
  entrance: {
    culture: 5,
    nature: 3,
    food: 0,
    entertainment: 10,
    sport: 15,
    crafts: 2,
    travel: 0,
  },
  transportPerKm: 0.1,
  foodPerDay: 15,
  accommodationPerNight: 30,
}

export function calculateTripCost(places: Place[], days = 1): TripCost {
  let entranceCost = 0

  places.forEach((place) => {
    const category = place.categoryId || "culture"
    entranceCost += COST_ESTIMATES.entrance[category as keyof typeof COST_ESTIMATES.entrance] || 5
  })

  const totalDistance = calculateTotalDistance(places)
  const transportCost = totalDistance * COST_ESTIMATES.transportPerKm
  const foodCost = days * COST_ESTIMATES.foodPerDay
  const accommodationCost = Math.max(0, days - 1) * COST_ESTIMATES.accommodationPerNight

  return {
    totalCost: entranceCost + transportCost + foodCost + accommodationCost,
    breakdown: {
      entrance: entranceCost,
      transport: transportCost,
      food: foodCost,
      accommodation: accommodationCost,
    },
  }
}

export function generateRoute(places: Place[]): RouteInfo {
  if (places.length === 0) {
    return {
      places: [],
      totalDistance: 0,
      estimatedDuration: 0,
      route: [],
    }
  }

  // Sort places by city to optimize route
  const sortedPlaces = [...places].sort((a, b) => a.city.localeCompare(b.city))

  const totalDistance = calculateTotalDistance(sortedPlaces)
  const estimatedDuration = places.length * 2 + totalDistance / 50 // 2 hours per place + travel time

  return {
    places: sortedPlaces,
    totalDistance,
    estimatedDuration,
    route: sortedPlaces.map((p) => p.name),
  }
}

function calculateTotalDistance(places: Place[]): number {
  if (places.length < 2) return 0

  let totalDistance = 0
  for (let i = 0; i < places.length - 1; i++) {
    const distance = calculateDistance(
      places[i].location?.lat || places[i].latitude || 0,
      places[i].location?.lng || places[i].longitude || 0,
      places[i + 1].location?.lat || places[i + 1].latitude || 0,
      places[i + 1].location?.lng || places[i + 1].longitude || 0,
    )
    totalDistance += distance
  }

  return totalDistance
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
