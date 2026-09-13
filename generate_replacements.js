const fs = require('fs');

let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

const replacements = [];

// 1. Popup title image replacement
const popupMatch = content.match(/\{idx === 0 \? \([\s\S]*?\) : \([\s\S]*?\)\}/);
if (popupMatch) {
  replacements.push({
    StartLine: content.substring(0, popupMatch.index).split('\n').length,
    EndLine: content.substring(0, popupMatch.index + popupMatch[0].length).split('\n').length,
    TargetContent: popupMatch[0],
    ReplacementContent: `                    <div className="mt-5 mb-2 relative h-10 sm:h-12 w-full flex justify-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={\`/logos/\${ev.slug}.png\`}
                        alt={ev.name} 
                        className="h-full w-auto object-contain object-left drop-shadow-md" 
                        draggable={false}
                      />
                    </div>`,
    AllowMultiple: false
  });
}

// 2. Fix spotlight planet to use dynamic URL
const spotlightMatch = content.match(/href="\/spotlight-planet\.svg"/);
if (spotlightMatch) {
  replacements.push({
    StartLine: content.substring(0, spotlightMatch.index).split('\n').length,
    EndLine: content.substring(0, spotlightMatch.index + spotlightMatch[0].length).split('\n').length,
    TargetContent: spotlightMatch[0],
    ReplacementContent: `href={\`/planets/\${event.slug}.svg\`}`,
    AllowMultiple: false
  });
}

// 3. Planet core replacements (1 to 9)
for (let i = 1; i <= 9; i++) {
  // Find `<circle cx="0" cy="0" r="85" fill="url(#p` up to `</g>` before next block
  const blockRegex = new RegExp(`{index === ${i} && \\([\\s\\S]*?<circle cx="0" cy="0" r="85" fill="url\\(#p\\d+-grad\\)" filter="(.*?)" \\/>([\\s\\S]*?)<\\/g>\\s*\\)}`);
  const match = content.match(blockRegex);
  if (match) {
    const filter = match[1];
    const innerContent = match[2];
    
    // We want to replace from `<circle ... r="85"` to end of innerContent
    const targetStart = match[0].indexOf(`<circle cx="0" cy="0" r="85"`);
    const targetFull = match[0].substring(targetStart, targetStart + match[0].substring(targetStart).indexOf('</g>'));
    
    const strokeColor = filter.includes('rgba(116,132,254') ? '#7484FE' :
                        filter.includes('rgba(51,255,103') ? '#33FF67' :
                        filter.includes('rgba(255,184,0') ? '#FFB800' :
                        filter.includes('rgba(255,112,67') ? '#FF7043' :
                        filter.includes('rgba(167,139,250') ? '#A78BFA' : '#7484FE';

    const replacement = `<defs>
              <clipPath id={\`planet-clip-\${index}\`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="${filter}">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={\`/planets/\${event.slug}.svg\`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={\`url(#planet-clip-\${index})\`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="${strokeColor}" strokeWidth="1.5" opacity="0.8" />
            </g>`;
            
    replacements.push({
      StartLine: content.substring(0, match.index + targetStart).split('\n').length,
      EndLine: content.substring(0, match.index + targetStart + targetFull.length).split('\n').length,
      TargetContent: targetFull,
      ReplacementContent: replacement,
      AllowMultiple: false
    });
  }
}

fs.writeFileSync('replacements.json', JSON.stringify(replacements, null, 2));
console.log('Wrote replacements.json');
