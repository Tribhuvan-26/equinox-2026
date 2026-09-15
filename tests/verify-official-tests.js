// tests/verify-official-tests.js
// Dedicated automated test verification for the 22 user test cases

const http = require("http");

async function postChat(message, history = []) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message, history });
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/chat",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error("Failed to parse: " + body));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("==================================================");
  console.log("RUNNING 22 OFFICIAL SPECIFICATION TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;
  const results = [];

  function assertTest(num, name, condition, actualInfo) {
    if (condition) {
      passed++;
      console.log(`✅ Test ${num} PASSED: ${name}`);
      console.log(`   ${actualInfo}\n`);
      results.push({ num, name, passed: true, actualInfo });
    } else {
      failed++;
      console.error(`❌ Test ${num} FAILED: ${name}`);
      console.error(`   ${actualInfo}\n`);
      results.push({ num, name, passed: false, actualInfo });
    }
  }

  // 1. What are all the sub-events?
  {
    const res = await postChat("What are all the sub-events?");
    const text = res.answer || "";
    const has10 = text.includes("10") || text.toLowerCase().includes("ten");
    const noIdeathon = !text.toLowerCase().includes("ideathon");
    const hasSpotlight = text.toLowerCase().includes("spotlight");
    const hasPitchDeck = text.toLowerCase().includes("pitch deck");
    assertTest(
      1,
      "What are all the sub-events?",
      has10 && noIdeathon && hasSpotlight && hasPitchDeck,
      `Text contains 10 events, includes Spotlight & Pitch Deck, excludes Ideathon. Card: ${res.eventCard?.name || "none"}`
    );
  }

  // 2. Tell me about Spotlight.
  {
    const res = await postChat("Tell me about Spotlight.");
    const text = (res.answer || "").toLowerCase();
    const hasExpertOrTalks = text.includes("expert") || text.includes("talk") || text.includes("spotlight");
    const cardValid = res.eventCard && res.eventCard.slug === "spotlight";
    assertTest(
      2,
      "Tell me about Spotlight.",
      hasExpertOrTalks && cardValid,
      `Text mentions expert/talks. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 3. Tell me about Crossroads.
  {
    const res = await postChat("Tell me about Crossroads.");
    const text = (res.answer || "").toLowerCase();
    const hasCaseOrSim = text.includes("simulation") || text.includes("case") || text.includes("crossroads");
    const cardValid = res.eventCard && res.eventCard.slug === "crossroads";
    assertTest(
      3,
      "Tell me about Crossroads.",
      hasCaseOrSim && cardValid,
      `Text mentions simulation/case. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 4. Tell me about Startup Expo.
  {
    const res = await postChat("Tell me about Startup Expo.");
    const text = (res.answer || "").toLowerCase();
    const hasExpo = text.includes("expo") || text.includes("showcase") || text.includes("product");
    const cardValid = res.eventCard && res.eventCard.slug === "startup-expo";
    assertTest(
      4,
      "Tell me about Startup Expo.",
      hasExpo && cardValid,
      `Text mentions expo/showcase/product. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 5. Tell me about Brand Battles.
  {
    const res = await postChat("Tell me about Brand Battles.");
    const text = (res.answer || "").toLowerCase();
    const hasBrand = text.includes("brand") || text.includes("debate");
    const cardValid = res.eventCard && res.eventCard.slug === "brand-battles";
    assertTest(
      5,
      "Tell me about Brand Battles.",
      hasBrand && cardValid,
      `Text mentions brand/debate. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 6. Tell me about IPL Auction.
  {
    const res = await postChat("Tell me about IPL Auction.");
    const text = (res.answer || "").toLowerCase();
    const hasIPL = text.includes("ipl") || text.includes("auction") || text.includes("cricket");
    const cardValid = res.eventCard && res.eventCard.slug === "ipl-auction";
    assertTest(
      6,
      "Tell me about IPL Auction.",
      hasIPL && cardValid,
      `Text mentions cricket/auction. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 7. Tell me about Hustle Mania.
  {
    const res = await postChat("Tell me about Hustle Mania.");
    const text = (res.answer || "").toLowerCase();
    const hasHustle = text.includes("hustle") || text.includes("stall") || text.includes("sell");
    const cardValid = res.eventCard && res.eventCard.slug === "hustle-mania";
    assertTest(
      7,
      "Tell me about Hustle Mania.",
      hasHustle && cardValid,
      `Text mentions stall/sell/hustle. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 8. Tell me about Internship Drive.
  {
    const res = await postChat("Tell me about Internship Drive.");
    const text = (res.answer || "").toLowerCase();
    const hasIntern = text.includes("internship") || text.includes("companies");
    const cardValid = res.eventCard && res.eventCard.slug === "internship-drive";
    assertTest(
      8,
      "Tell me about Internship Drive.",
      hasIntern && cardValid,
      `Text mentions internship/companies. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 9. Tell me about Startup Poly.
  {
    const res = await postChat("Tell me about Startup Poly.");
    const text = (res.answer || "").toLowerCase();
    const hasPoly = text.includes("monopoly") || text.includes("poly") || text.includes("board");
    const cardValid = res.eventCard && res.eventCard.slug === "startup-poly";
    assertTest(
      9,
      "Tell me about Startup Poly.",
      hasPoly && cardValid,
      `Text mentions monopoly/poly. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 10. Tell me about E-Cell Meet.
  {
    const res = await postChat("Tell me about E-Cell Meet.");
    const text = (res.answer || "").toLowerCase();
    const hasECell = text.includes("cell") || text.includes("network") || text.includes("conclave");
    const cardValid = res.eventCard && res.eventCard.slug === "e-cell-meet";
    assertTest(
      10,
      "Tell me about E-Cell Meet.",
      hasECell && cardValid,
      `Text mentions e-cell/networking. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 11. Tell me about Pitch Deck.
  {
    const res = await postChat("Tell me about Pitch Deck.");
    const text = (res.answer || "").toLowerCase();
    const hasPitch = text.includes("pitch") || text.includes("investor");
    const cardValid = res.eventCard && res.eventCard.slug === "pitch-deck";
    assertTest(
      11,
      "Tell me about Pitch Deck.",
      hasPitch && cardValid,
      `Text mentions pitch/investor. Card attached: ${res.eventCard?.name} (${res.eventCard?.slug})`
    );
  }

  // 12. Which event has industry expert talks?
  {
    const res = await postChat("Which event has industry expert talks?");
    const text = (res.answer || "").toLowerCase();
    const isSpotlight = text.includes("spotlight");
    assertTest(
      12,
      "Which event has industry expert talks? -> Spotlight",
      isSpotlight,
      `Answer identifies Spotlight. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 13. Which event involves selling to real customers?
  {
    const res = await postChat("Which event involves selling to real customers?");
    const text = (res.answer || "").toLowerCase();
    const isHustle = text.includes("hustle");
    assertTest(
      13,
      "Which event involves selling to real customers? -> Hustle Mania",
      isHustle,
      `Answer identifies Hustle Mania. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 14. Which event is Monopoly-inspired?
  {
    const res = await postChat("Which event is Monopoly-inspired?");
    const text = (res.answer || "").toLowerCase();
    const isPoly = text.includes("startup poly") || text.includes("poly");
    assertTest(
      14,
      "Which event is Monopoly-inspired? -> Startup Poly",
      isPoly,
      `Answer identifies Startup Poly. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 15. Which event connects E-Cells?
  {
    const res = await postChat("Which event connects E-Cells?");
    const text = (res.answer || "").toLowerCase();
    const isECellMeet = text.includes("e-cell meet") || text.includes("ecell meet");
    assertTest(
      15,
      "Which event connects E-Cells? -> E-Cell Meet",
      isECellMeet,
      `Answer identifies E-Cell Meet. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 16. Which event involves cricket bidding?
  {
    const res = await postChat("Which event involves cricket bidding?");
    const text = (res.answer || "").toLowerCase();
    const isIPL = text.includes("ipl");
    assertTest(
      16,
      "Which event involves cricket bidding? -> IPL Auction",
      isIPL,
      `Answer identifies IPL Auction. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 17. Which event involves rival brands?
  {
    const res = await postChat("Which event involves rival brands?");
    const text = (res.answer || "").toLowerCase();
    const isBrandBattles = text.includes("brand battle");
    assertTest(
      17,
      "Which event involves rival brands? -> Brand Battles",
      isBrandBattles,
      `Answer identifies Brand Battles. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 18. Which event involves internships?
  {
    const res = await postChat("Which event involves internships?");
    const text = (res.answer || "").toLowerCase();
    const isInternship = text.includes("internship drive");
    assertTest(
      18,
      "Which event involves internships? -> Internship Drive",
      isInternship,
      `Answer identifies Internship Drive. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 19. Tell me about Ideathon.
  {
    const res = await postChat("Tell me about Ideathon.");
    const text = (res.answer || "").toLowerCase();
    const rejected =
      text.includes("not part of") ||
      text.includes("not supported") ||
      text.includes("10 sub-events") ||
      text.includes("10 official");
    const noEventCard = !res.eventCard;
    assertTest(
      19,
      "Tell me about Ideathon. -> Explicit exclusion, no card, no fake info",
      rejected && noEventCard,
      `Response properly states Ideathon is not supported. No card attached. Snippet: "${text.slice(0, 120)}..."`
    );
  }

  // 20. Who won Equinox last year?
  {
    const res = await postChat("Who won Equinox last year?");
    const text = (res.answer || "").toLowerCase();
    const unavail =
      text.includes("don't have information") ||
      text.includes("not available") ||
      text.includes("past edition");
    const noEventCard = !res.eventCard;
    assertTest(
      20,
      "Who won Equinox last year? -> Unavailable guardrail, no card",
      unavail && noEventCard,
      `Response states information is unavailable. No card attached. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 21. What's the total prize pool?
  {
    const res = await postChat("What's the total prize pool?");
    const text = (res.answer || "").toLowerCase();
    const unavail =
      text.includes("don't have information") ||
      text.includes("not available") ||
      text.includes("overall summit prize pool") ||
      text.includes("prize pool in the official");
    const noEventCard = !res.eventCard;
    assertTest(
      21,
      "What's the total prize pool? -> Unavailable guardrail, no card",
      unavail && noEventCard,
      `Response states prize pool info is unavailable. No card attached. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  // 22. Tell me about Hustle Mania → Who can participate?
  {
    const history = [
      { role: "user", content: "Tell me about Hustle Mania." },
      {
        role: "assistant",
        content:
          "Hustle Mania is a hands-on business and marketing challenge where participants set up stalls and sell products to real customers.",
      },
    ];
    const res = await postChat("Who can participate?", history);
    const text = (res.answer || "").toLowerCase();
    const refersToHustle =
      text.includes("hustle") ||
      text.includes("solo") ||
      text.includes("2–3") ||
      text.includes("teams of 2") ||
      text.includes("hustler");
    const noGenericIntro = !text.includes("i am your equinox 2.0 assistant");
    assertTest(
      22,
      "Context: Tell me about Hustle Mania → Who can participate?",
      refersToHustle && noGenericIntro,
      `Correctly resolved follow-up to Hustle Mania eligibility. Card: ${res.eventCard?.name || "none (attribute query correctly omits card)"}. Snippet: "${text.slice(0, 100)}..."`
    );
  }

  console.log("==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
