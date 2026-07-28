import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

await page.addInitScript(() => localStorage.setItem('game_locale', 'zh'))
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' })
await page.locator('.op-intro .op-button--primary').click()
await page.locator('main.op--choosing').waitFor()

const checkpoints = [80, 240, 460, 720, 1000, 1300]
const startedAt = Date.now()
for (const checkpoint of checkpoints) {
  await page.waitForTimeout(Math.max(0, checkpoint - (Date.now() - startedAt)))
  await page.screenshot({
    path: `_qa/ui/platform-layout-v3-orbit-motion-${String(checkpoint).padStart(4, '0')}ms-390x844.png`,
  })
}

console.log(JSON.stringify({
  checkpoints,
  enabledCards: await page.locator('.op-orbit__card:not([disabled])').count(),
}))

await browser.close()
