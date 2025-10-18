"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { storage } from "@/lib/storage"
import type { Tour } from "@/lib/types"

interface ExpenseTrackerProps {
  tour: Tour
  onUpdate: () => void
}

const EXPENSE_CATEGORIES = ["transport", "food", "accommodation", "attraction", "other"] as const

export function ExpenseTracker({ tour, onUpdate }: ExpenseTrackerProps) {
  const [newDescription, setNewDescription] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newCategory, setNewCategory] = useState<(typeof EXPENSE_CATEGORIES)[number]>("other")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddExpense = () => {
    if (newDescription.trim() && newAmount) {
      storage.addExpense(tour.id, {
        category: newCategory,
        amount: Number.parseFloat(newAmount),
        description: newDescription,
        date: new Date().toISOString(),
      })
      setNewDescription("")
      setNewAmount("")
      setNewCategory("other")
      setIsAdding(false)
      onUpdate()
    }
  }

  const expenses = tour.expenses || []
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryLabels: Record<(typeof EXPENSE_CATEGORIES)[number], string> = {
    transport: "Транспорт",
    food: "Еда",
    accommodation: "Проживание",
    attraction: "Достопримечательности",
    other: "Прочее",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Расходы</h3>
        <span className="text-teal-400 font-semibold">Всего: ${totalExpenses.toFixed(2)}</span>
      </div>

      {/* Expenses List */}
      {expenses.length > 0 && (
        <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4">
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between text-sm p-2 bg-slate-700/30 rounded">
                <div>
                  <p className="text-white font-medium">{expense.description}</p>
                  <p className="text-gray-400 text-xs">{categoryLabels[expense.category]}</p>
                </div>
                <span className="text-teal-400 font-semibold">${expense.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Expense */}
      {isAdding ? (
        <Card className="bg-slate-800/60 backdrop-blur-lg border-slate-700 p-4 space-y-3">
          <Input
            placeholder="Описание расхода"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
          />
          <Input
            type="number"
            placeholder="Сумма ($)"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as (typeof EXPENSE_CATEGORIES)[number])}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button onClick={handleAddExpense} className="flex-1 bg-teal-500 hover:bg-teal-600">
              Добавить
            </Button>
            <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1 border-slate-600">
              Отмена
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить расход
        </Button>
      )}
    </div>
  )
}
