import { useCallback, useState } from 'react'
import type { Locale } from '../types'

const copy = {
  protocol: { zh: '神谕协议', en: 'ORACLE PROTOCOL' },
  subtitle: { zh: 'AI 大阿尔卡那 · 三张牌', en: 'AI MAJOR ARCANA · THREE CARDS' },
  promise: { zh: '不是预测未来，是帮你换个角度看现在。', en: 'Not a prediction. A clearer angle on the present.' },
  startFor: { zh: '为 {name} 抽三张牌', en: 'Three cards for {name}' },
  start: { zh: '开始抽牌', en: 'DRAW THE FIRST CARD' },
  disclaimer: {
    zh: '仅供自我反思与娱乐，不替代专业意见。',
    en: 'For reflection and entertainment, not professional advice.',
  },
  shuffling: { zh: '让牌找到它们的位置', en: 'LET THE CARDS FIND THEIR PLACE' },
  tapOne: { zh: '跟着直觉，点一张牌', en: 'Follow your instinct. Tap one card.' },
  chooseCard: { zh: '选择圆环第 {n} 张未知牌', en: 'Choose unknown card {n} from the circle' },
  focusTitle: { zh: '你选中了这张', en: 'YOU CHOSE THIS CARD' },
  focusHint: { zh: '确定后，它会成为你的{position}', en: 'It will become your {position}' },
  revealCard: { zh: '翻开这张', en: 'REVEAL THIS CARD' },
  chooseAgain: { zh: '换一张', en: 'CHOOSE ANOTHER' },
  revealMeaning: { zh: '看看它想提醒你什么', en: 'SEE WHAT IT MEANS FOR YOU' },
  acceptCard: { zh: '收下这张牌', en: 'KEEP THIS CARD' },
  nextCard: { zh: '继续抽下一张', en: 'DRAW THE NEXT CARD' },
  openReading: { zh: '开始完整解读', en: 'START THE READING' },
  past: { zh: '过去', en: 'PAST' },
  present: { zh: '当下', en: 'PRESENT' },
  future: { zh: '下一步', en: 'NEXT STEP' },
  upright: { zh: '正位', en: 'UPRIGHT' },
  reversed: { zh: '逆位', en: 'REVERSED' },
  cardProgress: { zh: '{position} · 第 {n}/3 张', en: '{position} · CARD {n}/3' },
  readingFor: { zh: '{name}，一次只看这一张', en: '{name}, ONE CARD AT A TIME' },
  pageProgress: { zh: '解读 {n}/4', en: 'READING {n}/4' },
  question: { zh: '问问自己', en: 'ASK YOURSELF' },
  today: { zh: '今天的提示', en: 'TODAY’S NOTE' },
  todayLead: { zh: '三张牌合在一起，想告诉你：', en: 'Together, your three cards say:' },
  todayAction: { zh: '今天可以做', en: 'TRY THIS TODAY' },
  previous: { zh: '上一页', en: 'BACK' },
  next: { zh: '下一页', en: 'NEXT' },
  again: { zh: '重新抽牌', en: 'DRAW AGAIN' },
  info: { zh: '关于这次解读', en: 'ABOUT THIS READING' },
  close: { zh: '关闭', en: 'CLOSE' },
} as const

export type CopyKey = keyof typeof copy

function detectLocale(): Locale {
  const override = alteruLocalStorage.getItem('game_locale')
  if (override === 'zh' || override === 'en') return override
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    alteruLocalStorage.setItem('game_locale', next)
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
