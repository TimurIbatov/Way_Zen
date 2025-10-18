import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { placeName, city, category }: { placeName: string; city: string; category: string } = await req.json()

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate a short, engaging description (2-3 sentences) for a tourist attraction in Uzbekistan:
      
Place: ${placeName}
City: ${city}
Category: ${category}

The description should be informative, highlight unique features, and encourage visitors. Write in Russian.`,
    })

    return Response.json({ description: text })
  } catch (error) {
    console.error("[v0] Error generating description:", error)
    return Response.json({ description: "" }, { status: 200 })
  }
}
