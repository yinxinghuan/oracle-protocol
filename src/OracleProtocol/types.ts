export type Locale = 'zh' | 'en'
export type GamePhase =
  | 'intro'
  | 'shuffling'
  | 'choosing'
  | 'focus'
  | 'reveal'
  | 'meaning'
  | 'reading'
export type Position = 'past' | 'present' | 'future'

export interface LocalizedText {
  zh: string
  en: string
}

export interface CardOrientation {
  keyword: LocalizedText
  meaning: LocalizedText
  reflection: LocalizedText
}

export interface TarotCard {
  id: string
  number: string
  title: LocalizedText
  classic: LocalizedText
  artFile: string
  holographic: boolean
  upright: CardOrientation
  reversed: CardOrientation
}

export interface DrawnCard {
  card: TarotCard
  reversed: boolean
}
