import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const mappingPath = path.join(rootDir, "sanity", "assets-mapping.json");
const outPath = path.join(rootDir, "lib", "sanity-assets.ts");

function generate() {
  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
  
  let content = `export const sanityAssets: Record<string, string> = {\n`;
  for (const [localPath, assetId] of Object.entries(mapping)) {
    // localPath looks like "public/planets/crossroads.png"
    const key = localPath.replace("public/", "");
    content += `  "${key}": "${assetId}",\n`;
  }
  content += `};\n`;

  fs.writeFileSync(outPath, content, "utf8");
  console.log(`Generated ${outPath}`);
}

generate();
