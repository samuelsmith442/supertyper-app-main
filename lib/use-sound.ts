import { useCallback, useRef, useEffect } from 'react'

export interface SoundSettings {
  enabled: boolean
  volume: number
}

export const useSounds = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const isInitialized = useRef(false)

  const initializeSounds = useCallback(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    try {
      audioRefs.current = {
        keystroke: new Audio('/sounds/keystroke.mp3'),
        correct: new Audio('/sounds/correct.mp3'),
        error: new Audio('/sounds/error.mp3'),
        complete: new Audio('/sounds/complete.mp3'),
      }

      // Set default properties
      Object.values(audioRefs.current).forEach(audio => {
        audio.volume = 0.3
        audio.preload = 'auto'
      })

      isInitialized.current = true
    } catch (error) {
      console.warn('Failed to initialize sounds:', error)
    }
  }, [])

  const playSound = useCallback((soundName: string, settings?: SoundSettings) => {
    if (!settings?.enabled || !isInitialized.current) return
    
    const audio = audioRefs.current[soundName]
    if (audio) {
      try {
        audio.volume = settings?.volume || 0.3
        audio.currentTime = 0
        audio.play().catch(() => {
          // Silently handle autoplay restrictions
        })
      } catch (error) {
        // Silently handle any audio errors
      }
    }
  }, [])

  return { initializeSounds, playSound }
}
