import { useCallback } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      })
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, parameters)
    }
  }, [])

  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_section: page
    })
  }, [trackEvent])

  const trackCalculation = useCallback((expression: string, result: string, duration: number) => {
    trackEvent('calculation_completed', {
      expression_type: expression.includes('scale=') ? 'precision' : 'basic',
      has_functions: /sin|cos|sqrt|log/.test(expression),
      calculation_duration: duration,
      result_length: result.length
    })
  }, [trackEvent])

  const trackTutorialProgress = useCallback((tutorialId: string, progress: number) => {
    trackEvent('tutorial_progress', {
      tutorial_id: tutorialId,
      progress_percent: progress,
      completed: progress >= 100
    })
  }, [trackEvent])

  const trackDownload = useCallback((resourceType: string) => {
    trackEvent('resource_download', {
      resource_type: resourceType,
      download_source: 'website'
    })
  }, [trackEvent])

  const trackChallenge = useCallback((challengeId: string, success: boolean, attempts: number) => {
    trackEvent('challenge_attempt', {
      challenge_id: challengeId,
      success,
      attempts,
      difficulty: challengeId.includes('easy') ? 'easy' : challengeId.includes('hard') ? 'hard' : 'medium'
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackCalculation,
    trackTutorialProgress,
    trackDownload,
    trackChallenge
  }
}