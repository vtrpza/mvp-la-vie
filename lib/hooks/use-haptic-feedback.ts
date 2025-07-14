'use client'

import { useCallback, useEffect, useState } from 'react'

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

interface HapticFeedbackOptions {
  enabled?: boolean
  respectReducedMotion?: boolean
}

export function useHapticFeedback(options: HapticFeedbackOptions = {}) {
  const { enabled = true, respectReducedMotion = true } = options
  const [isSupported, setIsSupported] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if haptic feedback is supported
    setIsSupported('vibrate' in navigator)
    
    // Check for reduced motion preference
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handler)
      
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [respectReducedMotion])

  const triggerHaptic = useCallback((pattern: HapticPattern | number[]) => {
    if (!enabled || !isSupported || (respectReducedMotion && prefersReducedMotion)) {
      return false
    }

    try {
      let vibrationPattern: number[]

      if (Array.isArray(pattern)) {
        vibrationPattern = pattern
      } else {
        // Predefined patterns
        switch (pattern) {
          case 'light':
            vibrationPattern = [10]
            break
          case 'medium':
            vibrationPattern = [20]
            break
          case 'heavy':
            vibrationPattern = [50]
            break
          case 'success':
            vibrationPattern = [10, 50, 10]
            break
          case 'warning':
            vibrationPattern = [20, 100, 20]
            break
          case 'error':
            vibrationPattern = [100, 50, 100]
            break
          default:
            vibrationPattern = [10]
        }
      }

      navigator.vibrate(vibrationPattern)
      return true
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
      return false
    }
  }, [enabled, isSupported, prefersReducedMotion, respectReducedMotion])

  return {
    triggerHaptic,
    isSupported,
    prefersReducedMotion
  }
}

// Predefined haptic patterns for common interactions
export const hapticPatterns = {
  // Button interactions
  buttonPress: [10] as const,
  buttonPressLong: [20] as const,
  
  // Navigation
  swipeLeft: [5, 20] as const,
  swipeRight: [5, 20] as const,
  
  // Feedback
  success: [10, 50, 10] as const,
  warning: [20, 100, 20] as const,
  error: [100, 50, 100] as const,
  
  // Notifications
  notification: [10, 20, 10] as const,
  alert: [50, 50, 50] as const,
  
  // Form interactions
  fieldFocus: [5] as const,
  fieldError: [20, 50] as const,
  formSubmit: [10, 30, 10] as const,
  
  // Special interactions
  refresh: [10, 10, 10] as const,
  longPress: [30] as const,
  doubleClick: [5, 10, 5] as const
}

export default useHapticFeedback