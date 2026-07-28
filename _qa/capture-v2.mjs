import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ headless: true })

async function createPlatformPage(width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.addInitScript(() => localStorage.setItem('game_locale', 'zh'))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' })
  return page
}

async function screenshot(page, name) {
  await page.screenshot({ path: `_qa/ui/${name}.png` })
}

async function revealAndUnderstand(page, cardId) {
  await page.locator(`[data-card-id="${cardId}"]`).click()
  await page.locator('main.op--focus').waitFor()
  await page.locator('.op-focus .op-button--primary:not([disabled])').click()
  await page.locator('main.op--reveal').waitFor()
}

const page = await createPlatformPage(390, 844)
await screenshot(page, 'platform-layout-v2-intro-390x844')

await page.locator('.op-intro .op-button--primary').click()
await page.locator('main.op--choosing').waitFor()
await screenshot(page, 'platform-layout-v2-orbit-390x844')

await page.locator('[data-card-id="alignment"]').click()
await page.locator('main.op--focus').waitFor()
await page.waitForTimeout(520)
await screenshot(page, 'platform-layout-v2-focus-390x844')
await page.locator('.op-focus .op-button--primary:not([disabled])').click()
await page.locator('main.op--reveal').waitFor()
await page.waitForTimeout(680)
await screenshot(page, 'platform-layout-v2-holographic-reveal-390x844')
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--meaning').waitFor()
await page.waitForTimeout(320)
await screenshot(page, 'platform-layout-v2-meaning-390x844')
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--choosing').waitFor()

await revealAndUnderstand(page, 'prompt')
await page.waitForTimeout(680)
await screenshot(page, 'platform-layout-v2-normal-reveal-390x844')
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--meaning').waitFor()
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--choosing').waitFor()

await revealAndUnderstand(page, 'architect')
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--meaning').waitFor()
await page.locator('.op-single .op-button--primary:not([disabled])').click()
await page.locator('main.op--reading').waitFor()
await screenshot(page, 'platform-layout-v2-reading-1of4-390x844')

for (let index = 0; index < 3; index += 1) {
  await page.locator('.op-reading-page__nav .op-button--primary').click()
}
await screenshot(page, 'platform-layout-v2-reading-4of4-390x844')
await page.setViewportSize({ width: 320, height: 568 })
await screenshot(page, 'platform-layout-v2-reading-4of4-320x568')
for (let index = 0; index < 3; index += 1) {
  await page.locator('.op-reading-page__nav .op-button--text').click()
}
await screenshot(page, 'platform-layout-v2-reading-1of4-320x568')

const narrow = await createPlatformPage(320, 568)
await narrow.locator('.op-intro .op-button--primary').click()
await narrow.locator('main.op--choosing').waitFor()
await screenshot(narrow, 'platform-layout-v2-orbit-320x568')
await narrow.locator('[data-card-id="alignment"]').click()
await narrow.locator('main.op--focus').waitFor()
await narrow.waitForTimeout(520)
await screenshot(narrow, 'platform-layout-v2-focus-320x568')
await narrow.locator('.op-focus .op-button--primary:not([disabled])').click()
await narrow.locator('main.op--reveal').waitFor()
await narrow.waitForTimeout(680)
await screenshot(narrow, 'platform-layout-v2-holographic-reveal-320x568')

const external = await browser.newPage({ viewport: { width: 390, height: 844 } })
await external.addInitScript(() => localStorage.setItem('game_locale', 'zh'))
await external.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await screenshot(external, 'external-guest-v2-intro-390x844')

console.log(JSON.stringify({
  completedPhase: await page.locator('main').getAttribute('class'),
  narrowPhase: await narrow.locator('main').getAttribute('class'),
  orbitCards: await narrow.locator('.op-orbit__card').count(),
}))

await browser.close()
