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

  // 5. Official Program Blueprint (equinox-events.pdf) - About & Vision
  chunks.push({
    id: "pdf-about-equinox",
    title: "About Equinox (Official Program Blueprint)",
    source: "chatbot/data/equinox-events.pdf",
    category: "overview",
    metadata: { sourcePdf: "equinox-events.pdf" },
    content: `EQUINOX BLUEPRINT - ABOUT THE EQUINOX:
EQUINOX is a 3-day event organized by the Centre for Innovation and Entrepreneurship at MLR Institute of Technology, Hyderabad. This event envisions creating a vibrant and engaging environment where students tackle real-world challenges and ignite their entrepreneurial spirit. Through sub-events Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, E-Cell Meet, and Pitch Deck, participants gain invaluable experiences that enhance their problem-solving abilities, creativity, and entrepreneurial mindset.`,
  });

  chunks.push({
    id: "pdf-vision",
    title: "Equinox Vision & Objectives (Official Program Blueprint)",
    source: "chatbot/data/equinox-events.pdf",
    category: "overview",
    metadata: { sourcePdf: "equinox-events.pdf" },
    content: `VISION:
We envision creating an inclusive space where students, entrepreneurs, and investors come together to collaborate, learn, and shape impactful ideas. By fostering entrepreneurial thinking and encouraging practical problem-solving, we provide a platform for participants to showcase their ideas, experience real-world business scenarios, and build meaningful connections with industry leaders. Our event empowers emerging innovators and aspiring entrepreneurs to refine their concepts, gain visibility, and explore opportunities for growth, mentorship, and collaboration.`,
  });

  // 6. Official Program Blueprint (equinox-events.pdf) - Individual Sub-Events (Ideathon strictly excluded)
  const pdfSubEvents = [
    {
      slug: "spotlight",
      name: "Spotlight",
      title: "Spotlight - Industry Expert Talks (Official Program Blueprint)",
      content: `SUB EVENT: SPOTLIGHT (Source: equinox-events.pdf)
Featuring inspiring presentations from industry experts on the latest trends in technology and entrepreneurship, the e-Summit will provide attendees with valuable insights into emerging technologies, industry trends, and the future of work. These talks will not only inform but also motivate and inspire, as participants hear firsthand how successful entrepreneurs overcame challenges and built thriving ventures. The personal stories of resilience and innovation will empower attendees to pursue their own ambitions with renewed determination, helping them stay focused and driven in the long run.`,
    },
    {
      slug: "crossroads",
      name: "Crossroads",
      title: "Crossroads - Business Simulation with CEO, CTO, Marketing Manager Roles (Official Program Blueprint)",
      content: `SUB EVENT: CROSSROADS (Source: equinox-events.pdf)
An interactive business simulation where each team member will take on a specific role, such as CEO, CTO, or Marketing Manager. They will face a challenging scenario and will be tasked with developing a strategic plan to overcome the obstacles. The top three teams will be awarded prizes for their exceptional performance based on creativity, feasibility, and teamwork.`,
    },
    {
      slug: "startup-expo",
      name: "Startup Expo",
      title: "Startup Expo - Showcase Products & Business Ideas (Official Program Blueprint)",
      content: `SUB EVENT: STARTUP EXPO (Source: equinox-events.pdf)
The Startup Expo at the summit offers an exciting platform for students to showcase their innovative products and business ideas to a diverse audience. It is a great opportunity for people who want to showcase their ideas and their marketing skills to simulate a real-life market.`,
    },
    {
      slug: "brand-battles",
      name: "Brand Battles",
      title: "Brand Battles - Rival Brands Debate (Official Program Blueprint)",
      content: `SUB EVENT: BRAND BATTLES (Source: equinox-events.pdf)
A competitive debate where two teams represent rival brands from the same sector. Participants must present strong, well-researched arguments supported by real-time data, case studies, and relevant market examples to demonstrate why their chosen brand stands superior. Teams with the most compelling arguments and impactful presentations will be awarded.`,
    },
    {
      slug: "ipl-auction",
      name: "IPL Auction",
      title: "IPL Auction - Cricket Draft Bidding Experience (Official Program Blueprint)",
      content: `SUB EVENT: IPL AUCTION (Source: equinox-events.pdf)
The IPL Auction is a competitive cricket draft experience where participants step into the shoes of team owners and build their own squads. Just like the official auction, each team is given a fixed budget to bid on players. The event runs in a fast-paced, high-energy format as participants strategize, outbid rivals, and assemble the strongest lineup for their team.`,
    },
    {
      slug: "hustle-mania",
      name: "Hustle Mania",
      title: "Hustle Mania - Selling Products to Real Customers from Stalls (Official Program Blueprint)",
      content: `SUB EVENT: HUSTLE MANIA (Source: equinox-events.pdf)
Hustle Mania is a hands-on business and marketing challenge where participants set up stalls and sell their products to real customers. Every aspect of their operations — expenditure, pricing, revenue, and profit — is tracked throughout the event. Teams must apply marketing strategies, customer engagement skills, and smart budgeting to maximize performance.`,
    },
    {
      slug: "internship-drive",
      name: "Internship Drive",
      title: "Internship Drive - Connecting Students with Companies for Internships (Official Program Blueprint)",
      content: `SUB EVENT: INTERNSHIP DRIVE (Source: equinox-events.pdf)
The Internship Drive is a unique platform designed for students to connect with companies that may not traditionally engage with campus recruitment. This event provides an opportunity to explore diverse career paths while gaining valuable experience with dynamic startups and mid-level firms. Participants can enhance their professional network and acquire essential skills to thrive in today’s competitive job market.`,
    },
    {
      slug: "startup-poly",
      name: "Startup Poly",
      title: "Startup Poly - Monopoly-Inspired Entrepreneurship Challenge (Official Program Blueprint)",
      content: `SUB EVENT: STARTUP POLY (Source: equinox-events.pdf)
Startup Poly is a Monopoly-inspired entrepreneurship challenge where participants roll a die and navigate through a board filled with startup-themed opportunities, challenges, rewards, and setbacks. Every move tests their business skills, creativity, and decision-making as they tackle real-world entrepreneurial scenarios. The participants who successfully overcome the challenges and remain in the game until the end will be declared the winners.`,
    },
    {
      slug: "e-cell-meet",
      name: "E-Cell Meet",
      title: "E-Cell Meet - Networking for E-Cells from Different Colleges (Official Program Blueprint)",
      content: `SUB EVENT: E-CELL MEET (Source: equinox-events.pdf)
The E-Cell Meet is a networking event where E-Cells from different colleges come together to collaborate and share ideas. It provides a platform for students to connect, exchange experiences, and explore potential partnerships. The focus is on building relationships and fostering collaboration across campuses.`,
    },
    {
      slug: "pitch-deck",
      name: "Pitch Deck",
      title: "Pitch Deck - Presenting Startup Concepts to Investors (Official Program Blueprint)",
      content: `SUB EVENT: PITCH DECK (Source: equinox-events.pdf)
Pitch Deck is an idea presentation event where participants showcase their startup concepts to a panel of investors, venture capitalists, and industry experts. Teams present their problem statement, solution, business model, and market potential through a structured pitch. Selected ideas receive constructive feedback, mentorship opportunities, and potential support from the panel.`,
    },
  ];

  pdfSubEvents.forEach((pse) => {
    chunks.push({
      id: `pdf-subevent-${pse.slug}`,
      title: pse.title,
      source: "chatbot/data/equinox-events.pdf",
      category: "subevent",
      metadata: { slug: pse.slug, sourcePdf: "equinox-events.pdf" },
      content: pse.content,
    });
  });

  // 7. Registration, Tickets & Passes
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

  // 8. FAQs & Practical Information
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

  // 9. Impact, Highlights & Partnerships
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
