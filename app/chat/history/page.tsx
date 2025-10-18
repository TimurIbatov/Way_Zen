"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { VerticalNav } from "@/components/vertical-nav"
import { useLanguage } from "@/lib/hooks/use-language"
import { Button } from "@/components/ui/button"

export default function ChatHistoryPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <VerticalNav />

      <div className="pl-20 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">{t("history.title")}</h1>

          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">{t("history.noChats")}</p>
            <Button
              onClick={() => router.push("/chat")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
            >
              {t("nav.chat")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
