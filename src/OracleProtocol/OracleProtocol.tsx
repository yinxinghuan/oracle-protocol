import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TAROT_CARDS } from './data/cards'
import { getPlainReading } from './data/plain-readings'
import { computeBarajaOrbit } from './lib/baraja-layout'
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
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    try {
      const value = new Uint32Array(1)
      crypto.getRandomValues(value)
      return value[0] / 4294967296
    } catch {
      // Math.random is sufficient for this entertainment-only shuffle.
    }
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

function isReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function positionLabel(position: Position, locale: Locale) {
  const labels = {
    past: { zh: '过去', en: 'PAST' },
    present: { zh: '当下', en: 'PRESENT' },
    future: { zh: '下一步', en: 'NEXT STEP' },
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
  const reading = getPlainReading(drawn.card.id, drawn.reversed)

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
        {failed && <div className="op-card-face__fallback"><span /><i /></div>}
      </div>
      <div className="op-card-face__etching" aria-hidden="true" />
      <header className="op-card-face__header">
        <span className="op-card-face__number">{drawn.card.number}</span>
        {drawn.card.holographic && <SparkIcon className="op-card-face__rare-icon" />}
      </header>
      <footer className="op-card-face__footer">
        <strong>{drawn.card.title[locale]}</strong>
        <span>{drawn.reversed ? (locale === 'zh' ? '逆位' : 'REVERSED') : (locale === 'zh' ? '正位' : 'UPRIGHT')}</span>
        {!compact && <em>{reading.headline[locale]}</em>}
      </footer>
    </article>
  )
}

function CardBack({ label }: { label: string }) {
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
      <div className="op-card-back__sigil" aria-hidden="true"><span /><i /><b /></div>
    </div>
  )
}

