import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "google/gemini-2.0-flash",
    messages: prompt,
    abortSignal: req.signal,
    system: `You are WayZen, a helpful travel assistant for Uzbekistan. 
You help users discover amazing places, plan tours, and find the best experiences.
You are knowledgeable about Uzbekistan's tourist cities: Samarkand, Bukhara, Khiva, and Tashkent.
Provide helpful, friendly, and informative responses about travel, attractions, and tours.`,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat stream aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
