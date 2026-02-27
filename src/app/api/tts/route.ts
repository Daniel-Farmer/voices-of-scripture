import { getCharacterVoiceConfig } from "@/config/tts.config";

// Strip asterisk actions (e.g. *pauses*, *sighs*) but preserve ElevenLabs voice tags
function sanitizeForTTS(text: string): string {
  return text
    .replace(/\*[^*]+\*/g, "") // Remove *action* markers
    .replace(/\s{2,}/g, " ") // Collapse whitespace
    .replace(/\.{4,}/g, "...") // Normalize excessive dots to ellipsis
    .trim();
}

export async function POST(req: Request) {
  const { text, characterId }: { text: string; characterId: string } =
    await req.json();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "TTS not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const voiceConfig = getCharacterVoiceConfig(characterId);
  const cleanText = sanitizeForTTS(text);

  if (!cleanText) {
    return new Response(JSON.stringify({ error: "Empty text" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: "eleven_v3",
        voice_settings: {
          stability: voiceConfig.stability,
          similarity_boost: voiceConfig.similarityBoost,
          style: voiceConfig.style,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return new Response(JSON.stringify({ error }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });
}
