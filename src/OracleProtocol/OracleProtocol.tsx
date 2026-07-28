import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BarajaDeck } from './lib/baraja-deck'
import { TAROT_CARDS } from './data/cards'
import type { DrawnCard, GamePhase, Locale, Position, TarotCard } from './types'
import { useI18n } from './i18n'
import { usePlayerName } from './hooks/usePlayerName'
import { sounds, unlockAudio } from './utils/audio'
import Watermark from './components/Watermark'
import { InfoIcon, ResetIcon, SparkIcon } from './components/Icons'
import './styles/baraja-deck.css'
import './styles/holographic-card-foil.css'
import './OracleProtocol.less'

const POSITIONS: Position[] = ['past', 'present', 'future']

function assetUrl(file: string) {
  return new URL(`./card-art/${file}`, document.baseURI).href
}

function randomFloat() {
  if (typeof globalThis.crypto !== 'undefined') {
    const value = new Uint32Array(1)
    crypto.getRandomValues(value)
    return value[0] / 4294967296
  }
  return Math.random()
}

function shuffledCards() {
  const next = [...TAROT_CARDS]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(randomFloat() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

function wait(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration))
}

function isReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function positionLabel(position: Position, locale: Locale) {
  const labels = {
    past: { zh: '过去', en: 'PAST' },
    present: { zh: '现在', en: 'PRESENT' },
    future: { zh: '未来', en: 'FUTURE' },
  }
  return labels[position][locale]
}

interface CardFaceProps {
  drawn: DrawnCard
  locale: Locale
  compact?: boolean
}

function CardFace({ drawn, locale, compact = false }: CardFaceProps) {
  const [failed, setFailed] = useState(false)
  const orientation = drawn.reversed ? drawn.card.reversed : drawn.card.upright

  return (
    <article
      className={[
        'op-card-face',
        compact ? 'op-card-face--compact' : '',
        drawn.card.holographic ? 'hcf-card op-card-face--holographic' : '',
      ].filter(Boolean).join(' ')}
      data-card-id={drawn.card.id}
    >
      <div className="op-card-face__art" aria-hidden="true">
        {!failed && (
          <img
            src={assetUrl(drawn.card.artFile)}
            alt=""
            draggable={false}
            onError={() => setFailed(true)}
            className={drawn.reversed ? 'op-card-face__image--reversed' : ''}
          />
        )}
        {failed && (
          <div className="op-card-face__fallback">
            <span />
            <i />
          </div>
        )}
      </div>
      <div className="op-card-face__etching" aria-hidden="true" />
      <header className="op-card-face__header">
        <span className="op-card-face__number">{drawn.card.number}</span>
        {drawn.card.holographic && <SparkIcon className="op-card-face__rare-icon" />}
      </header>
      <footer className="op-card-face__footer">
        <strong>{drawn.card.title[locale]}</strong>
        <span>{drawn.reversed ? (locale === 'zh' ? '逆位' : 'REVERSED') : (locale === 'zh' ? '正位' : 'UPRIGHT')}</span>
        {!compact && <em>{orientation.keyword[locale]}</em>}
      </footer>
    </article>
  )
}

interface CardBackProps {
  label: string
}

