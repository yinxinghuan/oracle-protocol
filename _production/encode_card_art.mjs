import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const sourceDir = fileURLToPath(new URL('../_artifacts/card-art/originals/', import.meta.url))
const outputDir = fileURLToPath(new URL('../public/card-art/', import.meta.url))
const framedFronts = new Set([
  'prompt.png',
  'architect.png',
  'latent-space.png',
  'dataset.png',
  'alignment.png',
  'offline-model.png',
  'wheel-of-versions.png',
  'deprecation.png',
  'optimization.png',
  'open-source.png',
  'hallucination.png',
  'singularity.png',
])

async function darkArtworkSquare(input) {
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const rowIsDark = (y) => {
    let dark = 0
    const offset = y * info.width
    for (let x = 0; x < info.width; x += 1) {
      if (data[offset + x] < 72) dark += 1
    }
    return dark / info.width >= 0.64
  }
  const colIsDark = (x) => {
    let dark = 0
    for (let y = 0; y < info.height; y += 1) {
      if (data[y * info.width + x] < 72) dark += 1
    }
    return dark / info.height >= 0.64
  }
  let top = 0
  let bottom = info.height - 1
  let left = 0
  let right = info.width - 1
  while (top < bottom && !rowIsDark(top)) top += 1
  while (bottom > top && !rowIsDark(bottom)) bottom -= 1
  while (left < right && !colIsDark(left)) left += 1
  while (right > left && !colIsDark(right)) right -= 1

  const detectedWidth = right - left + 1
  const detectedHeight = bottom - top + 1
  if (detectedWidth < info.width * 0.62 || detectedHeight < info.height * 0.62) {
    throw new Error(`Could not detect dark artwork bounds in ${input}`)
  }
  const inset = 3
  const side = Math.min(detectedWidth, detectedHeight) - inset * 2
  return {
    left: Math.round(left + (detectedWidth - side) / 2),
    top: Math.round(top + (detectedHeight - side) / 2),
    width: side,
    height: side,
  }
}

await mkdir(outputDir, { recursive: true })
const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.png'))

await Promise.all(files.map(async (file) => {
  const input = path.join(sourceDir, file)
  const output = path.join(outputDir, file.replace(/\.png$/, '.webp'))
  let pipeline = sharp(input)
  if (framedFronts.has(file)) {
    pipeline = pipeline.extract(await darkArtworkSquare(input)).resize(1024, 1024)
  }
  await pipeline
    .webp({ quality: 86, effort: 6 })
    .toFile(output)
}))

console.log(`encoded ${files.length} card-art assets`)
