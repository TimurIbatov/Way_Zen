import type { Review, Place, Tour, TourHistory, Expense } from "./types"
import { mockTours } from "./mock-data"

interface ReviewInput {
  placeId: string
  userId: string
  userName: string
  rating: number
  comment: string
  images: string[]
}

interface PlaceInput {
  name: string
  description: string
  categoryId: string
  city: string
  latitude: number
  longitude: number
  address: string
  images: string[]
  tags: string[]
  isHidden?: boolean
}

interface TourInput {
  name: string
  description: string
  city: string
  places: string[]
  duration: number
  price: number
  difficulty: "easy" | "medium" | "hard"
  image: string
  tags: string[]
  createdBy: string
  maxParticipants: number
}

class Storage {
  private REVIEWS_KEY = "echo_reviews"
  private PLACES_KEY = "echo_places"
  private TOURS_KEY = "echo_tours"
  private TOUR_HISTORY_KEY = "echo_tour_history"
  private INITIALIZED_KEY = "echo_initialized"

  private initializeSampleData(): void {
    if (typeof window === "undefined") return

    const initialized = localStorage.getItem(this.INITIALIZED_KEY)
    if (initialized) return

    const samplePlaces: Place[] = [
      // Спорт (Sport) - 10 places
      {
        id: "p_sport_1",
        name: "Chimgan Mountains Ski Resort",
        description:
          "Premier ski resort in Uzbekistan with excellent slopes for skiing and snowboarding. Open year-round for various mountain activities.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Чимган",
        location: { lat: 41.5667, lng: 70.0167, address: "Chimgan Mountains, Tashkent Region" },
        address: "Chimgan Mountains, Tashkent Region",
        images: ["/chimgan-ski-resort.jpg"],
        tags: ["skiing", "snowboarding", "mountains"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 41.5667,
        longitude: 70.0167,
      },
      {
        id: "p_sport_2",
        name: "Tashkent Tennis Academy",
        description:
          "Modern tennis facility with professional courts and coaching. Host to national and international tournaments.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Yunusabad District, Tashkent" },
        address: "Yunusabad District, Tashkent",
        images: ["/tennis-academy.png"],
        tags: ["tennis", "sports", "training"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_sport_3",
        name: "Beldersay Cable Car & Hiking",
        description:
          "Scenic cable car ride with access to hiking trails and mountain climbing routes. Breathtaking views of the Tian Shan mountains.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Белдерсай",
        location: { lat: 41.5333, lng: 70.05, address: "Beldersay, Tashkent Region" },
        address: "Beldersay, Tashkent Region",
        images: ["/beldersay-cable-car.jpg"],
        tags: ["hiking", "cable car", "mountains"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 41.5333,
        longitude: 70.05,
      },
      {
        id: "p_sport_4",
        name: "Pakhtakor Stadium",
        description:
          "Main football stadium in Tashkent, home to FC Pakhtakor. Hosts national team matches and major sporting events.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Ташкент",
        location: { lat: 41.3167, lng: 69.25, address: "Pakhtakor Stadium, Tashkent" },
        address: "Pakhtakor Stadium, Tashkent",
        images: ["/pakhtakor-stadium.jpg"],
        tags: ["football", "stadium", "sports"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 41.3167,
        longitude: 69.25,
      },
      {
        id: "p_sport_5",
        name: "Charvak Water Sports Center",
        description:
          "Water sports paradise at Charvak Reservoir. Offers jet skiing, kayaking, paddleboarding, and swimming.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Чарвак",
        location: { lat: 41.6167, lng: 70.0833, address: "Charvak Reservoir, Tashkent Region" },
        address: "Charvak Reservoir, Tashkent Region",
        images: ["/charvak-water-sports.jpg"],
        tags: ["water sports", "lake", "recreation"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.6167,
        longitude: 70.0833,
      },
      {
        id: "p_sport_6",
        name: "Tashkent Cycling Track",
        description:
          "Professional velodrome and cycling track. Popular spot for both competitive cyclists and recreational riders.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Ташкент",
        location: { lat: 41.2995, lng: 69.2401, address: "Mirzo Ulugbek District, Tashkent" },
        address: "Mirzo Ulugbek District, Tashkent",
        images: ["/cycling-track.jpg"],
        tags: ["cycling", "velodrome", "sports"],
        rating: 4.3,
        reviewCount: 0,
        latitude: 41.2995,
        longitude: 69.2401,
      },
      {
        id: "p_sport_7",
        name: "Amirsoy Mountain Resort",
        description:
          "Modern all-season mountain resort with skiing in winter and hiking, zip-lining in summer. Family-friendly activities.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Амирсой",
        location: { lat: 41.55, lng: 70.1, address: "Amirsoy, Tashkent Region" },
        address: "Amirsoy, Tashkent Region",
        images: ["/amirsoy-resort.jpg"],
        tags: ["resort", "skiing", "adventure"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 41.55,
        longitude: 70.1,
      },
      {
        id: "p_sport_8",
        name: "Tashkent Golf Club",
        description:
          "18-hole championship golf course with modern facilities. Beautiful landscaping and professional instruction available.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Ташкент",
        location: { lat: 41.35, lng: 69.3, address: "Tashkent Golf Club, Tashkent" },
        address: "Tashkent Golf Club, Tashkent",
        images: ["/lush-golf-course.png"],
        tags: ["golf", "sports", "recreation"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.35,
        longitude: 69.3,
      },
      {
        id: "p_sport_9",
        name: "Samarkand Equestrian Center",
        description:
          "Horse riding center offering lessons and trail rides through scenic countryside. Suitable for all skill levels.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Самарканд",
        location: { lat: 39.627, lng: 66.975, address: "Samarkand Equestrian Center" },
        address: "Samarkand Equestrian Center",
        images: ["/horse-riding.png"],
        tags: ["horse riding", "equestrian", "outdoor"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 39.627,
        longitude: 66.975,
      },
      {
        id: "p_sport_10",
        name: "Tashkent Rock Climbing Gym",
        description:
          "Indoor climbing facility with routes for beginners to advanced climbers. Professional instructors and equipment rental.",
        categoryId: "sport",
        categories: ["Спорт"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2401, address: "Chilanzar District, Tashkent" },
        address: "Chilanzar District, Tashkent",
        images: ["/rock-climbing-gym.jpg"],
        tags: ["climbing", "indoor", "fitness"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2401,
      },

      // Культура и история (Culture and History) - 10 places
      {
        id: "p_culture_1",
        name: "Registan Square",
        description:
          "The heart of ancient Samarkand, featuring three magnificent madrasahs: Ulugbek, Sherdor, and Tilla-Kori. A stunning example of Islamic architecture.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Registan Street, Samarkand" },
        address: "Registan Street, Samarkand",
        images: ["/registan-square-samarkand.jpg"],
        tags: ["architecture", "history", "unesco"],
        rating: 4.9,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_culture_2",
        name: "Shah-i-Zinda",
        description:
          "A necropolis with stunning blue-tiled mausoleums, one of the most beautiful architectural ensembles in Central Asia.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Самарканд",
        location: { lat: 39.6708, lng: 66.9897, address: "Shah-i-Zinda, Samarkand" },
        address: "Shah-i-Zinda, Samarkand",
        images: ["/shah-i-zinda-necropolis-blue-tiles.jpg"],
        tags: ["architecture", "history", "religious"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 39.6708,
        longitude: 66.9897,
      },
      {
        id: "p_culture_3",
        name: "Bibi-Khanym Mosque",
        description:
          "One of the largest mosques in Central Asia, built by Timur in the 15th century. A masterpiece of Timurid architecture.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Самарканд",
        location: { lat: 39.6603, lng: 66.9808, address: "Bibi-Khanym, Samarkand" },
        address: "Bibi-Khanym, Samarkand",
        images: ["/bibi-khanym-mosque-samarkand.jpg"],
        tags: ["mosque", "architecture", "history"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.6603,
        longitude: 66.9808,
      },
      {
        id: "p_culture_4",
        name: "Ark Fortress",
        description:
          "Ancient fortress in Bukhara, once the residence of Bukhara khans. Offers panoramic views of the old city.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4144, address: "Ark Fortress, Bukhara" },
        address: "Ark Fortress, Bukhara",
        images: ["/ark-fortress-bukhara.jpg"],
        tags: ["fortress", "history", "museum"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4144,
      },
      {
        id: "p_culture_5",
        name: "Gur-e-Amir Mausoleum",
        description:
          "The tomb of Timur (Tamerlane) and his descendants. Features stunning turquoise dome and intricate interior decorations.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Самарканд",
        location: { lat: 39.6481, lng: 66.9722, address: "Gur-e-Amir, Samarkand" },
        address: "Gur-e-Amir, Samarkand",
        images: ["/gur-emir-mausoleum.jpg"],
        tags: ["mausoleum", "history", "architecture"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.6481,
        longitude: 66.9722,
      },
      {
        id: "p_culture_6",
        name: "Hazrati Imam Complex",
        description:
          "Religious center of Tashkent housing the Othman Quran, one of the world's oldest Quran manuscripts.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Ташкент",
        location: { lat: 41.3267, lng: 69.2797, address: "Hazrati Imam Square, Tashkent" },
        address: "Hazrati Imam Square, Tashkent",
        images: ["/hazrati-imam-complex.jpg"],
        tags: ["religious", "history", "mosque"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.3267,
        longitude: 69.2797,
      },
      {
        id: "p_culture_7",
        name: "Khiva Old Town (Itchan Kala)",
        description:
          "UNESCO World Heritage walled city with perfectly preserved medieval architecture. An open-air museum of Islamic culture.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Хива",
        location: { lat: 41.3775, lng: 60.3642, address: "Itchan Kala, Khiva" },
        address: "Itchan Kala, Khiva",
        images: ["/khiva-itchan-kala.jpg"],
        tags: ["unesco", "history", "architecture"],
        rating: 4.9,
        reviewCount: 0,
        latitude: 41.3775,
        longitude: 60.3642,
      },
      {
        id: "p_culture_8",
        name: "Ulugbek Observatory",
        description:
          "15th-century astronomical observatory built by Ulugbek. One of the finest observatories in the Islamic world.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Самарканд",
        location: { lat: 39.6747, lng: 66.9897, address: "Ulugbek Observatory, Samarkand" },
        address: "Ulugbek Observatory, Samarkand",
        images: ["/ulugbek-observatory.jpg"],
        tags: ["observatory", "science", "history"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 39.6747,
        longitude: 66.9897,
      },
      {
        id: "p_culture_9",
        name: "Kalon Minaret",
        description:
          "The Great Minaret of Bukhara, standing 46 meters tall. A symbol of the city and masterpiece of medieval architecture.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Po-i-Kalyan Complex, Bukhara" },
        address: "Po-i-Kalyan Complex, Bukhara",
        images: ["/kalon-minaret-bukhara.jpg"],
        tags: ["minaret", "architecture", "landmark"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_culture_10",
        name: "Amir Timur Museum",
        description:
          "Museum dedicated to the life and legacy of Amir Timur. Houses artifacts, manuscripts, and historical exhibits.",
        categoryId: "culture",
        categories: ["Культура и история"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Amir Timur Square, Tashkent" },
        address: "Amir Timur Square, Tashkent",
        images: ["/amir-timur-museum.jpg"],
        tags: ["museum", "history", "culture"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },

      // Природа (Nature) - 10 places
      {
        id: "p_nature_1",
        name: "Chimgan Mountains",
        description:
          "Beautiful mountain range near Tashkent, perfect for hiking, skiing, and enjoying nature. Popular year-round destination.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Чимган",
        location: { lat: 41.5667, lng: 70.0167, address: "Chimgan Mountains, Tashkent Region" },
        address: "Chimgan Mountains, Tashkent Region",
        images: ["/chimgan-mountains-uzbekistan.jpg"],
        tags: ["mountains", "hiking", "nature"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 41.5667,
        longitude: 70.0167,
      },
      {
        id: "p_nature_2",
        name: "Aydarkul Lake",
        description:
          "Vast artificial lake in the Kyzylkum Desert, offering yurt stays, camel rides, and stunning desert landscapes.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Нурата",
        location: { lat: 40.5833, lng: 66.5833, address: "Aydarkul Lake, Navoi Region" },
        address: "Aydarkul Lake, Navoi Region",
        images: ["/aydarkul-lake-desert-uzbekistan.jpg"],
        tags: ["lake", "desert", "camping"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 40.5833,
        longitude: 66.5833,
      },
      {
        id: "p_nature_3",
        name: "Charvak Reservoir",
        description:
          "Stunning turquoise reservoir surrounded by mountains. Popular for swimming, boating, and beach activities.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Чарвак",
        location: { lat: 41.6167, lng: 70.0833, address: "Charvak, Tashkent Region" },
        address: "Charvak, Tashkent Region",
        images: ["/charvak-reservoir.jpg"],
        tags: ["lake", "mountains", "recreation"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 41.6167,
        longitude: 70.0833,
      },
      {
        id: "p_nature_4",
        name: "Nuratau Mountains",
        description: "Remote mountain range with unique flora and fauna. Great for eco-tourism and wildlife watching.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Нурата",
        location: { lat: 40.55, lng: 65.6833, address: "Nuratau Mountains, Navoi Region" },
        address: "Nuratau Mountains, Navoi Region",
        images: ["/nuratau-mountains.jpg"],
        tags: ["mountains", "wildlife", "eco-tourism"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 40.55,
        longitude: 65.6833,
      },
      {
        id: "p_nature_5",
        name: "Zaamin National Park",
        description:
          "Mountain national park with juniper forests, waterfalls, and diverse wildlife. Excellent hiking trails.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Заамин",
        location: { lat: 39.7167, lng: 68.4167, address: "Zaamin National Park, Jizzakh Region" },
        address: "Zaamin National Park, Jizzakh Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["national park", "hiking", "forest"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.7167,
        longitude: 68.4167,
      },
      {
        id: "p_nature_6",
        name: "Kyzylkum Desert",
        description:
          "Vast red sand desert offering unique desert experiences, camel treks, and stargazing opportunities.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Бухара",
        location: { lat: 42.0, lng: 63.0, address: "Kyzylkum Desert" },
        address: "Kyzylkum Desert",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["desert", "adventure", "camping"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 42.0,
        longitude: 63.0,
      },
      {
        id: "p_nature_7",
        name: "Ugam-Chatkal National Park",
        description:
          "Large national park with diverse ecosystems, from alpine meadows to river valleys. Home to rare species.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Паркент",
        location: { lat: 41.75, lng: 69.75, address: "Ugam-Chatkal National Park, Tashkent Region" },
        address: "Ugam-Chatkal National Park, Tashkent Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["national park", "wildlife", "hiking"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.75,
        longitude: 69.75,
      },
      {
        id: "p_nature_8",
        name: "Sarmysh Gorge",
        description: "Ancient gorge with petroglyphs and stunning rock formations. Archaeological and natural wonder.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Навои",
        location: { lat: 40.1, lng: 65.3667, address: "Sarmysh Gorge, Navoi Region" },
        address: "Sarmysh Gorge, Navoi Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["gorge", "petroglyphs", "archaeology"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 40.1,
        longitude: 65.3667,
      },
      {
        id: "p_nature_9",
        name: "Boysun Mountains",
        description:
          "UNESCO-recognized area with unique biodiversity and traditional mountain culture. Pristine natural beauty.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Бойсун",
        location: { lat: 38.2, lng: 67.2, address: "Boysun Mountains, Surkhandarya Region" },
        address: "Boysun Mountains, Surkhandarya Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["mountains", "unesco", "culture"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 38.2,
        longitude: 67.2,
      },
      {
        id: "p_nature_10",
        name: "Aral Sea Region",
        description:
          "Former sea bed now a unique desert landscape. Important ecological site with ongoing restoration efforts.",
        categoryId: "nature",
        categories: ["Природа"],
        city: "Муйнак",
        location: { lat: 43.7667, lng: 59.0167, address: "Aral Sea Region, Karakalpakstan" },
        address: "Aral Sea Region, Karakalpakstan",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["desert", "ecology", "unique"],
        rating: 4.3,
        reviewCount: 0,
        latitude: 43.7667,
        longitude: 59.0167,
      },

      // Ремесленничество (Crafts) - 10 places
      {
        id: "p_craft_1",
        name: "Bukhara Silk Carpet Workshop",
        description:
          "Traditional workshop where artisans create beautiful silk carpets using ancient techniques. Watch masters at work.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Old Town, Bukhara" },
        address: "Old Town, Bukhara",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["carpets", "silk", "handicrafts"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_craft_2",
        name: "Margilan Silk Factory",
        description:
          "Famous silk production center in the Fergana Valley. Learn about traditional silk-making from cocoon to fabric.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Маргилан",
        location: { lat: 40.4667, lng: 71.7167, address: "Yodgorlik Silk Factory, Margilan" },
        address: "Yodgorlik Silk Factory, Margilan",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["silk", "factory", "traditional"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 40.4667,
        longitude: 71.7167,
      },
      {
        id: "p_craft_3",
        name: "Samarkand Paper Mill",
        description:
          "Ancient paper-making workshop using traditional methods from the Silk Road era. Hands-on demonstrations available.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Konigil Village, Samarkand" },
        address: "Konigil Village, Samarkand",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["paper", "traditional", "workshop"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_craft_4",
        name: "Rishtan Ceramics Workshop",
        description:
          "World-famous ceramics center producing distinctive blue and green glazed pottery. Visit master potters' studios.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Риштан",
        location: { lat: 40.35, lng: 71.2833, address: "Rishtan, Fergana Region" },
        address: "Rishtan, Fergana Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["ceramics", "pottery", "art"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 40.35,
        longitude: 71.2833,
      },
      {
        id: "p_craft_5",
        name: "Bukhara Gold Embroidery Center",
        description:
          "Traditional gold embroidery workshop creating intricate designs on fabrics. UNESCO-recognized craft.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Bukhara Old Town" },
        address: "Bukhara Old Town",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["embroidery", "textiles", "unesco"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_craft_6",
        name: "Khiva Wood Carving Studio",
        description:
          "Master woodcarvers creating intricate designs on doors, columns, and furniture using traditional tools.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Хива",
        location: { lat: 41.3775, lng: 60.3642, address: "Itchan Kala, Khiva" },
        address: "Itchan Kala, Khiva",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["woodcarving", "art", "traditional"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3775,
        longitude: 60.3642,
      },
      {
        id: "p_craft_7",
        name: "Tashkent Miniature Painting School",
        description: "Learn the art of traditional Uzbek miniature painting. Classes and exhibitions available.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Tashkent Art School" },
        address: "Tashkent Art School",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["painting", "art", "education"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_craft_8",
        name: "Fergana Knife Making Workshop",
        description: "Traditional knife-making center producing famous Fergana knives with distinctive curved blades.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Фергона",
        location: { lat: 40.3833, lng: 71.7833, address: "Fergana City" },
        address: "Fergana City",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["knives", "metalwork", "traditional"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 40.3833,
        longitude: 71.7833,
      },
      {
        id: "p_craft_9",
        name: "Samarkand Suzani Embroidery Studio",
        description: "Traditional suzani textile workshop. Watch artisans create colorful embroidered wall hangings.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Samarkand Old Town" },
        address: "Samarkand Old Town",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["suzani", "embroidery", "textiles"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_craft_10",
        name: "Bukhara Jewelry Workshop",
        description: "Traditional jewelry-making studio creating silver and gold pieces with semi-precious stones.",
        categoryId: "craft",
        categories: ["Ремесленничество"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Taki Zargaron, Bukhara" },
        address: "Taki Zargaron, Bukhara",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["jewelry", "silver", "gold"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },

      // Путешествия (Travel) - 10 places
      {
        id: "p_travel_1",
        name: "Silk Road Caravanserai Tour",
        description: "Multi-day journey following ancient Silk Road routes, staying in restored caravanserais.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Различные",
        location: { lat: 39.7753, lng: 64.4208, address: "Silk Road Route" },
        address: "Silk Road Route",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["silk road", "tour", "history"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_travel_2",
        name: "Fergana Valley Cultural Tour",
        description: "Explore the fertile Fergana Valley, visiting craft workshops, markets, and historical sites.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Фергона",
        location: { lat: 40.3833, lng: 71.7833, address: "Fergana Valley" },
        address: "Fergana Valley",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["valley", "culture", "tour"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 40.3833,
        longitude: 71.7833,
      },
      {
        id: "p_travel_3",
        name: "Desert Yurt Camp Experience",
        description:
          "Overnight stay in traditional yurts in the desert. Includes camel rides, traditional meals, and stargazing.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Нурата",
        location: { lat: 40.5833, lng: 66.5833, address: "Kyzylkum Desert" },
        address: "Kyzylkum Desert",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["desert", "camping", "traditional"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 40.5833,
        longitude: 66.5833,
      },
      {
        id: "p_travel_4",
        name: "Tashkent Metro Art Tour",
        description: "Guided tour of Tashkent's stunning metro stations, each uniquely decorated with art and mosaics.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Tashkent Metro" },
        address: "Tashkent Metro",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["metro", "art", "architecture"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_travel_5",
        name: "Mountain Village Homestay",
        description:
          "Experience authentic Uzbek hospitality in mountain villages. Home-cooked meals and cultural immersion.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Чимган",
        location: { lat: 41.5667, lng: 70.0167, address: "Mountain Villages, Tashkent Region" },
        address: "Mountain Villages, Tashkent Region",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["homestay", "culture", "mountains"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 41.5667,
        longitude: 70.0167,
      },
      {
        id: "p_travel_6",
        name: "Samarkand Night Tour",
        description:
          "Evening tour of illuminated monuments in Samarkand. See Registan Square and other sites beautifully lit.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Samarkand City Center" },
        address: "Samarkand City Center",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["night tour", "monuments", "photography"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_travel_7",
        name: "Bukhara Old Town Walking Tour",
        description:
          "Comprehensive walking tour through Bukhara's historic center, visiting madrasahs, mosques, and bazaars.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Bukhara Old Town" },
        address: "Bukhara Old Town",
        images: ["/labi-hovuz-plaza-bukhara.jpg"],
        tags: ["walking tour", "history", "architecture"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_travel_8",
        name: "Khiva Photography Tour",
        description: "Specialized photography tour of Khiva's stunning architecture. Best times for golden hour shots.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Хива",
        location: { lat: 41.3775, lng: 60.3642, address: "Itchan Kala, Khiva" },
        address: "Itchan Kala, Khiva",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["photography", "architecture", "tour"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.3775,
        longitude: 60.3642,
      },
      {
        id: "p_travel_9",
        name: "Aral Sea Expedition",
        description:
          "Multi-day expedition to the Aral Sea region. Visit ship graveyard and learn about ecological changes.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Муйнак",
        location: { lat: 43.7667, lng: 59.0167, address: "Muynak, Karakalpakstan" },
        address: "Muynak, Karakalpakstan",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["expedition", "ecology", "adventure"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 43.7667,
        longitude: 59.0167,
      },
      {
        id: "p_travel_10",
        name: "Uzbek Cuisine Food Tour",
        description: "Culinary tour sampling traditional Uzbek dishes at local restaurants and street food vendors.",
        categoryId: "travel",
        categories: ["Путешествия"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Tashkent City" },
        address: "Tashkent City",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["food", "cuisine", "tour"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },

      // Развлечения (Entertainment) - 10 places
      {
        id: "p_entertainment_1",
        name: "Navoi Opera and Ballet Theatre",
        description:
          "Grand opera house in Tashkent hosting world-class performances. Beautiful architecture and acoustics.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Navoi Theatre, Tashkent" },
        address: "Navoi Theatre, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["opera", "ballet", "theatre"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_entertainment_2",
        name: "Magic City Entertainment Park",
        description: "Large amusement park with rides, attractions, and entertainment for all ages. Modern facilities.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3267, lng: 69.2345, address: "Magic City, Tashkent" },
        address: "Magic City, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["amusement park", "family", "rides"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3267,
        longitude: 69.2345,
      },
      {
        id: "p_entertainment_3",
        name: "Labi Hovuz Evening Shows",
        description:
          "Traditional music and dance performances in the historic Labi Hovuz plaza. Authentic cultural experience.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Бухара",
        location: { lat: 39.7747, lng: 64.4208, address: "Labi Hovuz, Bukhara" },
        address: "Labi Hovuz, Bukhara",
        images: ["/labi-hovuz-plaza-bukhara.jpg"],
        tags: ["music", "dance", "culture"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.7747,
        longitude: 64.4208,
      },
      {
        id: "p_entertainment_4",
        name: "Tashkent Aqua Park",
        description: "Modern water park with slides, pools, and water attractions. Perfect for hot summer days.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2401, address: "Aqua Park, Tashkent" },
        address: "Aqua Park, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["water park", "family", "summer"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2401,
      },
      {
        id: "p_entertainment_5",
        name: "Registan Light Show",
        description:
          "Spectacular sound and light show at Registan Square. Historical narrative with stunning visual effects.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Registan Square, Samarkand" },
        address: "Registan Square, Samarkand",
        images: ["/registan-square-samarkand.jpg"],
        tags: ["light show", "entertainment", "history"],
        rating: 4.9,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_entertainment_6",
        name: "Tashkent Zoo",
        description: "Large zoo with diverse animal collection. Educational programs and family-friendly environment.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3267, lng: 69.2797, address: "Tashkent Zoo" },
        address: "Tashkent Zoo",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["zoo", "animals", "family"],
        rating: 4.3,
        reviewCount: 0,
        latitude: 41.3267,
        longitude: 69.2797,
      },
      {
        id: "p_entertainment_7",
        name: "Samarkand Folklore Show",
        description:
          "Traditional Uzbek folklore performance with music, dance, and colorful costumes. Dinner included.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Samarkand Cultural Center" },
        address: "Samarkand Cultural Center",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["folklore", "performance", "culture"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_entertainment_8",
        name: "Tashkent Bowling Center",
        description: "Modern bowling alley with restaurant and bar. Popular entertainment venue for groups.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Tashkent City" },
        address: "Tashkent City",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["bowling", "entertainment", "social"],
        rating: 4.4,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_entertainment_9",
        name: "Bukhara Puppet Theatre",
        description: "Traditional puppet shows for children and families. Unique cultural entertainment experience.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Bukhara Old Town" },
        address: "Bukhara Old Town",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["puppets", "theatre", "children"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_entertainment_10",
        name: "Tashkent Cinema Park",
        description:
          "Modern multiplex cinema showing latest international and local films. IMAX and 3D screens available.",
        categoryId: "entertainment",
        categories: ["Развлечения"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Next Mall, Tashkent" },
        address: "Next Mall, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["cinema", "movies", "entertainment"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },

      // Еда (Food) - 10 places
      {
        id: "p_food_1",
        name: "Chorsu Bazaar",
        description:
          "Traditional covered market in Tashkent, offering fresh produce, spices, dried fruits, and local crafts.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Ташкент",
        location: { lat: 41.3267, lng: 69.2345, address: "Chorsu Bazaar, Tashkent" },
        address: "Chorsu Bazaar, Tashkent",
        images: ["/chorsu-bazaar-tashkent-market.jpg"],
        tags: ["market", "food", "shopping"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.3267,
        longitude: 69.2345,
      },
      {
        id: "p_food_2",
        name: "Plov Center",
        description:
          "Famous restaurant specializing in traditional Uzbek plov (pilaf). Authentic recipe and atmosphere.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Osh Markazi, Tashkent" },
        address: "Osh Markazi, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["plov", "restaurant", "traditional"],
        rating: 4.8,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_food_3",
        name: "Samarkand Shashlik House",
        description:
          "Best shashlik (kebabs) in Samarkand. Grilled over charcoal with traditional spices and fresh vegetables.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Samarkand City" },
        address: "Samarkand City",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["shashlik", "grill", "meat"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_food_4",
        name: "Bukhara Chaikhana",
        description:
          "Traditional tea house serving Uzbek tea, sweets, and light meals. Authentic atmosphere with traditional seating.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Бухара",
        location: { lat: 39.7747, lng: 64.4208, address: "Labi Hovuz, Bukhara" },
        address: "Labi Hovuz, Bukhara",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["tea house", "traditional", "sweets"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 39.7747,
        longitude: 64.4208,
      },
      {
        id: "p_food_5",
        name: "Fergana Samsa Bakery",
        description: "Famous for traditional samsa (meat pastries) baked in tandoor oven. Various fillings available.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Фергона",
        location: { lat: 40.3833, lng: 71.7833, address: "Fergana City Center" },
        address: "Fergana City Center",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["samsa", "bakery", "pastry"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 40.3833,
        longitude: 71.7833,
      },
      {
        id: "p_food_6",
        name: "Tashkent Lagman House",
        description: "Specializing in lagman (hand-pulled noodles) with various toppings. Fresh noodles made daily.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Ташкент",
        location: { lat: 41.3111, lng: 69.2797, address: "Tashkent City" },
        address: "Tashkent City",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["lagman", "noodles", "restaurant"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3111,
        longitude: 69.2797,
      },
      {
        id: "p_food_7",
        name: "Samarkand Non Bakery",
        description: "Traditional bread bakery making various types of Uzbek non (flatbread) in tandoor ovens.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Самарканд",
        location: { lat: 39.6542, lng: 66.9755, address: "Siyab Bazaar, Samarkand" },
        address: "Siyab Bazaar, Samarkand",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["bread", "bakery", "traditional"],
        rating: 4.7,
        reviewCount: 0,
        latitude: 39.6542,
        longitude: 66.9755,
      },
      {
        id: "p_food_8",
        name: "Bukhara Manti Restaurant",
        description:
          "Steamed dumplings (manti) with various fillings. Traditional recipe passed down through generations.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Бухара",
        location: { lat: 39.7753, lng: 64.4208, address: "Bukhara Old Town" },
        address: "Bukhara Old Town",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["manti", "dumplings", "traditional"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 39.7753,
        longitude: 64.4208,
      },
      {
        id: "p_food_9",
        name: "Tashkent Halva Shop",
        description:
          "Traditional sweets shop specializing in halva and other Uzbek desserts. Made with natural ingredients.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Ташкент",
        location: { lat: 41.3267, lng: 69.2345, address: "Chorsu Area, Tashkent" },
        address: "Chorsu Area, Tashkent",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["sweets", "desserts", "halva"],
        rating: 4.5,
        reviewCount: 0,
        latitude: 41.3267,
        longitude: 69.2345,
      },
      {
        id: "p_food_10",
        name: "Khiva Dimlama Restaurant",
        description: "Traditional restaurant serving dimlama (meat and vegetable stew). Slow-cooked to perfection.",
        categoryId: "food",
        categories: ["Еда"],
        city: "Хива",
        location: { lat: 41.3775, lng: 60.3642, address: "Itchan Kala, Khiva" },
        address: "Itchan Kala, Khiva",
        images: ["/placeholder.svg?height=400&width=600"],
        tags: ["dimlama", "stew", "traditional"],
        rating: 4.6,
        reviewCount: 0,
        latitude: 41.3775,
        longitude: 60.3642,
      },
    ]

    try {
      localStorage.setItem(this.PLACES_KEY, JSON.stringify(samplePlaces))
      localStorage.setItem(this.INITIALIZED_KEY, "true")
    } catch (error) {
      console.error("Error initializing sample data:", error)
    }

    this.initializeMockTours()
  }

  private initializeMockTours(): void {
    if (typeof window === "undefined") return

    const existingTours = this.getTours()

    if (existingTours.length === 0) {
      try {
        localStorage.setItem(this.TOURS_KEY, JSON.stringify(mockTours))
      } catch (error) {
        console.error("Error initializing mock tours:", error)
      }
    }
  }

  getReviews(): Review[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.REVIEWS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading reviews from storage:", error)
      return []
    }
  }

  addReview(input: ReviewInput): Review {
    const review: Review = {
      id: `r_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    }

    const reviews = this.getReviews()
    reviews.push(review)

    try {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews))
    } catch (error) {
      console.error("Error saving review to storage:", error)
    }

    this.updatePlaceRating(input.placeId)

    return review
  }

  deleteReview(reviewId: string): void {
    const reviews = this.getReviews().filter((r) => r.id !== reviewId)

    try {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews))
    } catch (error) {
      console.error("Error deleting review from storage:", error)
    }
  }

  getPlaces(): Place[] {
    if (typeof window === "undefined") return []

    this.initializeSampleData()

    try {
      const stored = localStorage.getItem(this.PLACES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading places from storage:", error)
      return []
    }
  }

  addPlace(input: PlaceInput): Place {
    const place: Place = {
      id: `p_${Date.now()}`,
      ...input,
      location: {
        lat: input.latitude,
        lng: input.longitude,
        address: input.address,
      },
      rating: 0,
      reviewCount: 0,
    }

    const places = this.getPlaces()
    places.push(place)

    try {
      localStorage.setItem(this.PLACES_KEY, JSON.stringify(places))
    } catch (error) {
      console.error("Error saving place to storage:", error)
    }

    return place
  }

  updatePlace(placeId: string, updates: Partial<Place>): void {
    const places = this.getPlaces().map((p) => (p.id === placeId ? { ...p, ...updates } : p))

    try {
      localStorage.setItem(this.PLACES_KEY, JSON.stringify(places))
    } catch (error) {
      console.error("Error updating place in storage:", error)
    }
  }

  deletePlace(placeId: string): void {
    const places = this.getPlaces().filter((p) => p.id !== placeId)

    try {
      localStorage.setItem(this.PLACES_KEY, JSON.stringify(places))
    } catch (error) {
      console.error("Error deleting place from storage:", error)
    }
  }

  updatePlaceRating(placeId: string): void {
    const reviews = this.getReviews().filter((r) => r.placeId === placeId)
    const places = this.getPlaces()
    const place = places.find((p) => p.id === placeId)

    if (!place) return

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

    this.updatePlace(placeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    })
  }

  // Tour management methods
  getTours(): Tour[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.TOURS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading tours from storage:", error)
      return []
    }
  }

  getTourById(tourId: string): Tour | undefined {
    return this.getTours().find((t) => t.id === tourId)
  }

  getToursByCity(city: string): Tour[] {
    return this.getTours().filter((tour) => tour.city === city)
  }

  getActiveTours(): Tour[] {
    return this.getTours().filter((tour) => tour.isActive && tour.currentParticipants < tour.maxParticipants)
  }

  addTour(input: Tour | TourInput): Tour {
    const tour: Tour =
      "places" in input
        ? input
        : {
            id: `t_${Date.now()}`,
            ...input,
            estimatedCost: input.price,
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            isActive: true,
            currentParticipants: 0,
            priceHistory: [],
            expenses: [],
          }

    const tours = this.getTours()
    tours.push(tour)

    try {
      localStorage.setItem(this.TOURS_KEY, JSON.stringify(tours))
    } catch (error) {
      console.error("Error saving tour to storage:", error)
    }

    return tour
  }

  updateTour(tour: Tour): void {
    const tours = this.getTours().map((t) => (t.id === tour.id ? tour : t))

    try {
      localStorage.setItem(this.TOURS_KEY, JSON.stringify(tours))
    } catch (error) {
      console.error("Error updating tour in storage:", error)
    }
  }

  deleteTour(tourId: string): void {
    const tours = this.getTours().filter((t) => t.id !== tourId)

    try {
      localStorage.setItem(this.TOURS_KEY, JSON.stringify(tours))
    } catch (error) {
      console.error("Error deleting tour from storage:", error)
    }
  }

  addExpense(tourId: string, expense: Omit<Expense, "id">): void {
    const tours = this.getTours()
    const tour = tours.find((t) => t.id === tourId)

    if (!tour) return

    const newExpense: Expense = {
      id: `e_${Date.now()}`,
      ...expense,
    }

    if (!tour.expenses) {
      tour.expenses = []
    }

    tour.expenses.push(newExpense)

    try {
      localStorage.setItem(this.TOURS_KEY, JSON.stringify(tours))
    } catch (error) {
      console.error("Error adding expense to storage:", error)
    }
  }

  addPricePoint(tourId: string, attraction: string, price: number): void {
    const tours = this.getTours()
    const tour = tours.find((t) => t.id === tourId)

    if (!tour) return

    if (!tour.priceHistory) {
      tour.priceHistory = []
    }

    tour.priceHistory.push({
      date: new Date().toISOString(),
      price,
      attraction,
    })

    try {
      localStorage.setItem(this.TOURS_KEY, JSON.stringify(tours))
    } catch (error) {
      console.error("Error adding price point to storage:", error)
    }
  }

  getTourHistory(): TourHistory[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.TOUR_HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading tour history from storage:", error)
      return []
    }
  }

  getUserTourHistory(userId: string): TourHistory[] {
    return this.getTourHistory().filter((h) => h.userId === userId)
  }

  addTourHistory(history: Omit<TourHistory, "id">): TourHistory {
    const newHistory: TourHistory = {
      id: `th_${Date.now()}`,
      ...history,
    }

    const histories = this.getTourHistory()
    histories.push(newHistory)

    try {
      localStorage.setItem(this.TOUR_HISTORY_KEY, JSON.stringify(histories))
    } catch (error) {
      console.error("Error saving tour history to storage:", error)
    }

    return newHistory
  }
}

export const storage = new Storage()
