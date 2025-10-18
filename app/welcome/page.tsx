"use client"

import { Button } from "@/components/ui/button"
import { Compass, MapPin, Users, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/use-language"
import { LanguageSelector } from "@/components/language-selector"

export default function WelcomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20 flex flex-col relative overflow-hidden">
      {/* Decorative gradient semicircle at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 rounded-b-full bg-gradient-to-b from-gray-700/40 to-transparent blur-3xl pointer-events-none" />

      {/* Header with language selector */}
      <div className="relative z-20 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white italic">WayZen</h1>
        </div>
        <LanguageSelector />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Hero section */}
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-teal-400 font-medium">{t("welcome.tagline")}</p>
              <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight text-balance">
                {t("welcome.title")}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed text-balance max-w-3xl mx-auto">
                {t("welcome.description")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Compass className="h-5 w-5 mr-2" />
                {t("welcome.startJourney")}
              </Button>
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                variant="outline"
                className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400/10 px-12 py-6 text-lg font-semibold rounded-full transition-all"
              >
                {t("welcome.login")}
              </Button>
            </div>
          </div>

          {/* Features showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-lg border border-teal-500/30 rounded-2xl p-8 hover:border-teal-400/60 transition-all hover:bg-teal-500/15">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-purple-500/0 group-hover:from-teal-500/10 group-hover:to-purple-500/5 rounded-2xl transition-all" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI-Powered Planning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Персонализированные рекомендации на основе ваших интересов и предпочтений
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/60 transition-all hover:bg-purple-500/15">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/5 rounded-2xl transition-all" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Smart Routes</h3>
                <p className="text-gray-300 leading-relaxed">
                  Оптимальные маршруты с расчётом времени, расстояния и стоимости
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg border border-amber-500/30 rounded-2xl p-8 hover:border-amber-400/60 transition-all hover:bg-amber-500/15">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/5 rounded-2xl transition-all" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Share & Explore</h3>
                <p className="text-gray-300 leading-relaxed">
                  Делитесь маршрутами с друзьями и открывайте скрытые жемчужины
                </p>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-teal-400">100+</div>
              <p className="text-gray-400 text-sm md:text-base">Мест и достопримечательностей</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-purple-400">50+</div>
              <p className="text-gray-400 text-sm md:text-base">Готовых туров</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-400">4</div>
              <p className="text-gray-400 text-sm md:text-base">Языка поддержки</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 text-sm border-t border-slate-700/50 relative z-10">
        <p>© 2025 WayZen. Откройте скрытые жемчужины Узбекистана</p>
      </div>
    </div>
  )
}
