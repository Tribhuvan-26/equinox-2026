// app/api/chat/route.ts
// Chatbot backend proxying queries to the Python FastAPI RAG microservice

import { getMockEquinoxResponse } from "@/lib/chatbot";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = (body.message || "").trim();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const ragServiceUrl = (
      process.env.RAG_SERVICE_URL || "http://127.0.0.1:8001"
    ).replace(/\/$/, "");

    try {
      const response = await fetch(`${ragServiceUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        return Response.json({
          answer: data.answer,
          sources: data.sources || data.retrievedChunks || [],
          retrievedChunks: data.retrievedChunks || data.sources || [],
          eventCard: data.eventCard,
          suggestions: data.suggestions || [],
          links: data.links || [{ label: "Browse Sub-Events", url: "#events" }],
          grounded: data.grounded ?? true,
          service: data.service || "python-fastapi",
        });
      } else {
        console.warn(`Python RAG service returned ${response.status}, using fallback.`);
      }
    } catch (fetchErr) {
      console.warn("Failed to reach Python RAG service at", ragServiceUrl, fetchErr);
    }

    // Graceful fallback if Python service is temporarily unreachable
    const mock = getMockEquinoxResponse(message);
    return Response.json({
      answer: mock.answer,
      suggestions: mock.suggestions,
      links: mock.links,
      grounded: false,
      service: "offline-fallback",
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
