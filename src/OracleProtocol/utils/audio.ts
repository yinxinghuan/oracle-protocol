type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }

let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (context) return context
  const AudioCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext
  if (!AudioCtor) return null
  try {
    context = new AudioCtor()
    return context
  } catch {
    return null
  }
}

function tone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  delay = 0,
  endFrequency?: number,
) {
  const audio = getContext()
  if (!audio) return
  try {
    const start = audio.currentTime + delay
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
    }
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.03)
  } catch {
    // Audio is optional and must never block the game state machine.
  }
}

function noisePulse(delay: number) {
  const audio = getContext()
  if (!audio) return
  try {
    const length = Math.floor(audio.sampleRate * 0.04)
    const buffer = audio.createBuffer(1, length, audio.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length)
    }
    const source = audio.createBufferSource()
    const filter = audio.createBiquadFilter()
    const gain = audio.createGain()
    filter.type = 'bandpass'
    filter.frequency.value = 1300
    filter.Q.value = 0.8
    gain.gain.value = 0.055
    source.buffer = buffer
    source.connect(filter).connect(gain).connect(audio.destination)
    source.start(audio.currentTime + delay)
  } catch {
    // Audio is optional and must never block the game state machine.
  }
}

export async function unlockAudio() {
  const audio = getContext()
  if (audio?.state === 'suspended') {
    try {
      await audio.resume()
    } catch {
      // Audio is optional.
    }
  }
}

export const sounds = {
  begin() {
    tone(196, 0.32, 0.1)
    tone(392, 0.24, 0.045, 'sine', 0.04)
  },
  shuffle() {
    for (let index = 0; index < 5; index += 1) noisePulse(index * 0.055)
  },
  draw() {
    tone(420, 0.13, 0.08, 'triangle', 0, 610)
  },
  reveal() {
    tone(520, 0.18, 0.075)
    tone(780, 0.15, 0.055, 'sine', 0.07)
  },
  rare() {
    ;[392, 587, 880, 1175].forEach((frequency, index) => {
      tone(frequency, 0.25, 0.07 - index * 0.008, 'sine', index * 0.09)
    })
  },
  complete() {
    ;[262, 330, 392, 523].forEach((frequency, index) => {
      tone(frequency, 0.4, 0.06, 'sine', index * 0.11)
    })
  },
}