function CardBack({ label }: CardBackProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="op-card-back" aria-label={label}>
      {!failed && (
        <img
          src={assetUrl('card-back.webp')}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      <div className="op-card-back__sigil" aria-hidden="true">
        <span />
        <i />
        <b />
      </div>
    </div>
  )
}

export default function OracleProtocol() {
  const { locale, setLocale, t } = useI18n()
  const playerName = usePlayerName()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [remaining, setRemaining] = useState<TarotCard[]>([])
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [revealBurst, setRevealBurst] = useState<{ key: number; rare: boolean } | null>(null)
  const deckElementRef = useRef<HTMLDivElement | null>(null)
  const deckControllerRef = useRef<BarajaDeck | null>(null)

  const protocolId = useMemo(() => {
    const source = drawn.map(({ card, reversed }) => `${card.number}${reversed ? 'R' : 'U'}`).join('')
    let hash = 2166136261
    for (const char of source) {
      hash ^= char.charCodeAt(0)
      hash = Math.imul(hash, 16777619)
    }
    return `OP-${Math.abs(hash >>> 0).toString(16).slice(0, 6).toUpperCase().padStart(6, '0')}`
  }, [drawn])

  const fanSettings = useCallback(() => {
    const narrow = window.innerWidth <= 340
    const short = window.innerHeight <= 640
    return {
      speed: isReducedMotion() ? 0 : 520,
      easing: 'cubic-bezier(.22,.7,.18,1)',
      range: narrow ? 38 : short ? 44 : 54,
      direction: 'right' as const,
      origin: { minX: 18, maxX: 82, y: 112 },
      center: true,
      translation: narrow ? 12 : short ? 16 : 22,
      scatter: false,
    }
  }, [])

  useLayoutEffect(() => {
    if (phase !== 'choosing' || !deckElementRef.current) {
      deckControllerRef.current?.destroy()
      deckControllerRef.current = null
      return
    }

    if (!deckControllerRef.current) {
      deckControllerRef.current = new BarajaDeck(deckElementRef.current, {
        speed: isReducedMotion() ? 0 : 260,
        easing: 'cubic-bezier(.22,.7,.18,1)',
        cycleGap: 12,
      })
    } else {
      deckControllerRef.current.refresh()
    }

    setLocked(true)
    let active = true
    void deckControllerRef.current.fan(fanSettings()).then(() => {
      if (active) setLocked(false)
    })
    return () => {
      active = false
    }
  }, [fanSettings, phase, remaining])

  useEffect(() => () => {
    deckControllerRef.current?.destroy()
  }, [])

  const begin = useCallback(() => {
    if (locked) return
    void unlockAudio()
    sounds.begin()
    sounds.shuffle()
    setLocked(true)
    setDrawn([])
    setRevealedCount(0)
    setRemaining(shuffledCards())
    setPhase('shuffling')
    window.setTimeout(() => {
      setPhase('choosing')
    }, isReducedMotion() ? 120 : 700)
  }, [locked])

  const handleDraw = useCallback(async (card: TarotCard, element: HTMLButtonElement) => {
    const controller = deckControllerRef.current
    if (!controller || locked || drawn.length >= 3) return
    setLocked(true)
    sounds.draw()
    await controller.bringToFront(element)

    if (!isReducedMotion() && typeof element.animate === 'function') {
      await element.animate([
        { transform: element.style.transform, opacity: 1 },
        { transform: 'translateY(-34px) scale(.74) rotate(0deg)', opacity: 0 },
      ], {
        duration: 280,
        easing: 'cubic-bezier(.3,.8,.25,1)',
        fill: 'forwards',
      }).finished.catch(() => undefined)
    }

    const nextDraw: DrawnCard = {
      card,
      reversed: randomFloat() < 0.35,
    }
    const finalCard = drawn.length === 2
    setDrawn((current) => [...current, nextDraw])
    setRemaining((current) => current.filter((item) => item.id !== card.id))

    if (finalCard) {
      setRevealedCount(0)
      setPhase('reveal')
      setLocked(false)
    }
  }, [drawn.length, locked])

  const revealNext = useCallback(async () => {
    if (locked) return
    if (revealedCount >= drawn.length) {
      sounds.complete()
      setPhase('reading')
      return
    }

    setLocked(true)
    const current = drawn[revealedCount]
    if (current.card.holographic) sounds.rare()
    else sounds.reveal()
    setRevealBurst({ key: Date.now(), rare: current.card.holographic })
    window.setTimeout(() => setRevealBurst(null), current.card.holographic ? 900 : 520)
    setRevealedCount((count) => count + 1)
    await wait(isReducedMotion() ? 140 : 600)
    setLocked(false)
  }, [drawn, locked, revealedCount])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (phase === 'intro') begin()
        else if (phase === 'reveal') void revealNext()
        else if (phase === 'reading') begin()
        return
      }
      if (phase !== 'choosing' || locked || !['1', '2', '3'].includes(event.key)) return
      const candidates = [0, Math.floor((remaining.length - 1) / 2), remaining.length - 1]
      const card = remaining[candidates[Number(event.key) - 1]]
      const element = deckElementRef.current?.querySelector<HTMLButtonElement>(`[data-card-id="${card?.id}"]`)
      if (card && element) void handleDraw(card, element)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [begin, handleDraw, locked, phase, remaining, revealNext])

  const choicePrompt = drawn.length === 0
    ? t('choosePast')
    : drawn.length === 1
      ? t('choosePresent')
      : t('chooseFuture')

  const revealButtonLabel = revealedCount === 0
    ? t('revealNextPast')
    : revealedCount === 1
      ? t('revealNextPresent')
      : revealedCount === 2
        ? t('revealNextFuture')
        : t('openReading')

  const lastRevealed = revealedCount > 0 ? drawn[revealedCount - 1] : null

  return (
    <main className={`op op--${phase}`}>
      <div className="op__ambient" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <i
            key={index}
            style={{
              '--x': `${(index * 41) % 100}%`,
              '--y': `${(index * 67) % 92}%`,
              '--h': `${3 + (index % 3) * 2}px`,
              '--opacity': 0.08 + (index % 5) * 0.025,
              '--duration': `${8 + (index % 7)}s`,
              '--delay': `${index * -0.47}s`,
              '--rotation': `${index * 23}deg`,
              '--rotation-end': `${index * 23 + 9}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <header className="op__topbar">
        <span>OP / ARCANA.12</span>
        <div className="op__tools">
          <button
            className="op__tool"
            type="button"
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            {locale === 'zh' ? 'EN' : '中'}
          </button>
          <button
            className="op__tool"
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label={t('info')}
          >
            <InfoIcon />
          </button>
        </div>
      </header>

      {phase === 'intro' && (
        <section className="op-intro">
          <div className="op-intro__mark" aria-hidden="true">
            <span />
            <i />
            <b />
          </div>
          <p className="op__eyebrow">{t('subtitle')}</p>
          <h1>{t('protocol')}</h1>
          <p className="op-intro__promise">{t('promise')}</p>
          <div className="op-intro__stack" aria-hidden="true">
            <div><CardBack label="" /></div>
            <div><CardBack label="" /></div>
            <div><CardBack label="" /></div>
          </div>
          <p className="op-intro__for">{t('startFor', { name: playerName })}</p>
          <button className="op-button op-button--primary" type="button" onPointerDown={begin}>
            <SparkIcon />
            <span>{t('start')}</span>
          </button>
          <p className="op__disclaimer">{t('disclaimer')}</p>
        </section>
      )}

      {phase === 'shuffling' && (
        <section className="op-shuffle" aria-live="polite">
          <p className="op__eyebrow">{t('shuffling')}</p>
          <div className="op-shuffle__deck" aria-hidden="true">
            <div><CardBack label="" /></div>
            <div><CardBack label="" /></div>
            <div><CardBack label="" /></div>
            <div><CardBack label="" /></div>
          </div>
          <div className="op-binding-loader" aria-hidden="true"><i /><i /><i /></div>
        </section>
      )}

      {phase === 'choosing' && (
        <section className="op-choose">
          <div className="op-choose__heading" aria-live="polite">
            <p className="op__eyebrow">{t('cardCount', { n: drawn.length })}</p>
            <h2>{choicePrompt}</h2>
          </div>
          <div className="op-slots op-slots--small">
            {POSITIONS.map((position, index) => (
              <div className={`op-slot ${drawn[index] ? 'op-slot--filled' : ''}`} key={position}>
                <span>{positionLabel(position, locale)}</span>
                {drawn[index] && <CardBack label={positionLabel(position, locale)} />}
              </div>
            ))}
          </div>
          <div className="op-choose__stage">
            <div className="baraja-deck op-deck" ref={deckElementRef}>
              {remaining.map((card, index) => (
                <button
                  className="baraja-deck__card op-deck__card"
                  type="button"
                  key={card.id}
                  data-card-id={card.id}
                  aria-label={t('chooseCard', { n: index + 1 })}
                  disabled={locked}
                  onPointerDown={(event) => void handleDraw(card, event.currentTarget)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return
                    event.preventDefault()
                    event.stopPropagation()
                    void handleDraw(card, event.currentTarget)
                  }}
                >
                  <CardBack label="" />
                </button>
              ))}
            </div>
          </div>
          <p className="op-choose__hint">{t('chooseHint')}</p>
        </section>
      )}

      {phase === 'reveal' && (
        <section className="op-reveal">
          {revealBurst && (
            <div
              className={`op-reveal__burst ${revealBurst.rare ? 'op-reveal__burst--rare' : ''}`}
              key={revealBurst.key}
              aria-hidden="true"
            >
              {Array.from({ length: revealBurst.rare ? 10 : 6 }, (_, index) => (
                <i
                  key={index}
                  style={{
                    '--burst-angle': `${index * (360 / (revealBurst.rare ? 10 : 6)) + 9}deg`,
                    '--burst-distance': `${48 + (index % 3) * 14}px`,
                    '--burst-delay': `${(index % 4) * 24}ms`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
          <div className="op-reveal__heading">
            <p className="op__eyebrow">{t('revealIntro')}</p>
            <h2>{revealedCount < 3 ? positionLabel(POSITIONS[revealedCount], locale) : t('complete')}</h2>
          </div>
          <div className="op-reveal__cards">
            {drawn.map((item, index) => (
              <div className={`op-flip ${index < revealedCount ? 'op-flip--revealed' : ''}`} key={item.card.id}>
                <div className="op-flip__inner">
                  <div className="op-flip__side op-flip__back">
                    <CardBack label={positionLabel(POSITIONS[index], locale)} />
                  </div>
                  <div className="op-flip__side op-flip__front">
                    <CardFace drawn={item} locale={locale} compact />
                  </div>
                </div>
                <span className="op-flip__position">{positionLabel(POSITIONS[index], locale)}</span>
              </div>
            ))}
          </div>
          <div className="op-reveal__meaning" aria-live="polite">
            {lastRevealed ? (
              <>
                <strong>
                  {(lastRevealed.reversed ? lastRevealed.card.reversed : lastRevealed.card.upright).keyword[locale]}
                </strong>
                <p>
                  {(lastRevealed.reversed ? lastRevealed.card.reversed : lastRevealed.card.upright).meaning[locale]}
                </p>
              </>
            ) : <p>{t('promise')}</p>}
          </div>
          <button
            className="op-button op-button--primary"
            type="button"
            disabled={locked}
            onPointerDown={() => void revealNext()}
          >
            <SparkIcon />
            <span>{revealButtonLabel}</span>
          </button>
        </section>
      )}

      {phase === 'reading' && (
        <section className="op-reading">
          <div className="op-reading__seal" aria-hidden="true"><SparkIcon /></div>
          <p className="op__eyebrow">{protocolId} · {t('complete')}</p>
          <h1>{t('readingFor', { name: playerName })}</h1>
          <div className="op-reading__spread">
            {drawn.map((item, index) => (
              <div key={item.card.id}>
                <span>{positionLabel(POSITIONS[index], locale)}</span>
                <CardFace drawn={item} locale={locale} compact />
              </div>
            ))}
          </div>
          <div className="op-reading__sections">
            {drawn.map((item, index) => {
              const orientation = item.reversed ? item.card.reversed : item.card.upright
              const heading = index === 0 ? t('signal') : index === 1 ? t('model') : t('iteration')
              return (
                <article key={item.card.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{heading} · {orientation.keyword[locale]}</h2>
                    <p>{orientation.meaning[locale]}</p>
                  </div>
                </article>
              )
            })}
          </div>
          {drawn[2] && (
            <blockquote>
              <span>{t('reflection')}</span>
              <p>{(drawn[2].reversed ? drawn[2].card.reversed : drawn[2].card.upright).reflection[locale]}</p>
            </blockquote>
          )}
          <details className="op-reading__details">
            <summary>{t('meanings')}</summary>
            {drawn.map((item) => {
              const orientation = item.reversed ? item.card.reversed : item.card.upright
              return (
                <article key={item.card.id}>
                  <h3>{item.card.title[locale]} · {item.reversed ? t('reversed') : t('upright')}</h3>
                  <p>{orientation.meaning[locale]}</p>
                  <small>{t('classic', { name: item.card.classic[locale] })}</small>
                </article>
              )
            })}
          </details>
          <p className="op__disclaimer">{t('disclaimer')}</p>
          <button className="op-button op-button--primary" type="button" onClick={begin}>
            <ResetIcon />
            <span>{t('again')}</span>
          </button>
        </section>
      )}

      {showInfo && (
        <div className="op-modal" role="dialog" aria-modal="true" aria-labelledby="op-info-title">
          <div className="op-modal__panel">
            <p className="op__eyebrow">OP / NOTE</p>
            <h2 id="op-info-title">{t('info')}</h2>
            <p>{t('promise')}</p>
            <p>{t('disclaimer')}</p>
            <button className="op-button op-button--secondary" type="button" onClick={() => setShowInfo(false)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}

      <Watermark />
    </main>
  )
}
