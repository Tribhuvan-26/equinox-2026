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

    // Grounded mock program response
    const mockResponse = getMockEquinoxResponse(message);

    return Response.json({
      answer: mockResponse.answer,
      suggestions: mockResponse.suggestions,
      links: mockResponse.links,
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return Response.json(
      {
        answer: "I am having trouble processing your question. Please browse the official 10 sub-events or contact the student coordinators directly.",
        suggestions: ["List all 10 Sub-Events", "Contact details"],
        links: [{ label: "Explore Sub-Events", url: "#events" }],
      },
      { status: 200 }
    );
  }
}
