import { useEffect, useState } from 'react'
import {
  callAigramAPI,
  isInAigramNow,
  getTelegramId,
  type AigramResponse,
} from '@shared/runtime'

interface PlatformProfile {
  name?: string
  user_name?: string
}

function debugOverride(): string | null {
  const value = new URLSearchParams(window.location.search).get('user_name')?.trim()
  return value ? value.slice(0, 48) : null
}

export function usePlayerName() {
  const [name, setName] = useState(() => debugOverride() ?? 'AlterU')

  useEffect(() => {
    const override = debugOverride()
    if (override) {
      setName(override)
      return
    }
    if (!isInAigramNow() || !getTelegramId()!) {
      setName('AlterU')
      return
    }

    let active = true
    void callAigramAPI<AigramResponse<PlatformProfile>>(
      `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(getTelegramId()!)}`,
      'GET',
    ).then((response) => {
      if (!active) return
      const next = response?.data?.name || response?.data?.user_name
      setName(next?.trim() ? next.trim().slice(0, 48) : 'AlterU')
    }).catch(() => {
      if (active) setName('AlterU')
    })

    return () => {
      active = false
    }
  }, [])

  return name
}
