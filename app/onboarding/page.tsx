"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { categories } from "@/lib/mock-data"
import { Check, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"

const UZBEK_CITIES = [
  { id: "tashkent", name: "Ташкент", emoji: "🏙️" },
  { id: "samarkand", name: "Самарканд", emoji: "🕌" },
  { id: "bukhara", name: "Бухара", emoji: "🏛️" },
  { id: "khiva", name: "Хива", emoji: "🏰" },
  { id: "fergana", name: "Фергона", emoji: "🌾" },
  { id: "andijan", name: "Андижан", emoji: "🏞️" },
  { id: "namangan", name: "Наманган", emoji: "🏘️" },
  { id: "nukus", name: "Нукус", emoji: "🏜️" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { updateInterests, user, loading } = useAuth()
  const { t } = useLanguage()
  const [step, setStep] = useState<"interests" | "city">("interests")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || [])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const toggleInterest = (categoryId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleContinue = () => {
    if (step === "interests") {
      setStep("city")
    } else {
      setIsLoading(true)
      updateInterests(selectedInterests)
      if (selectedCity) {
        localStorage.setItem("userCity", selectedCity)
      }
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20 p-4">
      <div className="w-full max-w-3xl space-y-6">
        {step === "interests" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-white">{t("onboarding.welcome")}</h1>
              <p className="text-gray-300 text-lg text-balance leading-relaxed">{t("onboarding.selectInterests")}</p>
            </div>

            <Card className="border-slate-700 bg-slate-800/60 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">{t("onboarding.selectInterests")}</CardTitle>
                <CardDescription className="text-gray-400">{t("onboarding.selectOneOrMore")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => {
                    const isSelected = selectedInterests.includes(category.id)
                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleInterest(category.id)}
                        className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-teal-500 bg-teal-500/10"
                            : "border-slate-700 hover:border-teal-500/50 bg-slate-800/40"
                        }`}
                      >
                        <div className="text-3xl flex-shrink-0">{category.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white">{category.name}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{category.description}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleContinue}
                    disabled={selectedInterests.length === 0 || isLoading}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                  >
                    {t("onboarding.next")}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === "city" && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-white">{t("onboarding.selectCity")}</h1>
              <p className="text-gray-300 text-lg text-balance leading-relaxed">{t("onboarding.whereToGo")}</p>
            </div>

            <Card className="border-slate-700 bg-slate-800/60 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">{t("onboarding.uzbekCities")}</CardTitle>
                <CardDescription className="text-gray-400">{t("onboarding.selectOneCity")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UZBEK_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCity === city.id
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-slate-700 hover:border-teal-500/50 bg-slate-800/40"
                      }`}
                    >
                      <span className="text-3xl">{city.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{city.name}</h3>
                      </div>
                      {selectedCity === city.id && (
                        <div className="bg-teal-500 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setStep("interests")}
                    variant="outline"
                    className="flex-1 border-slate-700 text-gray-300 hover:bg-slate-800"
                  >
                    {t("onboarding.back")}
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedCity || isLoading}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                  >
                    {isLoading ? t("onboarding.saving") : t("onboarding.continue")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
