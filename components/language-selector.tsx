"use client"

import { useLanguage } from "@/lib/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "ru" as const, name: "Русский", flag: "🇷🇺" },
    { code: "en" as const, name: "English", flag: "🇬🇧" },
    { code: "zh" as const, name: "中文", flag: "🇨🇳" },
    { code: "ar" as const, name: "العربية", flag: "🇸🇦" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? "bg-slate-700 text-white" : "text-gray-300 hover:bg-slate-700"
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
