"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Heart, MessageSquare, LogOut, Info } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { getCategoriesWithTranslations } from "@/lib/mock-data"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/hooks/use-language"
import { LanguageSelector } from "@/components/language-selector"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites(user?.id)
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const categories = getCategoriesWithTranslations(t)
  const userCategories = categories.filter((cat) => user?.interests.includes(cat.id))

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-slate-800/40 backdrop-blur-lg border-b border-slate-700">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">{t("profile.myProfile")}</h1>
            </div>
            <LanguageSelector />
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto p-4 space-y-4">
          {/* User info */}
          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">{user?.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-400">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Heart className="h-8 w-8 text-teal-400 mx-auto" />
                  <p className="text-3xl font-bold text-white">{favorites.length}</p>
                  <p className="text-sm text-gray-400">{t("favorites.places")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-8 w-8 text-cyan-400 mx-auto" />
                  <p className="text-3xl font-bold text-white">{userCategories.length}</p>
                  <p className="text-sm text-gray-400">{t("onboarding.selectInterests")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interests */}
          <Card className="bg-slate-800/40 backdrop-blur-lg border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{t("onboarding.selectInterests")}</CardTitle>
              <CardDescription className="text-gray-400">{t("onboarding.selectOneOrMore")}</CardDescription>
            </CardHeader>
            <CardContent>
              {userCategories.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-400">{t("onboarding.selectOneOrMore")}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-slate-700/60 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Link href="/onboarding">{t("onboarding.selectInterests")}</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/40 border border-slate-600"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <p className="font-medium text-white">{category.name}</p>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    </div>
                  ))}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-slate-700/60 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Link href="/onboarding">{t("onboarding.selectInterests")}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start bg-slate-700/60 border-slate-600 text-white hover:bg-slate-600"
            >
              <Link href="/about">
                <Info className="h-4 w-4 mr-2" />
                {t("profile.about")}
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-400 hover:text-red-300 bg-slate-700/60 border-slate-600 hover:bg-slate-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("profile.logout")}
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
