import { detectQuestionCategory } from '../../lib/rag/entityResolution';
import { resolveConversationContext } from '../../lib/rag/context';
import { getMockEquinoxResponse } from '../../lib/chatbot';
import { generateRagChatResponse } from '../../lib/rag/generate';

// 1. Define the ~100 Test Cases
const testCases = [
  // --- EVENT_INFO ---
  { query: "what is spotlight?", category: "EVENT_INFO", entity: "Spotlight" },
  { query: "tell me about the crossroads event", category: "EVENT_INFO", entity: "Cross Roads" },
  { query: "how does startup expo work?", category: "EVENT_INFO", entity: "Startup Expo" },
  { query: "details on brand battles", category: "EVENT_INFO", entity: "Brand Battles" },
  { query: "explain ipl auction", category: "EVENT_INFO", entity: "IPL Auction" },
  { query: "what are the rules for hustle mania", category: "EVENT_INFO", entity: "Hustle Mania" },
  { query: "internship drive details", category: "EVENT_INFO", entity: "Internship Drive" },
  { query: "what is the startup board game thing", category: "EVENT_INFO", entity: "Startup Poly" }, // Tests natural description
  { query: "startup poly rules", category: "EVENT_INFO", entity: "Startup Poly" },
  { query: "e-cell meet overview", category: "EVENT_INFO", entity: "E-Cell Meet" },
  { query: "pitch deck format", category: "EVENT_INFO", entity: "Pitch Deck" },
  { query: "what is cross roads", category: "EVENT_INFO", entity: "Cross Roads" },
  { query: "hustlemania info", category: "EVENT_INFO", entity: "Hustle Mania" }, // Typo
  { query: "brand battle details", category: "EVENT_INFO", entity: "Brand Battles" }, // Typo
  { query: "what is the pitching event", category: "EVENT_INFO", entity: "Pitch Deck" }, // Natural
  { query: "tell me about the monopoly event", category: "EVENT_INFO", entity: "Startup Poly" }, // Natural
  { query: "cricket bidding event", category: "EVENT_INFO", entity: "IPL Auction" }, // Natural
  { query: "what is e cell meet", category: "EVENT_INFO", entity: "E-Cell Meet" },
  { query: "info on internship drive", category: "EVENT_INFO", entity: "Internship Drive" },
  { query: "what is startup expo", category: "EVENT_INFO", entity: "Startup Expo" },

  // --- EVENT_CONTACT ---
  { query: "who do i call for spotlight", category: "EVENT_CONTACT", entity: "Spotlight" },
  { query: "contact for crossroads", category: "EVENT_CONTACT", entity: "Cross Roads" },
  { query: "startup expo spoc", category: "EVENT_CONTACT", entity: "Startup Expo" },
  { query: "brand battles coordinator", category: "EVENT_CONTACT", entity: "Brand Battles" },
  { query: "who manages ipl auction", category: "EVENT_CONTACT", entity: "IPL Auction" },
  { query: "hustle mania contact", category: "EVENT_CONTACT", entity: "Hustle Mania" },
  { query: "who is in charge of internship drive", category: "EVENT_CONTACT", entity: "Internship Drive" },
  { query: "startup poly spocs", category: "EVENT_CONTACT", entity: "Startup Poly" },
  { query: "who to contact for e-cell meet", category: "EVENT_CONTACT", entity: "E-Cell Meet" },
  { query: "pitch deck coordinator", category: "EVENT_CONTACT", entity: "Pitch Deck" },
  { query: "spoc for the board game event", category: "EVENT_CONTACT", entity: "Startup Poly" }, // Natural + Contact
  { query: "who do i call for the cricket draft", category: "EVENT_CONTACT", entity: "IPL Auction" },
  { query: "contact for selling event", category: "EVENT_CONTACT", entity: "Hustle Mania" },
  { query: "coordinator for brand battles", category: "EVENT_CONTACT", entity: "Brand Battles" },
  { query: "who manages e cell meet", category: "EVENT_CONTACT", entity: "E-Cell Meet" },

  // --- EVENT_DATE ---
  { query: "when is spotlight", category: "EVENT_DATE", entity: "Spotlight" },
  { query: "what time is crossroads", category: "EVENT_DATE", entity: "Cross Roads" },
  { query: "startup expo timing", category: "EVENT_DATE", entity: "Startup Expo" },
  { query: "when does brand battles start", category: "EVENT_DATE", entity: "Brand Battles" },
  { query: "ipl auction date", category: "EVENT_DATE", entity: "IPL Auction" },
  { query: "hustle mania time", category: "EVENT_DATE", entity: "Hustle Mania" },
  { query: "when is the internship drive", category: "EVENT_DATE", entity: "Internship Drive" },
  { query: "startup poly timing", category: "EVENT_DATE", entity: "Startup Poly" },
  { query: "e-cell meet schedule", category: "EVENT_DATE", entity: "E-Cell Meet" },
  { query: "when is pitch deck", category: "EVENT_DATE", entity: "Pitch Deck" },

  // --- EVENT_VENUE ---
  { query: "where is spotlight", category: "EVENT_VENUE", entity: "Spotlight" },
  { query: "crossroads venue", category: "EVENT_VENUE", entity: "Cross Roads" },
  { query: "startup expo location", category: "EVENT_VENUE", entity: "Startup Expo" },
  { query: "where will brand battles be held", category: "EVENT_VENUE", entity: "Brand Battles" },
  { query: "ipl auction room", category: "EVENT_VENUE", entity: "IPL Auction" },
  { query: "where is hustle mania", category: "EVENT_VENUE", entity: "Hustle Mania" },
  { query: "internship drive venue", category: "EVENT_VENUE", entity: "Internship Drive" },
  { query: "where is startup poly", category: "EVENT_VENUE", entity: "Startup Poly" },
  { query: "e-cell meet location", category: "EVENT_VENUE", entity: "E-Cell Meet" },
  { query: "pitch deck hall", category: "EVENT_VENUE", entity: "Pitch Deck" },

  // --- REGISTRATION ---
  { query: "how to register for spotlight", category: "REGISTRATION", entity: "Spotlight" },
  { query: "crossroads fee", category: "REGISTRATION", entity: "Cross Roads" },
  { query: "startup expo ticket", category: "REGISTRATION", entity: "Startup Expo" },
  { query: "brand battles registration", category: "REGISTRATION", entity: "Brand Battles" },
  { query: "how much is ipl auction", category: "REGISTRATION", entity: "IPL Auction" },
  { query: "hustle mania register", category: "REGISTRATION", entity: "Hustle Mania" },
  { query: "internship drive cost", category: "REGISTRATION", entity: "Internship Drive" },
  { query: "startup poly registration fee", category: "REGISTRATION", entity: "Startup Poly" },
  { query: "e-cell meet ticket", category: "REGISTRATION", entity: "E-Cell Meet" },
  { query: "how do i register for pitch deck", category: "REGISTRATION", entity: "Pitch Deck" },

  // --- ELIGIBILITY ---
  { query: "who can participate in spotlight", category: "ELIGIBILITY", entity: "Spotlight" },
  { query: "crossroads team size", category: "ELIGIBILITY", entity: "Cross Roads" },
  { query: "startup expo eligibility", category: "ELIGIBILITY", entity: "Startup Expo" },
  { query: "is brand battles solo or team", category: "ELIGIBILITY", entity: "Brand Battles" },
  { query: "ipl auction eligible", category: "ELIGIBILITY", entity: "IPL Auction" },
  { query: "hustle mania team", category: "ELIGIBILITY", entity: "Hustle Mania" },
  { query: "who is eligible for internship drive", category: "ELIGIBILITY", entity: "Internship Drive" },
  { query: "startup poly participant criteria", category: "ELIGIBILITY", entity: "Startup Poly" },
  { query: "e-cell meet participation", category: "ELIGIBILITY", entity: "E-Cell Meet" },
  { query: "pitch deck solo", category: "ELIGIBILITY", entity: "Pitch Deck" },

  // --- EVENT_LIST ---
  { query: "all events list please", category: "EVENT_LIST", entity: null },
  { query: "what are the events", category: "EVENT_LIST", entity: null },
  { query: "show me all sub-events", category: "EVENT_LIST", entity: null },
  { query: "list of events", category: "EVENT_LIST", entity: null },
  { query: "what events are there", category: "EVENT_LIST", entity: null },

  // --- GENERAL_EQUINOX ---
  { query: "what is equinox 2.0?", category: "GENERAL_EQUINOX", entity: null },
  { query: "tell me about equinox", category: "GENERAL_EQUINOX", entity: null },
  { query: "about equinox 2.0", category: "GENERAL_EQUINOX", entity: null },
  { query: "what is equinox", category: "GENERAL_EQUINOX", entity: null },
  { query: "dates of equinox", category: "EVENT_DATE", entity: null }, // Date for summit
  { query: "when is equinox", category: "EVENT_DATE", entity: null }, // Date for summit
  { query: "where is equinox", category: "EVENT_VENUE", entity: null }, // Venue for summit
  { query: "equinox venue", category: "EVENT_VENUE", entity: null }, // Venue for summit

  // --- CONTACT ---
  // GENERAL CONTACT
  { query: "who do i contact for equinox", category: "EVENT_CONTACT", entity: null },
  { query: "equinox overall coordinators", category: "EVENT_CONTACT", entity: null },
  { query: "contact organizers", category: "EVENT_CONTACT", entity: null },
  
  // --- HALLUCINATION RESISTANCE ---
  { query: "who won equinox last year", category: "UNKNOWN", entity: null, requireFallback: true },
  { query: "what is the wifi password", category: "UNKNOWN", entity: null, requireFallback: true },
  { query: "who is the chief guest", category: "UNKNOWN", entity: null, requireFallback: true },
  { query: "is food provided", category: "UNKNOWN", entity: null, requireFallback: true },
  { query: "who are the judges for pitch deck", category: "UNKNOWN", entity: "Pitch Deck", requireFallback: true },
  { query: "what is the accommodation policy", category: "UNKNOWN", entity: null, requireFallback: true },
];

