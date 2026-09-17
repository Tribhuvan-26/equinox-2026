import { EQUINOX_SUB_EVENTS, getEventSPOCs, OVERALL_EQUINOX_COORDINATORS, CHATBOT_CONTACTS } from "../chatbot/data/events";
import { getMockEquinoxResponse } from "../lib/chatbot";

async function testAll() {
  console.log("=== TEST 1: EVENT-SPECIFIC SPOCS FOR ALL 10 SUB-EVENTS ===");
  for (const event of EQUINOX_SUB_EVENTS) {
    const spocs = getEventSPOCs(event.slug);
    const names = spocs.map((s) => s.name);
    console.log(`[${event.name}] SPOCs:`, names.join(", "));
    if (spocs.length === 0) throw new Error(`No SPOCs found for ${event.name}`);
  }

  console.log("\n=== TEST 2: CHECK OVERALL & CHATBOT CONTACTS ===");
  console.log("Overall Primary:", OVERALL_EQUINOX_COORDINATORS.primary.map((c) => c.name));
  console.log("Overall Secondary:", OVERALL_EQUINOX_COORDINATORS.secondary.map((c) => c.name));
  console.log("Chatbot Contacts:", CHATBOT_CONTACTS.map((c) => c.name));

  console.log("\n=== TEST 3: CHATBOT RESPONSE QUERIES ===");

  const q1 = getMockEquinoxResponse("Who is the coordinator for Pitch Deck?");
  console.log("Pitch Deck Query Answer:\n", q1.answer);
  if (!q1.answer.includes("Anuj Lomte") || q1.answer.includes("Ghanashyam")) throw new Error("Pitch Deck failed");

  const q2 = getMockEquinoxResponse("Who are the SPOCs for Hustle Mania?");
  console.log("\nHustle Mania Query Answer:\n", q2.answer);
  if (!q2.answer.includes("Sai Vashist") || !q2.answer.includes("Rithwik")) throw new Error("Hustle Mania failed");

  const q3 = getMockEquinoxResponse("Who handles IPL Auction?");
  console.log("\nIPL Auction Query Answer:\n", q3.answer);
  if (!q3.answer.includes("Raja Vivek") || !q3.answer.includes("Bhruhathi") || !q3.answer.includes("Anamika Kumari")) throw new Error("IPL Auction failed");

  const q4 = getMockEquinoxResponse("Who do I contact for chatbot issues?");
  console.log("\nChatbot Contact Query Answer:\n", q4.answer);
  if (!q4.answer.includes("Bhavana") || !q4.answer.includes("Chatbot Support Contacts")) throw new Error("Chatbot Contact failed");

  const q5 = getMockEquinoxResponse("Who are the overall Equinox coordinators?");
  console.log("\nOverall Coordinators Query Answer:\n", q5.answer);
  if (!q5.answer.includes("Ghanashyam") || !q5.answer.includes("Secondary")) throw new Error("Overall Coordinators failed");

  console.log("\n✅ ALL PROBLEM 2 TESTS PASSED SUCCESSFULLY!");
}

testAll().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
