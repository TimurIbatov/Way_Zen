"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Map, MessageSquare, Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/use-language"

export default function AboutPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-800/40 backdrop-blur-lg border-b border-slate-700">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-xl font-bold text-white">{t("about.title")}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-white">WayZen</h1>
          <p className="text-xl text-gray-300 text-balance leading-relaxed">{t("about.description")}</p>
        </div>

        <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">О платформе</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              WayZen - это инновационная платформа для открытия аутентичных и малоизвестных мест Узбекистана. Мы
              помогаем туристам находить скрытые жемчужины, которые знают только местные жители.
            </p>
            <p>
              Наша миссия - сделать путешествия более осмысленными и аутентичными, предоставляя доступ к уникальным
              местам, которые не найти в обычных путеводителях.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-teal-500/20">
                  <Map className="h-6 w-6 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t("about.feature1")}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Исследуйте скрытые места на интерактивной карте с удобными фильтрами по категориям и интересам
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/20">
                  <MessageSquare className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t("about.feature2")}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Получайте персональные рекомендации и создавайте уникальные маршруты с помощью искусственного
                    интеллекта
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-pink-500/20">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t("about.feature3")}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Сохраняйте понравившиеся места, делитесь впечатлениями и читайте отзывы других путешественников
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t("about.feature4")}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Все места тщательно отобраны и проверены, чтобы гарантировать подлинный опыт узбекской культуры
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-teal-500/10 border-teal-500/30 backdrop-blur-lg">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">Версия 1.0.0</p>
            <p className="text-sm text-gray-300 leading-relaxed">Сделано с любовью к Узбекистану</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
