import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const mappingPath = path.join(rootDir, "sanity", "assets-mapping.json");
const galleryDataPath = path.join(rootDir, "lib", "gallery-data.ts");

const projectId = "ekb34j9w";
const dataset = "equinox";

function getSanityUrl(assetId) {
  // Format: image-1234567890abcdef-1600x1066-jpg -> 1234567890abcdef-1600x1066.jpg
  const parts = assetId.split("-");
  const extension = parts.pop();
  const rest = parts.slice(1).join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${rest}.${extension}?auto=format`;
}

async function migrate() {
  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
  let content = fs.readFileSync(galleryDataPath, "utf8");

  for (const [localPath, assetId] of Object.entries(mapping)) {
    if (localPath.startsWith("public/equinox-gallery/")) {
      const relativePath = localPath.replace("public", "");
      const cdnUrl = getSanityUrl(assetId);
      // Replace exactly the relative path
      content = content.replace(
        new RegExp(`src:\\s*["']${relativePath}["']`, "g"),
        `src: "${cdnUrl}"`
      );
    }
  }

  fs.writeFileSync(galleryDataPath, content, "utf8");
  console.log("Updated lib/gallery-data.ts with Sanity CDN URLs.");
}

migrate().catch(console.error);
