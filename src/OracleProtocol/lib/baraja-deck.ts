/**
 * Dependency-free TypeScript adaptation of Baraja v1.0.0 by Codrops.
 * Copyright (c) 2012 Codrops. Licensed under the MIT License.
 * See the host project's THIRD_PARTY_NOTICES.txt.
 */

import {
  computeBarajaFan,
  type BarajaFanSettings,
} from './baraja-layout'

export interface BarajaDeckOptions {
  speed?: number
  easing?: string
  cycleGap?: number
  zIndexBase?: number
  respectReducedMotion?: boolean
  random?: () => number
}

type Card = HTMLElement

export class BarajaDeck {
  private readonly container: HTMLElement
  private readonly options: Required<BarajaDeckOptions>
  private order: Card[] = []
  private animations = new Map<Card, Animation>()
  private busy = false
  private closed = true
  private destroyed = false

  constructor(container: HTMLElement, options: BarajaDeckOptions = {}) {
    this.container = container
    this.options = {
      speed: options.speed ?? 300,
      easing: options.easing ?? 'ease-in-out',
      cycleGap: options.cycleGap ?? 15,
      zIndexBase: options.zIndexBase ?? 1000,
      respectReducedMotion: options.respectReducedMotion ?? true,
      random: options.random ?? Math.random,
    }
    this.refresh()
  }

  get isBusy(): boolean {
    return this.busy
  }

  get isClosed(): boolean {
    return this.closed
  }

  get cards(): readonly Card[] {
    return this.order
  }

  /**
   * Reconcile DOM children without changing the order of cards already known.
   * Newly rendered children are appended to the back of the stack.
   */
  refresh(): void {
    this.assertAlive()
    const children = Array.from(this.container.children)
      .filter((node): node is Card => node instanceof HTMLElement)
    const live = new Set(children)
    this.order = [
      ...this.order.filter((card) => live.has(card)),
      ...children.filter((card) => !this.order.includes(card)),
    ]
    this.prepareCards()
    this.applyStack()
  }

  async fan(settings: Partial<BarajaFanSettings> = {}): Promise<boolean> {
    return this.run(async () => {
      if (!this.closed) await this.performClose()
      const merged = {
        ...settings,
        speed: settings.speed ?? 500,
        easing: settings.easing ?? 'ease-out',
      }
      const poses = computeBarajaFan(
        this.order.length,
        merged,
        this.options.random,
      )
      const duration = this.motionDuration(merged.speed)
      await Promise.all(this.order.map((card, rank) => {
        const pose = poses[rank]
        card.style.transformOrigin = `${pose.originX}% ${pose.originY}%`
        return this.animateTo(card, {
          transform: `translateX(${pose.translateX}px) rotate(${pose.rotation}deg)`,
          opacity: '1',
        }, duration, merged.easing)
      }))
      this.closed = false
    })
  }

  async close(): Promise<boolean> {
    return this.run(() => this.performClose())
  }

  async next(): Promise<boolean> {
    return this.cycle('next')
  }

  async previous(): Promise<boolean> {
    return this.cycle('previous')
  }

  /**
   * Closed top card -> fan. Open top card -> close. Open lower card -> promote.
   */
  async toggleFromCard(
    cardOrIndex: Card | number,
    fanSettings: Partial<BarajaFanSettings> = {},
  ): Promise<boolean> {
    const card = this.resolveCard(cardOrIndex)
    if (!card) return false
    if (this.closed) return this.fan(fanSettings)
    if (card === this.order[0]) return this.close()
    return this.bringToFront(card)
  }

  async bringToFront(cardOrIndex: Card | number): Promise<boolean> {
    const card = this.resolveCard(cardOrIndex)
    if (!card) return false

    return this.run(async () => {
      if (!this.closed) await this.performClose()
      if (card === this.order[0]) return

      const duration = this.motionDuration(this.options.speed)
      card.style.transformOrigin = '50% 50%'
      card.style.transform = 'scale(2) translateX(100px) rotate(20deg)'
      card.style.opacity = '0'

      this.order = [card, ...this.order.filter((item) => item !== card)]
      this.applyStack()
      await this.nextFrame()
      await this.animateTo(card, {
        transform: 'translateX(0) rotate(0deg) scale(1)',
        opacity: '1',
      }, duration, 'ease-in')
    })
  }

