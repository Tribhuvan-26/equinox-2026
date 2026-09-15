// app/api/chat/route.ts
// Primary server-side API route for Equinox 2.0 chatbot

import { generateRagChatResponse } from "@/lib/rag/generate";
import { ChatHistoryMessage } from "@/lib/rag/context";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = (body.message || "").trim();
    const history: ChatHistoryMessage[] = Array.isArray(body.history) ? body.history : [];

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
          "I encountered an unexpected issue processing your question. Please contact student coordinators Shyam (+91 93900 06806) or Mahima (+91 94933 62006), or email cie@mlrinstitutions.ac.in.",
        suggestions: ["List all 10 Sub-Events", "Dates & Venue", "Contact details"],
        links: [{ label: "Explore Sub-Events", url: "#events" }],
        grounded: false,
        service: "error-fallback",
      },
      { status: 200 }
    );
  }
}
