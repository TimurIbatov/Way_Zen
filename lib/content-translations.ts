export const categoryTranslations = {
  ru: {
    sport: "Спорт",
    culture: "Культура и история",
    nature: "Природа",
    crafts: "Ремесленничество",
    travel: "Путешествия",
    entertainment: "Развлечения",
    food: "Еда",
  },
  en: {
    sport: "Sport",
    culture: "Culture & History",
    nature: "Nature",
    crafts: "Crafts",
    travel: "Travel",
    entertainment: "Entertainment",
    food: "Food",
  },
  zh: {
    sport: "运动",
    culture: "文化和历史",
    nature: "自然",
    crafts: "工艺",
    travel: "旅游",
    entertainment: "娱乐",
    food: "食物",
  },
  ar: {
    sport: "رياضة",
    culture: "الثقافة والتاريخ",
    nature: "الطبيعة",
    crafts: "الحرف اليدوية",
    travel: "السفر",
    entertainment: "الترفيه",
    food: "الطعام",
  },
}

export const categoryDescriptions = {
  ru: {
    sport: "Спортивные площадки и активности",
    culture: "Исторические места и культурные достопримечательности",
    nature: "Природные парки и живописные места",
    crafts: "Мастерские и ремесленные центры",
    travel: "Туристические маршруты и экскурсии",
    entertainment: "Развлекательные центры и мероприятия",
    food: "Рестораны и традиционная кухня",
  },
  en: {
    sport: "Sports facilities and activities",
    culture: "Historical sites and cultural attractions",
    nature: "Natural parks and scenic locations",
    crafts: "Workshops and craft centers",
    travel: "Tourist routes and excursions",
    entertainment: "Entertainment centers and events",
    food: "Restaurants and traditional cuisine",
  },
  zh: {
    sport: "体育设施和活动",
    culture: "历史遗迹和文化景点",
    nature: "自然公园和风景区",
    crafts: "工作坊和手工艺中心",
    travel: "旅游路线和游览",
    entertainment: "娱乐中心和活动",
    food: "餐厅和传统美食",
  },
  ar: {
    sport: "المرافق الرياضية والأنشطة",
    culture: "المواقع التاريخية والمعالم الثقافية",
    nature: "الحدائق الطبيعية والمواقع الخلابة",
    crafts: "ورش العمل ومراكز الحرف اليدوية",
    travel: "المسارات السياحية والرحلات",
    entertainment: "مراكز الترفيه والفعاليات",
    food: "المطاعم والمأكولات التقليدية",
  },
}

// Хелпер для получения перевода категории
export function getCategoryName(categoryId: string, language: string): string {
  const translations = categoryTranslations[language as keyof typeof categoryTranslations]
  return translations?.[categoryId as keyof typeof translations] || categoryId
}

// Хелпер для получения описания категории
export function getCategoryDescription(categoryId: string, language: string): string {
  const descriptions = categoryDescriptions[language as keyof typeof categoryDescriptions]
  return descriptions?.[categoryId as keyof typeof descriptions] || ""
}
