"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Map, Heart, MessageSquare, Compass, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"
import { useLanguage } from "@/lib/hooks/use-language"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { icon: Compass, label: "Туры и Места", href: "/tours" },
    { icon: Map, label: t("nav.map"), href: "/map" },
    { icon: Heart, label: t("nav.favorites"), href: "/favorites" },
    { icon: MessageSquare, label: "История", href: "/chat/history" },
  ]

  if (!user) return null

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-slate-700 z-40 transition-transform duration-300 ease-in-out md:hidden",
          isVisible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 transition-colors",
                  isActive ? "text-teal-400" : "text-gray-500 hover:text-gray-300",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </button>
            )
          })}
          <button
            onClick={() => router.push("/profile")}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 transition-colors",
              pathname === "/profile" ? "text-teal-400" : "text-gray-500 hover:text-gray-300",
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] leading-tight">Профиль</span>
          </button>
        </div>
      </nav>
    </>
  )
}
