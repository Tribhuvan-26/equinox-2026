import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import {
  event,
  about,
  studentCoordinators,
  subEvents,
  highlights,
  contact,
  registration,
  tickets,
  faqs,
  audience,
} from "../lib/content";
import { eventsData } from "../app/events/eventsData";

// Load .env.local if needed
if (!process.env.GEMINI_API_KEY) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && match[1] === "GEMINI_API_KEY") {
        process.env.GEMINI_API_KEY = match[2].trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not set in environment or .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const EMBEDDING_MODEL = "gemini-embedding-001";

export interface KnowledgeChunk {
  id: string;
  title: string;
  source: string;
  category: "overview" | "subevent" | "coordinators" | "logistics" | "faq" | "sponsorship";
  metadata?: Record<string, any>;
  content: string;
  embedding?: number[];
}

function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // 1. Overview & Event Details
  chunks.push({
    id: "overview-summit",
    title: "The Equinox 2.0 - Overview & General Information",
    source: "lib/content.ts",
    category: "overview",
    metadata: { dates: event.datesFull, venue: event.venueFull },
    content: `The Equinox 2.0 (2026) is the flagship annual entrepreneurship summit organized by the Centre for Innovation and Entrepreneurship (CIE) at MLR Institute of Technology (MLRIT), Hyderabad.
Tagline: "${event.tagline}" (# WHERE PASSION MEETS PERSEVERANCE).
Dates: ${event.datesFull} (30th & 31st October 2026).
Venue: ${event.venueFull}.
Host: ${event.host}. Institution: ${event.institution} ("${event.institutionMotto}").
Audience: Over 1,000+ student innovators, builders, startup founders, strategists, and E-Cell leaders across campuses in India.
Highlights: 10 official sub-events, 2 action-packed days, 50+ college E-Cells participating.`,
  });

  // 2. About CIE & Vision
  chunks.push({
    id: "about-cie-mission",
    title: "Who We Are & What We Do - CIE MLRIT",
    source: "lib/content.ts",
    category: "overview",
    metadata: { host: event.host },
    content: `Who Are We:
${about.whoAreWe}

What We Do:
${about.whatWeDo}

What Is Equinox:
${about.whatIsEquinox}
${about.body.join(" ")}`,
  });

  // 3. Student Coordinators & Key Contacts
  const coordsFormatted = studentCoordinators
    .map((c) => `• ${c.name} (${c.role}): Phone ${c.phone}`)
    .join("\n");

  chunks.push({
    id: "contacts-coordinators",
    title: "Official Student Coordinators & Contact Information",
    source: "lib/content.ts",
    category: "coordinators",
    metadata: { email: contact.email, website: contact.website },
    content: `Official Student Coordinators for Equinox 2.0 (Page 12 of brochure):
${coordsFormatted}

Official Summit Support:
Email: ${contact.email}
Website: ${contact.website} (${contact.websiteUrl})
Address:
${contact.addressLines.join("\n")}

For doubts, questions, team reservations, or partnerships, reach out directly to the student coordinators or email cie@mlrinstitutions.ac.in.`,
  });

  // 4. Sub-events (1 chunk per sub-event with full details from both lib/content.ts & app/events/eventsData.ts)
  subEvents.forEach((se) => {
    const pageData = eventsData[se.slug];
    const aboutText = se.about.join("\n");
    const rulesText = se.rules.map((r, i) => `${i + 1}. ${r}`).join("\n");
    const skillsText = se.skills.join(", ");

    chunks.push({
      id: `subevent-${se.slug}`,
      title: `Sub-Event: ${se.name} (${se.pageNumber === "05" ? "Page 05" : "Page 06"})`,
      source: `lib/content.ts & app/events/eventsData.ts [${se.slug}]`,
      category: "subevent",
      metadata: {
        slug: se.slug,
        pageNumber: se.pageNumber,
        category: se.category,
        spoc: se.spoc,
        venue: se.venueRoom || se.venue,
        timing: se.timing,
      },
      content: `Sub-Event Name: ${se.name}
Brochure Page: Page ${se.pageNumber}
Category: ${se.category}
Tagline: "${se.tagline}"
Description: ${se.description}

Format:
${se.format}

Detailed Overview:
${aboutText}

Target Skills: ${skillsText}
Eligibility: ${se.eligibility}
Team Size: ${se.teamSize}
Schedule & Timing: ${se.timing} (${se.day}, ${se.time})
Venue: ${se.venueRoom || se.venue}
Registration Status: ${se.registrationStatus}
Fees: ${se.fee}
Prizes & Perks: ${se.prize}

Rules & Guidelines:
${rulesText}

Event SPOC (Single Point of Contact):
Name: ${se.spoc.name}, Phone: ${se.spoc.phone}, Email: ${se.spoc.email || contact.email}`,
    });
  });

  // 5. Registration, Tickets & Passes
  chunks.push({
    id: "registration-tickets",
    title: "Registration Process & Summit Passes",
    source: "lib/content.ts",
    category: "logistics",
    metadata: {},
    content: `Registration Details for The Equinox 2.0:
${registration.body}

Registration Steps:
1. ${registration.steps[0].title}: ${registration.steps[0].body}
2. ${registration.steps[1].title}: ${registration.steps[1].body}
3. ${registration.steps[2].title}: ${registration.steps[2].body}
4. ${registration.steps[3].title}: ${registration.steps[3].body}

Summit Pass:
Full access pass for both days (30 - 31 October 2026).
Perks include: Access to all 10 sub-events, Startup Expo floor badge, delegate kit, participation certificates, and exclusive founder/mentor networking.
For team discounts or institutional group passes, contact student coordinators or email cie@mlrinstitutions.ac.in.`,
  });

  // 6. FAQs & Practical Information
  const faqText = faqs.map((f, i) => `Q${i + 1}: ${f.q}\nA${i + 1}: ${f.a}`).join("\n\n");
  chunks.push({
    id: "summit-faqs",
    title: "Frequently Asked Questions (FAQ)",
    source: "lib/content.ts",
    category: "faq",
    metadata: {},
    content: `Frequently Asked Questions about Equinox 2.0:\n\n${faqText}

Who Can Attend:
Students, innovators, developers, strategists, and aspiring startup founders from any recognized university or college across India can participate.
Events cater to diverse specializations including sales/marketing (Hustle Mania), strategy/case analysis (Crossroads), cricket strategy & finance (IPL Auction), venture pitching (Pitch Deck), tech trends (Spotlight), and gaming/monopoly simulation (Startup Poly).`,
  });

  // 7. Impact, Highlights & Partnerships
  chunks.push({
    id: "summit-impact",
    title: "Summit Impact, Scale & Ecosystem Highlights",
    source: "lib/content.ts",
    category: "sponsorship",
    metadata: {},
    content: `Equinox 2.0 Summit Scale & Impact:
• 10 Official Sub-Events spanning strategy, cricket auctions, debates, sales, and startup pitching.
• 2 Days: 30 & 31 October 2026.
• 1,000+ student innovators from premier colleges and technical institutions.
• 50+ college E-Cells connecting in the inter-college E-Cell Meet.
• Organizing Body: Centre for Innovation and Entrepreneurship (CIE), MLRIT.
• Institutional Motto: "Engineering Ideas, Engineering Careers".`,
  });

  return chunks;
}

async function main() {
  console.log("=== Equinox 2.0 RAG Knowledge Base Generator ===");
  const chunks = buildChunks();
  console.log(`Generated ${chunks.length} semantic chunks.`);

  console.log(`Generating embeddings with model "${EMBEDDING_MODEL}"...`);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`[${i + 1}/${chunks.length}] Embedding "${chunk.title}"... `);
    try {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: chunk.content,
      });
      const values = response.embeddings?.[0]?.values;
      if (!values || values.length === 0) {
        throw new Error("No embedding values returned");
      }
      chunk.embedding = values;
      console.log(`✓ (${values.length} dims)`);
    } catch (err: any) {
      console.error(`\nFailed on chunk ${chunk.id}:`, err?.message || err);
      process.exit(1);
    }
  }

  const outputDir = path.resolve(process.cwd(), "lib/rag");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "knowledge-base.json");
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), "utf-8");

  const stat = fs.statSync(outputPath);
  console.log(`\nSuccessfully saved knowledge base to: ${outputPath}`);
  console.log(`File size: ${(stat.size / 1024).toFixed(1)} KB`);
  console.log(`Total chunks: ${chunks.length}`);
}

main().catch((err) => {
  console.error("Fatal error generating knowledge base:", err);
  process.exit(1);
});
