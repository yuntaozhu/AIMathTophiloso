/**
 * Optional Vercel AI Gateway client (OpenAI-compatible).
 * When AI_GATEWAY_API_KEY is set, callers can prefer this over direct Gemini.
 * @see https://vercel.com/docs/ai-gateway
 */
export async function generateViaAiGateway(params: {
  system?: string;
  user: string;
  json?: boolean;
  model?: string;
}): Promise<string | null> {
  const apiKey = process.env.AI_GATEWAY_API_KEY?.trim();
  if (!apiKey) return null;

  const model = params.model || process.env.AI_GATEWAY_MODEL || 'google/gemini-2.5-flash';
  const messages: { role: string; content: string }[] = [];
  if (params.system) {
    messages.push({ role: 'system', content: params.system });
  }
  messages.push({ role: 'user', content: params.user });

  try {
    const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        ...(params.json ? { response_format: { type: 'json_object' } } : {})
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
