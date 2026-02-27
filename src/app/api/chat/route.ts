import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { getCharacterSystemPrompt } from "@/lib/characters";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, characterId }: { messages: UIMessage[]; characterId: string } =
    await req.json();

  const systemPrompt = getCharacterSystemPrompt(characterId);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 300,
    temperature: 0.85,
  });

  return result.toUIMessageStreamResponse();
}