  async add(cards: Iterable<Card>): Promise<boolean> {
    const additions = Array.from(cards)
    if (additions.length === 0) return true

    return this.run(async () => {
      if (!this.closed) await this.performClose()
      for (const card of additions) {
        if (card.parentElement !== this.container) this.container.append(card)
        if (!this.order.includes(card)) this.order.push(card)
        card.style.opacity = '0'
        card.style.transform = 'scale(1.8) translateX(200px) rotate(15deg)'
      }
      this.prepareCards()
      this.applyStack()
      await this.nextFrame()

      const duration = this.motionDuration(500)
      await Promise.all([...additions].reverse().map((card, index) =>
        this.animateTo(card, {
          transform: 'translateX(0) rotate(0deg) scale(1)',
          opacity: '1',
        }, duration, 'ease-out', index * this.motionDuration(200)),
      ))
    })
  }

  destroy(): void {
    if (this.destroyed) return
    this.destroyed = true
    for (const animation of this.animations.values()) animation.cancel()
    this.animations.clear()
    for (const card of this.order) {
      card.style.removeProperty('z-index')
      card.style.removeProperty('transform')
      card.style.removeProperty('transform-origin')
      card.style.removeProperty('opacity')
      card.style.removeProperty('will-change')
    }
    this.order = []
  }

  private async cycle(direction: 'next' | 'previous'): Promise<boolean> {
    if (this.order.length < 2) return false
    return this.run(async () => {
      if (!this.closed) await this.performClose()

      const next = direction === 'next'
      const card = next ? this.order[0] : this.order[this.order.length - 1]
      const distance =
        card.getBoundingClientRect().width + this.options.cycleGap
      const signedDistance = next ? distance : -distance
      const rotation = next ? 5 : -5
      const duration = this.motionDuration(this.options.speed)

      await this.animateTo(card, {
        transform: `translateX(${signedDistance}px) rotate(${rotation}deg)`,
        opacity: '1',
      }, duration, this.options.easing)

      this.order = next
        ? [...this.order.slice(1), card]
        : [card, ...this.order.slice(0, -1)]
      this.applyStack()

      await this.animateTo(card, {
        transform: 'translateX(0) rotate(0deg)',
        opacity: '1',
      }, duration, this.options.easing)
    })
  }

  private async performClose(): Promise<void> {
    const duration = this.motionDuration(this.options.speed)
    await Promise.all(this.order.map((card) =>
      this.animateTo(card, {
        transform: 'translateX(0) rotate(0deg)',
        opacity: '1',
      }, duration, this.options.easing),
    ))
    for (const card of this.order) card.style.transformOrigin = '50% 50%'
    this.closed = true
  }

  private async run(action: () => void | Promise<void>): Promise<boolean> {
    this.assertAlive()
    if (this.busy || this.order.length === 0) return false
    this.busy = true
    try {
      await action()
      return true
    } finally {
      this.busy = false
    }
  }

  private prepareCards(): void {
    for (const card of this.order) {
      card.style.willChange = 'transform, opacity'
      if (!card.style.transform) card.style.transform = 'translateX(0) rotate(0deg)'
      if (!card.style.opacity) card.style.opacity = '1'
    }
  }

  private applyStack(): void {
    const count = this.order.length
    this.order.forEach((card, rank) => {
      card.style.zIndex = String(this.options.zIndexBase + count - 1 - rank)
    })
  }

  private animateTo(
    card: Card,
    target: { transform: string; opacity: string },
    duration: number,
    easing: string,
    delay = 0,
  ): Promise<void> {
    this.animations.get(card)?.cancel()
    const finish = () => {
      card.style.transform = target.transform
      card.style.opacity = target.opacity
      this.animations.delete(card)
    }

    if (duration === 0 || typeof card.animate !== 'function') {
      finish()
      return Promise.resolve()
    }

    const animation = card.animate([
      {
        transform: card.style.transform || 'none',
        opacity: card.style.opacity || '1',
      },
      target,
    ], {
      duration,
      delay,
      easing,
      fill: 'forwards',
    })
    this.animations.set(card, animation)
    return animation.finished
      .then(finish)
      .catch(() => undefined)
  }

  private motionDuration(duration: number): number {
    if (!this.options.respectReducedMotion) return Math.max(0, duration)
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ? 0
      : Math.max(0, duration)
  }

  private resolveCard(cardOrIndex: Card | number): Card | undefined {
    if (typeof cardOrIndex === 'number') return this.order[cardOrIndex]
    return this.order.includes(cardOrIndex) ? cardOrIndex : undefined
  }

  private nextFrame(): Promise<void> {
    if (this.motionDuration(1) === 0) return Promise.resolve()
    return new Promise((resolve) => requestAnimationFrame(() => resolve()))
  }

  private assertAlive(): void {
    if (this.destroyed) throw new Error('BarajaDeck has been destroyed')
  }
}
