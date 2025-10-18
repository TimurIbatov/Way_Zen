"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useLanguage } from "@/lib/hooks/use-language"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.interests && userData.interests.length > 0) {
          router.push("/")
        } else {
          router.push("/onboarding")
        }
      }
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Card className="w-full max-w-md p-8 bg-slate-800/60 backdrop-blur-lg border-slate-700">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white italic">{t("auth.login")}</h1>
          <p className="text-gray-400">{t("auth.enterEmail")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 h-12"
            />
            <Input
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 h-12"
            />
            <p className="text-sm text-gray-400 text-left">{t("auth.forgotPassword")}</p>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-12"
              disabled={loading}
            >
              {loading ? t("auth.loggingIn") : t("auth.login")}
            </Button>
          </form>

          <p className="text-sm text-gray-400">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="text-teal-400 hover:underline">
              {t("auth.signup")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
