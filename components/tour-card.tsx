import { Star, MapPin, Users, Clock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Tour } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-slate-700 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-lg">
      <Link href={`/tours/${tour.id}`}>
        <div className="relative h-48 bg-muted">
          <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">Тур</Badge>
          <Badge className="absolute top-2 right-2 bg-teal-500 text-white">{tour.difficulty}</Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/tours/${tour.id}`} className="block">
          <h3 className="font-semibold text-white hover:text-teal-400 transition-colors line-clamp-1 mb-2">
            {tour.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{tour.city}</span>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{tour.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <Clock className="h-4 w-4 text-teal-400" />
            <span>{tour.duration}ч</span>
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <Users className="h-4 w-4 text-teal-400" />
            <span>
              {tour.currentParticipants}/{tour.maxParticipants}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-teal-500 text-teal-500" />
            <span className="font-medium text-white">{tour.rating}</span>
            <span className="text-sm text-gray-400">({tour.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-teal-400">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">${tour.price}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tour.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          Подробнее
        </Button>
      </CardContent>
    </Card>
  )
}
