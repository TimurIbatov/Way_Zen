"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { VerticalNav } from "@/components/vertical-nav"
import type { Place } from "@/lib/types"
import { PlaceCard } from "@/components/place-card"
import { useLanguage } from "@/lib/hooks/use-language"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  places?: Place[]
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [displayMessages, setDisplayMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const { t } = useLanguage()

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && user.interests.length === 0) {
      router.push("/onboarding")
    }
  }, [user, loading, router])

  useEffect(() => {
    const converted = messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.parts
        .filter((part) => part.type === "text")
        .map((part) => (part as any).text)
        .join(""),
      places: undefined,
    }))
    setDisplayMessages(converted)
  }, [messages])

  useEffect(() => {
    const query = searchParams.get("q")
    if (query && displayMessages.length === 0) {
      handleQuery(query)
    }
  }, [searchParams])

  const handleQuery = async (query: string) => {
    setInput("")
    sendMessage({ text: query })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    setInput("")
    sendMessage({ text: input })
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
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
      <VerticalNav />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pl-20">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {displayMessages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <Card className="max-w-[80%] p-4 bg-teal-500/20 backdrop-blur-lg border-teal-500/30">
                    <p className="text-sm leading-relaxed text-white">{message.content}</p>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="max-w-[80%] p-4 bg-slate-800/60 backdrop-blur-lg border-slate-700">
                    <p className="text-sm leading-relaxed text-gray-200">{message.content}</p>
                  </Card>
                  {message.places && message.places.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {message.places.map((place) => (
                        <PlaceCard key={place.id} place={place} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {status === "in_progress" && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-4 bg-slate-800/60 backdrop-blur-lg border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse flex gap-1">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animation-delay-400"></div>
                  </div>
                  <span className="text-sm text-gray-400">{t("chat.thinking")}</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-purple-500 via-teal-500 to-cyan-500">
              <div className="flex gap-2 bg-slate-900 rounded-full p-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chat.inputPlaceholder")}
                  disabled={status === "in_progress"}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  disabled={status === "in_progress" || !input.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-full h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
