/**
 * Tiny client-side sound helper.
 *
 * Sound files live in `public/sound/<name>.mp3`. We cache one Audio element
 * per sound and rewind it on each play so rapid retriggers (e.g. multiple
 * toasts in quick succession) all fire.
 *
 * Browser autoplay policies block playback until the user has interacted
 * with the page — that's fine, we silently swallow the rejection.
 */

const SOUND_BASE = '/sound'

export type SoundName = 'button-click' | 'redeem' | 'spin'

const FILE_MAP: Record<SoundName, string> = {
  // Note: existing assets use spaces in the file names — keep them encoded.
  'button-click': 'button%20click.mp3',
  redeem: 'redeem.mp3',
  spin: 'spin2.mp3',
}

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {}

function getAudio(name: SoundName, volume: number): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  let audio = cache[name]
  if (!audio) {
    audio = new Audio(`${SOUND_BASE}/${FILE_MAP[name]}`)
    audio.preload = 'auto'
    cache[name] = audio
  }
  audio.volume = volume
  return audio
}

interface PlaySoundOptions {
  /** 0–1. Defaults: click 0.5, redeem 0.7, spin 0.5. */
  volume?: number
}

/**
 * Play a sound and return the underlying `HTMLAudioElement` so the caller can
 * pause / stop it (handy for the spin sound, which we cut off the moment the
 * reel lands on a result). Returns `null` on the server or if the audio can't
 * be created. Callers that don't need to stop the sound can ignore the return
 * value — the existing fire-and-forget call sites are unaffected.
 */
export function playSound(
  name: SoundName,
  options: PlaySoundOptions = {}
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const defaultVolume = name === 'redeem' ? 0.7 : 0.5
  const audio = getAudio(name, options.volume ?? defaultVolume)
  if (!audio) return null
  try {
    audio.currentTime = 0
    const result = audio.play()
    // Some browsers return a Promise; ignore rejections (autoplay policy etc.)
    if (result && typeof (result as Promise<void>).catch === 'function') {
      ;(result as Promise<void>).catch(() => {})
    }
  } catch {
    // no-op — sound is purely cosmetic
  }
  return audio
}

/** Stop a sound immediately and rewind it. Safe to call if the sound was
 * never played. */
export function stopSound(name: SoundName): void {
  const audio = cache[name]
  if (!audio) return
  try {
    audio.pause()
    audio.currentTime = 0
  } catch {
    // no-op
  }
}
