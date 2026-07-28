import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const source = fileURLToPath(new URL('../_artifacts/card-art/originals/poster-scene.png', import.meta.url))
const output = fileURLToPath(new URL('../public/poster.png', import.meta.url))
const preview = fileURLToPath(new URL('../_artifacts/poster-160.png', import.meta.url))

const titleLayer = Buffer.from(`
  <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#080a09" stop-opacity=".98"/>
        <stop offset=".72" stop-color="#080a09" stop-opacity=".9"/>
        <stop offset="1" stop-color="#080a09" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#080a09" stop-opacity=".92"/>
        <stop offset="1" stop-color="#080a09" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="270" fill="url(#top)"/>
    <rect y="912" width="1024" height="112" fill="url(#bottom)"/>
    <text x="512" y="91" text-anchor="middle" fill="#e9dfc5"
      font-family="Georgia, serif" font-size="64" letter-spacing="8">ORACLE PROTOCOL</text>
    <path d="M312 119H712" stroke="#c98d52" stroke-width="2"/>
    <circle cx="512" cy="119" r="5" fill="#70b8a5"/>
    <text x="512" y="158" text-anchor="middle" fill="#c98d52"
      font-family="Arial, sans-serif" font-size="20" letter-spacing="7">AN AI TAROT READING</text>
    <text x="512" y="982" text-anchor="middle" fill="#e9dfc5"
      font-family="Arial, sans-serif" font-size="17" letter-spacing="5">PAST · PRESENT · FUTURE</text>
  </svg>
`)

await sharp(source)
  .composite([{ input: titleLayer }])
  .png({ compressionLevel: 9, palette: true, quality: 100 })
  .toFile(output)

await sharp(output).resize(160, 160).png().toFile(preview)

console.log('poster written to public/poster.png')
