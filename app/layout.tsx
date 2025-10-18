import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { AuthProvider } from "@/lib/hooks/use-auth"
import { LanguageProvider } from "@/lib/hooks/use-language"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "WayZen",
  description: "Откройте скрытые жемчужины Узбекистана",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </Suspense>
      
      </body>
    </html>
  )
}
