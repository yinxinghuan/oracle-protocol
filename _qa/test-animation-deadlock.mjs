import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

await page.addInitScript(() => {
  Element.prototype.animate = () => ({
    finished: new Promise(() => {}),
    cancel() {},
  })
})

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.addStyleTag({
  content: '#alteru-guest-banner{display:none!important}',
})
await page.locator('.op-button--primary').click()
await page.locator('.op-deck__card:not([disabled])').first().waitFor({ timeout: 2500 })

for (let index = 0; index < 3; index += 1) {
  await page.locator('.op-deck__card:not([disabled])').first().click()
  if (index < 2) {
    await page.locator('.op-deck__card:not([disabled])').first().waitFor({ timeout: 2500 })
  }
}

await page.locator('.op-reveal').waitFor({ timeout: 2500 })
await page.screenshot({
  path: '_qa/ui/platform-layout-animation-deadlock-recovered-390x844.png',
  fullPage: true,
})
await page.setViewportSize({ width: 320, height: 568 })
await page.screenshot({
  path: '_qa/ui/platform-layout-animation-deadlock-recovered-320x568.png',
  fullPage: true,
})

console.log(JSON.stringify({
  phase: await page.locator('main').getAttribute('class'),
  drawnCards: await page.locator('.op-flip').count(),
}))

await browser.close()
