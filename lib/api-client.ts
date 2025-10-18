const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Tours endpoints
  async getTours() {
    return this.request("/tours/")
  }

  async getTourById(id: string) {
    return this.request(`/tours/${id}/`)
  }

  async createTour(tourData: any) {
    return this.request("/tours/", {
      method: "POST",
      body: JSON.stringify(tourData),
    })
  }

  async updateTour(id: string, tourData: any) {
    return this.request(`/tours/${id}/`, {
      method: "PUT",
      body: JSON.stringify(tourData),
    })
  }

  async deleteTour(id: string) {
    return this.request(`/tours/${id}/`, {
      method: "DELETE",
    })
  }

  // Places endpoints
  async getPlaces() {
    return this.request("/places/")
  }

  async getPlaceById(id: string) {
    return this.request(`/places/${id}/`)
  }

  async createPlace(placeData: any) {
    return this.request("/places/", {
      method: "POST",
      body: JSON.stringify(placeData),
    })
  }

  async updatePlace(id: string, placeData: any) {
    return this.request(`/places/${id}/`, {
      method: "PUT",
      body: JSON.stringify(placeData),
    })
  }

  async deletePlace(id: string) {
    return this.request(`/places/${id}/`, {
      method: "DELETE",
    })
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}/`)
  }

  async updateUserProfile(userId: string, userData: any) {
    return this.request(`/users/${userId}/`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  // Tour participation endpoints
  async joinTour(tourId: string, userId: string) {
    return this.request(`/tours/${tourId}/join/`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  }

  async leaveTour(tourId: string, userId: string) {
    return this.request(`/tours/${tourId}/leave/`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  }

  // Reviews endpoints
  async getReviews(placeId?: string) {
    const endpoint = placeId ? `/reviews/?place=${placeId}` : "/reviews/"
    return this.request(endpoint)
  }

  async createReview(reviewData: any) {
    return this.request("/reviews/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/${reviewId}/`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
