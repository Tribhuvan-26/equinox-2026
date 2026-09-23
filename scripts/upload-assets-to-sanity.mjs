import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { basename } from 'path'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error("Missing sanity credentials in .env.local")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2023-05-03',
})

// Add new heavy files
const newFilesToUpload = [
  'public/overlay-animations/pitch-deck-base.png',
  'public/overlay-animations/hustle-mania-base.png',
  'public/overlay-animations/pitch-deck-scene.png',
  'public/overlay-animations/hustle-mania-stall.png',
  'public/logos/cie-full-white.png',
  'public/chatbot-mascot.png',
  // New assets
  'public/tagline-lockup.png',
  'public/logos/mlrit.png',
  'public/logos/mlrit-white.png',
  'public/logos/cie-mark-white.png',
  'public/blackhole.svg',
  'public/portol.svg',
  'public/spacestation.svg',
  'public/spotlight-planet.svg',
  'public/equinox_background.jpg'
]

async function uploadAssets() {
  console.log('Uploading heavy assets to Sanity...')
  // Read existing mapping
  const mappingPath = 'sanity-assets-mapping.json'
  let mapping = {}
  if (fs.existsSync(mappingPath)) {
    mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))
  }

  for (const filePath of newFilesToUpload) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      continue
    }
    if (mapping[filePath]) {
      console.log(`Already uploaded: ${filePath}`)
      continue
    }

    try {
      console.log(`Uploading ${filePath}...`)
      const asset = await client.assets.upload('image', createReadStream(filePath), {
        filename: basename(filePath)
      })
      console.log(`Success: ${asset._id}`)
      mapping[filePath] = asset._id
    } catch (err) {
      console.error(`Failed to upload ${filePath}:`, err.message)
    }
  }

  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2))
  console.log('Done! Asset mapping saved to sanity-assets-mapping.json')
}

uploadAssets()
