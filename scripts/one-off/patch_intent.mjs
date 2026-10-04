import fs from 'fs';

let content = fs.readFileSync('lib/rag/entityResolution.ts', 'utf8');

// 1. Replace AttributeIntent with QuestionCategory
content = content.replace(
  /export type AttributeIntent =[\s\S]*?\| "overview";/,
  `export type QuestionCategory =
  | "EVENT_INFO"
  | "EVENT_CONTACT"
  | "EVENT_DATE"
  | "EVENT_VENUE"
  | "REGISTRATION"
  | "ELIGIBILITY"
  | "EVENT_LIST"
  | "GENERAL_EQUINOX"
  | "CONTACT"
  | "UNKNOWN";`
);

// 2. Rename detectAttributeIntent to detectQuestionCategory and update returns
content = content.replace(
  /export function detectAttributeIntent\(query: string\): AttributeIntent \| undefined \{/,
  `export function detectQuestionCategory(query: string): QuestionCategory | undefined {`
);

content = content.replace(/return "timing";/g, 'return "EVENT_DATE";');
content = content.replace(/return "venue";/g, 'return "EVENT_VENUE";');
content = content.replace(/return "eligibility";/g, 'return "ELIGIBILITY";');
content = content.replace(/return "rules";/g, 'return "EVENT_INFO";');
content = content.replace(/return "registration";/g, 'return "REGISTRATION";');
content = content.replace(/return "prize";/g, 'return "EVENT_INFO";');
content = content.replace(/return "contact";/g, 'return "EVENT_CONTACT";');
content = content.replace(/return "overview";/g, 'return "EVENT_INFO";');

fs.writeFileSync('lib/rag/entityResolution.ts', content);
console.log('Patched entityResolution.ts');
