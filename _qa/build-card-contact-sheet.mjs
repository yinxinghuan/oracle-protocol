import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')
const sourceDir = fileURLToPath(new URL('../public/card-art/', import.meta.url))
const output = fileURLToPath(new URL('./ui/platform-layout-v4-card-art-contact-sheet.png', import.meta.url))
const names = (await readdir(sourceDir))
  .filter((name) => name.endsWith('.webp') && !['card-back.webp', 'poster-scene.webp'].includes(name))
  .sort()

const tile = 240
const gap = 12
const columns = 4
const rows = Math.ceil(names.length / columns)
const width = columns * tile + (columns + 1) * gap
const height = rows * tile + (rows + 1) * gap
const composites = await Promise.all(names.map(async (name, index) => ({
  input: await sharp(path.join(sourceDir, name)).resize(tile, tile).png().toBuffer(),
  left: gap + (index % columns) * (tile + gap),
  top: gap + Math.floor(index / columns) * (tile + gap),
})))

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: '#090a0d',
  },
}).composite(composites).png().toFile(output)

console.log(JSON.stringify({ output, cards: names.length }))
