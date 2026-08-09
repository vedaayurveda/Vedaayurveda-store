'use client'

import { useEffect, useState } from 'react'

export function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)

    return () => {
      // Leave script in place across navigations within the app; no cleanup needed.
    }
  }, [])

  return loaded
}
