import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const sourceDir = fileURLToPath(new URL('../_artifacts/card-art/originals/', import.meta.url))
const outputDir = fileURLToPath(new URL('../public/card-art/', import.meta.url))

await mkdir(outputDir, { recursive: true })
const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.png'))

await Promise.all(files.map(async (file) => {
  const output = path.join(outputDir, file.replace(/\.png$/, '.webp'))
  await sharp(path.join(sourceDir, file))
    .webp({ quality: 86, effort: 6 })
    .toFile(output)
}))

console.log(`encoded ${files.length} card-art assets`)
