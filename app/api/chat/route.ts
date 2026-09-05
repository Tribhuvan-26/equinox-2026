import { GoogleGenAI } from "@google/genai";
import {
  detectOffTopic,
  detectAmbiguity,
  getFastAnswer,
  searchChatbotContext,
} from "@/lib/chatbot";

const DEFAULT_SUGGESTIONS = [
  "🎪 Explore events",
  "🗓 What's on the agenda?",
  "🎤 Meet the speakers",
  "🎟 Ticket prices",
  "📝 How do I register?",
];

interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = (body.message || "").trim();
    const history: ChatHistoryItem[] = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 1. Off-topic detection before calling Gemini
    const offTopicResponse = detectOffTopic(message);
    if (offTopicResponse) {
      return Response.json({
        answer: offTopicResponse,
        suggestions: DEFAULT_SUGGESTIONS,
      });
    }

    // 2. Ambiguity handling (ask for clarification instead of guessing)
    const ambiguityResponse = detectAmbiguity(message);
    if (ambiguityResponse) {
      return Response.json(ambiguityResponse);
    }

    // 3. Fast-path direct answers for high-confidence exact queries
    const fastAnswer = getFastAnswer(message);
    if (fastAnswer) {
      return Response.json(fastAnswer);
    }

    // 4. Search Equinox 2026 content
    const { context, links } = searchChatbotContext(message);

    // 5. Connect to Google Gemini API
    let apiKey = process.env.GEMINI_API_KEY;

    // Fallback: Read .env.local if environment variable not directly populated
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf8");
          for (const line of envContent.split("\n")) {
            const parts = line.trim().split("=");
            if (parts[0] === "GEMINI_API_KEY") {
              const val = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
              if (val && val !== "your_gemini_api_key_here") {
                apiKey = val;
                break;
              }
            }
          }
        }
      } catch {
        // Silently continue
      }
    }

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Graceful fallback when API key is not yet set in .env.local
      return Response.json({
        answer:
          "✨ Equinox 2026 Assistant is ready! Please add your GEMINI_API_KEY in .env.local to enable live conversational responses.",
        links,
        suggestions: DEFAULT_SUGGESTIONS,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are the official AI Event Assistant for Equinox 2026, the flagship innovation summit of CIE MLRIT (held 12–14 March 2026 at MLR Institute of Technology, Hyderabad).

STRICT CONVERSATIONAL RULES:
1. Default to 1–3 concise, conversational sentences.
2. Answer ONLY what the user specifically asked. Do NOT dump unsolicited rules, dates, or unrelated context.
3. NEVER dump raw context data or full event blocks unless the user explicitly asks for "full details", "all rules", "complete agenda", or "everything".
4. Use ONLY the provided Equinox 2026 Context. Never invent, extrapolate, or assume facts.
5. If the requested information is not in the context, state in one polite sentence:
   "I don't have that information in the Equinox 2026 summit records. Please check the website or contact the organizers at equinox2026@gmail.com."
6. When relevant, embed clean Markdown links naturally:
   - [All Events](/events)
   - [Register](/register)
   - [Agenda](/#agenda)
   - [Contact Us](/contact)
   - Sub-events: [Hack the Equinox](/events/hackathon), [Ideathon](/events/ideathon), [Robo Race](/events/robo-race), [Code Sprint](/events/code-sprint), [Design Jam](/events/design-jam), [Startup Expo](/events/startup-expo).`;

    const historySnippet =
      history.length > 0
        ? `\nPrior Conversation:\n${history
            .slice(-3)
            .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
            .join("\n")}\n`
        : "";

    const prompt = `Equinox 2026 Context:
${context}
${historySnippet}
User Question: ${message}

Answer concisely in 1–3 conversational sentences:`;

    const modelsToTry = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let responseText = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature for high factual precision
          },
        });

        const text = (response.text || "").trim();
        if (text) {
          responseText = text;
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${modelName} call failed, trying next candidate:`, err);
      }
    }

    if (!responseText) {
      responseText =
        "I'm having trouble retrieving that detail right now. Please explore our [Events](/events) or reach out to equinox2026@gmail.com.";
    }

    return Response.json({
      answer: responseText,
      links,
      suggestions: links && links.length > 0
        ? links.map((l) => l.label)
        : DEFAULT_SUGGESTIONS,
    });
  } catch (error: unknown) {
    console.error("Chatbot API route error:", error);
    return Response.json(
      { error: "Internal server error processing chatbot request" },
      { status: 500 }
    );
  }
}
