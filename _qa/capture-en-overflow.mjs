import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const browser = await chromium.launch({ headless: true })

async function capture(width, height, suffix) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.addInitScript(() => localStorage.setItem('game_locale', 'en'))
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' })
  await page.locator('.op-intro .op-button--primary').click()
  await page.locator('main.op--choosing').waitFor()
  await page.locator('.op-orbit__card:not([disabled])').first().waitFor()
  await page.locator('[data-card-id="singularity"]').click()
  await page.locator('main.op--focus').waitFor()
  await page.locator('.op-focus .op-button--primary:not([disabled])').click()
  await page.locator('main.op--reveal').waitFor()
  await page.locator('.op-single .op-button--primary:not([disabled])').click()
  await page.locator('main.op--meaning').waitFor()
  await page.waitForTimeout(320)

  const metrics = await page.evaluate(() => {
    const root = document.querySelector('.op')
    const detail = document.querySelector('.op-single__meaning')
    const scroller = document.querySelector('.op-single__meaning-scroll')
    const button = detail?.querySelector('button')
    const rootRect = root?.getBoundingClientRect()
    const buttonRect = button?.getBoundingClientRect()
    const scrollerRect = scroller?.getBoundingClientRect()
    return {
      viewportHeight: window.innerHeight,
      rootHeight: rootRect?.height,
      detailClientHeight: detail?.clientHeight,
      detailScrollHeight: detail?.scrollHeight,
      scrollerClientHeight: scroller?.clientHeight,
      scrollerScrollHeight: scroller?.scrollHeight,
      scrollerBottom: scrollerRect?.bottom,
      buttonTop: buttonRect?.top,
      buttonBottom: buttonRect?.bottom,
      buttonVisible: Boolean(buttonRect && buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight),
      overflowY: scroller ? getComputedStyle(scroller).overflowY : null,
    }
  })
  await page.screenshot({ path: `_qa/ui/platform-layout-en-meaning-${suffix}-${width}x${height}.png` })
  await page.locator('.op-single__meaning-scroll').evaluate((element) => {
    element.scrollTop = element.scrollHeight
  })
  await page.waitForTimeout(120)
  const bottomMetrics = await page.evaluate(() => {
    const scroller = document.querySelector('.op-single__meaning-scroll')
    const lastLine = scroller?.querySelector('strong')
    const scrollerRect = scroller?.getBoundingClientRect()
    const lastLineRect = lastLine?.getBoundingClientRect()
    return {
      scrollTop: scroller?.scrollTop,
      lastLineBottom: lastLineRect?.bottom,
      scrollerBottom: scrollerRect?.bottom,
      lastLineVisible: Boolean(lastLineRect && scrollerRect && lastLineRect.bottom <= scrollerRect.bottom + 1),
    }
  })
  await page.screenshot({ path: `_qa/ui/platform-layout-en-meaning-${suffix}-scrolled-${width}x${height}.png` })
  await page.close()
  return { ...metrics, ...bottomMetrics }
}

console.log(JSON.stringify({
  narrow: await capture(320, 568, process.env.QA_PASS ?? 'first-pass'),
  embedded: await capture(390, 640, process.env.QA_PASS ?? 'first-pass'),
}))

await browser.close()
