"use client"

import { AuthGuard } from "@/components/auth-guard"
import { VerticalNav } from "@/components/vertical-nav"
import { Card } from "@/components/ui/card"
import { MessageSquare, Clock } from "lucide-react"

export default function HistoryPage() {
  // Placeholder for chat history - will be implemented later
  const chatHistory = [
    {
      id: "1",
      query: "Plan a one-day trip for me.",
      timestamp: "2024-01-15 14:30",
      responses: 3,
    },
    {
      id: "2",
      query: "How to get to the nearest cinema?",
      timestamp: "2024-01-15 12:15",
      responses: 1,
    },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-teal-900/20">
        <VerticalNav />

        <div className="pl-20 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">История чатов</h1>

            <div className="space-y-4">
              {chatHistory.map((chat) => (
                <Card
                  key={chat.id}
                  className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-6 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg mb-2">{chat.query}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{chat.timestamp}</span>
                        </div>
                        <span>{chat.responses} ответов</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {chatHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">История чатов пуста</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
