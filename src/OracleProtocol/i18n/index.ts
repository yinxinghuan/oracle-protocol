import { useCallback, useState } from 'react'
import type { Locale } from '../types'

const copy = {
  protocol: { zh: '神谕协议', en: 'ORACLE PROTOCOL' },
  subtitle: { zh: 'AI 大阿尔卡那 · 三张牌阵', en: 'AI MAJOR ARCANA · THREE-CARD SPREAD' },
  promise: { zh: '不是预测未来，而是为当下换一个观察角度。', en: 'Not a prediction. A new angle on the present.' },
  startFor: { zh: '为 {name} 开启协议', en: 'Open the protocol for {name}' },
  start: { zh: '开始连接', en: 'BEGIN CONNECTION' },
  disclaimer: {
    zh: '用于自我反思与娱乐，不替代医疗、法律、财务或其他专业意见。',
    en: 'For reflection and entertainment. Not medical, legal, financial, or professional advice.',
  },
  shuffling: { zh: '正在打乱模型权重…', en: 'SHUFFLING MODEL WEIGHTS…' },
  choosePast: { zh: '选一张，作为你的过去', en: 'Choose a card for your past' },
  choosePresent: { zh: '再选一张，照见现在', en: 'Choose again for your present' },
  chooseFuture: { zh: '最后一张，指向下一次迭代', en: 'One final card for the next iteration' },
  chooseHint: { zh: '从扇面中选择', en: 'CHOOSE FROM THE FAN' },
  chooseCard: { zh: '选择扇面第 {n} 张未知牌', en: 'Choose unknown card {n} from the fan' },
  past: { zh: '过去', en: 'PAST' },
  present: { zh: '现在', en: 'PRESENT' },
  future: { zh: '未来', en: 'FUTURE' },
  revealIntro: { zh: '三张牌已经锁定', en: 'THREE CARDS LOCKED' },
  revealNextPast: { zh: '翻开过去', en: 'REVEAL THE PAST' },
  revealNextPresent: { zh: '翻开现在', en: 'REVEAL THE PRESENT' },
  revealNextFuture: { zh: '翻开未来', en: 'REVEAL THE FUTURE' },
  openReading: { zh: '读取综合神谕', en: 'READ THE ORACLE' },
  upright: { zh: '正位', en: 'UPRIGHT' },
  reversed: { zh: '逆位', en: 'REVERSED' },
  signal: { zh: '信号', en: 'SIGNAL' },
  model: { zh: '模型', en: 'MODEL' },
  iteration: { zh: '下一次迭代', en: 'NEXT ITERATION' },
  reflection: { zh: '留给你的问题', en: 'A QUESTION TO KEEP' },
  complete: { zh: '协议完成', en: 'PROTOCOL COMPLETE' },
  readingFor: { zh: '{name} 的三张牌', en: 'THREE CARDS FOR {name}' },
  again: { zh: '再次连接', en: 'CONNECT AGAIN' },
  meanings: { zh: '查看完整牌义', en: 'VIEW FULL CARD MEANINGS' },
  classic: { zh: '对应经典牌：{name}', en: 'CLASSIC ARCANA: {name}' },
  artFallback: { zh: '图像信号暂时离线', en: 'IMAGE SIGNAL OFFLINE' },
  cardCount: { zh: '已抽取 {n}/3', en: '{n}/3 DRAWN' },
  info: { zh: '关于这次解读', en: 'ABOUT THIS READING' },
  close: { zh: '关闭', en: 'CLOSE' },
} as const

export type CopyKey = keyof typeof copy

function detectLocale(): Locale {
  const override = localStorage.getItem('game_locale')
  if (override === 'zh' || override === 'en') return override
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem('game_locale', next)
    setLocaleState(next)
  }, [])

  const t = useCallback((key: CopyKey, vars?: Record<string, string | number>) => {
    let value: string = copy[key][locale]
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.split(`{${name}}`).join(String(replacement))
      }
    }
    return value
  }, [locale])

  return { locale, setLocale, t }
}
