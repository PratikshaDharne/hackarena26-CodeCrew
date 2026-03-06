interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: any) {

  try {

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const prompt = messages.map((m:any)=>m.content).join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    onDelta(text);
    onDone();

  } catch (e) {

    onError("AI request failed");

  }

}