import fs from 'fs';

let content = fs.readFileSync('lib/chatbot.ts', 'utf8');

const ungroundedBlock = `  // 5. UNGROUNDED / UNAVAILABLE TOPICS (Case B)
  // Check for questions asking for information not present in the official brochure
  if (
    q.includes("who won") ||
    q.includes("winner") ||
    q.includes("last year") ||
    q.includes("2025") ||
    q.includes("previous edition") ||
    q.includes("previous winner") ||
    q.includes("past winners") ||
    q.includes("which college won") ||
    q.includes("who came second") ||
    q.includes("how many people attended last year") ||
    q.includes("how many teams participated last year")
  ) {
    return {
      answer:
        "I don't have information about past editions or last year's winners in the official Equinox 2.0 program. You can contact the organizers for more information.",
      suggestions: ["What is Equinox 2.0?", "Dates & Venue", "Explore Sub-Events"],
      grounded: true,
    };
  }

  if (q.includes("judge") || q.includes("judges") || q.includes("jury")) {
    return {
      answer:
        "I don't have information about the judges in the official Equinox 2.0 program. Jury panels and evaluators are announced closer to the event days.",
      suggestions: ["Explore Sub-Events", "Dates & Venue", "Registration"],
      grounded: true,
    };
  }

  if (q.includes("chief guest") || q.includes("guest of honour") || q.includes("dignitary")) {
    return {
      answer:
        "I don't have information about the chief guest in the official Equinox 2.0 program. Dignitaries and keynote speakers will be announced on the official summit website.",
      suggestions: ["Spotlight Keynotes", "Dates & Venue", "Explore Sub-Events"],
      grounded: true,
    };
  }

  if (
    q.includes("total prize pool") ||
    q.includes("overall prize money") ||
    q.includes("prize money") ||
    q.includes("how much money can i win") ||
    q.includes("what are the prizes") ||
    q.includes("cash prize") ||
    ((q.includes("prize pool") || q === "prizes" || q === "EVENT_INFO") && !context.resolvedEntity)
  ) {
    return {
      answer:
        "The Equinox 2.0 program features dedicated prizes across its sub-events:\\n\\n• **Brand Battles**: Cash prizes & trophies\\n• **IPL Auction**: Champion purse & team medals\\n• **Hustle Mania**: Retain sales profits + Winner Trophy\\n• **Pitch Deck**: Seed funding & incubation support\\n• **Startup Poly**: Equinox Board Champion Shield\\n• **Crossroads**: Exciting awards & certificates\\n• **Spotlight**: Exclusive mentor connections\\n• **Internship Drive**: Paid internship offers\\n\\nAsk about any specific event to view its complete rules, timing, and coordinator contacts!",
      suggestions: ["Brand Battles prizes", "IPL Auction prizes", "Hustle Mania prizes", "Pitch Deck prizes"],
      links: [{ label: "Explore Sub-Events", url: "/events" }],
      grounded: true,
    };
  }

  if (q.includes("wifi") || q.includes("wi fi") || q.includes("password")) {
    return {
      answer:
        "I don't have the WiFi password in the official Equinox 2.0 program. Campus network access details will be provided at the registration desk during check-in.",
      suggestions: ["Dates & Venue", "Explore Sub-Events", "Registration"],
      grounded: true,
    };
  }

  if (
    q.includes("food") ||
    q.includes("lunch") ||
    q.includes("accommodation") ||
    q.includes("stay") ||
    q.includes("hotel") ||
    q.includes("transport") ||
    q.includes("bus") ||
    q.includes("cab")
  ) {
    return {
      answer:
        "I don't have information about food, accommodation, or transport arrangements in the official Equinox 2.0 program. You can contact the organizers at cie@mlrinstitutions.ac.in for more information.",
      suggestions: ["Dates & Venue", "Explore Sub-Events", "Registration"],
      grounded: true,
    };
  }`;

content = content.replace(ungroundedBlock, "");

content = content.replace(
  /(\/\/ 4\. If an active entity is identified\s*if \(context\.resolvedEntity\) \{)/g,
  ungroundedBlock + "\n\n  $1"
);

content = content.replace(
  /q\.includes\("pass"\)/g,
  `(q.includes("pass") && !q.includes("password"))`
);

fs.writeFileSync('lib/chatbot.ts', content);

// Now patch entityResolution.ts genericSkipWords
let erContent = fs.readFileSync('lib/rag/entityResolution.ts', 'utf8');
erContent = erContent.replace(/"startups",/g, '"startups",\n        "start",\n        "start time",');
erContent = erContent.replace(
  /\\b\(who is the coordinator\|contact\|spoc\|spocs\|who manages\|who do i contact\|who to contact\)\\b/,
  "\\b(who is the coordinator|contact|spoc|spocs|who manages|who handles|who do i call|who do i contact|who to contact)\\b"
);
fs.writeFileSync('lib/rag/entityResolution.ts', erContent);

