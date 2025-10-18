export interface Place {
  id: string
  name: string
  description: string
  categoryId: string
  categories?: string[]
  city: string
  location: {
    lat: number
    lng: number
    address: string
  }
  images: string[]
  rating: number
  reviewCount: number
  tags: string[]
  isHidden?: boolean
  address?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

export interface Review {
  id: string
  placeId: string
  userId: string
  userName: string
  rating: number
  comment: string
  images: string[]
  createdAt: string
}

export interface Tour {
  id: string
  name: string
  description: string
  city: string
  places: string[] // Place IDs
  duration: number // in hours
  price: number
  estimatedCost: number
  difficulty: "easy" | "medium" | "hard"
  rating: number
  reviewCount: number
  image: string
  tags: string[]
  createdBy: string
  createdAt: string
  isActive: boolean
  maxParticipants: number
  currentParticipants: number
  startDate?: string
  endDate?: string
  priceHistory?: PricePoint[]
  expenses?: Expense[]
  isCustom?: boolean
  baseTourId?: string
  version?: number
  route?: string[]
}

export interface PricePoint {
  date: string
  price: number
  attraction: string
}

export interface Expense {
  id: string
  category: "transport" | "food" | "accommodation" | "attraction" | "other"
  amount: number
  description: string
  date: string
}

export interface TourHistory {
  id: string
  tourId: string
  userId: string
  completedAt: string
  rating: number
  totalSpent: number
  notes: string
}
