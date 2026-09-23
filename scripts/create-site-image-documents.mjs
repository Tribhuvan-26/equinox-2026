import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error("Missing sanity credentials in .env.local")
  process.exit(1)
}

function formatTitle(filePath) {
  const filename = path.basename(filePath, path.extname(filePath))
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function generateDocId(filePath) {
  const cleanPath = filePath.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
  return `siteImage-${cleanPath}`
}

async function syncDataset(datasetName, mapping) {
  console.log(`\n========================================`)
  console.log(`Syncing documents to dataset: ${datasetName}`)
  console.log(`========================================`)

  const client = createClient({
    projectId,
    dataset: datasetName,
    token,
    useCdn: false,
    apiVersion: '2023-05-03',
  })

  // First, verify which image assets exist in this dataset
  const existingAssets = await client.fetch(`*[_type == "sanity.imageAsset"]{_id, originalFilename}`)
  const assetMapByFilename = {}
  const assetMapById = new Set(existingAssets.map(a => a._id))
  for (const a of existingAssets) {
    if (a.originalFilename) {
      assetMapByFilename[a.originalFilename] = a._id
    }
  }

  let createdCount = 0

  for (const [filePath, assetId] of Object.entries(mapping)) {
    const filename = path.basename(filePath)
    let targetAssetId = assetId

    // If asset does not exist in this dataset, upload it
    if (!assetMapById.has(targetAssetId)) {
      if (assetMapByFilename[filename]) {
        targetAssetId = assetMapByFilename[filename]
      } else if (fs.existsSync(filePath)) {
        try {
          console.log(`Uploading ${filePath} to dataset ${datasetName}...`)
          const uploaded = await client.assets.upload('image', fs.createReadStream(filePath), {
            filename
          })
          targetAssetId = uploaded._id
          assetMapById.add(targetAssetId)
          assetMapByFilename[filename] = targetAssetId
          console.log(`Uploaded asset: ${targetAssetId}`)
        } catch (err) {
          console.error(`Failed to upload ${filePath} to ${datasetName}:`, err.message)
          continue
        }
      } else {
        console.warn(`Local file missing, cannot upload: ${filePath}`)
        continue
      }
    }

    const title = formatTitle(filePath)
    const docId = generateDocId(filePath)

    const doc = {
      _id: docId,
      _type: 'siteImage',
      title: title,
      alt: `${title} - Equinox 2026`,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: targetAssetId
        }
      }
    }

    try {
      await client.createOrReplace(doc)
      createdCount++
      console.log(`✓ [${createdCount}/${Object.keys(mapping).length}] Created document: ${docId} (${title})`)
    } catch (err) {
      console.error(`Error creating document ${docId}:`, err.message)
    }
  }

  console.log(`Completed syncing ${createdCount} documents to dataset ${datasetName}.`)
}

async function main() {
  const mappingPath = 'sanity-assets-mapping.json'
  if (!fs.existsSync(mappingPath)) {
    console.error('Missing sanity-assets-mapping.json')
    process.exit(1)
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'))

  // Sync to equinox dataset
  await syncDataset('equinox', mapping)

  // Sync to production dataset so both are fully populated
  await syncDataset('production', mapping)

  console.log('\nAll assets and documents successfully synced to Sanity cloud datasets!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
