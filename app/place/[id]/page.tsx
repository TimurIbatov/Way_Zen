"use client"

import type React from "react"

import { use, useState, useMemo, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart, Star, MapPin, Calendar } from "lucide-react"
import { categories } from "@/lib/mock-data"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { storage } from "@/lib/storage"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { VerticalNav } from "@/components/vertical-nav"
import type { Place, Review } from "@/lib/types"

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites(user?.id)
  const [place, setPlace] = useState<Place | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const places = storage.getPlaces()
    const foundPlace = places.find((p) => p.id === resolvedParams.id)
    setPlace(foundPlace || null)
    setReviews(storage.getReviews())
  }, [resolvedParams.id])

  const category = place ? categories.find((c) => c.id === place.categoryId) : null
  const placeReviews = useMemo(
    () => reviews.filter((r) => r.placeId === resolvedParams.id),
    [reviews, resolvedParams.id],
  )

  if (!place) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Место не найдено</h1>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/map">Вернуться к карте</Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newReview.comment.trim()) return

    setIsSubmitting(true)
    const review = storage.addReview({
      placeId: place.id,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      images: [],
    })

    storage.updatePlaceRating(place.id)

    setReviews([...reviews, review])
    setNewReview({ rating: 5, comment: "" })
    setIsSubmitting(false)

    const updatedPlace = storage.getPlaces().find((p) => p.id === place.id)
    if (updatedPlace) setPlace(updatedPlace)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <VerticalNav />

        {/* Header */}
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(place.id)}>
              <Heart
                className={`h-5 w-5 ${isFavorite(place.id) ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </Button>
          </div>
        </header>

        {/* Image gallery */}
        <div className="relative h-80 bg-muted">
          <Image src={place.images[0] || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
          {place.isHidden && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Скрытая жемчужина</Badge>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Title and basic info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-foreground text-balance">{place.name}</h1>
              {category && (
                <Badge variant="secondary" className="flex-shrink-0">
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{place.city}</span>
              </div>
              {place.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{place.rating}</span>
                  <span>({place.reviewCount} отзывов)</span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{place.description}</p>

            <div className="flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location details */}
          <Card className="bg-card/80 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Местоположение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{place.location.address}</p>
                  <p className="text-sm text-muted-foreground">{place.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews section */}
          <Card className="bg-card/80 backdrop-blur-lg border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Отзывы ({placeReviews.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add review form */}
              {user && (
                <form onSubmit={handleSubmitReview} className="space-y-4 pb-6 border-b border-border">
                  <div className="space-y-2">
                    <Label>Ваша оценка</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= newReview.rating ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Ваш отзыв</Label>
                    <Textarea
                      id="comment"
                      placeholder="Поделитесь своими впечатлениями..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={4}
                      className="bg-input text-foreground"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !newReview.comment.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Отправка..." : "Оставить отзыв"}
                  </Button>
                </form>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {placeReviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Пока нет отзывов. Будьте первым!</p>
                ) : (
                  placeReviews.map((review) => (
                    <div key={review.id} className="space-y-2 pb-4 border-b border-border last:border-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(review.createdAt).toLocaleDateString("ru-RU")}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image gallery */}
          {place.images.length > 1 && (
            <Card className="bg-card/80 backdrop-blur-lg border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Фотографии</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {place.images.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${place.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
