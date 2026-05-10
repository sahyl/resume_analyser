export function safeParseAIJSON(text: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON object found");
    }

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Invalid AI JSON:", text);
    throw err;
  }
}
