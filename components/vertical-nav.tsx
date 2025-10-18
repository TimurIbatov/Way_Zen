"use client"

import { usePathname, useRouter } from "next/navigation"
import { Map, Heart, MessageSquare, Compass, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import { LanguageSelector } from "./language-selector"
import { useLanguage } from "@/lib/hooks/use-language"

export function VerticalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { icon: Compass, label: t("nav.tours"), href: "/tours" },
    { icon: Map, label: t("nav.map"), href: "/map" },
    { icon: Heart, label: t("nav.favorites"), href: "/favorites" },
    { icon: MessageSquare, label: t("nav.history"), href: "/chat/history" },
  ]

  if (!user) return null

  return (
    <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-20 bg-[#2a2a2a] flex-col items-center py-6 z-50">
      {/* Logo */}
      <button onClick={() => router.push("/")} className="mb-8 hover:opacity-80 transition-opacity" title="Home">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-xl">W</span>
        </div>
      </button>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors group",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300",
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-tight text-center">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-4">
        <LanguageSelector />
      </div>

      {/* User Profile at bottom */}
      <button
        onClick={() => router.push("/profile")}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          pathname === "/profile" ? "text-white" : "text-gray-500 hover:text-gray-300",
        )}
        title="Profile"
      >
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="h-5 w-5" />
        </div>
        <span className="text-[10px] text-center leading-tight max-w-[60px] truncate">{user.name}</span>
      </button>
    </nav>
  )
}
