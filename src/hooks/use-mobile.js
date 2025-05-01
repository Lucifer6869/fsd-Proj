
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined) // Removed type: boolean | undefined

  React.useEffect(() => {
     // Check if window is defined (client-side)
     if (typeof window === 'undefined') {
        setIsMobile(false); // Default to false on server
        return;
      }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Cleanup listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