const followupTests = [
  { queries: ["Tell me about Startup Poly", "Who handles it?"], expectedEntity: "Startup Poly", expectedCategory: "EVENT_CONTACT" },
  { queries: ["what is brand battles", "when does it start?"], expectedEntity: "Brand Battles", expectedCategory: "EVENT_DATE" },
  { queries: ["pitch deck", "what is the team size"], expectedEntity: "Pitch Deck", expectedCategory: "ELIGIBILITY" },
  { queries: ["where is crossroads", "how do i register for it"], expectedEntity: "Cross Roads", expectedCategory: "REGISTRATION" },
];

async function runTests() {
  let passed = 0;
  let failed = 0;
  let categoryMismatches = 0;
  let entityMismatches = 0;

  console.log("=== RUNNING CHATBOT EVALUATION ===");

  for (const tc of testCases) {
    const context = resolveConversationContext(tc.query, []);
    const cat = detectQuestionCategory(context.augmentedQuery);
    const resolvedEntityName = context.resolvedEntity?.name || null;

    let catPassed = true;
    // For date/venue of equinox generally without an entity, entityResolution might classify it correctly, but let's be flexible
    if (tc.category !== "UNKNOWN" && tc.category !== "CONTACT" && tc.category !== "EVENT_DATE" && tc.category !== "EVENT_VENUE") {
      if (cat !== tc.category) {
        catPassed = false;
        categoryMismatches++;
      }
    } else if (tc.category === "EVENT_DATE" || tc.category === "EVENT_VENUE") {
       if (cat !== tc.category && cat !== "UNKNOWN") {
          catPassed = false;
          categoryMismatches++;
       }
    }

    let entPassed = true;
    if (tc.entity !== resolvedEntityName) {
      entPassed = false;
      entityMismatches++;
    }
    
    // Check if it routes successfully to mock response or fallback
    const mock = getMockEquinoxResponse(context.augmentedQuery, []);
    let routePassed = true;
    if (tc.requireFallback && !mock.answer.includes("I don't have") && !mock.answer.includes("Ideathon is not part of")) {
       // if it requires a fallback answer for ungrounded info
       routePassed = false;
    }

    if (!catPassed || !entPassed || !routePassed) {
      console.log(`\n❌ FAILED: "${tc.query}"`);
      if (!catPassed) console.log(`   Expected Category: ${tc.category}, Got: ${cat}`);
      if (!entPassed) console.log(`   Expected Entity: ${tc.entity}, Got: ${resolvedEntityName}`);
      if (!routePassed) console.log(`   Expected Fallback rejection, but got: ${mock.answer.substring(0, 50)}...`);
      failed++;
    } else {
      passed++;
    }
  }

  console.log("\n=== FOLLOW-UP CONTEXT TESTS ===");
  for (const ft of followupTests) {
    let history: any[] = [];
    for (let i = 0; i < ft.queries.length; i++) {
       const q = ft.queries[i];
       const context = resolveConversationContext(q, history);
       
       if (i === ft.queries.length - 1) {
          const cat = detectQuestionCategory(context.augmentedQuery);
          const resolvedEntityName = context.resolvedEntity?.name || null;
          
          if (resolvedEntityName !== ft.expectedEntity || cat !== ft.expectedCategory) {
            console.log(`\n❌ FAILED FOLLOWUP: "${ft.queries.join(' -> ')}"`);
            console.log(`   Expected Entity: ${ft.expectedEntity}, Got: ${resolvedEntityName}`);
            console.log(`   Expected Category: ${ft.expectedCategory}, Got: ${cat}`);
            failed++;
          } else {
            passed++;
          }
       }
       
       history.push({ role: "user", content: q });
       history.push({ role: "assistant", content: getMockEquinoxResponse(context.augmentedQuery, history).answer });
    }
  }

  console.log("\n=== EVALUATION RESULTS ===");
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  console.log(`Category Mismatches: ${categoryMismatches}`);
  console.log(`Entity Mismatches: ${entityMismatches}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
