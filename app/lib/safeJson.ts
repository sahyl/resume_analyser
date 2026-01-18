export function safeParseAIJSON(text: string) {
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}
