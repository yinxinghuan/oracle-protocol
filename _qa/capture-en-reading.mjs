import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ headless: true })

async function draw(page, cardId) {
  await page.locator(`main.op--choosing [data-card-id="${cardId}"]:not([disabled])`).waitFor()
  await page.locator(`[data-card-id="${cardId}"]`).click()
  await page.locator('main.op--focus').waitFor()
  await page.locator('.op-focus .op-button--primary:not([disabled])').click()
  await page.locator('main.op--reveal').waitFor()
  await page.locator('.op-single__reveal-copy .op-button--primary:not([disabled])').click()
  await page.locator('main.op--meaning').waitFor()
  await page.locator('.op-single__meaning > .op-button--primary:not([disabled])').click()
}

async function metrics(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('.op-reading-page__nav')
    const content = document.querySelector('.op-reading-page__content')
    const navRect = nav?.getBoundingClientRect()
    return {
      viewportHeight: window.innerHeight,
      contentClientHeight: content?.clientHeight,
      contentScrollHeight: content?.scrollHeight,
      contentOverflowY: content ? getComputedStyle(content).overflowY : null,
      navBottom: navRect?.bottom,
      navVisible: Boolean(navRect && navRect.top >= 0 && navRect.bottom <= window.innerHeight),
    }
  })
}

async function capture(width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.addInitScript(() => localStorage.setItem('game_locale', 'en'))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' })
  await page.locator('.op-intro .op-button--primary').click()
  await page.locator('main.op--choosing').waitFor()
  await draw(page, 'alignment')
  await page.locator('main.op--choosing').waitFor()
  await draw(page, 'prompt')
  await page.locator('main.op--choosing').waitFor()
  await draw(page, 'architect')
  await page.locator('main.op--reading').waitFor()
  await page.screenshot({ path: `_qa/ui/platform-layout-en-reading-1of4-${width}x${height}.png` })
  const first = await metrics(page)

  for (let index = 0; index < 3; index += 1) {
    await page.locator('.op-reading-page__nav .op-button--primary').click()
  }
  await page.screenshot({ path: `_qa/ui/platform-layout-en-reading-4of4-${width}x${height}.png` })
  const final = await metrics(page)
  await page.close()
  return { first, final }
}

console.log(JSON.stringify({
  narrow: await capture(320, 568),
  embedded: await capture(390, 640),
}))

await browser.close()
