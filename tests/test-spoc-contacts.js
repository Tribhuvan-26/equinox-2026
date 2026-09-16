// tests/test-spoc-contacts.js
// Verification suite for SPOC and Coordinator contacts in Equinox 2.0 Chatbot

const tests = [
  // 1. All 10 sub-events include their complete SPOC list
  {
    name: "Spotlight overview includes Rithish Kumar",
    query: "Tell me about Spotlight",
    expectedSPOCs: ["Rithish Kumar", "+91 93987 53113"],
    unexpectedSPOCs: ["Indu", "Sadwika", "Ghanashyam"],
  },
  {
    name: "Crossroads overview includes Indu and Sadwika",
    query: "What is Crossroads?",
    expectedSPOCs: ["Indu", "+91 89197 51488", "Sadwika", "+91 93477 15741"],
    unexpectedSPOCs: ["Rithish", "Nikitha", "Ghanashyam"],
  },
  {
    name: "Startup Expo overview includes Nikitha and Adithya Jadhav",
    query: "Tell me about Startup Expo",
    expectedSPOCs: ["Nikitha", "+91 85002 07731", "Adithya Jadhav", "+91 72869 05928"],
    unexpectedSPOCs: ["Pranav", "Raja Vivek"],
  },
  {
    name: "Brand Battles overview includes Pranav Chandra and Hansika Jella",
    query: "Tell me about Brand Battles",
    expectedSPOCs: ["Pranav Chandra", "+91 95811 70601", "Hansika Jella", "+91 83099 75984"],
    unexpectedSPOCs: ["Sai Vashist", "Indu"],
  },
  {
    name: "IPL Auction overview includes Raja Vivek, Bhruhathi, Anamika Kumari",
    query: "Tell me about IPL Auction",
    expectedSPOCs: [
      "Raja Vivek",
      "+91 89857 11276",
      "Bhruhathi",
      "+91 62812 77577",
      "Anamika Kumari",
      "+91 86867 35562",
    ],
    unexpectedSPOCs: ["Adithya Ganesh", "Tribhuvan"],
  },
  {
    name: "Hustle Mania overview includes Sai Vashist and Rithwik",
    query: "Tell me about Hustle Mania",
    expectedSPOCs: ["Sai Vashist", "+91 95156 40740", "Rithwik", "+91 81214 51565"],
    unexpectedSPOCs: ["Anuj Lomte", "Sanjana"],
  },
  {
    name: "Internship Drive overview includes Adithya Ganesh and Shiva",
    query: "Tell me about Internship Drive",
    expectedSPOCs: ["Adithya Ganesh", "+91 91822 40970", "Shiva", "+91 93477 38868"],
    unexpectedSPOCs: ["Rithish Kumar", "Indu"],
  },
  {
    name: "Startup Poly overview includes Tribhuvan, Abhinav Sai, Farhana",
    query: "Tell me about Startup Poly",
    expectedSPOCs: [
      "Tribhuvan",
      "+91 73306 72121",
      "Abhinav Sai",
      "+91 91336 94540",
      "Farhana",
      "+91 83280 07810",
    ],
    unexpectedSPOCs: ["Sai Vashist", "Nikitha"],
  },
  {
    name: "E-Cell Meet overview includes Sanjana and Adithya Ganesh",
    query: "Tell me about E-Cell Meet",
    expectedSPOCs: ["Sanjana", "+91 82084 99746", "Adithya Ganesh", "+91 91822 40970"],
    unexpectedSPOCs: ["Raja Vivek", "Pranav Chandra"],
  },
  {
    name: "Pitch Deck overview includes Anuj Lomte",
    query: "Tell me about Pitch Deck",
    expectedSPOCs: ["Anuj Lomte", "+91 93901 20510"],
    unexpectedSPOCs: ["Tribhuvan", "Indu"],
  },

  // 2. Specific Sub-Event Contact Queries
  {
    name: "who do I contact for Spotlight?",
    query: "who do I contact for Spotlight?",
    expectedSPOCs: ["Rithish Kumar", "+91 93987 53113"],
    unexpectedSPOCs: ["Ghanashyam", "Indu", "Sadwika"],
  },
  {
    name: "who manages Crossroads?",
    query: "who manages Crossroads?",
    expectedSPOCs: ["Indu", "+91 89197 51488", "Sadwika", "+91 93477 15741"],
    unexpectedSPOCs: ["Ghanashyam", "Rithish Kumar"],
  },
  {
    name: "give me the SPOCs for IPL Auction",
    query: "give me the SPOCs for IPL Auction",
    expectedSPOCs: [
      "Raja Vivek",
      "+91 89857 11276",
      "Bhruhathi",
      "+91 62812 77577",
      "Anamika Kumari",
      "+91 86867 35562",
    ],
    unexpectedSPOCs: ["Ghanashyam", "Indu"],
  },

  // 3. General Equinox Coordinator queries
  {
    name: "General coordinators inquiry",
    query: "who are the overall coordinators?",
    expectedSPOCs: [
      "Ghanashyam",
      "+91 93900 06806",
      "Jaikar",
      "+91 90324 10189",
      "Bhavana",
      "+91 99895 32925",
    ],
    unexpectedSPOCs: ["Rithish Kumar", "Sadwika", "Anuj Lomte"],
  },
  {
    name: "General contact inquiry",
    query: "how do I contact Equinox coordinators?",
    expectedSPOCs: [
      "Ghanashyam",
      "+91 93900 06806",
      "Jaikar",
      "+91 90324 10189",
      "Bhavana",
      "+91 99895 32925",
    ],
    unexpectedSPOCs: ["Tribhuvan", "Indu"],
  },

  // 4. Guardrail / Unknown queries must NOT return SPOCs
  {
    name: "Unknown query: WiFi password should not list coordinators",
    query: "What is the WiFi password?",
    expectedSPOCs: [],
    unexpectedSPOCs: ["Ghanashyam", "Jaikar", "Bhavana", "Rithish Kumar", "Indu"],
  },
  {
    name: "Unknown query: Who won last year should not list coordinators",
    query: "Who won Equinox last year?",
    expectedSPOCs: [],
    unexpectedSPOCs: ["Ghanashyam", "Jaikar", "Bhavana", "Rithish Kumar", "Indu"],
  },
];

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING SPOC & COORDINATOR CONTACT VERIFICATION SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t.query }),
      });
      const data = await res.json();
      const answer = data.answer || "";
      const lower = answer.toLowerCase();

      // Check expected
      const missing = t.expectedSPOCs.filter(
        (spoc) => !lower.includes(spoc.toLowerCase())
      );

      // Check unexpected
      const leaked = t.unexpectedSPOCs.filter((un) =>
        lower.includes(un.toLowerCase())
      );

      if (missing.length === 0 && leaked.length === 0) {
        passed++;
        console.log(`\n✅ Test ${i + 1} PASSED: ${t.name}`);
        console.log(`   Query: "${t.query}"`);
        const snippet = answer.length > 180 ? answer.substring(0, 180) + "..." : answer;
        console.log(`   Snippet: ${snippet.replace(/\n/g, " ")}`);
      } else {
        failed++;
        console.error(`\n❌ Test ${i + 1} FAILED: ${t.name}`);
        console.error(`   Query: "${t.query}"`);
        if (missing.length > 0) {
          console.error(`   Missing expected details:`, missing);
        }
        if (leaked.length > 0) {
          console.error(`   Leaked unexpected details:`, leaked);
        }
        console.error(`   Full answer:\n${answer}`);
      }
    } catch (err) {
      failed++;
      console.error(`\n❌ Test ${i + 1} ERROR: ${t.name}`, err);
    }
  }

  console.log("\n==================================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED out of ${tests.length}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
