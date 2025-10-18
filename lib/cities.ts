export const CITY_KEYS = [
  "tashkent",
  "samarkand", 
  "bukhara",
  "khiva",
  "fergona",
  "kokand",
  "shahrisabz",
  "andijan",
  "namangan",
  "nukus"
] as const

export type CityKey = typeof CITY_KEYS[number]

// Маппинг для сопоставления с данными в базе (на русском)
export const CITY_MAPPING: Record<string, CityKey> = {
  "Ташкент": "tashkent",
  "Самарканд": "samarkand",
  "Бухара": "bukhara",
  "Хива": "khiva",
  "Фергона": "fergona",
  "Коканд": "kokand",
  "Шахрисабз": "shahrisabz",
  "Андижан": "andijan",
  "Наманган": "namangan",
  "Нукус": "nukus"
}

// Обратный маппинг - для сохранения в базу
export const CITY_REVERSE_MAPPING: Record<CityKey, string> = {
  "tashkent": "Ташкент",
  "samarkand": "Самарканд",
  "bukhara": "Бухара",
  "khiva": "Хива",
  "fergona": "Фергона",
  "kokand": "Коканд",
  "shahrisabz": "Шахрисабз",
  "andijan": "Андижан",
  "namangan": "Наманган",
  "nukus": "Нукус"
}

// Хелпер для получения переведенного названия города
export function getCityTranslation(cityKey: CityKey, t: (key: string) => string): string {
  return t(`cities.${cityKey}`)
}

// Хелпер для поиска ключа города по названию в базе
export function getCityKeyFromName(cityName: string): CityKey | null {
  return CITY_MAPPING[cityName] || null
}
