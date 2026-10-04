const fs = require('fs');

let content = fs.readFileSync('components/JourneyPlanets.tsx', 'utf8');

// 1. Popup title image replacement
content = content.replace(
  /\{idx === 0 \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  `                    <div className="mt-5 mb-2 relative h-10 sm:h-12 w-full flex justify-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={\`/logos/\${ev.slug}.png\`}
                        alt={ev.name} 
                        className="h-full w-auto object-contain object-left drop-shadow-md" 
                        draggable={false}
                      />
                    </div>`
);

// 2. Fix spotlight planet to use dynamic URL
content = content.replace(
  /href="\/spotlight-planet\.svg"/,
  `href={\`/planets/\${event.slug}.svg\`}`
);

// 3. Planet core replacements (1 to 9)
for (let i = 1; i <= 9; i++) {
  const blockRegex = new RegExp(`({index === ${i} && \\([\\s\\S]*?)<circle cx="0" cy="0" r="85" fill="url\\(#p\\d+-grad\\)" filter="(.*?)" \\/>([\\s\\S]*?)<\\/g>(\\s*\\)})`);
  const match = content.match(blockRegex);
  if (match) {
    const prefix = match[1];
    const filter = match[2];
    const innerContent = match[3];
    const suffix = match[4];
    
    const strokeColor = filter.includes('rgba(116,132,254') ? '#7484FE' :
                        filter.includes('rgba(51,255,103') ? '#33FF67' :
                        filter.includes('rgba(255,184,0') ? '#FFB800' :
                        filter.includes('rgba(255,112,67') ? '#FF7043' :
                        filter.includes('rgba(167,139,250') ? '#A78BFA' : '#7484FE';

    const replacement = `${prefix}<defs>
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
            </g>${suffix}`;
            
    content = content.replace(blockRegex, replacement);
  }
}

fs.writeFileSync('components/JourneyPlanets.tsx', content);
console.log('Done!');
