/**
 * Transform layout derived from Baraja v1.0.0 by Codrops.
 * Copyright (c) 2012 Codrops. Licensed under the MIT License.
 * See the host project's THIRD_PARTY_NOTICES.txt.
 */

export type BarajaDirection = 'left' | 'right'

export type BarajaOrigin =
  | { x: number; y: number }
  | { minX: number; maxX: number; y: number }

export interface BarajaFanSettings {
  speed: number
  easing: string
  range: number
  direction: BarajaDirection
  origin: BarajaOrigin
  translation: number
  center: boolean
  scatter: boolean
}

export interface BarajaPose {
  translateX: number
  rotation: number
  originX: number
  originY: number
}

export const DEFAULT_BARAJA_FAN: Readonly<BarajaFanSettings> = {
  speed: 500,
  easing: 'ease-out',
  range: 90,
  direction: 'right',
  origin: { x: 25, y: 100 },
  translation: 0,
  center: true,
  scatter: false,
}

export function mergeBarajaFanSettings(
  settings: Partial<BarajaFanSettings> = {},
): BarajaFanSettings {
  return {
    ...DEFAULT_BARAJA_FAN,
    ...settings,
    origin: settings.origin ?? DEFAULT_BARAJA_FAN.origin,
  }
}

/**
 * Return poses in front-to-back rank order. Map pose[rank] to order[rank].
 */
export function computeBarajaFan(
  count: number,
  partial: Partial<BarajaFanSettings> = {},
  random: () => number = Math.random,
): BarajaPose[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('count must be a non-negative integer')
  }
  if (count === 0) return []

  const settings = mergeBarajaFanSettings(partial)
  if (count === 1) {
    return [{
      translateX: 0,
      rotation: 0,
      originX: fixedOriginX(settings.origin),
      originY: settings.origin.y,
    }]
  }

  const stepAngle = settings.range / (count - 1)
  const stepTranslation = settings.translation / (count - 1)

  return Array.from({ length: count }, (_, rank) => {
    let rotation =
      (settings.center ? settings.range / 2 : settings.range) -
      stepAngle * rank
    let translateX = stepTranslation * (count - rank - 1)

    if (settings.direction === 'left') {
      rotation *= -1
      translateX *= -1
    }

    if (settings.scatter && rank !== count - 1) {
      const extraAngle = Math.floor(random() * Math.abs(stepAngle))
      const extraPosition = Math.floor(random() * Math.abs(stepTranslation))
      if (settings.direction === 'left') {
        rotation += extraAngle
        translateX -= extraPosition
      } else {
        rotation -= extraAngle
        translateX += extraPosition
      }
    }

    if (Object.is(rotation, -0)) rotation = 0
    if (Object.is(translateX, -0)) translateX = 0

    return {
      translateX,
      rotation,
      originX: originForRank(settings.origin, rank, count, settings.direction),
      originY: settings.origin.y,
    }
  })
}

export function createBarajaSeededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function fixedOriginX(origin: BarajaOrigin): number {
  return 'x' in origin ? origin.x : (origin.minX + origin.maxX) / 2
}

function originForRank(
  origin: BarajaOrigin,
  rank: number,
  count: number,
  direction: BarajaDirection,
): number {
  if ('x' in origin) return origin.x

  const stepOrigin = (origin.maxX - origin.minX) / count
  let x =
    rank * (origin.maxX - origin.minX + stepOrigin) / count +
    origin.minX
  if (direction === 'left') x = origin.maxX + origin.minX - x
  return x
}
