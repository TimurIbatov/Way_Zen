import type { Category } from "./types"

// Базовые категории (ID остаются на английском для совместимости с данными)
export const categories: Category[] = [
  {
    id: "sport",
    name: "Спорт", // Будет переводиться динамически
    icon: "⚽",
    description: "Спортивные площадки и активности",
  },
  {
    id: "culture",
    name: "Культура и история",
    icon: "🏛️",
    description: "Исторические места и культурные достопримечательности",
  },
  {
    id: "nature",
    name: "Природа",
    icon: "🌿",
    description: "Природные парки и живописные места",
  },
  {
    id: "crafts",
    name: "Ремесленничество",
    icon: "🎨",
    description: "Мастерские и ремесленные центры",
  },
  {
    id: "travel",
    name: "Путешествия",
    icon: "✈️",
    description: "Туристические маршруты и экскурсии",
  },
  {
    id: "entertainment",
    name: "Развлечения",
    icon: "🎭",
    description: "Развлекательные центры и мероприятия",
  },
  {
    id: "food",
    name: "Еда",
    icon: "🍽️",
    description: "Рестораны и традиционная кухня",
  },
]

// Функция для получения категорий с переводами
export function getCategoriesWithTranslations(t: (key: string) => string): Category[] {
  return categories.map(cat => ({
    ...cat,
    name: t(`categories.${cat.id}`),
  }))
}
