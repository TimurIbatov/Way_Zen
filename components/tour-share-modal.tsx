"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Mail, Share2 } from "lucide-react"
import type { Tour } from "@/lib/types"

interface TourShareModalProps {
  tour: Tour
  isOpen: boolean
  onClose: () => void
}

export function TourShareModal({ tour, isOpen, onClose }: TourShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/tours/${tour.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareEmail = () => {
    const subject = `Приглашение на тур: ${tour.name}`
    const body = `Присоединяйтесь к туру "${tour.name}" в ${tour.city}!\n\nСсылка: ${shareUrl}\n\nДлительность: ${tour.duration} часов\nСтоимость: ~$${tour.price}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleShareSocial = () => {
    const text = `Присоединяйтесь к туру "${tour.name}" в ${tour.city}! ${shareUrl}`
    if (navigator.share) {
      navigator.share({
        title: tour.name,
        text: text,
        url: shareUrl,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Поделиться туром</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tour Info */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-white font-semibold text-sm">{tour.name}</p>
            <p className="text-gray-400 text-xs mt-1">
              {tour.city} • {tour.duration} часов
            </p>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Ссылка на тур</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-slate-800 border-slate-700 text-gray-300 text-sm" />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Скопировано" : "Копировать"}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Способы поделиться</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleShareEmail}
                variant="outline"
                className="border-slate-700 text-gray-300 hover:bg-slate-800 flex items-center gap-2 bg-transparent"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                onClick={handleShareSocial}
                variant="outline"
                className="border-slate-700 text-gray-300 hover:bg-slate-800 flex items-center gap-2 bg-transparent"
              >
                <Share2 className="h-4 w-4" />
                Поделиться
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
