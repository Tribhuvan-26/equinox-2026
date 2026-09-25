import fs from 'fs';

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports
  content = content.replace(/detectAttributeIntent/g, 'detectQuestionCategory');
  content = content.replace(/AttributeIntent/g, 'QuestionCategory');
  
  // Replace string literal comparisons
  content = content.replace(/=== "timing"/g, '=== "EVENT_DATE"');
  content = content.replace(/=== "venue"/g, '=== "EVENT_VENUE"');
  content = content.replace(/=== "eligibility"/g, '=== "ELIGIBILITY"');
  content = content.replace(/=== "rules"/g, '=== "EVENT_INFO"');
  content = content.replace(/=== "registration"/g, '=== "REGISTRATION"');
  content = content.replace(/=== "prize"/g, '=== "EVENT_INFO"');
  content = content.replace(/=== "contact"/g, '=== "EVENT_CONTACT"');
  content = content.replace(/=== "overview"/g, '=== "EVENT_INFO"');

  // Also replace 'attr === ' etc if it was assigned to a variable named `attribute`
  content = content.replace(/attribute === "contact"/g, 'attribute === "EVENT_CONTACT"');
  content = content.replace(/attribute === "timing"/g, 'attribute === "EVENT_DATE"');
  content = content.replace(/attribute === "venue"/g, 'attribute === "EVENT_VENUE"');
  content = content.replace(/attribute === "eligibility"/g, 'attribute === "ELIGIBILITY"');
  content = content.replace(/attribute === "rules"/g, 'attribute === "EVENT_INFO"');
  content = content.replace(/attribute === "registration"/g, 'attribute === "REGISTRATION"');
  content = content.replace(/attribute === "overview"/g, 'attribute === "EVENT_INFO"');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

updateFile('lib/chatbot.ts');
updateFile('lib/rag/generate.ts');
