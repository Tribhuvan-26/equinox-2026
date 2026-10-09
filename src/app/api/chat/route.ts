// app/api/chat/route.ts
// Primary server-side API route for Equinox 2.0 chatbot

import { generateRagChatResponse } from "@/lib/rag/generate";
import { ChatHistoryMessage } from "@/lib/rag/context";
import { clientIp, overLimit } from "@/lib/security/rate-limit";

// Every real question can reach Gemini (billed), so cap volume and size.
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY = 8;
const ROLES = new Set(["user", "assistant", "bot"]);

export async function POST(req: Request) {
  // The chat window falls back to its offline answers on any non-OK status.
  if (await overLimit([{ key: `chat:ip:${clientIp(req)}`, max: 30, windowSeconds: 300 }])) {
    return Response.json({ error: "Too many messages. Please wait a few minutes." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE_CHARS);
    const history: ChatHistoryMessage[] = (Array.isArray(body.history) ? body.history : [])
      .filter((m: unknown): m is ChatHistoryMessage => {
        const h = m as ChatHistoryMessage;
        return Boolean(h) && ROLES.has(h.role) && typeof h.content === "string";
      })
      .slice(-MAX_HISTORY)
      .map((m: ChatHistoryMessage) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS * 4) }));

    if (!message) {
      return Response.json(
        {
          answer:
            "How can I help you with Equinox 2.0? You can ask about our 10 sub-events, dates (30–31 Oct), venue at MLRIT, or student coordinators.",
          suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Student Coordinators"],
          links: [{ label: "Browse Sub-Events", url: "#events" }],
          grounded: true,
          service: "equinox-rag",
        },
        { status: 200 }
      );
    }

    // Optional external RAG microservice if explicitly configured and remote
    const ragServiceUrl = process.env.RAG_SERVICE_URL?.trim();
    if (
      ragServiceUrl &&
      !ragServiceUrl.includes("127.0.0.1:8001") &&
      !ragServiceUrl.includes("localhost:8001")
    ) {
      try {
        const response = await fetch(`${ragServiceUrl.replace(/\/$/, "")}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history }),
          signal: AbortSignal.timeout(4000),
        });
        if (response.ok) {
          const data = await response.json();
          return Response.json(data);
        }
      } catch (err) {
        console.warn("External RAG service unreachable, falling back to Next.js RAG pipeline:", err);
      }
    }

    // Server-side RAG generation pipeline
    const result = await generateRagChatResponse(message, history);

    return Response.json({
      answer: result.answer,
      eventCard: result.eventCard,
      suggestions: result.suggestions || [],
      links: result.links || [{ label: "Browse Sub-Events", url: "#events" }],
      retrievedChunks: result.retrievedChunks || [],
      grounded: result.grounded,
      service: result.source,
    });
  } catch (error) {
    console.error("Chatbot API route error:", error);
    return Response.json(
      {
        answer:
          "I encountered an unexpected issue processing your question. Please contact Overall Equinox Coordinators Ghanashyam (+91 93900 06806), Jaikar (+91 90324 10189), or Bhavana (+91 99895 32925), or email cie@mlrinstitutions.ac.in.",
        suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Contact details"],
        links: [{ label: "Explore Sub-Events", url: "#events" }],
        grounded: false,
        service: "error-fallback",
      },
      { status: 200 }
    );
  }
}