export default function OracleProtocol() {
  const { locale, setLocale, t } = useI18n()
  const playerName = usePlayerName()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [remaining, setRemaining] = useState<TarotCard[]>([])
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const [candidate, setCandidate] = useState<DrawnCard | null>(null)
  const [locked, setLocked] = useState(false)
  const [readingPage, setReadingPage] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [revealBurst, setRevealBurst] = useState(false)
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight })
  const actionLockRef = useRef(false)

  const position = POSITIONS[Math.min(drawn.length, 2)]
  const progressNumber = drawn.length + 1

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const orbit = useMemo(() => {
    const short = viewport.height <= 640
    const narrow = viewport.width <= 340
    return computeBarajaOrbit(remaining.length, {
      radiusX: narrow ? 103 : 138,
      radiusY: short ? 126 : 178,
      startAngle: -90,
      faceCenter: true,
    })
  }, [remaining.length, viewport])

  const candidateIndex = candidate
    ? remaining.findIndex((card) => card.id === candidate.card.id)
    : -1
  const candidatePose = candidateIndex >= 0 ? orbit[candidateIndex] : null

  const begin = useCallback(() => {
    if (actionLockRef.current) return
    actionLockRef.current = true
    setLocked(true)
    setDrawn([])
    setCandidate(null)
    setReadingPage(0)
    setRemaining(shuffledCards())
    setPhase('shuffling')
    void unlockAudio()
    sounds.begin()
    sounds.shuffle()
    window.setTimeout(() => {
      setPhase('choosing')
      setLocked(false)
      actionLockRef.current = false
    }, isReducedMotion() ? 120 : 560)
  }, [])

  const chooseCard = useCallback((card: TarotCard) => {
    if (locked || actionLockRef.current) return
    actionLockRef.current = true
    setLocked(true)
    sounds.draw()
    setCandidate({ card, reversed: randomFloat() < 0.35 })
    setPhase('focus')
    window.setTimeout(() => {
      setLocked(false)
      actionLockRef.current = false
    }, isReducedMotion() ? 120 : 460)
  }, [locked])

  const chooseAgain = useCallback(() => {
    if (locked || actionLockRef.current) return
    actionLockRef.current = true
    setLocked(true)
    setPhase('choosing')
    window.setTimeout(() => {
      setCandidate(null)
      setLocked(false)
      actionLockRef.current = false
    }, isReducedMotion() ? 80 : 280)
  }, [locked])

  const revealCard = useCallback(() => {
    if (!candidate || locked || actionLockRef.current) return
    actionLockRef.current = true
    setLocked(true)
    setPhase('reveal')
    setRevealBurst(true)
    if (candidate.card.holographic) sounds.rare()
    else sounds.reveal()
    window.setTimeout(() => setRevealBurst(false), candidate.card.holographic ? 900 : 560)
    window.setTimeout(() => {
      setLocked(false)
      actionLockRef.current = false
    }, isReducedMotion() ? 120 : 620)
  }, [candidate, locked])

  const showMeaning = useCallback(() => {
    if (locked) return
    setPhase('meaning')
  }, [locked])

  const acceptCard = useCallback(() => {
    if (!candidate || locked || actionLockRef.current) return
    actionLockRef.current = true
    setLocked(true)
    const isFinal = drawn.length === 2
    setDrawn((current) => [...current, candidate])
    setRemaining((current) => current.filter((card) => card.id !== candidate.card.id))
    sounds.complete()
    window.setTimeout(() => {
      setCandidate(null)
      setLocked(false)
      actionLockRef.current = false
      if (isFinal) {
        setReadingPage(0)
        setPhase('reading')
      } else {
        setPhase('choosing')
      }
    }, isReducedMotion() ? 100 : 360)
  }, [candidate, drawn.length, locked])

  const activeReading = readingPage < 3 ? drawn[readingPage] : null
  const activePlain = activeReading
    ? getPlainReading(activeReading.card.id, activeReading.reversed)
    : null

  const summary = useMemo(() => {
    if (drawn.length < 3) return ''
    const first = getPlainReading(drawn[0].card.id, drawn[0].reversed)
    const second = getPlainReading(drawn[1].card.id, drawn[1].reversed)
    if (locale === 'zh') {
      return `${first.headline.zh}；${second.headline.zh}。现在，把注意力放回你能做的下一步。`
    }
    return `${first.headline.en}; ${second.headline.en}. Now return your attention to the next step you can take.`
  }, [drawn, locale])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase === 'focus') {
        event.preventDefault()
        chooseAgain()
        return
      }
      if (event.key !== 'Enter' && event.key !== ' ') return
      if ((event.target as HTMLElement)?.closest('button')) return
      event.preventDefault()
      if (phase === 'intro') begin()
      else if (phase === 'focus') revealCard()
      else if (phase === 'reveal') showMeaning()
      else if (phase === 'meaning') acceptCard()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [acceptCard, begin, chooseAgain, phase, revealCard, showMeaning])

  const progress = (
    <div className="op-progress" aria-label={t('cardProgress', {
      position: positionLabel(position, locale),
      n: progressNumber,
    })}>
      <span>{positionLabel(position, locale)}</span>
      <div>{POSITIONS.map((item, index) => <i className={index < drawn.length ? 'is-filled' : index === drawn.length ? 'is-current' : ''} key={item} />)}</div>
      <b>{progressNumber}/3</b>
    </div>
  )

  const orbitCards = (
    <div className={`op-orbit ${phase === 'focus' ? 'op-orbit--receded' : ''}`} aria-hidden={phase === 'focus'}>
      <div className="op-orbit__track" aria-hidden="true" />
      {remaining.map((card, index) => {
        const pose = orbit[index]
        const selected = candidate?.card.id === card.id
        return (
          <button
            className={`op-orbit__card ${selected ? 'is-selected' : ''}`}
            type="button"
            key={card.id}
            data-card-id={card.id}
            aria-label={t('chooseCard', { n: index + 1 })}
            disabled={phase !== 'choosing' || locked}
            onPointerDown={() => chooseCard(card)}
            style={{
              '--orbit-x': `${pose.translateX}px`,
              '--orbit-y': `${pose.translateY}px`,
              '--orbit-rotation': `${pose.rotation}deg`,
              '--orbit-delay': `${index * 18}ms`,
              zIndex: pose.zIndex,
            } as React.CSSProperties}
          >
            <CardBack label="" />
          </button>
        )
      })}
    </div>
  )

  return (
    <main className={`op op--${phase}`}>
      <div className="op__ambient" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} style={{
            '--x': `${(index * 41) % 100}%`,
            '--y': `${(index * 67) % 92}%`,
            '--duration': `${8 + (index % 7)}s`,
            '--delay': `${index * -0.47}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      <header className="op__topbar">
        <span>OP / ARCANA.12</span>
        <div className="op__tools">
          <button className="op__tool" type="button" onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}>
            {locale === 'zh' ? 'EN' : '中'}
          </button>
          <button className="op__tool" type="button" onClick={() => setShowInfo(true)} aria-label={t('info')}><InfoIcon /></button>
        </div>
      </header>

      {phase === 'intro' && (
        <section className="op-intro">
          <p className="op__eyebrow">{t('subtitle')}</p>
          <h1>{t('protocol')}</h1>
          <p className="op-intro__promise">{t('promise')}</p>
          <div className="op-intro__portal" aria-hidden="true">
            <i /><b />
            <div className="op-intro__stack"><div><CardBack label="" /></div><div><CardBack label="" /></div><div><CardBack label="" /></div></div>
          </div>
          <p className="op-intro__for">{t('startFor', { name: playerName })}</p>
          <button className="op-button op-button--primary" type="button" onPointerDown={begin}>
            <SparkIcon /><span>{t('start')}</span>
          </button>
          <p className="op__disclaimer">{t('disclaimer')}</p>
        </section>
      )}

      {phase === 'shuffling' && (
        <section className="op-shuffle" aria-live="polite">
          <p className="op__eyebrow">{t('shuffling')}</p>
          <div className="op-shuffle__deck" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <div key={index}><CardBack label="" /></div>)}
          </div>
          <div className="op-binding-loader" aria-hidden="true"><i /><i /><i /></div>
        </section>
      )}

      {phase === 'choosing' && (
        <section className="op-choice">
          {progress}
          <h1>{t('tapOne')}</h1>
          <div className="op-choice__stage">{orbitCards}<div className="op-choice__center-mark" aria-hidden="true"><SparkIcon /></div></div>
        </section>
      )}

      {phase === 'focus' && candidate && (
        <section className="op-focus">
          {progress}
          <div className="op-focus__stage">
            {orbitCards}
            <div
              className="op-hero-card op-hero-card--back"
              style={{
                '--focus-from-x': `${candidatePose?.translateX ?? 0}px`,
                '--focus-from-y': `${candidatePose?.translateY ?? 0}px`,
                '--focus-from-rotation': `${candidatePose?.rotation ?? 0}deg`,
              } as React.CSSProperties}
            >
              <CardBack label={t('focusTitle')} />
            </div>
          </div>
          <div className="op-focus__copy">
            <p className="op__eyebrow">{t('focusTitle')}</p>
            <h1>{t('focusHint', { position: positionLabel(position, locale) })}</h1>
          </div>
          <div className="op-actions">
            <button className="op-button op-button--primary" type="button" disabled={locked} onPointerDown={revealCard}><SparkIcon /><span>{t('revealCard')}</span></button>
            <button className="op-button op-button--text" type="button" disabled={locked} onClick={chooseAgain}>{t('chooseAgain')}</button>
          </div>
        </section>
      )}

      {(phase === 'reveal' || phase === 'meaning') && candidate && (
        <section className={`op-single ${phase === 'meaning' ? 'op-single--meaning' : ''}`}>
          {progress}
          {revealBurst && (
            <div className={`op-reveal-burst ${candidate.card.holographic ? 'is-rare' : ''}`} aria-hidden="true">
              {Array.from({ length: candidate.card.holographic ? 10 : 6 }, (_, index) => <i key={index} style={{ '--burst-angle': `${index * (360 / (candidate.card.holographic ? 10 : 6))}deg`, '--burst-delay': `${index * 24}ms` } as React.CSSProperties} />)}
            </div>
          )}
          <div className="op-single__card"><CardFace drawn={candidate} locale={locale} /></div>
          {phase === 'reveal' ? (
            <div className="op-single__reveal-copy">
              <p className="op__eyebrow">{positionLabel(position, locale)} · {candidate.reversed ? t('reversed') : t('upright')}</p>
              <h1>{getPlainReading(candidate.card.id, candidate.reversed).headline[locale]}</h1>
              <button className="op-button op-button--primary" type="button" disabled={locked} onPointerDown={showMeaning}><span>{t('revealMeaning')}</span></button>
            </div>
          ) : (
            <div className="op-single__meaning">
              <p>{getPlainReading(candidate.card.id, candidate.reversed).message[locale]}</p>
              <aside>
                <span>{t('todayAction')}</span>
                <strong>{getPlainReading(candidate.card.id, candidate.reversed).action[locale]}</strong>
              </aside>
              <button className="op-button op-button--primary" type="button" disabled={locked} onPointerDown={acceptCard}>
                <SparkIcon />
                <span>{drawn.length === 2 ? t('openReading') : t('nextCard')}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {phase === 'reading' && drawn.length === 3 && (
        <section className="op-reading-page">
          <p className="op__eyebrow">{t('pageProgress', { n: readingPage + 1 })}</p>
          {readingPage < 3 && activeReading && activePlain ? (
            <>
              <header>
                <span>{positionLabel(POSITIONS[readingPage], locale)}</span>
                <h1>{activePlain.headline[locale]}</h1>
              </header>
              <div className="op-reading-page__card"><CardFace drawn={activeReading} locale={locale} compact /></div>
              <div className="op-reading-page__copy">
                <p>{activePlain.message[locale]}</p>
                <aside><span>{t('question')}</span><strong>{(activeReading.reversed ? activeReading.card.reversed : activeReading.card.upright).reflection[locale]}</strong></aside>
              </div>
            </>
          ) : (
            <div className="op-reading-page__today">
              <div className="op-reading-page__seal"><SparkIcon /></div>
              <span>{t('today')}</span>
              <h1>{t('todayLead')}</h1>
              <p>{summary}</p>
              <aside>
                <span>{t('todayAction')}</span>
                <strong>{getPlainReading(drawn[2].card.id, drawn[2].reversed).action[locale]}</strong>
              </aside>
              <p className="op__disclaimer">{t('disclaimer')}</p>
            </div>
          )}
          <nav className="op-reading-page__nav">
            {readingPage > 0 && <button className="op-button op-button--text" type="button" onClick={() => setReadingPage((page) => page - 1)}>{t('previous')}</button>}
            {readingPage < 3 ? (
              <button className="op-button op-button--primary" type="button" onClick={() => setReadingPage((page) => page + 1)}><span>{t('next')}</span></button>
            ) : (
              <button className="op-button op-button--primary" type="button" onClick={begin}><ResetIcon /><span>{t('again')}</span></button>
            )}
          </nav>
        </section>
      )}

      {showInfo && (
        <div className="op-modal" role="dialog" aria-modal="true" aria-labelledby="op-info-title">
          <div className="op-modal__panel">
            <p className="op__eyebrow">OP / NOTE</p>
            <h2 id="op-info-title">{t('info')}</h2>
            <p>{t('promise')}</p><p>{t('disclaimer')}</p>
            <button className="op-button op-button--text" type="button" onClick={() => setShowInfo(false)}>{t('close')}</button>
          </div>
        </div>
      )}

      <Watermark />
    </main>
  )
}
