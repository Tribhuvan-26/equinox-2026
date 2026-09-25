import fs from 'fs';

const pdfText = fs.readFileSync('extracted_pdf_data.txt', 'utf8');

// Parse PDF blocks
const blocks = pdfText.split(/\d{2} — /).filter(Boolean);
const pdfData = {};

blocks.forEach(b => {
  const lines = b.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length >= 3) {
    const title = lines[0].toLowerCase();
    const slugMap = {
      'spotlight': 'spotlight',
      'crossroads': 'crossroads',
      'startup expo': 'startup-expo',
      'brand battles': 'brand-battles',
      'ipl auction': 'ipl-auction',
      'hustle mania': 'hustle-mania',
      'internship drive': 'internship-drive',
      'startup poly': 'startup-poly',
      'e-cell meet': 'e-cell-meet',
      'pitch deck': 'pitch-deck'
    };
    
    let slug = null;
    for (const [k, v] of Object.entries(slugMap)) {
      if (title.includes(k)) {
        slug = v;
        break;
      }
    }
    
    if (slug) {
      // The description is the 3rd line onwards
      const description = lines.slice(2).join(' ');
      pdfData[slug] = description;
    }
  }
});

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [slug, desc] of Object.entries(pdfData)) {
    // Regex to match: slug: "...", \n name: "...", \n ... description: "..."
    // We can do a string replace or a more targeted regex
    // Since the format is strict, we can find the block for the slug
    const blockStart = content.indexOf(`slug: "${slug}"`);
    if (blockStart === -1) continue;
    
    const descStart = content.indexOf('description:', blockStart);
    if (descStart === -1) continue;
    
    // Find the end of the string. It could be multi-line string in TS, usually in quotes.
    // The existing descriptions are in double quotes, potentially spanning multiple lines.
    // Wait, in events.ts it's double quotes `description: "...",`
    const nextProp = content.indexOf('skills:', descStart);
    if (nextProp === -1) continue;
    
    // Replace the text between descStart and nextProp
    const before = content.substring(0, descStart);
    const after = content.substring(nextProp);
    
    content = before + `description:\n      "${desc}",\n    ` + after;
  }
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

updateFile('chatbot/data/events.ts');
updateFile('lib/content.ts');

