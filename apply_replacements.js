const fs = require('fs');

let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');
const replacements = JSON.parse(fs.readFileSync('replacements.json', 'utf8'));

// Apply replacements from bottom to top to avoid line number shifts
replacements.sort((a, b) => b.StartLine - a.StartLine);

for (const rep of replacements) {
  const lines = content.split('\n');
  const targetLines = lines.slice(rep.StartLine - 1, rep.EndLine).join('\n');
  if (targetLines.trim() === rep.TargetContent.trim() || targetLines.replace(/\s+/g, '') === rep.TargetContent.replace(/\s+/g, '')) {
    lines.splice(rep.StartLine - 1, rep.EndLine - rep.StartLine + 1, rep.ReplacementContent);
    content = lines.join('\n');
  } else {
    console.error(`Mismatch at line ${rep.StartLine}`);
    console.error('Expected:', rep.TargetContent);
    console.error('Found:', targetLines);
    process.exit(1);
  }
}

fs.writeFileSync('components/JourneyPlanets.tsx', content);
console.log('Applied replacements successfully.');
