"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useLanguage } from "@/lib/hooks/use-language"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signup(email, password, name)
      router.push("/login")
    } catch (error) {
      console.error("Signup failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">ECHO</h1>
          <p className="text-gray-400 text-balance">{t("welcome.description")}</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/60 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">{t("auth.signup")}</CardTitle>
            <CardDescription>{t("auth.createAccount")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  {t("auth.name")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("auth.yourName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  {t("auth.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                disabled={loading}
              >
                {loading ? t("auth.signingUp") : t("auth.signup")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-400">{t("auth.haveAccount")} </span>
              <Link href="/login" className="text-teal-400 hover:underline font-medium">
                {t("auth.login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
